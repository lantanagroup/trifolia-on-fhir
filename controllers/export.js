const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const request = require('request');
const _ = require('underscore');
const Q = require('q');
const tmp = require('tmp');
const path = require('path');
const fs = require('fs-extra');
const zipdir = require('zip-dir');
const { spawn } = require('child_process');
const config = require('config');
const fhirConfig = config.get('fhir');
const Fhir = require('fhir');
const fhir = new Fhir();
const rp = require('request-promise');

function getBundle(req, format) {
    const deferred = Q.defer();
    let query = {
        '_id': req.params.implementationGuideId,
        '_include': 'ImplementationGuide:resource',
        '_format': format || req.query._format
    };
    const url = req.getFhirServerUrl('ImplementationGuide', null, null, query);

    request(url, (error, results, body) => {
        if (error) {
            console.log('Error retrieving implementation guide bundle from FHIR server: ' + error);
            return deferred.reject('Error retrieving implementation guide bundle from FHIR server');
        }

        deferred.resolve(body);
    });

    return deferred.promise;
}

function exportBundle(req, res) {
    getBundle(req)
        .then((body) => {
            let fileExt = '.json';

            if (req.query._format && req.query._format === 'application/xml') {
                fileExt = '.xml';
            }

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=ig-bundle' + fileExt);      // TODO: Determine file name
            res.send(body);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

function getControl(extension, implementationGuide, bundle) {
    const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
    const canonicalBaseMatch = canonicalBaseRegex.exec(implementationGuide.url);

    if (!canonicalBaseMatch || canonicalBaseMatch.length < 2) {
        throw new Error('The ImplementationGuide.url is not in the correct format. A canonical base cannot be determined.');
    }

    const control = {
        tool: 'jekyll',
        source: 'ImplementationGuide/' + implementationGuide.id + '.xml',           // currently, IG has to be XML for IG Publisher
        paths: {
            resources: 'resources',
            qa: 'qa',
            temp: 'temp',
            pages: 'pages',
            specification: 'http://www.hl7.org/fhir/'
        },
        'sct-edition': 'http://snomed.info/sct/731000124108',
        canonicalBase: canonicalBaseMatch[1],
        defaults: {
            'Any': {
                'template-format': 'template-format.html',
                'template-base': 'template-base.html'
            },
            'StructureDefinition': {
                'template-base': 'sd-template-base.html',
                'template-defns': 'sd-template-defns.html',
                'template-format': 'sd-template-format.html'
            },
            'ValueSet': {
                'template-base': 'tm-template-base.html'
            },
            'CodeSystem': {
                'template-base': 'tm-template-base.html'
            },
            'Resource': {
                'template-base': 'pf-template-base.html'
            },
            'Questionnaire': {
                'template-base': 'in-template-base.html',
                'template-format': 'in-template-format.html'
            },
            'Patient': {
                'template-base': 'in-template-base.html',
                'template-format': 'in-template-format.html'
            },
            'Extension': {
                'template-base': 'ex-template-base.html'
            }
        },
        resources: {}
    };

    if (bundle && bundle.entry) {
        for (var i = 0; i < bundle.entry.length; i++) {
            const entry = bundle.entry[i];
            const resource = entry.resource;

            if (resource.resourceType === 'ImplementationGuide') {
                continue;
            }

            control.resources[resource.resourceType + '/' + resource.id] = {
                base: resource.resourceType + '-' + resource.id + '.html',
                defns: resource.resourceType + '-' + resource.id + '-definitions.html'
            };
        }
    }

    return control;
}

function sendSocketMessage(req, packageId, status, message) {
    if (req && req.io) {
        req.io.emit('message', {
            packageId: packageId,
            status: status,
            message: message
        });
    }
}

function packageImplementationGuidePage(pagesPath, implementationGuide, page) {
    const contentExtension = _.find(page.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content');

    if (contentExtension && contentExtension.valueReference && contentExtension.valueReference.reference && page.source) {
        const reference = contentExtension.valueReference.reference;

        if (reference.startsWith('#')) {
            const contained = _.find(implementationGuide.contained, (contained) => contained.id === reference.substring(1));

            if (contained && contained.resourceType === 'Binary') {
                const newPagePath = path.join(pagesPath, page.source);
                const content = Buffer.from(contained.content, 'base64').toString();
                fs.writeFileSync(newPagePath, content);
            }
        }
    }

    _.each(page.page, (subPage) => packageImplementationGuidePage(pagesPath, implementationGuide, subPage));
}

function getIgPublisher(req, packageId) {
    const deferred = Q.defer();
    const fileName = 'org.hl7.fhir.igpublisher.jar';
    const defaultPath = path.join(__dirname, '../ig-publisher');
    const defaultFilePath = path.join(defaultPath, fileName);

    if (req.query.useLatest === 'true') {
        sendSocketMessage(req, packageId, 'progress', 'Downloading latest FHIR IG publisher');

        // TODO: Check http://build.fhir.org/version.info first

        rp(fhirConfig.latestPublisher, { encoding: null })
            .then((results) => {
                const latestPath = path.join(defaultPath, 'latest');
                fs.ensureDirSync(latestPath);

                const buff = Buffer.from(results, 'utf8');
                const latestFilePath = path.join(latestPath, fileName);
                fs.writeFileSync(latestFilePath, buff);

                deferred.resolve(latestFilePath);
            })
            .catch((err) => {
                sendSocketMessage(req, packageId, 'progress', 'Encounter error downloading latest IG publisher, will use pre-loaded/default IG publisher');
                return Q.resolve(defaultFilePath);
            });
    } else {
        sendSocketMessage(req, packageId, 'progress', 'Using existing/default version of FHIR IG publisher');
        return Q.resolve(defaultFilePath);
    }

    return deferred.promise;
}

function exportHtml(req, res, testCallback) {
    const isXml = req.query._format === 'application/xml';
    const extension = (!isXml ? '.json' : '.xml');
    const useTerminologyServer = req.query.useTerminologyServer === undefined || req.query.useTerminologyServer == 'true';
    const executeIgPublisher = req.query.executeIgPublisher === undefined || req.query.executeIgPublisher == 'true';
    const homedir = require('os').homedir();

    tmp.dir((err, rootPath, cleanup) => {
        if (err) {
            console.log(err);
            return res.status(500).send('An error occurred while creating a temporary directory');
        }

        const packageId = rootPath.substring(rootPath.lastIndexOf(path.sep) + 1);
        res.send(packageId);

        setTimeout(() => {
            sendSocketMessage(req, packageId, 'progress', 'Created temp directory. Retrieving resources for implementation guide.');

            // Prepare IG Publisher package
            getBundle(req, 'application/json')
                .then((bundleJson) => {
                    const bundle = JSON.parse(bundleJson);
                    let implementationGuideResource = null;

                    sendSocketMessage(req, packageId, 'progress', 'Resources retrieved. Packaging.');

                    try {
                        for (var i = 0; i < bundle.entry.length; i++) {
                            const resourceType = bundle.entry[i].resource.resourceType;
                            const id = bundle.entry[i].resource.id;
                            const resourceDir = path.join(rootPath, 'resources', resourceType);
                            let resourcePath;

                            let resourceContent = null;

                            // ImplementationGuide must be generated as an xml file for the IG Publisher in STU3.
                            if (!isXml && resourceType !== 'ImplementationGuide') {
                                resourceContent = JSON.stringify(bundle.entry[0].resource, null, '\t');
                                resourcePath = path.join(resourceDir, id + '.json');
                            } else {
                                resourceContent = fhir.objToXml(bundle.entry[0].resource);
                                resourcePath = path.join(resourceDir, id + '.xml');
                            }

                            if (resourceType == 'ImplementationGuide' && id === req.params.implementationGuideId) {
                                implementationGuideResource = bundle.entry[i].resource;
                            }

                            fs.ensureDirSync(resourceDir);
                            fs.writeFileSync(resourcePath, resourceContent);
                        }

                        if (!implementationGuideResource) {
                            throw new Error('The implementation guide was not found in the bundle returned by the server');
                        }

                        if (implementationGuideResource.page) {
                            const pagesPath = path.join(rootPath, '_pages');
                            fs.ensureDirSync(pagesPath);

                            packageImplementationGuidePage(pagesPath, implementationGuideResource, implementationGuideResource.page);
                        }

                        const control = getControl(extension, implementationGuideResource, bundle);
                        const controlPath = path.join(rootPath, 'ig.json');
                        const controlContent = JSON.stringify(control, null, '\t');
                        fs.writeFileSync(controlPath, controlContent);

                        const templatePath = path.join(__dirname, '..', 'ig-publisher-template');
                        fs.copySync(templatePath, rootPath);

                        sendSocketMessage(req, packageId, 'progress', 'Done building package');

                        if (executeIgPublisher) {
                            getIgPublisher(req, packageId)
                                .then((igPublisherLocation) => {
                                    if (testCallback) {
                                        throw new Error('Should not execute the IG publisher in a unit test');
                                    }

                                    const igPublisherVersion = req.query.useLatest ? 'latest' : 'default';
                                    sendSocketMessage(req, packageId, 'progress', `Running ${igPublisherVersion} IG Publisher`);

                                    const jarParams = ['-jar', igPublisherLocation, '-ig', controlPath];

                                    if (!useTerminologyServer) {
                                        jarParams.push('-tx', 'N/A');
                                    }

                                    const igPublisherProcess = spawn('java', jarParams);

                                    igPublisherProcess.stdout.on('data', (data) => {
                                        const message = data.toString().replace(tmp.tmpdir, 'XXX').replace(homedir, 'XXX');
                                        sendSocketMessage(req, packageId, 'progress', message);
                                    });

                                    igPublisherProcess.stderr.on('data', (data) => {
                                        const message = data.toString().replace(tmp.tmpdir, 'XXX').replace(homedir, 'XXX');
                                        sendSocketMessage(req, packageId, 'progress', message);
                                    });

                                    igPublisherProcess.on('exit', (code) => {
                                        sendSocketMessage(req, packageId, 'progress', 'IG Publisher finished with code ' + code);
                                        sendSocketMessage(req, packageId, 'complete', 'Done. You will be prompted to download the package in a moment.');
                                    });
                                })
                                .catch((err) => {
                                    sendSocketMessage(req, packageId, 'error', err);
                                    fs.emptyDirSync(rootPath);
                                    fs.rmdirSync(rootPath);

                                    if (testCallback) {
                                        testCallback(rootPath, err);
                                    }
                                });
                        } else {
                            sendSocketMessage(req, packageId, 'complete', 'Done. You will be prompted to download the package in a moment.');

                            if (testCallback) {
                                testCallback(rootPath);
                            }
                        }
                    } catch (ex) {
                        sendSocketMessage(req, packageId, 'error', ex.message);
                        fs.emptyDirSync(rootPath);
                        fs.rmdirSync(rootPath);

                        if (testCallback) {
                            testCallback(rootPath, ex);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send('Error retrieving bundle from FHIR server');

                    if (testCallback) {
                        testCallback(rootPath, err);
                    }
                });
        }, 1000);
    });
}

router.post('/:implementationGuideId', checkJwt, (req, res) => {
    try {
        switch (req.query.exportFormat) {
            case '1':
                return exportBundle(req, res);
            case '2':
                return exportHtml(req, res);
        }
    } catch (ex) {
        console.log(ex);
        return res.status(500).send('A fatal error occurred while exporting');
    }
});

router.get('/:packageId', checkJwt, (req, res) => {
    const rootPath = path.join(tmp.tmpdir, req.params.packageId);

    zipdir(rootPath, (err, buffer) => {
        if (err) {
            console.log(err);
            fs.emptyDir(rootPath, cleanup);             // Asynchronously removes the temporary folder
            return res.status(500).send('An error occurred while ziping the package');
        }

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=ig-package.zip');      // TODO: Determine file name
        res.send(buffer);

        fs.emptyDirSync(rootPath);
        fs.rmdirSync(rootPath);
    });
});

module.exports = router;
module.exports.getControl = getControl;
module.exports.exportHtml = exportHtml;