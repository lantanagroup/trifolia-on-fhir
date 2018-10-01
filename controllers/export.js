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
const serverConfig = config.get('server');
const rp = require('request-promise');
const FhirHelper = require('../fhirHelper');
const log4js = require('log4js');
const log = log4js.getLogger();

/*
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
            log.error('Error retrieving implementation guide bundle from FHIR server: ' + error);
            return deferred.reject('Error retrieving implementation guide bundle from FHIR server');
        }

        deferred.resolve(body);
    });

    return deferred.promise;
}
*/

/**
 * Gets a bundle for the implementation guide in the request
 * @param req The express http request
 * @param req.params.implementationGuideId
 * @return {*}
 */
function getBundle(req) {
    const deferred = Q.defer();
    const igUrl = req.getFhirServerUrl('ImplementationGuide', req.params.implementationGuideId);
    let implementationGuide;
    let implementationGuideFullUrl;

    rp({ url: igUrl, json: true, resolveWithFullResponse: true })
        .then((response) => {
            implementationGuide = response.body;
            implementationGuideFullUrl = response.headers['content-location'];

            const promises = [];

            _.each(implementationGuide.package, (package) => {
                const references = _.chain(package.resource)
                    .filter((resource) => resource.sourceReference && resource.sourceReference.reference)
                    .map((resource) => resource.sourceReference.reference)
                    .value();

                _.each(references, (reference) => {
                    const parsed = FhirHelper.parseUrl(reference);
                    const resourceUrl = req.getFhirServerUrl(parsed.resourceType, parsed.id);
                    const resourcePromise = rp({ url: resourceUrl, json: true, resolveWithFullResponse: true });
                    promises.push(resourcePromise);
                });
            });

            return Q.all(promises);
        })
        .then((responses) => {
            const badResponses = _.filter(responses, (response) => {
                return !response.body || !response.body.resourceType;
            });
            const resourceEntries = _.chain(responses)
                .filter((response) => {
                    return response.body && response.body.resourceType;
                })
                .map((response) => {
                    let fullUrl = response.headers['content-location'];

                    if (!fullUrl) {
                        fullUrl = FhirHelper.joinUrl(req.fhirServerBase, response.body.resourceType, response.body.id);

                        if (response.body.meta && response.body.meta.versionId) {
                            fullUrl = FhirHelper.joinUrl(fullUrl, '_history', response.body.meta.versionId);
                        }
                    }

                    return {
                        fullUrl: fullUrl,
                        resource: response.body
                    };
                })
                .value();

            if (responses.length !== resourceEntries.length) {
                log.error(`Expected ${responses.length} entries in the export bundle, but only returning ${resourceEntries.length}. Some resources could not be returned in the bundle due to the response from the server.`);
            }

            const bundle = {
                resourceType: 'Bundle',
                type: 'collection',
                total: resourceEntries.length + 1,
                entry: [{ fullUrl: implementationGuideFullUrl, resource: implementationGuide }].concat(resourceEntries)
            };

            deferred.resolve(bundle);
        })
        .catch((err) => {
            deferred.reject(err);
        });

    return deferred.promise;
}

/**
 * Exports a bundle for the specified implementation guide in the http request
 * @param req The express http request
 * @param req.params.implementationGuideId {string} The id of the implementation guide to export
 * @param req.query._format {string} The format that should be returned by the bundle. See http://www.hl7.org/fhir/http.html#mime-type
 * @param res The express http response
 * @param res.headers Sets the content-type and content-disposition to reflect downloading an attached file
 */
function exportBundle(req, res) {
    getBundle(req)
        .then((bundle) => {
            let fileExt = '.json';

            if (req.query._format && req.query._format === 'application/xml') {
                fileExt = '.xml';
            }

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=ig-bundle' + fileExt);      // TODO: Determine file name

            let responseContent = bundle;

            if (req.query._format === 'xml' || req.query._format === 'application/xml' || req.query._format === 'application/fhir+xml') {
                responseContent = req.fhir.objToXml(bundle);
            }

            res.send(responseContent);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

/**
 * Builds a control file based on the specified criteria
 * @param extension The extension of the files to export - not currently used in control
 * @param implementationGuide {ImplementationGuide} - The implementation guide resource to build the control file for
 * @param bundle {Bundle} - The bundle of resources the control file represents
 * @param version {string} - The FHIR version to use in the control file
 * @return {{tool: string, version: *, source: string, "npm-name": string, license: string, paths: {qa: string, temp: string, output: string, txCache: string, specification: string, pages: string[], resources: string[]}, pages: string[], "extension-domains": string[], "allowed-domains": string[], "sct-edition": string, canonicalBase: string, defaults: {Location: {"template-base": string}, ProcedureRequest: {"template-base": string}, Organization: {"template-base": string}, MedicationStatement: {"template-base": string}, SearchParameter: {"template-base": string}, StructureDefinition: {"template-mappings": string, "template-base": string, "template-defns": string}, Immunization: {"template-base": string}, Patient: {"template-base": string}, StructureMap: {content: boolean, script: boolean, "template-base": string, profiles: boolean}, ConceptMap: {"template-base": string}, Practitioner: {"template-base": string}, OperationDefinition: {"template-base": string}, CodeSystem: {"template-base": string}, Communication: {"template-base": string}, Any: {"template-format": string, "template-base": string}, PractitionerRole: {"template-base": string}, ValueSet: {"template-base": string}, CapabilityStatement: {"template-base": string}, Observation: {"template-base": string}}, resources: {}}}
 */
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
            qa: "generated_output/qa",
            temp: "generated_output/temp",
            output: "output",
            txCache: "generated_output/txCache",
            specification: "http://hl7.org/fhir/STU3",
            pages: [
                "framework",
                "source/pages"
            ],
            resources: [ "source/resources" ]
        },
        pages: ['pages'],
        'extension-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
        'allowed-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
        'sct-edition': 'http://snomed.info/sct/731000124108',
        canonicalBase: canonicalBaseMatch[1],
        defaults: {
            "Location": {"template-base": "ex.html"},
            "ProcedureRequest": {"template-base": "ex.html"},
            "Organization": {"template-base": "ex.html"},
            "MedicationStatement": {"template-base": "ex.html"},
            "SearchParameter": {"template-base": "base.html"},
            "StructureDefinition": {
                "template-mappings": "sd-mappings.html",
                "template-base": "sd.html",
                "template-defns": "sd-definitions.html"
            },
            "Immunization": {"template-base": "ex.html"},
            "Patient": {"template-base": "ex.html"},
            "StructureMap": {
                "content": false,
                "script": false,
                "template-base": "ex.html",
                "profiles": false
            },
            "ConceptMap": {"template-base": "base.html"},
            "Practitioner": {"template-base": "ex.html"},
            "OperationDefinition": {"template-base": "base.html"},
            "CodeSystem": {"template-base": "base.html"},
            "Communication": {"template-base": "ex.html"},
            "Any": {
                "template-format": "format.html",
                "template-base": "base.html"
            },
            "PractitionerRole": {"template-base": "ex.html"},
            "ValueSet": {"template-base": "base.html"},
            "CapabilityStatement": {"template-base": "base.html"},
            "Observation": {"template-base": "ex.html"}
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
    if (!req.query.socketId) {
        log.error('Won\'t send socket message for export because the original request did not specify a socketId');
        return;
    }

    if (req && req.io) {
        req.io.to(req.query.socketId).emit('message', {
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
                sendSocketMessage(req, packageId, 'progress', 'Encountered error downloading latest IG publisher, will use pre-loaded/default IG publisher');
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
            log.error(err);
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

function createTableFromArray(headers, data) {
    let output = '<table>\n<thead>\n<tr>\n';

    _.each(headers, (header) => {
        output += `<th>${header}</th>\n`;
    });

    output += '</tr>\n</thead>\n<tbody>\n';

    _.each(data, (row) => {
        output += '<tr>\n';

        _.each(row, (cell) => {
            output += `<td>${cell}</td>\n`;
        });

        output += '</tr>\n';
    });

    output += '</tbody>\n</table>\n';

    return output;
}

function updateTemplates(rootPath, bundle, implementationGuide) {
    const valueSets = _.chain(bundle.entry)
        .filter((entry) => entry.resource.resourceType === 'ValueSet')
        .map((entry) => entry.resource)
        .value();
    const codeSystems = _.chain(bundle.entry)
        .filter((entry) => entry.resource.resourceType === 'CodeSystem')
        .map((entry) => entry.resource)
        .value();
    const profiles = _.chain(bundle.entry)
        .filter((entry) => entry.resource.resourceType === 'StructureDefinition' && (!entry.resource.baseDefinition || !entry.resource.baseDefinition.endsWith('Extension')))
        .map((entry) => entry.resource)
        .value();
    const extensions = _.chain(bundle.entry)
        .filter((entry) => entry.resource.resourceType === 'StructureDefinition' && entry.resource.baseDefinition && entry.resource.baseDefinition.endsWith('Extension'))
        .map((entry) => entry.resource)
        .value();
    const capabilityStatements = _.chain(bundle.entry)
        .filter((entry) => entry.resource.resourceType === 'CapabilityStatement')
        .map((entry) => entry.resource)
        .value();

    if (implementationGuide) {
        const indexPath = path.join(rootPath, 'source/pages/index.md');

        if (implementationGuide.description) {
            const descriptionContent = '### Description\n\n' + implementationGuide.description + '\n\n';
            fs.appendFileSync(indexPath, descriptionContent);
        }

        if (implementationGuide.contact) {
            const authorsData = _.map(implementationGuide.contact, (contact) => {
                const foundEmail = _.find(contact.telecom, (telecom) => telecom.system === 'email');
                return [contact.name, foundEmail ? `<a href="mailto:${foundEmail.value}">${foundEmail.value}</a>` : ''];
            });
            const authorsContent = '### Authors\n\n' + createTableFromArray(['Name', 'Email'], authorsData) + '\n\n';
            fs.appendFileSync(indexPath, authorsContent);
        }
    }

    if (profiles.length > 0) {
        const profilesData = _.map(profiles, (profile) => {
            return [`<a href="StructureDefinition-${profile.id}.html">${profile.name}</a>`, profile.description || ''];
        });
        const profilesTable = createTableFromArray(['Name', 'Description'], profilesData);
        const profilesPath = path.join(rootPath, 'source/pages/profiles.md');
        fs.appendFileSync(profilesPath, '### Profiles\n\n' + profilesTable + '\n\n');
    }

    if (extensions.length > 0) {
        const extData = _.map(extensions, (extension) => {
            return [`<a href="StructureDefinition-${extension.id}.html">${extension.name}</a>`, extension.description || ''];
        });
        const extContent = createTableFromArray(['Name', 'Description'], extData);
        const extPath = path.join(rootPath, 'source/pages/profiles.md');
        fs.appendFileSync(extPath, '### Extensions\n\n' + extContent + '\n\n');
    }

    if (valueSets.length > 0) {
        let vsContent = '### Value Sets\n\n';
        const vsPath = path.join(rootPath, 'source/pages/terminology.md');

        _.each(valueSets, (valueSet) => {
            vsContent += `- [${valueSet.title || valueSet.name}](ValueSet-${valueSet.id}.html)\n`;
        });

        fs.appendFileSync(vsPath, vsContent + '\n\n');
    }

    if (codeSystems.length > 0) {
        let csContent = '### Code Systems\n\n';
        const csPath = path.join(rootPath, 'source/pages/terminology.md');

        _.each(valueSets, (codeSystem) => {
            csContent += `- [${codeSystem.title || codeSystem.name}](ValueSet-${codeSystem.id}.html)\n`;
        });

        fs.appendFileSync(csPath, csContent + '\n\n');
    }

    if (capabilityStatements.length > 0) {
        const csData = _.map(capabilityStatements, (capabilityStatement) => {
            return [`<a href="CapabilityStatement-${capabilityStatement.id}.html">${capabilityStatement.name}</a>`, capabilityStatement.description || ''];
        });
        const csContent = createTableFromArray(['Name', 'Description'], csData);
        const csPath = path.join(rootPath, 'source/pages/profiles.md');
        fs.appendFileSync(csPath, '### CapabilityStatements\n\n' + csContent);
    }
}

function writeFilesForResource(rootPath, resource) {
    if (!resource || !resource.resourceType || resource.resourceType === 'ImplementationGuide') {
        return;
    }

    const introPath = path.join(rootPath, `source/pages/_includes/${resource.id}-intro.md`);
    const searchPath = path.join(rootPath, `source/pages/_includes/${resource.id}-search.md`);
    const summaryPath = path.join(rootPath, `source/pages/_includes/${resource.id}-summary.md`);

    fs.writeFileSync(introPath, 'TODO - Intro');
    fs.writeFileSync(searchPath, 'TODO - Search');
    fs.writeFileSync(summaryPath, 'TODO - Summary');
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
            log.error(err);
            return res.status(500).send('An error occurred while creating a temporary directory');
        }

        const packageId = rootPath.substring(rootPath.lastIndexOf(path.sep) + 1);
        const controlPath = path.join(rootPath, 'ig.json');
        let bundle;
        res.send(packageId);

        setTimeout(() => {
            sendSocketMessage(req, packageId, 'progress', 'Created temp directory. Retrieving resources for implementation guide.');

            // Prepare IG Publisher package
            getBundle(req, 'application/json')
                .then((results) => {
                    bundle = results;
                    const resourcesDir = path.join(rootPath, 'source/resources');

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
                    // Copy the contents of the ig-publisher-template folder to the export temporary folder
                    const templatePath = path.join(__dirname, '..', 'ig-publisher-template');
                    fs.copySync(templatePath, rootPath);

                    // Write the ig.json file to the export temporary folder
                    const controlContent = JSON.stringify(control, null, '\t');
                    fs.writeFileSync(controlPath, controlContent);

                    // Write the intro, summary and search MD files for each resource
                    _.each(bundle.entry, (entry) => writeFilesForResource(rootPath, entry.resource));

                    updateTemplates(rootPath, bundle, implementationGuideResource);

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

                    const process = serverConfig.javaLocation || 'java';
                    const jarParams = ['-jar', igPublisherLocation, '-ig', controlPath];

                    if (!useTerminologyServer) {
                        jarParams.push('-tx', 'N/A');
                    }

                    log.debug(`Spawning FHIR IG Publisher Java process at ${process} with params ${jarParams}`);

                    const igPublisherProcess = spawn(process, jarParams);

                    igPublisherProcess.stdout.on('data', (data) => {
                        const message = data.toString().replace(tmp.tmpdir, 'XXX').replace(homedir, 'XXX');

                        if (message && message.trim().replace(/\./g, '') !== '') {
                            sendSocketMessage(req, packageId, 'progress', message);
                        }
                    });

                    igPublisherProcess.stderr.on('data', (data) => {
                        const message = data.toString().replace(tmp.tmpdir, 'XXX').replace(homedir, 'XXX');

                        if (message && message.trim().replace(/\./g, '') !== '') {
                            sendSocketMessage(req, packageId, 'progress', message);
                        }
                    });

                    igPublisherProcess.on('error', (err) => {
                        const message = 'Error executing FHIR IG Publisher: ' + err;
                        log.error(message);
                        sendSocketMessage(req, packageId, 'error', message);
                    });

                    igPublisherProcess.on('exit', (code) => {
                        log.debug(`IG Publisher is done executing for ${rootPath}`);

                        sendSocketMessage(req, packageId, 'progress', 'IG Publisher finished with code ' + code);

                        if (code !== 0) {
                            sendSocketMessage(req, packageId, 'progress', 'Won\'t copy output to deployment path.');
                            sendSocketMessage(req, packageId, 'complete', 'Done. You will be prompted to download the package in a moment.');
                        } else {
                            sendSocketMessage(req, packageId, 'progress', 'Copying output to deployment path.');

                            const shouldDownload = !req.query.hasOwnProperty('downloadOutput') || req.query.downloadOutput.toLowerCase() === "true";
                            const generatedPath = path.resolve(rootPath, 'generated_output');
                            const outputPath = path.resolve(rootPath, 'output');

                            log.debug(`Deleting content generated by ig publisher in ${generatedPath}`);

                            fs.emptyDirSync(generatedPath);

                            log.debug(`Copying output from ${outputPath} to ${deployDir}`);

                            fs.copy(outputPath, deployDir, (err) => {
                                if (err) {
                                    log.error(err);
                                    sendSocketMessage(req, packageId, 'error', 'Error copying contents to deployment path.');
                                } else {
                                    const finalMessage = 'Done executing the FHIR IG Publisher.' + (shouldDownload ? ' You will be prompted to download the package in a moment.' : '');
                                    sendSocketMessage(req, packageId, 'complete', finalMessage);
                                }

                                if (!shouldDownload) {
                                    log.debug(`User indicated they don't need to download. Removing temporary directory ${rootPath}`);
                                    fs.emptyDirSync(rootPath);
                                    log.debug(`Done removing temporary directory ${rootPath}`);
                                }
                            });
                        }
                    });
                })
                .catch((err) => {
                    log.error(err);
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
        log.error(ex);
        return res.status(500).send('A fatal error occurred while exporting');
    }
});

router.get('/:packageId', checkJwt, (req, res) => {
    const rootPath = path.join(tmp.tmpdir, req.params.packageId);

    zipdir(rootPath, (err, buffer) => {
        if (err) {
            log.error(err);
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