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

function getControl(extension, implementationGuide, bundle, version) {
    const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
    const canonicalBaseMatch = canonicalBaseRegex.exec(implementationGuide.url);

    if (!canonicalBaseMatch || canonicalBaseMatch.length < 2) {
        throw new Error('The ImplementationGuide.url is not in the correct format. A canonical base cannot be determined.');
    }

    // TODO: Extract npm-name from IG extension.
    // currently, IG resource has to be in XML format for the IG Publisher
    const control = {
        tool: 'jekyll',
        version: version,                                                           // R4: ImplementationGuide.fhirVersion
        source: 'implementationguide/' + implementationGuide.id + '.xml',
        'npm-name': implementationGuide.id + '-npm',                                // R4: ImplementationGuide.packageId
        license: 'CC0-1.0',                                                         // R4: ImplementationGuide.license
        paths: {
            resources: 'resources',
            qa: 'qa',
            temp: 'temp',
            pages: 'pages',
            specification: 'http://www.hl7.org/fhir/'
        },
        pages: ['pages', '_pages'],
        'extension-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
        'allowed-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
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

    // Set the dependencyList based on the extensions in the IG
    const dependencyExtensions = _.filter(implementationGuide.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency');

    // R4 ImplementationGuide.dependsOn
    control.dependencyList = _.map(dependencyExtensions, (dependencyExtension) => {
        const locationExtension = _.find(dependencyExtension.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-location');
        const nameExtension = _.find(dependencyExtension.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-name');
        const versionExtension = _.find(dependencyExtension.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-version');

        return {
            location: locationExtension ? locationExtension.valueUri : '',
            name: nameExtension ? nameExtension.valueString : '',
            version: versionExtension ? versionExtension.valueString : ''
        };
    });

    // Define the resources in the control and what templates they should use
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

function getIgPublisher(req, packageId, executeIgPublisher) {
    if (!executeIgPublisher) {
        return Q.resolve();
    }

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

function getDependency(dependencyUrl, dependencyName) {
    const deferred = Q.defer();

    request(dependencyUrl, { encoding: null }, (err, response, body) => {
        if (err) {
            console.log(err);
            deferred.reject('Could not retrieve dependency at ' + dependencyUrl);
        } else {
            deferred.resolve({
                name: dependencyName,
                data: body
            });
        }
    });

    return deferred.promise;
}

function copyExtension(destExtensionsDir, extensionFileName, isXml, fhir) {
    const sourceExtensionsDir = path.join(__dirname, '../src/assets/stu3/extensions');
    const sourceExtensionFileName = path.join(sourceExtensionsDir, extensionFileName);
    let destExtensionFileName = path.join(destExtensionsDir, extensionFileName);

    if (!isXml) {
        fs.copySync(sourceExtensionFileName, destExtensionFileName);
    } else {
        const extensionJson = fs.readFileSync(sourceExtensionFileName).toString();
        const extensionXml = fhir.jsonToXml(extensionJson);

        destExtensionFileName = destExtensionFileName.substring(0, destExtensionFileName.indexOf('.json')) + '.xml';
        fs.writeFileSync(destExtensionFileName, extensionXml);
    }
}

function getDependencies(control, isXml, resourcesDir, fhir, fhirServerConfig) {
    const isStu3 = fhirServerConfig && fhirServerConfig.version === 'stu3';

    // Load the ig dependency extensions into the resources directory
    if (isStu3 && control.dependencyList && control.dependencyList.length > 0) {
        const destExtensionsDir = path.join(resourcesDir, 'structuredefinition');

        fs.ensureDirSync(destExtensionsDir);

        copyExtension(destExtensionsDir, 'extension-ig-dependency.json', isXml, fhir);
        copyExtension(destExtensionsDir, 'extension-ig-dependency-version.json', isXml, fhir);
        copyExtension(destExtensionsDir, 'extension-ig-dependency-location.json', isXml, fhir);
        copyExtension(destExtensionsDir, 'extension-ig-dependency-name.json', isXml, fhir);
    }

    return Q.resolve([]);           // This isn't actually needed, since the IG Publisher attempts to resolve these dependency automatically

    // Attempt to resolve the dependency's definitions and include it in the package
    const deferred = Q.defer();
    const promises = _.map(control.dependencyList, (dependency) => {
        const dependencyUrl =
            dependency.location +
            (dependency.location.endsWith('/') ? '' : '/') + 'definitions.' +
            (isXml ? 'xml' : 'json') +
            '.zip';
        return getDependency(dependencyUrl, dependency.name);
    });

    Q.all(promises)
        .then(deferred.resolve)
        .catch(deferred.reject);

    return deferred.promise;
}

function getFhirControlVersion(fhirServerConfig) {
    if (!fhirServerConfig) {
        return 'current';
    }

    switch (fhirServerConfig.version) {
        case 'stu3':
            return '3.0.1';
        // case 'r4':
        default:
            return 'current';
    }
}

function exportHtml(req, res, testCallback) {
    const isXml = req.query._format === 'application/xml';
    const extension = (!isXml ? '.json' : '.xml');
    const useTerminologyServer = req.query.useTerminologyServer === undefined || req.query.useTerminologyServer == 'true';
    const executeIgPublisher = req.query.executeIgPublisher === undefined || req.query.executeIgPublisher == 'true';
    const homedir = require('os').homedir();
    const fhirServerConfig = _.find(fhirConfig.servers, (serverConfig) => {
        return serverConfig.id === req.headers['fhirserver'];
    });
    let control;
    let implementationGuideResource;

    tmp.dir((err, rootPath, cleanup) => {
        if (err) {
            console.log(err);
            return res.status(500).send('An error occurred while creating a temporary directory');
        }

        const packageId = rootPath.substring(rootPath.lastIndexOf(path.sep) + 1);
        const controlPath = path.join(rootPath, 'ig.json');
        res.send(packageId);

        setTimeout(() => {
            sendSocketMessage(req, packageId, 'progress', 'Created temp directory. Retrieving resources for implementation guide.');

            // Prepare IG Publisher package
            getBundle(req, 'application/json')
                .then((bundleJson) => {
                    const bundle = JSON.parse(bundleJson);
                    const resourcesDir = path.join(rootPath, 'resources');

                    sendSocketMessage(req, packageId, 'progress', 'Resources retrieved. Packaging.');

                    for (var i = 0; i < bundle.entry.length; i++) {
                        const resourceType = bundle.entry[i].resource.resourceType;
                        const id = bundle.entry[i].resource.id;
                        const resourceDir = path.join(resourcesDir, resourceType.toLowerCase());
                        let resourcePath;

                        let resourceContent = null;

                        // ImplementationGuide must be generated as an xml file for the IG Publisher in STU3.
                        if (!isXml && resourceType !== 'ImplementationGuide') {
                            resourceContent = JSON.stringify(bundle.entry[i].resource, null, '\t');
                            resourcePath = path.join(resourceDir, id + '.json');
                        } else {
                            resourceContent = req.fhir.objToXml(bundle.entry[i].resource);
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

                    control = getControl(extension, implementationGuideResource, bundle, getFhirControlVersion(fhirServerConfig));

                    return getDependencies(control, isXml, resourcesDir, req.fhir, fhirServerConfig);
                })
                .then((dependencies) => {
                    const controlContent = JSON.stringify(control, null, '\t');
                    fs.writeFileSync(controlPath, controlContent);

                    const templatePath = path.join(__dirname, '..', 'ig-publisher-template');
                    fs.copySync(templatePath, rootPath);

                    sendSocketMessage(req, packageId, 'progress', 'Done building package');

                    return getIgPublisher(req, packageId, executeIgPublisher);
                })
                .then((igPublisherLocation) => {
                    if (!executeIgPublisher || !igPublisherLocation) {
                        sendSocketMessage(req, packageId, 'complete', 'Done. You will be prompted to download the package in a moment.');

                        if (testCallback) {
                            testCallback(rootPath);
                        }

                        return;
                    }

                    const deployDir = path.resolve(__dirname, '../wwwroot/igs', implementationGuideResource.id);
                    fs.ensureDirSync(deployDir);

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

                        if (code !== 0) {
                            sendSocketMessage(req, packageId, 'progress', 'Won\'t copy output to deployment path.');
                            sendSocketMessage(req, packageId, 'complete', 'Done. You will be prompted to download the package in a moment.');
                        } else {
                            sendSocketMessage(req, packageId, 'progress', 'Copying output to deployment path.');

                            const outputPath = path.resolve(rootPath, 'output');
                            fs.copy(outputPath, deployDir, (err) => {
                                if (err) {
                                    console.log(err);
                                    sendSocketMessage(req, packageId, 'error', 'Error copying contents to deployment path.');
                                } else {
                                    sendSocketMessage(req, packageId, 'complete', 'Done. You will be prompted to download the package in a moment.');
                                }
                            });
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    sendSocketMessage(req, packageId, 'error', 'Error during export: ' + err);

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