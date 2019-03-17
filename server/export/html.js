"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const log4js = require("log4js");
const path = require("path");
const _ = require("underscore");
const rp = require("request-promise");
const fs = require("fs-extra");
const config = require("config");
const tmp = require("tmp");
const vkbeautify = require("vkbeautify");
const bundle_1 = require("./bundle");
const globals_1 = require("../../src/app/globals");
const fhirConfig = config.get('fhir');
const serverConfig = config.get('server');
class HtmlExporter {
    constructor(fhirServerBase, fhirServerId, fhirVersion, fhir, io, socketId, implementationGuideId) {
        this.log = log4js.getLogger();
        this.fhirServerBase = fhirServerBase;
        this.fhirServerId = fhirServerId;
        this.fhirVersion = fhirVersion;
        this.fhir = fhir;
        this.io = io;
        this.socketId = socketId;
        this.implementationGuideId = implementationGuideId;
    }
    getDisplayName(name) {
        if (!name) {
            return;
        }
        if (typeof name === 'string') {
            return name;
        }
        let display = name.family;
        if (name.given) {
            if (display) {
                display += ', ';
            }
            else {
                display = '';
            }
            display += name.given.join(' ');
        }
        return display;
    }
    createTableFromArray(headers, data) {
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
    sendSocketMessage(status, message) {
        if (!this.socketId) {
            this.log.error('Won\'t send socket message for export because the original request did not specify a socketId');
            return;
        }
        if (this.io) {
            this.io.to(this.socketId).emit('html-export', {
                packageId: this.packageId,
                status: status,
                message: message
            });
        }
    }
    getIgPublisher(useLatest, executeIgPublisher) {
        if (!executeIgPublisher) {
            return Promise.resolve(undefined);
        }
        return new Promise((resolve) => {
            const fileName = 'org.hl7.fhir.igpublisher.jar';
            const defaultPath = path.join(__dirname, '../../ig-publisher');
            const defaultFilePath = path.join(defaultPath, fileName);
            if (useLatest === true) {
                this.log.debug('Request to get latest version of FHIR IG publisher. Retrieving from: ' + fhirConfig.latestPublisher);
                this.sendSocketMessage('progress', 'Downloading latest FHIR IG publisher');
                // TODO: Check http://build.fhir.org/version.info first
                rp(fhirConfig.latestPublisher, { encoding: null })
                    .then((results) => {
                    this.log.debug('Successfully downloaded latest version of FHIR IG Publisher. Ensuring latest directory exists');
                    const latestPath = path.join(defaultPath, 'latest');
                    fs.ensureDirSync(latestPath);
                    // noinspection JSUnresolvedFunction
                    const buff = Buffer.from(results, 'utf8');
                    const latestFilePath = path.join(latestPath, fileName);
                    this.log.debug('Saving FHIR IG publisher to ' + latestFilePath);
                    fs.writeFileSync(latestFilePath, buff);
                    resolve(latestFilePath);
                })
                    .catch((err) => {
                    this.log.error(`Error getting latest version of FHIR IG publisher: ${err}`);
                    this.sendSocketMessage('progress', 'Encountered error downloading latest IG publisher, will use pre-loaded/default IG publisher');
                    resolve(defaultFilePath);
                });
            }
            else {
                this.log.debug('Using built-in version of FHIR IG publisher for export');
                this.sendSocketMessage('progress', 'Using existing/default version of FHIR IG publisher');
                resolve(defaultFilePath);
            }
        });
    }
    copyExtension(destExtensionsDir, extensionFileName, isXml, fhir) {
        const sourceExtensionsDir = path.join(__dirname, '../../src/assets/stu3/extensions');
        const sourceExtensionFileName = path.join(sourceExtensionsDir, extensionFileName);
        let destExtensionFileName = path.join(destExtensionsDir, extensionFileName);
        if (!isXml) {
            fs.copySync(sourceExtensionFileName, destExtensionFileName);
        }
        else {
            const extensionJson = fs.readFileSync(sourceExtensionFileName).toString();
            const extensionXml = fhir.jsonToXml(extensionJson);
            destExtensionFileName = destExtensionFileName.substring(0, destExtensionFileName.indexOf('.json')) + '.xml';
            fs.writeFileSync(destExtensionFileName, extensionXml);
        }
    }
    getDependencies(control, isXml, resourcesDir, fhir, fhirServerConfig) {
        const isStu3 = fhirServerConfig && fhirServerConfig.version === 'stu3';
        // Load the ig dependency extensions into the resources directory
        if (isStu3 && control.dependencyList && control.dependencyList.length > 0) {
            const destExtensionsDir = path.join(resourcesDir, 'structuredefinition');
            fs.ensureDirSync(destExtensionsDir);
            this.copyExtension(destExtensionsDir, 'extension-ig-dependency.json', isXml, fhir);
            this.copyExtension(destExtensionsDir, 'extension-ig-dependency-version.json', isXml, fhir);
            this.copyExtension(destExtensionsDir, 'extension-ig-dependency-location.json', isXml, fhir);
            this.copyExtension(destExtensionsDir, 'extension-ig-dependency-name.json', isXml, fhir);
        }
        return Promise.resolve([]); // This isn't actually needed, since the IG Publisher attempts to resolve these dependency automatically
        /*
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
        */
    }
    getFhirControlVersion(fhirServerConfig) {
        const configVersion = fhirServerConfig ? fhirServerConfig.version : null;
        // TODO: Add more logic
        switch (configVersion) {
            case 'stu3':
                return '3.0.1';
            default:
                return '4.0.0';
        }
    }
    updateTemplates(rootPath, bundle, implementationGuide) {
        const mainResourceTypes = ['ImplementationGuide', 'ValueSet', 'CodeSystem', 'StructureDefinition', 'CapabilityStatement'];
        const distinctResources = _.chain(bundle.entry)
            .map((entry) => entry.resource)
            .uniq((resource) => resource.id)
            .value();
        const valueSets = _.filter(distinctResources, (resource) => resource.resourceType === 'ValueSet');
        const codeSystems = _.filter(distinctResources, (resource) => resource.resourceType === 'CodeSystem');
        const profiles = _.filter(distinctResources, (resource) => resource.resourceType === 'StructureDefinition' && (!resource.baseDefinition || !resource.baseDefinition.endsWith('Extension')));
        const extensions = _.filter(distinctResources, (resource) => resource.resourceType === 'StructureDefinition' && resource.baseDefinition && resource.baseDefinition.endsWith('Extension'));
        const capabilityStatements = _.filter(distinctResources, (resource) => resource.resourceType === 'CapabilityStatement');
        const otherResources = _.filter(distinctResources, (resource) => mainResourceTypes.indexOf(resource.resourceType) < 0);
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
                const authorsContent = '### Authors\n\n' + this.createTableFromArray(['Name', 'Email'], authorsData) + '\n\n';
                fs.appendFileSync(indexPath, authorsContent);
            }
        }
        if (profiles.length > 0) {
            const profilesData = _.chain(profiles)
                .sortBy((profile) => profile.name)
                .map((profile) => {
                return [`<a href="StructureDefinition-${profile.id}.html">${profile.name}</a>`, profile.description || ''];
            }).value();
            const profilesTable = this.createTableFromArray(['Name', 'Description'], profilesData);
            const profilesPath = path.join(rootPath, 'source/pages/profiles.md');
            fs.appendFileSync(profilesPath, '### Profiles\n\n' + profilesTable + '\n\n');
        }
        if (extensions.length > 0) {
            const extData = _.chain(extensions)
                .sortBy((extension) => extension.name)
                .map((extension) => {
                return [`<a href="StructureDefinition-${extension.id}.html">${extension.name}</a>`, extension.description || ''];
            }).value();
            const extContent = this.createTableFromArray(['Name', 'Description'], extData);
            const extPath = path.join(rootPath, 'source/pages/profiles.md');
            fs.appendFileSync(extPath, '### Extensions\n\n' + extContent + '\n\n');
        }
        if (valueSets.length > 0) {
            let vsContent = '### Value Sets\n\n';
            const vsPath = path.join(rootPath, 'source/pages/terminology.md');
            _.chain(valueSets)
                .sortBy((valueSet) => valueSet.title || valueSet.name)
                .each((valueSet) => {
                vsContent += `- [${valueSet.title || valueSet.name}](ValueSet-${valueSet.id}.html)\n`;
            });
            fs.appendFileSync(vsPath, vsContent + '\n\n');
        }
        if (codeSystems.length > 0) {
            let csContent = '### Code Systems\n\n';
            const csPath = path.join(rootPath, 'source/pages/terminology.md');
            _.chain(codeSystems)
                .sortBy((codeSystem) => codeSystem.title || codeSystem.name)
                .each((codeSystem) => {
                csContent += `- [${codeSystem.title || codeSystem.name}](ValueSet-${codeSystem.id}.html)\n`;
            });
            fs.appendFileSync(csPath, csContent + '\n\n');
        }
        if (capabilityStatements.length > 0) {
            const csData = _.chain(capabilityStatements)
                .sortBy((capabilityStatement) => capabilityStatement.name)
                .map((capabilityStatement) => {
                return [`<a href="CapabilityStatement-${capabilityStatement.id}.html">${capabilityStatement.name}</a>`, capabilityStatement.description || ''];
            }).value();
            const csContent = this.createTableFromArray(['Name', 'Description'], csData);
            const csPath = path.join(rootPath, 'source/pages/capstatements.md');
            fs.appendFileSync(csPath, '### CapabilityStatements\n\n' + csContent);
        }
        if (otherResources.length > 0) {
            const oData = _.chain(otherResources)
                .sortBy((resource) => {
                let display = resource.title || this.getDisplayName(resource.name) || resource.id;
                return resource.resourceType + display;
            })
                .map((resource) => {
                let name = resource.title || this.getDisplayName(resource.name) || resource.id;
                return [resource.resourceType, `<a href="${resource.resourceType}-${resource.id}.html">${name}</a>`];
            })
                .value();
            const oContent = this.createTableFromArray(['Type', 'Name'], oData);
            const csPath = path.join(rootPath, 'source/pages/other.md');
            fs.appendFileSync(csPath, '### Other Resources\n\n' + oContent);
        }
    }
    writeFilesForResources(rootPath, resource) {
        if (!resource || !resource.resourceType || resource.resourceType === 'ImplementationGuide') {
            return;
        }
        const introPath = path.join(rootPath, `source/pages/_includes/${resource.id}-intro.md`);
        const searchPath = path.join(rootPath, `source/pages/_includes/${resource.id}-search.md`);
        const summaryPath = path.join(rootPath, `source/pages/_includes/${resource.id}-summary.md`);
        let intro = '---\n' +
            `title: ${resource.resourceType}-${resource.id}-intro\n` +
            'layout: default\n' +
            `active: ${resource.resourceType}-${resource.id}-intro\n` +
            '---\n\n';
        if (resource.description) {
            intro += resource.description;
        }
        fs.writeFileSync(introPath, intro);
        fs.writeFileSync(searchPath, 'TODO - Search');
        fs.writeFileSync(summaryPath, 'TODO - Summary');
    }
    getStu3Control(implementationGuide, bundle, version) {
        const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
        const canonicalBaseMatch = canonicalBaseRegex.exec(implementationGuide.url);
        const packageIdExtension = _.find(implementationGuide.extension, (extension) => extension.url === new globals_1.Globals().extensionUrls['extension-ig-package-id']);
        let canonicalBase;
        if (!canonicalBaseMatch || canonicalBaseMatch.length < 2) {
            canonicalBase = implementationGuide.url.substring(0, implementationGuide.url.lastIndexOf('/'));
        }
        else {
            canonicalBase = canonicalBaseMatch[1];
        }
        // TODO: Extract npm-name from IG extension.
        // currently, IG resource has to be in XML format for the IG Publisher
        const control = {
            tool: 'jekyll',
            source: 'implementationguide/' + implementationGuide.id + '.xml',
            'npm-name': packageIdExtension && packageIdExtension.valueString ? packageIdExtension.valueString : implementationGuide.id + '-npm',
            license: 'CC0-1.0',
            paths: {
                qa: 'generated_output/qa',
                temp: 'generated_output/temp',
                output: 'output',
                txCache: 'generated_output/txCache',
                specification: 'http://hl7.org/fhir/STU3',
                pages: [
                    'framework',
                    'source/pages'
                ],
                resources: ['source/resources']
            },
            pages: ['pages'],
            'extension-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
            'allowed-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
            'sct-edition': 'http://snomed.info/sct/731000124108',
            canonicalBase: canonicalBase,
            defaults: {
                'Location': { 'template-base': 'ex.html' },
                'ProcedureRequest': { 'template-base': 'ex.html' },
                'Organization': { 'template-base': 'ex.html' },
                'MedicationStatement': { 'template-base': 'ex.html' },
                'SearchParameter': { 'template-base': 'base.html' },
                'StructureDefinition': {
                    'template-mappings': 'sd-mappings.html',
                    'template-base': 'sd.html',
                    'template-defns': 'sd-definitions.html'
                },
                'Immunization': { 'template-base': 'ex.html' },
                'Patient': { 'template-base': 'ex.html' },
                'StructureMap': {
                    'content': false,
                    'script': false,
                    'template-base': 'ex.html',
                    'profiles': false
                },
                'ConceptMap': { 'template-base': 'base.html' },
                'Practitioner': { 'template-base': 'ex.html' },
                'OperationDefinition': { 'template-base': 'base.html' },
                'CodeSystem': { 'template-base': 'base.html' },
                'Communication': { 'template-base': 'ex.html' },
                'Any': {
                    'template-format': 'format.html',
                    'template-base': 'base.html'
                },
                'PractitionerRole': { 'template-base': 'ex.html' },
                'ValueSet': { 'template-base': 'base.html' },
                'CapabilityStatement': { 'template-base': 'base.html' },
                'Observation': { 'template-base': 'ex.html' }
            },
            resources: {}
        };
        if (version) {
            control.version = version;
        }
        // Set the dependencyList based on the extensions in the IG
        const dependencyExtensions = _.filter(implementationGuide.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency');
        // R4 ImplementationGuide.dependsOn
        control.dependencyList = _.chain(dependencyExtensions)
            .filter((dependencyExtension) => {
            const locationExtension = _.find(dependencyExtension.extension, (next) => next.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-location');
            const nameExtension = _.find(dependencyExtension.extension, (next) => next.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-name');
            return !!locationExtension && !!locationExtension.valueString && !!nameExtension && !!nameExtension.valueString;
        })
            .map((dependencyExtension) => {
            const locationExtension = _.find(dependencyExtension.extension, (next) => next.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-location');
            const nameExtension = _.find(dependencyExtension.extension, (next) => next.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-name');
            const versionExtension = _.find(dependencyExtension.extension, (next) => next.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-version');
            return {
                location: locationExtension ? locationExtension.valueUri : '',
                name: nameExtension ? nameExtension.valueString : '',
                version: versionExtension ? versionExtension.valueString : ''
            };
        })
            .value();
        // Define the resources in the control and what templates they should use
        if (bundle && bundle.entry) {
            for (let i = 0; i < bundle.entry.length; i++) {
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
    getR4Control(implementationGuide, bundle, version) {
        const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
        const canonicalBaseMatch = canonicalBaseRegex.exec(implementationGuide.url);
        let canonicalBase;
        if (!canonicalBaseMatch || canonicalBaseMatch.length < 2) {
            canonicalBase = implementationGuide.url.substring(0, implementationGuide.url.lastIndexOf('/'));
        }
        else {
            canonicalBase = canonicalBaseMatch[1];
        }
        // currently, IG resource has to be in XML format for the IG Publisher
        const control = {
            tool: 'jekyll',
            source: 'implementationguide/' + implementationGuide.id + '.xml',
            'npm-name': implementationGuide.packageId || implementationGuide.id + '-npm',
            license: implementationGuide.license || 'CC0-1.0',
            paths: {
                qa: 'generated_output/qa',
                temp: 'generated_output/temp',
                output: 'output',
                txCache: 'generated_output/txCache',
                specification: 'http://hl7.org/fhir/R4/',
                pages: [
                    'framework',
                    'source/pages'
                ],
                resources: ['source/resources']
            },
            pages: ['pages'],
            'extension-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
            'allowed-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
            'sct-edition': 'http://snomed.info/sct/731000124108',
            canonicalBase: canonicalBase,
            defaults: {
                'Location': { 'template-base': 'ex.html' },
                'ProcedureRequest': { 'template-base': 'ex.html' },
                'Organization': { 'template-base': 'ex.html' },
                'MedicationStatement': { 'template-base': 'ex.html' },
                'SearchParameter': { 'template-base': 'base.html' },
                'StructureDefinition': {
                    'template-mappings': 'sd-mappings.html',
                    'template-base': 'sd.html',
                    'template-defns': 'sd-definitions.html'
                },
                'Immunization': { 'template-base': 'ex.html' },
                'Patient': { 'template-base': 'ex.html' },
                'StructureMap': {
                    'content': false,
                    'script': false,
                    'template-base': 'ex.html',
                    'profiles': false
                },
                'ConceptMap': { 'template-base': 'base.html' },
                'Practitioner': { 'template-base': 'ex.html' },
                'OperationDefinition': { 'template-base': 'base.html' },
                'CodeSystem': { 'template-base': 'base.html' },
                'Communication': { 'template-base': 'ex.html' },
                'Any': {
                    'template-format': 'format.html',
                    'template-base': 'base.html'
                },
                'PractitionerRole': { 'template-base': 'ex.html' },
                'ValueSet': { 'template-base': 'base.html' },
                'CapabilityStatement': { 'template-base': 'base.html' },
                'Observation': { 'template-base': 'ex.html' }
            },
            resources: {}
        };
        if (version) {
            control.version = version;
        }
        if (implementationGuide.fhirVersion && implementationGuide.fhirVersion.length > 0) {
            control['fixed-business-version'] = implementationGuide.fhirVersion[0];
        }
        control.dependencyList = _.chain(implementationGuide.dependsOn)
            .filter((dependsOn) => {
            const locationExtension = _.find(dependsOn.extension, (dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-location');
            const nameExtension = _.find(dependsOn.extension, (dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-name');
            return !!locationExtension && !!locationExtension.valueString && !!nameExtension && !!nameExtension.valueString;
        })
            .map((dependsOn) => {
            const locationExtension = _.find(dependsOn.extension, (dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-location');
            const nameExtension = _.find(dependsOn.extension, (dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-name');
            return {
                location: locationExtension ? locationExtension.valueString : '',
                name: nameExtension ? nameExtension.valueString : '',
                version: dependsOn.version
            };
        })
            .value();
        // Define the resources in the control and what templates they should use
        if (bundle && bundle.entry) {
            for (let i = 0; i < bundle.entry.length; i++) {
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
    getStu3PageContent(implementationGuide, page) {
        const contentExtension = _.find(page.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content');
        if (contentExtension && contentExtension.valueReference && contentExtension.valueReference.reference && page.source) {
            const reference = contentExtension.valueReference.reference;
            if (reference.startsWith('#')) {
                const contained = _.find(implementationGuide.contained, (contained) => contained.id === reference.substring(1));
                const binary = contained && contained.resourceType === 'Binary' ? contained : undefined;
                if (binary) {
                    return {
                        fileName: page.source,
                        content: Buffer.from(binary.content, 'base64').toString()
                    };
                }
            }
        }
    }
    writeStu3Page(pagesPath, implementationGuide, page, level, tocEntries) {
        const pageContent = this.getStu3PageContent(implementationGuide, page);
        if (page.kind !== 'toc' && pageContent && pageContent.content) {
            const newPagePath = path.join(pagesPath, pageContent.fileName);
            const content = '---\n' +
                `title: ${page.title}\n` +
                'layout: default\n' +
                `active: ${page.title}\n` +
                '---\n\n' + pageContent.content;
            fs.writeFileSync(newPagePath, content);
        }
        // Add an entry to the TOC
        tocEntries.push({ level: level, fileName: page.kind === 'page' && pageContent ? pageContent.fileName : null, title: page.title });
        _.each(page.page, (subPage) => this.writeStu3Page(pagesPath, implementationGuide, subPage, level + 1, tocEntries));
    }
    getPageExtension(page) {
        switch (page.generation) {
            case 'html':
            case 'generated':
                return '.html';
            case 'xml':
                return '.xml';
            default:
                return '.md';
        }
    }
    writeR4Page(pagesPath, implementationGuide, page, level, tocEntries) {
        let fileName;
        if (page.nameReference && page.nameReference.reference && page.title) {
            const reference = page.nameReference.reference;
            if (reference.startsWith('#')) {
                const contained = _.find(implementationGuide.contained, (contained) => contained.id === reference.substring(1));
                const binary = contained && contained.resourceType === 'Binary' ? contained : undefined;
                if (binary && binary.data) {
                    fileName = page.title.replace(/ /g, '_');
                    if (fileName.indexOf('.') < 0) {
                        fileName += this.getPageExtension(page);
                    }
                    const newPagePath = path.join(pagesPath, fileName);
                    // noinspection JSUnresolvedFunction
                    const binaryContent = Buffer.from(binary.data, 'base64').toString();
                    const content = '---\n' +
                        `title: ${page.title}\n` +
                        'layout: default\n' +
                        `active: ${page.title}\n` +
                        `---\n\n${binaryContent}`;
                    fs.writeFileSync(newPagePath, content);
                }
            }
        }
        // Add an entry to the TOC
        tocEntries.push({ level: level, fileName: fileName, title: page.title });
        _.each(page.page, (subPage) => this.writeR4Page(pagesPath, implementationGuide, subPage, level + 1, tocEntries));
    }
    generateTableOfContents(rootPath, tocEntries, shouldAutoGenerate, pageContent) {
        const tocPath = path.join(rootPath, 'source/pages/toc.md');
        let tocContent = '';
        if (shouldAutoGenerate) {
            _.each(tocEntries, (entry) => {
                let fileName = entry.fileName;
                if (fileName && fileName.endsWith('.md')) {
                    fileName = fileName.substring(0, fileName.length - 3) + '.html';
                }
                for (let i = 1; i < entry.level; i++) {
                    tocContent += '    ';
                }
                tocContent += '* ';
                if (fileName) {
                    tocContent += `<a href="${fileName}">${entry.title}</a>\n`;
                }
                else {
                    tocContent += `${entry.title}\n`;
                }
            });
        }
        else if (pageContent && pageContent.content) {
            tocContent = pageContent.content;
        }
        if (tocContent) {
            fs.appendFileSync(tocPath, tocContent);
        }
    }
    writeStu3Pages(rootPath, implementationGuide) {
        const tocFilePath = path.join(rootPath, 'source/pages/toc.md');
        const tocEntries = [];
        if (implementationGuide.page) {
            const autoGenerateExtension = _.find(implementationGuide.page.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc');
            const shouldAutoGenerate = autoGenerateExtension && autoGenerateExtension.valueBoolean === true;
            const pageContent = this.getStu3PageContent(implementationGuide, implementationGuide.page);
            const pagesPath = path.join(rootPath, 'source/pages');
            fs.ensureDirSync(pagesPath);
            this.writeStu3Page(pagesPath, implementationGuide, implementationGuide.page, 1, tocEntries);
            this.generateTableOfContents(rootPath, tocEntries, shouldAutoGenerate, pageContent);
        }
    }
    writeR4Pages(rootPath, implementationGuide) {
        const tocEntries = [];
        let shouldAutoGenerate = true;
        let rootPageContent;
        let rootPageFileName;
        if (implementationGuide.definition && implementationGuide.definition.page) {
            const autoGenerateExtension = _.find(implementationGuide.definition.page.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc');
            shouldAutoGenerate = autoGenerateExtension && autoGenerateExtension.valueBoolean === true;
            const pagesPath = path.join(rootPath, 'source/pages');
            fs.ensureDirSync(pagesPath);
            if (implementationGuide.definition.page.nameReference) {
                const nameReference = implementationGuide.definition.page.nameReference;
                if (nameReference.reference && nameReference.reference.startsWith('#')) {
                    const foundContained = _.find(implementationGuide.contained, (contained) => contained.id === nameReference.reference.substring(1));
                    const binary = foundContained && foundContained.resourceType === 'Binary' ? foundContained : undefined;
                    if (binary) {
                        rootPageContent = new Buffer(binary.data, 'base64').toString();
                        rootPageFileName = implementationGuide.definition.page.title.replace(/ /g, '_');
                        if (!rootPageFileName.endsWith('.md')) {
                            rootPageFileName += '.md';
                        }
                    }
                }
            }
            this.writeR4Page(pagesPath, implementationGuide, implementationGuide.definition.page, 1, tocEntries);
        }
        // Append TOC Entries to the toc.md file in the template
        this.generateTableOfContents(rootPath, tocEntries, shouldAutoGenerate, { fileName: rootPageFileName, content: rootPageContent });
    }
    export(format, executeIgPublisher, useTerminologyServer, useLatest, downloadOutput, includeIgPublisherJar, testCallback) {
        return new Promise((resolve, reject) => {
            const bundleExporter = new bundle_1.BundleExporter(this.fhirServerBase, this.fhirServerId, this.fhirVersion, this.fhir, this.implementationGuideId);
            const isXml = format === 'xml' || format === 'application/xml' || format === 'application/fhir+xml';
            const extension = (!isXml ? '.json' : '.xml');
            const homedir = require('os').homedir();
            const fhirServerConfig = _.find(fhirConfig.servers, (server) => server.id === this.fhirServerId);
            let control;
            let implementationGuideResource;
            tmp.dir((tmpDirErr, rootPath) => {
                if (tmpDirErr) {
                    this.log.error(tmpDirErr);
                    return reject('An error occurred while creating a temporary directory: ' + tmpDirErr);
                }
                const controlPath = path.join(rootPath, 'ig.json');
                let bundle;
                this.packageId = rootPath.substring(rootPath.lastIndexOf(path.sep) + 1);
                resolve(this.packageId);
                setTimeout(() => {
                    this.sendSocketMessage('progress', 'Created temp directory. Retrieving resources for implementation guide.');
                    // Prepare IG Publisher package
                    bundleExporter.getBundle(false)
                        .then((results) => {
                        bundle = results;
                        const resourcesDir = path.join(rootPath, 'source/resources');
                        this.sendSocketMessage('progress', 'Resources retrieved. Packaging.');
                        for (let i = 0; i < bundle.entry.length; i++) {
                            const resource = bundle.entry[i].resource;
                            const extensionlessResource = bundle_1.BundleExporter.cleanupResource(resource);
                            const resourceType = resource.resourceType;
                            const id = resource.id;
                            const resourceDir = path.join(resourcesDir, resourceType.toLowerCase());
                            let resourcePath;
                            let resourceContent = null;
                            if (resourceType === 'ImplementationGuide' && id === this.implementationGuideId) {
                                implementationGuideResource = resource;
                            }
                            // ImplementationGuide must be generated as an xml file for the IG Publisher in STU3.
                            if (!isXml && resourceType !== 'ImplementationGuide') {
                                resourceContent = JSON.stringify(extensionlessResource, null, '\t');
                                resourcePath = path.join(resourceDir, id + '.json');
                            }
                            else {
                                resourceContent = this.fhir.objToXml(extensionlessResource);
                                resourceContent = vkbeautify.xml(resourceContent);
                                resourcePath = path.join(resourceDir, id + '.xml');
                            }
                            fs.ensureDirSync(resourceDir);
                            fs.writeFileSync(resourcePath, resourceContent);
                        }
                        if (!implementationGuideResource) {
                            throw new Error('The implementation guide was not found in the bundle returned by the server');
                        }
                        if (fhirServerConfig.version === 'stu3') {
                            control = this.getStu3Control(implementationGuideResource, bundle, this.getFhirControlVersion(fhirServerConfig));
                        }
                        else {
                            control = this.getR4Control(implementationGuideResource, bundle, this.getFhirControlVersion(fhirServerConfig));
                        }
                        return this.getDependencies(control, isXml, resourcesDir, this.fhir, fhirServerConfig);
                    })
                        .then(() => {
                        // Copy the contents of the ig-publisher-template folder to the export temporary folder
                        const templatePath = path.join(__dirname, '../../', 'ig-publisher-template');
                        fs.copySync(templatePath, rootPath);
                        // Write the ig.json file to the export temporary folder
                        const controlContent = JSON.stringify(control, null, '\t');
                        fs.writeFileSync(controlPath, controlContent);
                        // Write the intro, summary and search MD files for each resource
                        _.each(bundle.entry, (entry) => this.writeFilesForResources(rootPath, entry.resource));
                        this.updateTemplates(rootPath, bundle, implementationGuideResource);
                        if (fhirServerConfig.version === 'stu3') {
                            this.writeStu3Pages(rootPath, implementationGuideResource);
                        }
                        else {
                            this.writeR4Pages(rootPath, implementationGuideResource);
                        }
                        this.sendSocketMessage('progress', 'Done building package');
                        return this.getIgPublisher(useLatest, executeIgPublisher);
                    })
                        .then((igPublisherLocation) => {
                        if (includeIgPublisherJar) {
                            this.sendSocketMessage('progress', 'Copying IG Publisher JAR to working directory.');
                            const jarFileName = igPublisherLocation.substring(igPublisherLocation.lastIndexOf(path.sep) + 1);
                            const destJarPath = path.join(rootPath, jarFileName);
                            fs.copySync(igPublisherLocation, destJarPath);
                        }
                        if (!executeIgPublisher || !igPublisherLocation) {
                            this.sendSocketMessage('complete', 'Done. You will be prompted to download the package in a moment.');
                            if (testCallback) {
                                testCallback(rootPath);
                            }
                            return;
                        }
                        const deployDir = path.resolve(__dirname, '../../wwwroot/igs', this.fhirServerId, implementationGuideResource.id);
                        fs.ensureDirSync(deployDir);
                        const igPublisherVersion = useLatest ? 'latest' : 'default';
                        const process = serverConfig.javaLocation || 'java';
                        const jarParams = ['-jar', igPublisherLocation, '-ig', controlPath];
                        if (!useTerminologyServer) {
                            jarParams.push('-tx', 'N/A');
                        }
                        this.sendSocketMessage('progress', `Running ${igPublisherVersion} IG Publisher: ${jarParams.join(' ')}`);
                        this.log.debug(`Spawning FHIR IG Publisher Java process at ${process} with params ${jarParams}`);
                        const igPublisherProcess = child_process_1.spawn(process, jarParams);
                        igPublisherProcess.stdout.on('data', (data) => {
                            const message = data.toString().replace(tmp.tmpdir, 'XXX').replace(homedir, 'XXX');
                            if (message && message.trim().replace(/\./g, '') !== '') {
                                this.sendSocketMessage('progress', message);
                            }
                        });
                        igPublisherProcess.stderr.on('data', (data) => {
                            const message = data.toString().replace(tmp.tmpdir, 'XXX').replace(homedir, 'XXX');
                            if (message && message.trim().replace(/\./g, '') !== '') {
                                this.sendSocketMessage('progress', message);
                            }
                        });
                        igPublisherProcess.on('error', (err) => {
                            const message = 'Error executing FHIR IG Publisher: ' + err;
                            this.log.error(message);
                            this.sendSocketMessage('error', message);
                        });
                        igPublisherProcess.on('exit', (code) => {
                            this.log.debug(`IG Publisher is done executing for ${rootPath}`);
                            this.sendSocketMessage('progress', 'IG Publisher finished with code ' + code);
                            if (code !== 0) {
                                this.sendSocketMessage('progress', 'Won\'t copy output to deployment path.');
                                this.sendSocketMessage('complete', 'Done. You will be prompted to download the package in a moment.');
                            }
                            else {
                                this.sendSocketMessage('progress', 'Copying output to deployment path.');
                                const generatedPath = path.resolve(rootPath, 'generated_output');
                                const outputPath = path.resolve(rootPath, 'output');
                                this.log.debug(`Deleting content generated by ig publisher in ${generatedPath}`);
                                fs.emptyDir(generatedPath, (err) => {
                                    if (err) {
                                        this.log.error(err);
                                    }
                                });
                                this.log.debug(`Copying output from ${outputPath} to ${deployDir}`);
                                fs.copy(outputPath, deployDir, (err) => {
                                    if (err) {
                                        this.log.error(err);
                                        this.sendSocketMessage('error', 'Error copying contents to deployment path.');
                                    }
                                    else {
                                        const finalMessage = `Done executing the FHIR IG Publisher. You may view the IG <a href="/implementation-guide/${this.implementationGuideId}/view">here</a>.` + (downloadOutput ? ' You will be prompted to download the package in a moment.' : '');
                                        this.sendSocketMessage('complete', finalMessage);
                                    }
                                    if (!downloadOutput) {
                                        this.log.debug(`User indicated they don't need to download. Removing temporary directory ${rootPath}`);
                                        fs.emptyDir(rootPath, (err) => {
                                            if (err) {
                                                this.log.error(err);
                                            }
                                            else {
                                                this.log.debug(`Done removing temporary directory ${rootPath}`);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    })
                        .catch((err) => {
                        this.log.error(err);
                        this.sendSocketMessage('error', 'Error during export: ' + err);
                        if (testCallback) {
                            testCallback(rootPath, err);
                        }
                    });
                }, 1000);
            });
        });
    }
}
exports.HtmlExporter = HtmlExporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpREFBb0M7QUFlcEMsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixpQ0FBaUM7QUFDakMsMkJBQTJCO0FBQzNCLHlDQUF5QztBQVN6QyxxQ0FBd0M7QUFFeEMsbURBQThDO0FBRTlDLE1BQU0sVUFBVSxHQUFnQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELE1BQU0sWUFBWSxHQUFrQixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBUXpELE1BQWEsWUFBWTtJQVlyQixZQUFZLGNBQXNCLEVBQUUsWUFBb0IsRUFBRSxXQUFtQixFQUFFLElBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQWdCLEVBQUUscUJBQTZCO1FBWG5KLFFBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFZOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMscUJBQXFCLEdBQUcscUJBQXFCLENBQUM7SUFDdkQsQ0FBQztJQUVPLGNBQWMsQ0FBQyxJQUFzQjtRQUN6QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTztTQUNWO1FBRUQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDMUIsT0FBZ0IsSUFBSSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxPQUFPLEdBQUcs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O3dCQUNMLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQzt5QkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTt3QkFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSx1QkFBdUIsR0FBRyxHQUFHLENBQUMsQ0FBQzt3QkFFL0QsSUFBSSxZQUFZLEVBQUU7NEJBQ2QsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDL0I7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQTM3QkQsb0NBMjdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RmhpciBhcyBGaGlyTW9kdWxlfSBmcm9tICdmaGlyL2ZoaXInO1xuaW1wb3J0IHtTZXJ2ZXJ9IGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQge3NwYXdufSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7XG4gICAgRG9tYWluUmVzb3VyY2UsXG4gICAgSHVtYW5OYW1lLFxuICAgIEJ1bmRsZSBhcyBTVFUzQnVuZGxlLFxuICAgIEJpbmFyeSBhcyBTVFUzQmluYXJ5LFxuICAgIEltcGxlbWVudGF0aW9uR3VpZGUgYXMgU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUsXG4gICAgUGFnZUNvbXBvbmVudCwgRXh0ZW5zaW9uXG59IGZyb20gJy4uLy4uL3NyYy9hcHAvbW9kZWxzL3N0dTMvZmhpcic7XG5pbXBvcnQge1xuICAgIEJpbmFyeSBhcyBSNEJpbmFyeSxcbiAgICBCdW5kbGUgYXMgUjRCdW5kbGUsXG4gICAgSW1wbGVtZW50YXRpb25HdWlkZSBhcyBSNEltcGxlbWVudGF0aW9uR3VpZGUsXG4gICAgSW1wbGVtZW50YXRpb25HdWlkZVBhZ2VDb21wb25lbnRcbn0gZnJvbSAnLi4vLi4vc3JjL2FwcC9tb2RlbHMvcjQvZmhpcic7XG5pbXBvcnQgKiBhcyBsb2c0anMgZnJvbSAnbG9nNGpzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tICdjb25maWcnO1xuaW1wb3J0ICogYXMgdG1wIGZyb20gJ3RtcCc7XG5pbXBvcnQgKiBhcyB2a2JlYXV0aWZ5IGZyb20gJ3ZrYmVhdXRpZnknO1xuaW1wb3J0IHtcbiAgICBGaGlyLFxuICAgIEZoaXJDb25maWcsXG4gICAgRmhpckNvbmZpZ1NlcnZlcixcbiAgICBGaGlyQ29udHJvbCxcbiAgICBGaGlyQ29udHJvbERlcGVuZGVuY3ksXG4gICAgU2VydmVyQ29uZmlnXG59IGZyb20gJy4uL2NvbnRyb2xsZXJzL21vZGVscyc7XG5pbXBvcnQge0J1bmRsZUV4cG9ydGVyfSBmcm9tICcuL2J1bmRsZSc7XG5pbXBvcnQgQnVuZGxlID0gRmhpci5CdW5kbGU7XG5pbXBvcnQge0dsb2JhbHN9IGZyb20gJy4uLy4uL3NyYy9hcHAvZ2xvYmFscyc7XG5cbmNvbnN0IGZoaXJDb25maWcgPSA8RmhpckNvbmZpZz4gY29uZmlnLmdldCgnZmhpcicpO1xuY29uc3Qgc2VydmVyQ29uZmlnID0gPFNlcnZlckNvbmZpZz4gY29uZmlnLmdldCgnc2VydmVyJyk7XG5cbmludGVyZmFjZSBUYWJsZU9mQ29udGVudHNFbnRyeSB7XG4gICAgbGV2ZWw6IG51bWJlcjtcbiAgICBmaWxlTmFtZTogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBIdG1sRXhwb3J0ZXIge1xuICAgIHJlYWRvbmx5IGxvZyA9IGxvZzRqcy5nZXRMb2dnZXIoKTtcbiAgICByZWFkb25seSBmaGlyU2VydmVyQmFzZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGZoaXJTZXJ2ZXJJZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGZoaXJWZXJzaW9uOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZmhpcjogRmhpck1vZHVsZTtcbiAgICByZWFkb25seSBpbzogU2VydmVyO1xuICAgIHJlYWRvbmx5IHNvY2tldElkOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaW1wbGVtZW50YXRpb25HdWlkZUlkOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIHBhY2thZ2VJZDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoZmhpclNlcnZlckJhc2U6IHN0cmluZywgZmhpclNlcnZlcklkOiBzdHJpbmcsIGZoaXJWZXJzaW9uOiBzdHJpbmcsIGZoaXI6IEZoaXJNb2R1bGUsIGlvOiBTZXJ2ZXIsIHNvY2tldElkOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGVJZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZmhpclNlcnZlckJhc2UgPSBmaGlyU2VydmVyQmFzZTtcbiAgICAgICAgdGhpcy5maGlyU2VydmVySWQgPSBmaGlyU2VydmVySWQ7XG4gICAgICAgIHRoaXMuZmhpclZlcnNpb24gPSBmaGlyVmVyc2lvbjtcbiAgICAgICAgdGhpcy5maGlyID0gZmhpcjtcbiAgICAgICAgdGhpcy5pbyA9IGlvO1xuICAgICAgICB0aGlzLnNvY2tldElkID0gc29ja2V0SWQ7XG4gICAgICAgIHRoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkID0gaW1wbGVtZW50YXRpb25HdWlkZUlkO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGlzcGxheU5hbWUobmFtZTogc3RyaW5nfEh1bWFuTmFtZSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIDxzdHJpbmc+IG5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGlzcGxheSA9IG5hbWUuZmFtaWx5O1xuXG4gICAgICAgIGlmIChuYW1lLmdpdmVuKSB7XG4gICAgICAgICAgICBpZiAoZGlzcGxheSkge1xuICAgICAgICAgICAgICAgIGRpc3BsYXkgKz0gJywgJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkaXNwbGF5ICs9IG5hbWUuZ2l2ZW4uam9pbignICcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRpc3BsYXk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGNyZWF0ZVRhYmxlRnJvbUFycmF5KGhlYWRlcnMsIGRhdGEpIHtcbiAgICAgICAgbGV0IG91dHB1dCA9ICc8dGFibGU+XFxuPHRoZWFkPlxcbjx0cj5cXG4nO1xuXG4gICAgICAgIF8uZWFjaChoZWFkZXJzLCAoaGVhZGVyKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gYDx0aD4ke2hlYWRlcn08L3RoPlxcbmA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG91dHB1dCArPSAnPC90cj5cXG48L3RoZWFkPlxcbjx0Ym9keT5cXG4nO1xuXG4gICAgICAgIF8uZWFjaChkYXRhLCAocm93OiBzdHJpbmdbXSkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0ICs9ICc8dHI+XFxuJztcblxuICAgICAgICAgICAgXy5lYWNoKHJvdywgKGNlbGwpID0+IHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYDx0ZD4ke2NlbGx9PC90ZD5cXG5gO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG91dHB1dCArPSAnPC90cj5cXG4nO1xuICAgICAgICB9KTtcblxuICAgICAgICBvdXRwdXQgKz0gJzwvdGJvZHk+XFxuPC90YWJsZT5cXG4nO1xuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZW5kU29ja2V0TWVzc2FnZShzdGF0dXMsIG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNvY2tldElkKSB7XG4gICAgICAgICAgICB0aGlzLmxvZy5lcnJvcignV29uXFwndCBzZW5kIHNvY2tldCBtZXNzYWdlIGZvciBleHBvcnQgYmVjYXVzZSB0aGUgb3JpZ2luYWwgcmVxdWVzdCBkaWQgbm90IHNwZWNpZnkgYSBzb2NrZXRJZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaW8pIHtcbiAgICAgICAgICAgIHRoaXMuaW8udG8odGhpcy5zb2NrZXRJZCkuZW1pdCgnaHRtbC1leHBvcnQnLCB7XG4gICAgICAgICAgICAgICAgcGFja2FnZUlkOiB0aGlzLnBhY2thZ2VJZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SWdQdWJsaXNoZXIodXNlTGF0ZXN0OiBib29sZWFuLCBleGVjdXRlSWdQdWJsaXNoZXI6IGJvb2xlYW4pOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBpZiAoIWV4ZWN1dGVJZ1B1Ymxpc2hlcikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9ICdvcmcuaGw3LmZoaXIuaWdwdWJsaXNoZXIuamFyJztcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL2lnLXB1Ymxpc2hlcicpO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdEZpbGVQYXRoID0gcGF0aC5qb2luKGRlZmF1bHRQYXRoLCBmaWxlTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICh1c2VMYXRlc3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZygnUmVxdWVzdCB0byBnZXQgbGF0ZXN0IHZlcnNpb24gb2YgRkhJUiBJRyBwdWJsaXNoZXIuIFJldHJpZXZpbmcgZnJvbTogJyArIGZoaXJDb25maWcubGF0ZXN0UHVibGlzaGVyKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0Rvd25sb2FkaW5nIGxhdGVzdCBGSElSIElHIHB1Ymxpc2hlcicpO1xuXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogQ2hlY2sgaHR0cDovL2J1aWxkLmZoaXIub3JnL3ZlcnNpb24uaW5mbyBmaXJzdFxuXG4gICAgICAgICAgICAgICAgcnAoZmhpckNvbmZpZy5sYXRlc3RQdWJsaXNoZXIsIHsgZW5jb2Rpbmc6IG51bGwgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdTdWNjZXNzZnVsbHkgZG93bmxvYWRlZCBsYXRlc3QgdmVyc2lvbiBvZiBGSElSIElHIFB1Ymxpc2hlci4gRW5zdXJpbmcgbGF0ZXN0IGRpcmVjdG9yeSBleGlzdHMnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0UGF0aCA9IHBhdGguam9pbihkZWZhdWx0UGF0aCwgJ2xhdGVzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhsYXRlc3RQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBidWZmID0gQnVmZmVyLmZyb20ocmVzdWx0cywgJ3V0ZjgnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhdGVzdEZpbGVQYXRoID0gcGF0aC5qb2luKGxhdGVzdFBhdGgsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoJ1NhdmluZyBGSElSIElHIHB1Ymxpc2hlciB0byAnICsgbGF0ZXN0RmlsZVBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGxhdGVzdEZpbGVQYXRoLCBidWZmKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShsYXRlc3RGaWxlUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5lcnJvcihgRXJyb3IgZ2V0dGluZyBsYXRlc3QgdmVyc2lvbiBvZiBGSElSIElHIHB1Ymxpc2hlcjogJHtlcnJ9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdFbmNvdW50ZXJlZCBlcnJvciBkb3dubG9hZGluZyBsYXRlc3QgSUcgcHVibGlzaGVyLCB3aWxsIHVzZSBwcmUtbG9hZGVkL2RlZmF1bHQgSUcgcHVibGlzaGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRlZmF1bHRGaWxlUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZygnVXNpbmcgYnVpbHQtaW4gdmVyc2lvbiBvZiBGSElSIElHIHB1Ymxpc2hlciBmb3IgZXhwb3J0Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnVXNpbmcgZXhpc3RpbmcvZGVmYXVsdCB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkZWZhdWx0RmlsZVBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBjb3B5RXh0ZW5zaW9uKGRlc3RFeHRlbnNpb25zRGlyOiBzdHJpbmcsIGV4dGVuc2lvbkZpbGVOYW1lOiBzdHJpbmcsIGlzWG1sOiBib29sZWFuLCBmaGlyOiBGaGlyTW9kdWxlKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUV4dGVuc2lvbnNEaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vc3JjL2Fzc2V0cy9zdHUzL2V4dGVuc2lvbnMnKTtcbiAgICAgICAgY29uc3Qgc291cmNlRXh0ZW5zaW9uRmlsZU5hbWUgPSBwYXRoLmpvaW4oc291cmNlRXh0ZW5zaW9uc0RpciwgZXh0ZW5zaW9uRmlsZU5hbWUpO1xuICAgICAgICBsZXQgZGVzdEV4dGVuc2lvbkZpbGVOYW1lID0gcGF0aC5qb2luKGRlc3RFeHRlbnNpb25zRGlyLCBleHRlbnNpb25GaWxlTmFtZSk7XG5cbiAgICAgICAgaWYgKCFpc1htbCkge1xuICAgICAgICAgICAgZnMuY29weVN5bmMoc291cmNlRXh0ZW5zaW9uRmlsZU5hbWUsIGRlc3RFeHRlbnNpb25GaWxlTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb25Kc29uID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZUV4dGVuc2lvbkZpbGVOYW1lKS50b1N0cmluZygpO1xuICAgICAgICAgICAgY29uc3QgZXh0ZW5zaW9uWG1sID0gZmhpci5qc29uVG9YbWwoZXh0ZW5zaW9uSnNvbik7XG5cbiAgICAgICAgICAgIGRlc3RFeHRlbnNpb25GaWxlTmFtZSA9IGRlc3RFeHRlbnNpb25GaWxlTmFtZS5zdWJzdHJpbmcoMCwgZGVzdEV4dGVuc2lvbkZpbGVOYW1lLmluZGV4T2YoJy5qc29uJykpICsgJy54bWwnO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkZXN0RXh0ZW5zaW9uRmlsZU5hbWUsIGV4dGVuc2lvblhtbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXREZXBlbmRlbmNpZXMoY29udHJvbCwgaXNYbWw6IGJvb2xlYW4sIHJlc291cmNlc0Rpcjogc3RyaW5nLCBmaGlyOiBGaGlyTW9kdWxlLCBmaGlyU2VydmVyQ29uZmlnOiBGaGlyQ29uZmlnU2VydmVyKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3QgaXNTdHUzID0gZmhpclNlcnZlckNvbmZpZyAmJiBmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gPT09ICdzdHUzJztcblxuICAgICAgICAvLyBMb2FkIHRoZSBpZyBkZXBlbmRlbmN5IGV4dGVuc2lvbnMgaW50byB0aGUgcmVzb3VyY2VzIGRpcmVjdG9yeVxuICAgICAgICBpZiAoaXNTdHUzICYmIGNvbnRyb2wuZGVwZW5kZW5jeUxpc3QgJiYgY29udHJvbC5kZXBlbmRlbmN5TGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBkZXN0RXh0ZW5zaW9uc0RpciA9IHBhdGguam9pbihyZXNvdXJjZXNEaXIsICdzdHJ1Y3R1cmVkZWZpbml0aW9uJyk7XG5cbiAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMoZGVzdEV4dGVuc2lvbnNEaXIpO1xuXG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS5qc29uJywgaXNYbWwsIGZoaXIpO1xuICAgICAgICAgICAgdGhpcy5jb3B5RXh0ZW5zaW9uKGRlc3RFeHRlbnNpb25zRGlyLCAnZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktdmVyc2lvbi5qc29uJywgaXNYbWwsIGZoaXIpO1xuICAgICAgICAgICAgdGhpcy5jb3B5RXh0ZW5zaW9uKGRlc3RFeHRlbnNpb25zRGlyLCAnZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbG9jYXRpb24uanNvbicsIGlzWG1sLCBmaGlyKTtcbiAgICAgICAgICAgIHRoaXMuY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0RpciwgJ2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LW5hbWUuanNvbicsIGlzWG1sLCBmaGlyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pOyAgICAgICAgICAgLy8gVGhpcyBpc24ndCBhY3R1YWxseSBuZWVkZWQsIHNpbmNlIHRoZSBJRyBQdWJsaXNoZXIgYXR0ZW1wdHMgdG8gcmVzb2x2ZSB0aGVzZSBkZXBlbmRlbmN5IGF1dG9tYXRpY2FsbHlcblxuICAgICAgICAvKlxuICAgICAgICAvLyBBdHRlbXB0IHRvIHJlc29sdmUgdGhlIGRlcGVuZGVuY3kncyBkZWZpbml0aW9ucyBhbmQgaW5jbHVkZSBpdCBpbiB0aGUgcGFja2FnZVxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBfLm1hcChjb250cm9sLmRlcGVuZGVuY3lMaXN0LCAoZGVwZW5kZW5jeSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVwZW5kZW5jeVVybCA9XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jeS5sb2NhdGlvbiArXG4gICAgICAgICAgICAgICAgKGRlcGVuZGVuY3kubG9jYXRpb24uZW5kc1dpdGgoJy8nKSA/ICcnIDogJy8nKSArICdkZWZpbml0aW9ucy4nICtcbiAgICAgICAgICAgICAgICAoaXNYbWwgPyAneG1sJyA6ICdqc29uJykgK1xuICAgICAgICAgICAgICAgICcuemlwJztcbiAgICAgICAgICAgIHJldHVybiBnZXREZXBlbmRlbmN5KGRlcGVuZGVuY3lVcmwsIGRlcGVuZGVuY3kubmFtZSk7XG4gICAgICAgIH0pO1xuICAgIFxuICAgICAgICBRLmFsbChwcm9taXNlcylcbiAgICAgICAgICAgIC50aGVuKGRlZmVycmVkLnJlc29sdmUpXG4gICAgICAgICAgICAuY2F0Y2goZGVmZXJyZWQucmVqZWN0KTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICovXG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0RmhpckNvbnRyb2xWZXJzaW9uKGZoaXJTZXJ2ZXJDb25maWcpIHtcbiAgICAgICAgY29uc3QgY29uZmlnVmVyc2lvbiA9IGZoaXJTZXJ2ZXJDb25maWcgPyBmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gOiBudWxsO1xuXG4gICAgICAgIC8vIFRPRE86IEFkZCBtb3JlIGxvZ2ljXG4gICAgICAgIHN3aXRjaCAoY29uZmlnVmVyc2lvbikge1xuICAgICAgICAgICAgY2FzZSAnc3R1Myc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICczLjAuMSc7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAnNC4wLjAnO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgdXBkYXRlVGVtcGxhdGVzKHJvb3RQYXRoLCBidW5kbGUsIGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgIGNvbnN0IG1haW5SZXNvdXJjZVR5cGVzID0gWydJbXBsZW1lbnRhdGlvbkd1aWRlJywgJ1ZhbHVlU2V0JywgJ0NvZGVTeXN0ZW0nLCAnU3RydWN0dXJlRGVmaW5pdGlvbicsICdDYXBhYmlsaXR5U3RhdGVtZW50J107XG4gICAgICAgIGNvbnN0IGRpc3RpbmN0UmVzb3VyY2VzID0gXy5jaGFpbihidW5kbGUuZW50cnkpXG4gICAgICAgICAgICAubWFwKChlbnRyeSkgPT4gZW50cnkucmVzb3VyY2UpXG4gICAgICAgICAgICAudW5pcSgocmVzb3VyY2UpID0+IHJlc291cmNlLmlkKVxuICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgIGNvbnN0IHZhbHVlU2V0cyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ1ZhbHVlU2V0Jyk7XG4gICAgICAgIGNvbnN0IGNvZGVTeXN0ZW1zID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnQ29kZVN5c3RlbScpO1xuICAgICAgICBjb25zdCBwcm9maWxlcyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ1N0cnVjdHVyZURlZmluaXRpb24nICYmICghcmVzb3VyY2UuYmFzZURlZmluaXRpb24gfHwgIXJlc291cmNlLmJhc2VEZWZpbml0aW9uLmVuZHNXaXRoKCdFeHRlbnNpb24nKSkpO1xuICAgICAgICBjb25zdCBleHRlbnNpb25zID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnU3RydWN0dXJlRGVmaW5pdGlvbicgJiYgcmVzb3VyY2UuYmFzZURlZmluaXRpb24gJiYgcmVzb3VyY2UuYmFzZURlZmluaXRpb24uZW5kc1dpdGgoJ0V4dGVuc2lvbicpKTtcbiAgICAgICAgY29uc3QgY2FwYWJpbGl0eVN0YXRlbWVudHMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdDYXBhYmlsaXR5U3RhdGVtZW50Jyk7XG4gICAgICAgIGNvbnN0IG90aGVyUmVzb3VyY2VzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gbWFpblJlc291cmNlVHlwZXMuaW5kZXhPZihyZXNvdXJjZS5yZXNvdXJjZVR5cGUpIDwgMCk7XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4UGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9pbmRleC5tZCcpO1xuXG4gICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uQ29udGVudCA9ICcjIyMgRGVzY3JpcHRpb25cXG5cXG4nICsgaW1wbGVtZW50YXRpb25HdWlkZS5kZXNjcmlwdGlvbiArICdcXG5cXG4nO1xuICAgICAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGluZGV4UGF0aCwgZGVzY3JpcHRpb25Db250ZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFjdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvcnNEYXRhID0gXy5tYXAoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWN0LCAoY29udGFjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZEVtYWlsID0gXy5maW5kKGNvbnRhY3QudGVsZWNvbSwgKHRlbGVjb20pID0+IHRlbGVjb20uc3lzdGVtID09PSAnZW1haWwnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjb250YWN0Lm5hbWUsIGZvdW5kRW1haWwgPyBgPGEgaHJlZj1cIm1haWx0bzoke2ZvdW5kRW1haWwudmFsdWV9XCI+JHtmb3VuZEVtYWlsLnZhbHVlfTwvYT5gIDogJyddO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvcnNDb250ZW50ID0gJyMjIyBBdXRob3JzXFxuXFxuJyArIHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0VtYWlsJ10sIGF1dGhvcnNEYXRhKSArICdcXG5cXG4nO1xuICAgICAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGluZGV4UGF0aCwgYXV0aG9yc0NvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb2ZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzRGF0YSA9IF8uY2hhaW4ocHJvZmlsZXMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgocHJvZmlsZSkgPT4gcHJvZmlsZS5uYW1lKVxuICAgICAgICAgICAgICAgIC5tYXAoKHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtgPGEgaHJlZj1cIlN0cnVjdHVyZURlZmluaXRpb24tJHtwcm9maWxlLmlkfS5odG1sXCI+JHtwcm9maWxlLm5hbWV9PC9hPmAsIHByb2ZpbGUuZGVzY3JpcHRpb24gfHwgJyddO1xuICAgICAgICAgICAgICAgIH0pLnZhbHVlKCk7XG4gICAgICAgICAgICBjb25zdCBwcm9maWxlc1RhYmxlID0gdGhpcy5jcmVhdGVUYWJsZUZyb21BcnJheShbJ05hbWUnLCAnRGVzY3JpcHRpb24nXSwgcHJvZmlsZXNEYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9wcm9maWxlcy5tZCcpO1xuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMocHJvZmlsZXNQYXRoLCAnIyMjIFByb2ZpbGVzXFxuXFxuJyArIHByb2ZpbGVzVGFibGUgKyAnXFxuXFxuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXh0ZW5zaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBleHREYXRhID0gXy5jaGFpbihleHRlbnNpb25zKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLm5hbWUpXG4gICAgICAgICAgICAgICAgLm1hcCgoZXh0ZW5zaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbYDxhIGhyZWY9XCJTdHJ1Y3R1cmVEZWZpbml0aW9uLSR7ZXh0ZW5zaW9uLmlkfS5odG1sXCI+JHtleHRlbnNpb24ubmFtZX08L2E+YCwgZXh0ZW5zaW9uLmRlc2NyaXB0aW9uIHx8ICcnXTtcbiAgICAgICAgICAgICAgICB9KS52YWx1ZSgpO1xuICAgICAgICAgICAgY29uc3QgZXh0Q29udGVudCA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0Rlc2NyaXB0aW9uJ10sIGV4dERhdGEpO1xuICAgICAgICAgICAgY29uc3QgZXh0UGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9wcm9maWxlcy5tZCcpO1xuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoZXh0UGF0aCwgJyMjIyBFeHRlbnNpb25zXFxuXFxuJyArIGV4dENvbnRlbnQgKyAnXFxuXFxuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWVTZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCB2c0NvbnRlbnQgPSAnIyMjIFZhbHVlIFNldHNcXG5cXG4nO1xuICAgICAgICAgICAgY29uc3QgdnNQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3Rlcm1pbm9sb2d5Lm1kJyk7XG5cbiAgICAgICAgICAgIF8uY2hhaW4odmFsdWVTZXRzKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKHZhbHVlU2V0KSA9PiB2YWx1ZVNldC50aXRsZSB8fCB2YWx1ZVNldC5uYW1lKVxuICAgICAgICAgICAgICAgIC5lYWNoKCh2YWx1ZVNldCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2c0NvbnRlbnQgKz0gYC0gWyR7dmFsdWVTZXQudGl0bGUgfHwgdmFsdWVTZXQubmFtZX1dKFZhbHVlU2V0LSR7dmFsdWVTZXQuaWR9Lmh0bWwpXFxuYDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmModnNQYXRoLCB2c0NvbnRlbnQgKyAnXFxuXFxuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29kZVN5c3RlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IGNzQ29udGVudCA9ICcjIyMgQ29kZSBTeXN0ZW1zXFxuXFxuJztcbiAgICAgICAgICAgIGNvbnN0IGNzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy90ZXJtaW5vbG9neS5tZCcpO1xuXG4gICAgICAgICAgICBfLmNoYWluKGNvZGVTeXN0ZW1zKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKGNvZGVTeXN0ZW0pID0+IGNvZGVTeXN0ZW0udGl0bGUgfHwgY29kZVN5c3RlbS5uYW1lKVxuICAgICAgICAgICAgICAgIC5lYWNoKChjb2RlU3lzdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNzQ29udGVudCArPSBgLSBbJHtjb2RlU3lzdGVtLnRpdGxlIHx8IGNvZGVTeXN0ZW0ubmFtZX1dKFZhbHVlU2V0LSR7Y29kZVN5c3RlbS5pZH0uaHRtbClcXG5gO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhjc1BhdGgsIGNzQ29udGVudCArICdcXG5cXG4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXBhYmlsaXR5U3RhdGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBjc0RhdGEgPSBfLmNoYWluKGNhcGFiaWxpdHlTdGF0ZW1lbnRzKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKGNhcGFiaWxpdHlTdGF0ZW1lbnQpID0+IGNhcGFiaWxpdHlTdGF0ZW1lbnQubmFtZSlcbiAgICAgICAgICAgICAgICAubWFwKChjYXBhYmlsaXR5U3RhdGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbYDxhIGhyZWY9XCJDYXBhYmlsaXR5U3RhdGVtZW50LSR7Y2FwYWJpbGl0eVN0YXRlbWVudC5pZH0uaHRtbFwiPiR7Y2FwYWJpbGl0eVN0YXRlbWVudC5uYW1lfTwvYT5gLCBjYXBhYmlsaXR5U3RhdGVtZW50LmRlc2NyaXB0aW9uIHx8ICcnXTtcbiAgICAgICAgICAgICAgICB9KS52YWx1ZSgpO1xuICAgICAgICAgICAgY29uc3QgY3NDb250ZW50ID0gdGhpcy5jcmVhdGVUYWJsZUZyb21BcnJheShbJ05hbWUnLCAnRGVzY3JpcHRpb24nXSwgY3NEYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGNzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9jYXBzdGF0ZW1lbnRzLm1kJyk7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhjc1BhdGgsICcjIyMgQ2FwYWJpbGl0eVN0YXRlbWVudHNcXG5cXG4nICsgY3NDb250ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdGhlclJlc291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBvRGF0YSA9IF8uY2hhaW4ob3RoZXJSZXNvdXJjZXMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgocmVzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpc3BsYXkgPSByZXNvdXJjZS50aXRsZSB8fCB0aGlzLmdldERpc3BsYXlOYW1lKHJlc291cmNlLm5hbWUpIHx8IHJlc291cmNlLmlkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgZGlzcGxheTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5tYXAoKHJlc291cmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gcmVzb3VyY2UudGl0bGUgfHwgdGhpcy5nZXREaXNwbGF5TmFtZShyZXNvdXJjZS5uYW1lKSB8fCByZXNvdXJjZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtyZXNvdXJjZS5yZXNvdXJjZVR5cGUsIGA8YSBocmVmPVwiJHtyZXNvdXJjZS5yZXNvdXJjZVR5cGV9LSR7cmVzb3VyY2UuaWR9Lmh0bWxcIj4ke25hbWV9PC9hPmBdO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgICAgICBjb25zdCBvQ29udGVudCA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydUeXBlJywgJ05hbWUnXSwgb0RhdGEpO1xuICAgICAgICAgICAgY29uc3QgY3NQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL290aGVyLm1kJyk7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhjc1BhdGgsICcjIyMgT3RoZXIgUmVzb3VyY2VzXFxuXFxuJyArIG9Db250ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlRmlsZXNGb3JSZXNvdXJjZXMocm9vdFBhdGg6IHN0cmluZywgcmVzb3VyY2U6IERvbWFpblJlc291cmNlKSB7XG4gICAgICAgIGlmICghcmVzb3VyY2UgfHwgIXJlc291cmNlLnJlc291cmNlVHlwZSB8fCByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW50cm9QYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBgc291cmNlL3BhZ2VzL19pbmNsdWRlcy8ke3Jlc291cmNlLmlkfS1pbnRyby5tZGApO1xuICAgICAgICBjb25zdCBzZWFyY2hQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBgc291cmNlL3BhZ2VzL19pbmNsdWRlcy8ke3Jlc291cmNlLmlkfS1zZWFyY2gubWRgKTtcbiAgICAgICAgY29uc3Qgc3VtbWFyeVBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIGBzb3VyY2UvcGFnZXMvX2luY2x1ZGVzLyR7cmVzb3VyY2UuaWR9LXN1bW1hcnkubWRgKTtcblxuICAgICAgICBsZXQgaW50cm8gPSAnLS0tXFxuJyArXG4gICAgICAgICAgICBgdGl0bGU6ICR7cmVzb3VyY2UucmVzb3VyY2VUeXBlfS0ke3Jlc291cmNlLmlkfS1pbnRyb1xcbmAgK1xuICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xuICAgICAgICAgICAgYGFjdGl2ZTogJHtyZXNvdXJjZS5yZXNvdXJjZVR5cGV9LSR7cmVzb3VyY2UuaWR9LWludHJvXFxuYCArXG4gICAgICAgICAgICAnLS0tXFxuXFxuJztcblxuICAgICAgICBpZiAoKDxhbnk+cmVzb3VyY2UpLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpbnRybyArPSAoPGFueT5yZXNvdXJjZSkuZGVzY3JpcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGludHJvUGF0aCwgaW50cm8pO1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHNlYXJjaFBhdGgsICdUT0RPIC0gU2VhcmNoJyk7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoc3VtbWFyeVBhdGgsICdUT0RPIC0gU3VtbWFyeScpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFN0dTNDb250cm9sKGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBidW5kbGU6IFNUVTNCdW5kbGUsIHZlcnNpb24pIHtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsQmFzZVJlZ2V4ID0gL14oLis/KVxcL0ltcGxlbWVudGF0aW9uR3VpZGVcXC8uKyQvZ207XG4gICAgICAgIGNvbnN0IGNhbm9uaWNhbEJhc2VNYXRjaCA9IGNhbm9uaWNhbEJhc2VSZWdleC5leGVjKGltcGxlbWVudGF0aW9uR3VpZGUudXJsKTtcbiAgICAgICAgY29uc3QgcGFja2FnZUlkRXh0ZW5zaW9uID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSBuZXcgR2xvYmFscygpLmV4dGVuc2lvblVybHNbJ2V4dGVuc2lvbi1pZy1wYWNrYWdlLWlkJ10pO1xuICAgICAgICBsZXQgY2Fub25pY2FsQmFzZTtcblxuICAgICAgICBpZiAoIWNhbm9uaWNhbEJhc2VNYXRjaCB8fCBjYW5vbmljYWxCYXNlTWF0Y2gubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgY2Fub25pY2FsQmFzZSA9IGltcGxlbWVudGF0aW9uR3VpZGUudXJsLnN1YnN0cmluZygwLCBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5sYXN0SW5kZXhPZignLycpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBjYW5vbmljYWxCYXNlTWF0Y2hbMV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBFeHRyYWN0IG5wbS1uYW1lIGZyb20gSUcgZXh0ZW5zaW9uLlxuICAgICAgICAvLyBjdXJyZW50bHksIElHIHJlc291cmNlIGhhcyB0byBiZSBpbiBYTUwgZm9ybWF0IGZvciB0aGUgSUcgUHVibGlzaGVyXG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSA8RmhpckNvbnRyb2w+IHtcbiAgICAgICAgICAgIHRvb2w6ICdqZWt5bGwnLFxuICAgICAgICAgICAgc291cmNlOiAnaW1wbGVtZW50YXRpb25ndWlkZS8nICsgaW1wbGVtZW50YXRpb25HdWlkZS5pZCArICcueG1sJyxcbiAgICAgICAgICAgICducG0tbmFtZSc6IHBhY2thZ2VJZEV4dGVuc2lvbiAmJiBwYWNrYWdlSWRFeHRlbnNpb24udmFsdWVTdHJpbmcgPyBwYWNrYWdlSWRFeHRlbnNpb24udmFsdWVTdHJpbmcgOiBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy1ucG0nLFxuICAgICAgICAgICAgbGljZW5zZTogJ0NDMC0xLjAnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFI0OiBJbXBsZW1lbnRhdGlvbkd1aWRlLmxpY2Vuc2VcbiAgICAgICAgICAgIHBhdGhzOiB7XG4gICAgICAgICAgICAgICAgcWE6ICdnZW5lcmF0ZWRfb3V0cHV0L3FhJyxcbiAgICAgICAgICAgICAgICB0ZW1wOiAnZ2VuZXJhdGVkX291dHB1dC90ZW1wJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6ICdvdXRwdXQnLFxuICAgICAgICAgICAgICAgIHR4Q2FjaGU6ICdnZW5lcmF0ZWRfb3V0cHV0L3R4Q2FjaGUnLFxuICAgICAgICAgICAgICAgIHNwZWNpZmljYXRpb246ICdodHRwOi8vaGw3Lm9yZy9maGlyL1NUVTMnLFxuICAgICAgICAgICAgICAgIHBhZ2VzOiBbXG4gICAgICAgICAgICAgICAgICAgICdmcmFtZXdvcmsnLFxuICAgICAgICAgICAgICAgICAgICAnc291cmNlL3BhZ2VzJ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbICdzb3VyY2UvcmVzb3VyY2VzJyBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFnZXM6IFsncGFnZXMnXSxcbiAgICAgICAgICAgICdleHRlbnNpb24tZG9tYWlucyc6IFsnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20nXSxcbiAgICAgICAgICAgICdhbGxvd2VkLWRvbWFpbnMnOiBbJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tJ10sXG4gICAgICAgICAgICAnc2N0LWVkaXRpb24nOiAnaHR0cDovL3Nub21lZC5pbmZvL3NjdC83MzEwMDAxMjQxMDgnLFxuICAgICAgICAgICAgY2Fub25pY2FsQmFzZTogY2Fub25pY2FsQmFzZSxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgJ0xvY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUHJvY2VkdXJlUmVxdWVzdCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ09yZ2FuaXphdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ01lZGljYXRpb25TdGF0ZW1lbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdTZWFyY2hQYXJhbWV0ZXInOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZURlZmluaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1tYXBwaW5ncyc6ICdzZC1tYXBwaW5ncy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnc2QuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1kZWZucyc6ICdzZC1kZWZpbml0aW9ucy5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0ltbXVuaXphdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1BhdGllbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdTdHJ1Y3R1cmVNYXAnOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50JzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICdzY3JpcHQnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICdwcm9maWxlcyc6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnQ29uY2VwdE1hcCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUHJhY3RpdGlvbmVyJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT3BlcmF0aW9uRGVmaW5pdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ29kZVN5c3RlbSc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ29tbXVuaWNhdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0FueSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWZvcm1hdCc6ICdmb3JtYXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXJSb2xlJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnVmFsdWVTZXQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0NhcGFiaWxpdHlTdGF0ZW1lbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ09ic2VydmF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc291cmNlczoge31cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodmVyc2lvbikge1xuICAgICAgICAgICAgY29udHJvbC52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCB0aGUgZGVwZW5kZW5jeUxpc3QgYmFzZWQgb24gdGhlIGV4dGVuc2lvbnMgaW4gdGhlIElHXG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY3lFeHRlbnNpb25zID0gXy5maWx0ZXIoaW1wbGVtZW50YXRpb25HdWlkZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5Jyk7XG5cbiAgICAgICAgLy8gUjQgSW1wbGVtZW50YXRpb25HdWlkZS5kZXBlbmRzT25cbiAgICAgICAgY29udHJvbC5kZXBlbmRlbmN5TGlzdCA9IF8uY2hhaW4oZGVwZW5kZW5jeUV4dGVuc2lvbnMpXG4gICAgICAgICAgICAuZmlsdGVyKChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FeHRlbnNpb24gPSBfLmZpbmQoZGVwZW5kZW5jeUV4dGVuc2lvbi5leHRlbnNpb24sIChuZXh0KSA9PiBuZXh0LnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LW5hbWUnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAhIWxvY2F0aW9uRXh0ZW5zaW9uICYmICEhbG9jYXRpb25FeHRlbnNpb24udmFsdWVTdHJpbmcgJiYgISFuYW1lRXh0ZW5zaW9uICYmICEhbmFtZUV4dGVuc2lvbi52YWx1ZVN0cmluZztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FeHRlbnNpb24gPSA8RXh0ZW5zaW9uPiBfLmZpbmQoZGVwZW5kZW5jeUV4dGVuc2lvbi5leHRlbnNpb24sIChuZXh0KSA9PiBuZXh0LnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lRXh0ZW5zaW9uID0gPEV4dGVuc2lvbj4gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LW5hbWUnKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJzaW9uRXh0ZW5zaW9uID0gPEV4dGVuc2lvbj4gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LXZlcnNpb24nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiA8RmhpckNvbnRyb2xEZXBlbmRlbmN5PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkV4dGVuc2lvbiA/IGxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlVXJpIDogJycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVFeHRlbnNpb24gPyBuYW1lRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb25FeHRlbnNpb24gPyB2ZXJzaW9uRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC52YWx1ZSgpO1xuXG4gICAgICAgIC8vIERlZmluZSB0aGUgcmVzb3VyY2VzIGluIHRoZSBjb250cm9sIGFuZCB3aGF0IHRlbXBsYXRlcyB0aGV5IHNob3VsZCB1c2VcbiAgICAgICAgaWYgKGJ1bmRsZSAmJiBidW5kbGUuZW50cnkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlLmVudHJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSBidW5kbGUuZW50cnlbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBlbnRyeS5yZXNvdXJjZTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb250cm9sLnJlc291cmNlc1tyZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLycgKyByZXNvdXJjZS5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2U6IHJlc291cmNlLnJlc291cmNlVHlwZSArICctJyArIHJlc291cmNlLmlkICsgJy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgZGVmbnM6IHJlc291cmNlLnJlc291cmNlVHlwZSArICctJyArIHJlc291cmNlLmlkICsgJy1kZWZpbml0aW9ucy5odG1sJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRSNENvbnRyb2woaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlLCBidW5kbGU6IFI0QnVuZGxlLCB2ZXJzaW9uOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsQmFzZVJlZ2V4ID0gL14oLis/KVxcL0ltcGxlbWVudGF0aW9uR3VpZGVcXC8uKyQvZ207XG4gICAgICAgIGNvbnN0IGNhbm9uaWNhbEJhc2VNYXRjaCA9IGNhbm9uaWNhbEJhc2VSZWdleC5leGVjKGltcGxlbWVudGF0aW9uR3VpZGUudXJsKTtcbiAgICAgICAgbGV0IGNhbm9uaWNhbEJhc2U7XG5cbiAgICAgICAgaWYgKCFjYW5vbmljYWxCYXNlTWF0Y2ggfHwgY2Fub25pY2FsQmFzZU1hdGNoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5zdWJzdHJpbmcoMCwgaW1wbGVtZW50YXRpb25HdWlkZS51cmwubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlID0gY2Fub25pY2FsQmFzZU1hdGNoWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY3VycmVudGx5LCBJRyByZXNvdXJjZSBoYXMgdG8gYmUgaW4gWE1MIGZvcm1hdCBmb3IgdGhlIElHIFB1Ymxpc2hlclxuICAgICAgICBjb25zdCBjb250cm9sID0gPEZoaXJDb250cm9sPiB7XG4gICAgICAgICAgICB0b29sOiAnamVreWxsJyxcbiAgICAgICAgICAgIHNvdXJjZTogJ2ltcGxlbWVudGF0aW9uZ3VpZGUvJyArIGltcGxlbWVudGF0aW9uR3VpZGUuaWQgKyAnLnhtbCcsXG4gICAgICAgICAgICAnbnBtLW5hbWUnOiBpbXBsZW1lbnRhdGlvbkd1aWRlLnBhY2thZ2VJZCB8fCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy1ucG0nLFxuICAgICAgICAgICAgbGljZW5zZTogaW1wbGVtZW50YXRpb25HdWlkZS5saWNlbnNlIHx8ICdDQzAtMS4wJyxcbiAgICAgICAgICAgIHBhdGhzOiB7XG4gICAgICAgICAgICAgICAgcWE6ICdnZW5lcmF0ZWRfb3V0cHV0L3FhJyxcbiAgICAgICAgICAgICAgICB0ZW1wOiAnZ2VuZXJhdGVkX291dHB1dC90ZW1wJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6ICdvdXRwdXQnLFxuICAgICAgICAgICAgICAgIHR4Q2FjaGU6ICdnZW5lcmF0ZWRfb3V0cHV0L3R4Q2FjaGUnLFxuICAgICAgICAgICAgICAgIHNwZWNpZmljYXRpb246ICdodHRwOi8vaGw3Lm9yZy9maGlyL1I0LycsXG4gICAgICAgICAgICAgICAgcGFnZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2ZyYW1ld29yaycsXG4gICAgICAgICAgICAgICAgICAgICdzb3VyY2UvcGFnZXMnXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFsgJ3NvdXJjZS9yZXNvdXJjZXMnIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYWdlczogWydwYWdlcyddLFxuICAgICAgICAgICAgJ2V4dGVuc2lvbi1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxuICAgICAgICAgICAgJ2FsbG93ZWQtZG9tYWlucyc6IFsnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20nXSxcbiAgICAgICAgICAgICdzY3QtZWRpdGlvbic6ICdodHRwOi8vc25vbWVkLmluZm8vc2N0LzczMTAwMDEyNDEwOCcsXG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlOiBjYW5vbmljYWxCYXNlLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAnTG9jYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcm9jZWR1cmVSZXF1ZXN0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT3JnYW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnTWVkaWNhdGlvblN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1NlYXJjaFBhcmFtZXRlcic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU3RydWN0dXJlRGVmaW5pdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLW1hcHBpbmdzJzogJ3NkLW1hcHBpbmdzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdzZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWRlZm5zJzogJ3NkLWRlZmluaXRpb25zLmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnSW1tdW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUGF0aWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZU1hcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJ3NjcmlwdCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3Byb2ZpbGVzJzogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb25jZXB0TWFwJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXInOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPcGVyYXRpb25EZWZpbml0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb2RlU3lzdGVtJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb21tdW5pY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQW55Jzoge1xuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZm9ybWF0JzogJ2Zvcm1hdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lclJvbGUnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdWYWx1ZVNldCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ2FwYWJpbGl0eVN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT2JzZXJ2YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb3VyY2VzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICBjb250cm9sLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuZmhpclZlcnNpb24gJiYgaW1wbGVtZW50YXRpb25HdWlkZS5maGlyVmVyc2lvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb250cm9sWydmaXhlZC1idXNpbmVzcy12ZXJzaW9uJ10gPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmZoaXJWZXJzaW9uWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udHJvbC5kZXBlbmRlbmN5TGlzdCA9IF8uY2hhaW4oaW1wbGVtZW50YXRpb25HdWlkZS5kZXBlbmRzT24pXG4gICAgICAgICAgICAuZmlsdGVyKChkZXBlbmRzT24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLWxvY2F0aW9uJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLW5hbWUnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAhIWxvY2F0aW9uRXh0ZW5zaW9uICYmICEhbG9jYXRpb25FeHRlbnNpb24udmFsdWVTdHJpbmcgJiYgISFuYW1lRXh0ZW5zaW9uICYmICEhbmFtZUV4dGVuc2lvbi52YWx1ZVN0cmluZztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKChkZXBlbmRzT24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLWxvY2F0aW9uJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLW5hbWUnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkV4dGVuc2lvbiA/IGxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVFeHRlbnNpb24gPyBuYW1lRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IGRlcGVuZHNPbi52ZXJzaW9uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudmFsdWUoKTtcblxuICAgICAgICAvLyBEZWZpbmUgdGhlIHJlc291cmNlcyBpbiB0aGUgY29udHJvbCBhbmQgd2hhdCB0ZW1wbGF0ZXMgdGhleSBzaG91bGQgdXNlXG4gICAgICAgIGlmIChidW5kbGUgJiYgYnVuZGxlLmVudHJ5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1bmRsZS5lbnRyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gYnVuZGxlLmVudHJ5W2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gZW50cnkucmVzb3VyY2U7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29udHJvbC5yZXNvdXJjZXNbcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy8nICsgcmVzb3VyY2UuaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICBiYXNlOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGRlZm5zOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICctZGVmaW5pdGlvbnMuaHRtbCdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0U3R1M1BhZ2VDb250ZW50KGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBQYWdlQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRFeHRlbnNpb24gPSBfLmZpbmQocGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWNvbnRlbnQnKTtcblxuICAgICAgICBpZiAoY29udGVudEV4dGVuc2lvbiAmJiBjb250ZW50RXh0ZW5zaW9uLnZhbHVlUmVmZXJlbmNlICYmIGNvbnRlbnRFeHRlbnNpb24udmFsdWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIHBhZ2Uuc291cmNlKSB7XG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBjb250ZW50RXh0ZW5zaW9uLnZhbHVlUmVmZXJlbmNlLnJlZmVyZW5jZTtcblxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZS5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZWQgPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWluZWQsIChjb250YWluZWQpID0+IGNvbnRhaW5lZC5pZCA9PT0gcmVmZXJlbmNlLnN1YnN0cmluZygxKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5ID0gY29udGFpbmVkICYmIGNvbnRhaW5lZC5yZXNvdXJjZVR5cGUgPT09ICdCaW5hcnknID8gPFNUVTNCaW5hcnk+IGNvbnRhaW5lZCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIGlmIChiaW5hcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBwYWdlLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IEJ1ZmZlci5mcm9tKGJpbmFyeS5jb250ZW50LCAnYmFzZTY0JykudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlU3R1M1BhZ2UocGFnZXNQYXRoOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBQYWdlQ29tcG9uZW50LCBsZXZlbDogbnVtYmVyLCB0b2NFbnRyaWVzOiBUYWJsZU9mQ29udGVudHNFbnRyeVtdKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gdGhpcy5nZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZSwgcGFnZSk7XG5cbiAgICAgICAgaWYgKHBhZ2Uua2luZCAhPT0gJ3RvYycgJiYgcGFnZUNvbnRlbnQgJiYgcGFnZUNvbnRlbnQuY29udGVudCkge1xuICAgICAgICAgICAgY29uc3QgbmV3UGFnZVBhdGggPSBwYXRoLmpvaW4ocGFnZXNQYXRoLCBwYWdlQ29udGVudC5maWxlTmFtZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSAnLS0tXFxuJyArXG4gICAgICAgICAgICAgICAgYHRpdGxlOiAke3BhZ2UudGl0bGV9XFxuYCArXG4gICAgICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xuICAgICAgICAgICAgICAgIGBhY3RpdmU6ICR7cGFnZS50aXRsZX1cXG5gICtcbiAgICAgICAgICAgICAgICAnLS0tXFxuXFxuJyArIHBhZ2VDb250ZW50LmNvbnRlbnQ7XG5cbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3UGFnZVBhdGgsIGNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGFuIGVudHJ5IHRvIHRoZSBUT0NcbiAgICAgICAgdG9jRW50cmllcy5wdXNoKHsgbGV2ZWw6IGxldmVsLCBmaWxlTmFtZTogcGFnZS5raW5kID09PSAncGFnZScgJiYgcGFnZUNvbnRlbnQgPyBwYWdlQ29udGVudC5maWxlTmFtZSA6IG51bGwsIHRpdGxlOiBwYWdlLnRpdGxlIH0pO1xuICAgICAgICBfLmVhY2gocGFnZS5wYWdlLCAoc3ViUGFnZSkgPT4gdGhpcy53cml0ZVN0dTNQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgc3ViUGFnZSwgbGV2ZWwgKyAxLCB0b2NFbnRyaWVzKSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0UGFnZUV4dGVuc2lvbihwYWdlOiBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudCkge1xuICAgICAgICBzd2l0Y2ggKHBhZ2UuZ2VuZXJhdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgICBjYXNlICdnZW5lcmF0ZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnLmh0bWwnO1xuICAgICAgICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy54bWwnO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy5tZCc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZVI0UGFnZShwYWdlc1BhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudCwgbGV2ZWw6IG51bWJlciwgdG9jRW50cmllczogVGFibGVPZkNvbnRlbnRzRW50cnlbXSkge1xuICAgICAgICBsZXQgZmlsZU5hbWU7XG5cbiAgICAgICAgaWYgKHBhZ2UubmFtZVJlZmVyZW5jZSAmJiBwYWdlLm5hbWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIHBhZ2UudGl0bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHBhZ2UubmFtZVJlZmVyZW5jZS5yZWZlcmVuY2U7XG5cbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2Uuc3RhcnRzV2l0aCgnIycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVkID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFpbmVkLCAoY29udGFpbmVkKSA9PiBjb250YWluZWQuaWQgPT09IHJlZmVyZW5jZS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmFyeSA9IGNvbnRhaW5lZCAmJiBjb250YWluZWQucmVzb3VyY2VUeXBlID09PSAnQmluYXJ5JyA/IDxSNEJpbmFyeT4gY29udGFpbmVkIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmFyeSAmJiBiaW5hcnkuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IHBhZ2UudGl0bGUucmVwbGFjZSgvIC9nLCAnXycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS5pbmRleE9mKCcuJykgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSB0aGlzLmdldFBhZ2VFeHRlbnNpb24ocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQYWdlUGF0aCA9IHBhdGguam9pbihwYWdlc1BhdGgsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5Q29udGVudCA9IEJ1ZmZlci5mcm9tKGJpbmFyeS5kYXRhLCAnYmFzZTY0JykudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9ICctLS1cXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGB0aXRsZTogJHtwYWdlLnRpdGxlfVxcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYGFjdGl2ZTogJHtwYWdlLnRpdGxlfVxcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYC0tLVxcblxcbiR7YmluYXJ5Q29udGVudH1gO1xuICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG5ld1BhZ2VQYXRoLCBjb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgYW4gZW50cnkgdG8gdGhlIFRPQ1xuICAgICAgICB0b2NFbnRyaWVzLnB1c2goeyBsZXZlbDogbGV2ZWwsIGZpbGVOYW1lOiBmaWxlTmFtZSwgdGl0bGU6IHBhZ2UudGl0bGUgfSk7XG5cbiAgICAgICAgXy5lYWNoKHBhZ2UucGFnZSwgKHN1YlBhZ2UpID0+IHRoaXMud3JpdGVSNFBhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBzdWJQYWdlLCBsZXZlbCArIDEsIHRvY0VudHJpZXMpKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aDogc3RyaW5nLCB0b2NFbnRyaWVzOiBUYWJsZU9mQ29udGVudHNFbnRyeVtdLCBzaG91bGRBdXRvR2VuZXJhdGU6IGJvb2xlYW4sIHBhZ2VDb250ZW50KSB7XG4gICAgICAgIGNvbnN0IHRvY1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdG9jLm1kJyk7XG4gICAgICAgIGxldCB0b2NDb250ZW50ID0gJyc7XG5cbiAgICAgICAgaWYgKHNob3VsZEF1dG9HZW5lcmF0ZSkge1xuICAgICAgICAgICAgXy5lYWNoKHRvY0VudHJpZXMsIChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZSA9IGVudHJ5LmZpbGVOYW1lO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lICYmIGZpbGVOYW1lLmVuZHNXaXRoKCcubWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZygwLCBmaWxlTmFtZS5sZW5ndGggLSAzKSArICcuaHRtbCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBlbnRyeS5sZXZlbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gJyAgICAnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gJyogJztcblxuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0b2NDb250ZW50ICs9IGA8YSBocmVmPVwiJHtmaWxlTmFtZX1cIj4ke2VudHJ5LnRpdGxlfTwvYT5cXG5gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gYCR7ZW50cnkudGl0bGV9XFxuYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChwYWdlQ29udGVudCAmJiBwYWdlQ29udGVudC5jb250ZW50KSB7XG4gICAgICAgICAgICB0b2NDb250ZW50ID0gcGFnZUNvbnRlbnQuY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b2NDb250ZW50KSB7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyh0b2NQYXRoLCB0b2NDb250ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlU3R1M1BhZ2VzKHJvb3RQYXRoOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgIGNvbnN0IHRvY0ZpbGVQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3RvYy5tZCcpO1xuICAgICAgICBjb25zdCB0b2NFbnRyaWVzID0gW107XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUucGFnZSkge1xuICAgICAgICAgICAgY29uc3QgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUucGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWF1dG8tZ2VuZXJhdGUtdG9jJyk7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRBdXRvR2VuZXJhdGUgPSBhdXRvR2VuZXJhdGVFeHRlbnNpb24gJiYgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uLnZhbHVlQm9vbGVhbiA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gdGhpcy5nZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5wYWdlKTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcycpO1xuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhwYWdlc1BhdGgpO1xuXG4gICAgICAgICAgICB0aGlzLndyaXRlU3R1M1BhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBpbXBsZW1lbnRhdGlvbkd1aWRlLnBhZ2UsIDEsIHRvY0VudHJpZXMpO1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aCwgdG9jRW50cmllcywgc2hvdWxkQXV0b0dlbmVyYXRlLCBwYWdlQ29udGVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZVI0UGFnZXMocm9vdFBhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgIGNvbnN0IHRvY0VudHJpZXMgPSBbXTtcbiAgICAgICAgbGV0IHNob3VsZEF1dG9HZW5lcmF0ZSA9IHRydWU7XG4gICAgICAgIGxldCByb290UGFnZUNvbnRlbnQ7XG4gICAgICAgIGxldCByb290UGFnZUZpbGVOYW1lO1xuXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24gJiYgaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGF1dG9HZW5lcmF0ZUV4dGVuc2lvbiA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWF1dG8tZ2VuZXJhdGUtdG9jJyk7XG4gICAgICAgICAgICBzaG91bGRBdXRvR2VuZXJhdGUgPSBhdXRvR2VuZXJhdGVFeHRlbnNpb24gJiYgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uLnZhbHVlQm9vbGVhbiA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcycpO1xuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhwYWdlc1BhdGgpO1xuXG4gICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UubmFtZVJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWVSZWZlcmVuY2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS5uYW1lUmVmZXJlbmNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZENvbnRhaW5lZCA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhaW5lZCwgKGNvbnRhaW5lZCkgPT4gY29udGFpbmVkLmlkID09PSBuYW1lUmVmZXJlbmNlLnJlZmVyZW5jZS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW5hcnkgPSBmb3VuZENvbnRhaW5lZCAmJiBmb3VuZENvbnRhaW5lZC5yZXNvdXJjZVR5cGUgPT09ICdCaW5hcnknID8gPFI0QmluYXJ5PiBmb3VuZENvbnRhaW5lZCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UGFnZUNvbnRlbnQgPSBuZXcgQnVmZmVyKGJpbmFyeS5kYXRhLCAnYmFzZTY0JykudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQYWdlRmlsZU5hbWUgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS50aXRsZS5yZXBsYWNlKC8gL2csICdfJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcm9vdFBhZ2VGaWxlTmFtZS5lbmRzV2l0aCgnLm1kJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UGFnZUZpbGVOYW1lICs9ICcubWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLndyaXRlUjRQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UsIDEsIHRvY0VudHJpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwZW5kIFRPQyBFbnRyaWVzIHRvIHRoZSB0b2MubWQgZmlsZSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aCwgdG9jRW50cmllcywgc2hvdWxkQXV0b0dlbmVyYXRlLCB7IGZpbGVOYW1lOiByb290UGFnZUZpbGVOYW1lLCBjb250ZW50OiByb290UGFnZUNvbnRlbnQgfSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBleHBvcnQoZm9ybWF0OiBzdHJpbmcsIGV4ZWN1dGVJZ1B1Ymxpc2hlcjogYm9vbGVhbiwgdXNlVGVybWlub2xvZ3lTZXJ2ZXI6IGJvb2xlYW4sIHVzZUxhdGVzdDogYm9vbGVhbiwgZG93bmxvYWRPdXRwdXQ6IGJvb2xlYW4sIGluY2x1ZGVJZ1B1Ymxpc2hlckphcjogYm9vbGVhbiwgdGVzdENhbGxiYWNrPzogKG1lc3NhZ2UsIGVycj8pID0+IHZvaWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJ1bmRsZUV4cG9ydGVyID0gbmV3IEJ1bmRsZUV4cG9ydGVyKHRoaXMuZmhpclNlcnZlckJhc2UsIHRoaXMuZmhpclNlcnZlcklkLCB0aGlzLmZoaXJWZXJzaW9uLCB0aGlzLmZoaXIsIHRoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkKTtcbiAgICAgICAgICAgIGNvbnN0IGlzWG1sID0gZm9ybWF0ID09PSAneG1sJyB8fCBmb3JtYXQgPT09ICdhcHBsaWNhdGlvbi94bWwnIHx8IGZvcm1hdCA9PT0gJ2FwcGxpY2F0aW9uL2ZoaXIreG1sJztcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9ICghaXNYbWwgPyAnLmpzb24nIDogJy54bWwnKTtcbiAgICAgICAgICAgIGNvbnN0IGhvbWVkaXIgPSByZXF1aXJlKCdvcycpLmhvbWVkaXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGZoaXJTZXJ2ZXJDb25maWcgPSBfLmZpbmQoZmhpckNvbmZpZy5zZXJ2ZXJzLCAoc2VydmVyOiBGaGlyQ29uZmlnU2VydmVyKSA9PiBzZXJ2ZXIuaWQgPT09IHRoaXMuZmhpclNlcnZlcklkKTtcbiAgICAgICAgICAgIGxldCBjb250cm9sO1xuICAgICAgICAgICAgbGV0IGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZTtcblxuICAgICAgICAgICAgdG1wLmRpcigodG1wRGlyRXJyLCByb290UGF0aCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0bXBEaXJFcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IodG1wRGlyRXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgY3JlYXRpbmcgYSB0ZW1wb3JhcnkgZGlyZWN0b3J5OiAnICsgdG1wRGlyRXJyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ2lnLmpzb24nKTtcbiAgICAgICAgICAgICAgICBsZXQgYnVuZGxlOiBCdW5kbGU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBhY2thZ2VJZCA9IHJvb3RQYXRoLnN1YnN0cmluZyhyb290UGF0aC5sYXN0SW5kZXhPZihwYXRoLnNlcCkgKyAxKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucGFja2FnZUlkKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdDcmVhdGVkIHRlbXAgZGlyZWN0b3J5LiBSZXRyaWV2aW5nIHJlc291cmNlcyBmb3IgaW1wbGVtZW50YXRpb24gZ3VpZGUuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUHJlcGFyZSBJRyBQdWJsaXNoZXIgcGFja2FnZVxuICAgICAgICAgICAgICAgICAgICBidW5kbGVFeHBvcnRlci5nZXRCdW5kbGUoZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0czogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlID0gPEJ1bmRsZT4gcmVzdWx0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZXNEaXIgPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcmVzb3VyY2VzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdSZXNvdXJjZXMgcmV0cmlldmVkLiBQYWNrYWdpbmcuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1bmRsZS5lbnRyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZSA9IGJ1bmRsZS5lbnRyeVtpXS5yZXNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXh0ZW5zaW9ubGVzc1Jlc291cmNlID0gQnVuZGxlRXhwb3J0ZXIuY2xlYW51cFJlc291cmNlKHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VUeXBlID0gcmVzb3VyY2UucmVzb3VyY2VUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHJlc291cmNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZURpciA9IHBhdGguam9pbihyZXNvdXJjZXNEaXIsIHJlc291cmNlVHlwZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc291cmNlUGF0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb3VyY2VDb250ZW50ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScgJiYgaWQgPT09IHRoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UgPSByZXNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEltcGxlbWVudGF0aW9uR3VpZGUgbXVzdCBiZSBnZW5lcmF0ZWQgYXMgYW4geG1sIGZpbGUgZm9yIHRoZSBJRyBQdWJsaXNoZXIgaW4gU1RVMy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1htbCAmJiByZXNvdXJjZVR5cGUgIT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoZXh0ZW5zaW9ubGVzc1Jlc291cmNlLCBudWxsLCAnXFx0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZVBhdGggPSBwYXRoLmpvaW4ocmVzb3VyY2VEaXIsIGlkICsgJy5qc29uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZUNvbnRlbnQgPSB0aGlzLmZoaXIub2JqVG9YbWwoZXh0ZW5zaW9ubGVzc1Jlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlQ29udGVudCA9IHZrYmVhdXRpZnkueG1sKHJlc291cmNlQ29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZVBhdGggPSBwYXRoLmpvaW4ocmVzb3VyY2VEaXIsIGlkICsgJy54bWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMocmVzb3VyY2VEaXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHJlc291cmNlUGF0aCwgcmVzb3VyY2VDb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBpbXBsZW1lbnRhdGlvbiBndWlkZSB3YXMgbm90IGZvdW5kIGluIHRoZSBidW5kbGUgcmV0dXJuZWQgYnkgdGhlIHNlcnZlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gPT09ICdzdHUzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sID0gdGhpcy5nZXRTdHUzQ29udHJvbChpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UsIDxTVFUzQnVuZGxlPjxhbnk+IGJ1bmRsZSwgdGhpcy5nZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2wgPSB0aGlzLmdldFI0Q29udHJvbChpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UsIDxSNEJ1bmRsZT48YW55PiBidW5kbGUsIHRoaXMuZ2V0RmhpckNvbnRyb2xWZXJzaW9uKGZoaXJTZXJ2ZXJDb25maWcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXREZXBlbmRlbmNpZXMoY29udHJvbCwgaXNYbWwsIHJlc291cmNlc0RpciwgdGhpcy5maGlyLCBmaGlyU2VydmVyQ29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29weSB0aGUgY29udGVudHMgb2YgdGhlIGlnLXB1Ymxpc2hlci10ZW1wbGF0ZSBmb2xkZXIgdG8gdGhlIGV4cG9ydCB0ZW1wb3JhcnkgZm9sZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcGxhdGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uLycsICdpZy1wdWJsaXNoZXItdGVtcGxhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5jb3B5U3luYyh0ZW1wbGF0ZVBhdGgsIHJvb3RQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdyaXRlIHRoZSBpZy5qc29uIGZpbGUgdG8gdGhlIGV4cG9ydCB0ZW1wb3JhcnkgZm9sZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udHJvbENvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShjb250cm9sLCBudWxsLCAnXFx0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhjb250cm9sUGF0aCwgY29udHJvbENvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV3JpdGUgdGhlIGludHJvLCBzdW1tYXJ5IGFuZCBzZWFyY2ggTUQgZmlsZXMgZm9yIGVhY2ggcmVzb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goYnVuZGxlLmVudHJ5LCAoZW50cnkpID0+IHRoaXMud3JpdGVGaWxlc0ZvclJlc291cmNlcyhyb290UGF0aCwgZW50cnkucmVzb3VyY2UpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGVtcGxhdGVzKHJvb3RQYXRoLCBidW5kbGUsIGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmhpclNlcnZlckNvbmZpZy52ZXJzaW9uID09PSAnc3R1MycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53cml0ZVN0dTNQYWdlcyhyb290UGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlUjRQYWdlcyhyb290UGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdEb25lIGJ1aWxkaW5nIHBhY2thZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldElnUHVibGlzaGVyKHVzZUxhdGVzdCwgZXhlY3V0ZUlnUHVibGlzaGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoaWdQdWJsaXNoZXJMb2NhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlSWdQdWJsaXNoZXJKYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnQ29weWluZyBJRyBQdWJsaXNoZXIgSkFSIHRvIHdvcmtpbmcgZGlyZWN0b3J5LicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqYXJGaWxlTmFtZSA9IGlnUHVibGlzaGVyTG9jYXRpb24uc3Vic3RyaW5nKGlnUHVibGlzaGVyTG9jYXRpb24ubGFzdEluZGV4T2YocGF0aC5zZXApICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3RKYXJQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBqYXJGaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmNvcHlTeW5jKGlnUHVibGlzaGVyTG9jYXRpb24sIGRlc3RKYXJQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWV4ZWN1dGVJZ1B1Ymxpc2hlciB8fCAhaWdQdWJsaXNoZXJMb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdjb21wbGV0ZScsICdEb25lLiBZb3Ugd2lsbCBiZSBwcm9tcHRlZCB0byBkb3dubG9hZCB0aGUgcGFja2FnZSBpbiBhIG1vbWVudC4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0Q2FsbGJhY2socm9vdFBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlcGxveURpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi93d3dyb290L2lncycsIHRoaXMuZmhpclNlcnZlcklkLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMoZGVwbG95RGlyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlnUHVibGlzaGVyVmVyc2lvbiA9IHVzZUxhdGVzdCA/ICdsYXRlc3QnIDogJ2RlZmF1bHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2Nlc3MgPSBzZXJ2ZXJDb25maWcuamF2YUxvY2F0aW9uIHx8ICdqYXZhJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqYXJQYXJhbXMgPSBbJy1qYXInLCBpZ1B1Ymxpc2hlckxvY2F0aW9uLCAnLWlnJywgY29udHJvbFBhdGhdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VUZXJtaW5vbG9neVNlcnZlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqYXJQYXJhbXMucHVzaCgnLXR4JywgJ04vQScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgYFJ1bm5pbmcgJHtpZ1B1Ymxpc2hlclZlcnNpb259IElHIFB1Ymxpc2hlcjogJHtqYXJQYXJhbXMuam9pbignICcpfWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYFNwYXduaW5nIEZISVIgSUcgUHVibGlzaGVyIEphdmEgcHJvY2VzcyBhdCAke3Byb2Nlc3N9IHdpdGggcGFyYW1zICR7amFyUGFyYW1zfWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWdQdWJsaXNoZXJQcm9jZXNzID0gc3Bhd24ocHJvY2VzcywgamFyUGFyYW1zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUHVibGlzaGVyUHJvY2Vzcy5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UodG1wLnRtcGRpciwgJ1hYWCcpLnJlcGxhY2UoaG9tZWRpciwgJ1hYWCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudHJpbSgpLnJlcGxhY2UoL1xcLi9nLCAnJykgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Muc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKHRtcC50bXBkaXIsICdYWFgnKS5yZXBsYWNlKGhvbWVkaXIsICdYWFgnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnRyaW0oKS5yZXBsYWNlKC9cXC4vZywgJycpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQdWJsaXNoZXJQcm9jZXNzLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdFcnJvciBleGVjdXRpbmcgRkhJUiBJRyBQdWJsaXNoZXI6ICcgKyBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdlcnJvcicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQdWJsaXNoZXJQcm9jZXNzLm9uKCdleGl0JywgKGNvZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYElHIFB1Ymxpc2hlciBpcyBkb25lIGV4ZWN1dGluZyBmb3IgJHtyb290UGF0aH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdJRyBQdWJsaXNoZXIgZmluaXNoZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29kZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnV29uXFwndCBjb3B5IG91dHB1dCB0byBkZXBsb3ltZW50IHBhdGguJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdjb21wbGV0ZScsICdEb25lLiBZb3Ugd2lsbCBiZSBwcm9tcHRlZCB0byBkb3dubG9hZCB0aGUgcGFja2FnZSBpbiBhIG1vbWVudC4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0NvcHlpbmcgb3V0cHV0IHRvIGRlcGxveW1lbnQgcGF0aC4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVkUGF0aCA9IHBhdGgucmVzb2x2ZShyb290UGF0aCwgJ2dlbmVyYXRlZF9vdXRwdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dFBhdGggPSBwYXRoLnJlc29sdmUocm9vdFBhdGgsICdvdXRwdXQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYERlbGV0aW5nIGNvbnRlbnQgZ2VuZXJhdGVkIGJ5IGlnIHB1Ymxpc2hlciBpbiAke2dlbmVyYXRlZFBhdGh9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVtcHR5RGlyKGdlbmVyYXRlZFBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBDb3B5aW5nIG91dHB1dCBmcm9tICR7b3V0cHV0UGF0aH0gdG8gJHtkZXBsb3lEaXJ9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmNvcHkob3V0cHV0UGF0aCwgZGVwbG95RGlyLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdlcnJvcicsICdFcnJvciBjb3B5aW5nIGNvbnRlbnRzIHRvIGRlcGxveW1lbnQgcGF0aC4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaW5hbE1lc3NhZ2UgPSBgRG9uZSBleGVjdXRpbmcgdGhlIEZISVIgSUcgUHVibGlzaGVyLiBZb3UgbWF5IHZpZXcgdGhlIElHIDxhIGhyZWY9XCIvaW1wbGVtZW50YXRpb24tZ3VpZGUvJHt0aGlzLmltcGxlbWVudGF0aW9uR3VpZGVJZH0vdmlld1wiPmhlcmU8L2E+LmAgKyAoZG93bmxvYWRPdXRwdXQgPyAnIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvd25sb2FkIHRoZSBwYWNrYWdlIGluIGEgbW9tZW50LicgOiAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2NvbXBsZXRlJywgZmluYWxNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRvd25sb2FkT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBVc2VyIGluZGljYXRlZCB0aGV5IGRvbid0IG5lZWQgdG8gZG93bmxvYWQuIFJlbW92aW5nIHRlbXBvcmFyeSBkaXJlY3RvcnkgJHtyb290UGF0aH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5lbXB0eURpcihyb290UGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBEb25lIHJlbW92aW5nIHRlbXBvcmFyeSBkaXJlY3RvcnkgJHtyb290UGF0aH1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnZXJyb3InLCAnRXJyb3IgZHVyaW5nIGV4cG9ydDogJyArIGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RDYWxsYmFjayhyb290UGF0aCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=