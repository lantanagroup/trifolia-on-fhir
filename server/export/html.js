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
    getIgPublisher(useLatest) {
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
        const packageIdExtension = _.find(implementationGuide.extension, (extension) => extension.url === globals_1.Globals.extensionUrls['extension-ig-package-id']);
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
        if (implementationGuide.fhirVersion) {
            control.version = implementationGuide.fhirVersion;
        }
        else if (version) { // Use the version of the FHIR server the resources are coming from
            control.version = version;
        }
        if (implementationGuide.version) {
            control['fixed-business-version'] = implementationGuide.version;
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
        if (implementationGuide.fhirVersion && implementationGuide.fhirVersion.length > 0) {
            control.version = implementationGuide.fhirVersion[0];
        }
        else if (version) { // Use the version of the FHIR server the resources are coming from
            control.version = version;
        }
        if (implementationGuide.version) {
            control['fixed-business-version'] = implementationGuide.version;
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
                const contained = _.find(implementationGuide.contained, (next) => next.id === reference.substring(1));
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
                            const cleanResource = bundle_1.BundleExporter.cleanupResource(resource);
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
                                resourceContent = JSON.stringify(cleanResource, null, '\t');
                                resourcePath = path.join(resourceDir, id + '.json');
                            }
                            else {
                                resourceContent = this.fhir.objToXml(cleanResource);
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
                        return this.getIgPublisher(useLatest);
                    })
                        .then((igPublisherLocation) => {
                        if (includeIgPublisherJar && igPublisherLocation) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpREFBb0M7QUFlcEMsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixpQ0FBaUM7QUFDakMsMkJBQTJCO0FBQzNCLHlDQUF5QztBQVN6QyxxQ0FBd0M7QUFFeEMsbURBQThDO0FBRTlDLE1BQU0sVUFBVSxHQUFnQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELE1BQU0sWUFBWSxHQUFrQixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBUXpELE1BQWEsWUFBWTtJQVlyQixZQUFZLGNBQXNCLEVBQUUsWUFBb0IsRUFBRSxXQUFtQixFQUFFLElBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQWdCLEVBQUUscUJBQTZCO1FBWG5KLFFBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFZOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMscUJBQXFCLEdBQUcscUJBQXFCLENBQUM7SUFDdkQsQ0FBQztJQUVPLGNBQWMsQ0FBQyxJQUFzQjtRQUN6QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTztTQUNWO1FBRUQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDMUIsT0FBZ0IsSUFBSSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxPQUFPLEdBQUcs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Z0RBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7NkNBQ3ZCO2lEQUFNO2dEQUNILElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxRQUFRLEVBQUUsQ0FBQyxDQUFDOzZDQUNuRTt3Q0FDTCxDQUFDLENBQUMsQ0FBQztxQ0FDTjtnQ0FDTCxDQUFDLENBQUMsQ0FBQzs2QkFDTjt3QkFDTCxDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUM7eUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7d0JBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsdUJBQXVCLEdBQUcsR0FBRyxDQUFDLENBQUM7d0JBRS9ELElBQUksWUFBWSxFQUFFOzRCQUNkLFlBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQy9CO29CQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNYLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFoOEJELG9DQWc4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0ZoaXIgYXMgRmhpck1vZHVsZX0gZnJvbSAnZmhpci9maGlyJztcbmltcG9ydCB7U2VydmVyfSBmcm9tICdzb2NrZXQuaW8nO1xuaW1wb3J0IHtzcGF3bn0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQge1xuICAgIERvbWFpblJlc291cmNlLFxuICAgIEh1bWFuTmFtZSxcbiAgICBCdW5kbGUgYXMgU1RVM0J1bmRsZSxcbiAgICBCaW5hcnkgYXMgU1RVM0JpbmFyeSxcbiAgICBJbXBsZW1lbnRhdGlvbkd1aWRlIGFzIFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLFxuICAgIFBhZ2VDb21wb25lbnQsIEV4dGVuc2lvblxufSBmcm9tICcuLi8uLi9zcmMvYXBwL21vZGVscy9zdHUzL2ZoaXInO1xuaW1wb3J0IHtcbiAgICBCaW5hcnkgYXMgUjRCaW5hcnksXG4gICAgQnVuZGxlIGFzIFI0QnVuZGxlLFxuICAgIEltcGxlbWVudGF0aW9uR3VpZGUgYXMgUjRJbXBsZW1lbnRhdGlvbkd1aWRlLFxuICAgIEltcGxlbWVudGF0aW9uR3VpZGVQYWdlQ29tcG9uZW50XG59IGZyb20gJy4uLy4uL3NyYy9hcHAvbW9kZWxzL3I0L2ZoaXInO1xuaW1wb3J0ICogYXMgbG9nNGpzIGZyb20gJ2xvZzRqcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCAqIGFzIHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnY29uZmlnJztcbmltcG9ydCAqIGFzIHRtcCBmcm9tICd0bXAnO1xuaW1wb3J0ICogYXMgdmtiZWF1dGlmeSBmcm9tICd2a2JlYXV0aWZ5JztcbmltcG9ydCB7XG4gICAgRmhpcixcbiAgICBGaGlyQ29uZmlnLFxuICAgIEZoaXJDb25maWdTZXJ2ZXIsXG4gICAgRmhpckNvbnRyb2wsXG4gICAgRmhpckNvbnRyb2xEZXBlbmRlbmN5LFxuICAgIFNlcnZlckNvbmZpZ1xufSBmcm9tICcuLi9jb250cm9sbGVycy9tb2RlbHMnO1xuaW1wb3J0IHtCdW5kbGVFeHBvcnRlcn0gZnJvbSAnLi9idW5kbGUnO1xuaW1wb3J0IEJ1bmRsZSA9IEZoaXIuQnVuZGxlO1xuaW1wb3J0IHtHbG9iYWxzfSBmcm9tICcuLi8uLi9zcmMvYXBwL2dsb2JhbHMnO1xuXG5jb25zdCBmaGlyQ29uZmlnID0gPEZoaXJDb25maWc+IGNvbmZpZy5nZXQoJ2ZoaXInKTtcbmNvbnN0IHNlcnZlckNvbmZpZyA9IDxTZXJ2ZXJDb25maWc+IGNvbmZpZy5nZXQoJ3NlcnZlcicpO1xuXG5pbnRlcmZhY2UgVGFibGVPZkNvbnRlbnRzRW50cnkge1xuICAgIGxldmVsOiBudW1iZXI7XG4gICAgZmlsZU5hbWU6IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgSHRtbEV4cG9ydGVyIHtcbiAgICByZWFkb25seSBsb2cgPSBsb2c0anMuZ2V0TG9nZ2VyKCk7XG4gICAgcmVhZG9ubHkgZmhpclNlcnZlckJhc2U6IHN0cmluZztcbiAgICByZWFkb25seSBmaGlyU2VydmVySWQ6IHN0cmluZztcbiAgICByZWFkb25seSBmaGlyVmVyc2lvbjogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGZoaXI6IEZoaXJNb2R1bGU7XG4gICAgcmVhZG9ubHkgaW86IFNlcnZlcjtcbiAgICByZWFkb25seSBzb2NrZXRJZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGltcGxlbWVudGF0aW9uR3VpZGVJZDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBwYWNrYWdlSWQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGZoaXJTZXJ2ZXJCYXNlOiBzdHJpbmcsIGZoaXJTZXJ2ZXJJZDogc3RyaW5nLCBmaGlyVmVyc2lvbjogc3RyaW5nLCBmaGlyOiBGaGlyTW9kdWxlLCBpbzogU2VydmVyLCBzb2NrZXRJZDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmZoaXJTZXJ2ZXJCYXNlID0gZmhpclNlcnZlckJhc2U7XG4gICAgICAgIHRoaXMuZmhpclNlcnZlcklkID0gZmhpclNlcnZlcklkO1xuICAgICAgICB0aGlzLmZoaXJWZXJzaW9uID0gZmhpclZlcnNpb247XG4gICAgICAgIHRoaXMuZmhpciA9IGZoaXI7XG4gICAgICAgIHRoaXMuaW8gPSBpbztcbiAgICAgICAgdGhpcy5zb2NrZXRJZCA9IHNvY2tldElkO1xuICAgICAgICB0aGlzLmltcGxlbWVudGF0aW9uR3VpZGVJZCA9IGltcGxlbWVudGF0aW9uR3VpZGVJZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldERpc3BsYXlOYW1lKG5hbWU6IHN0cmluZ3xIdW1hbk5hbWUpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiA8c3RyaW5nPiBuYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRpc3BsYXkgPSBuYW1lLmZhbWlseTtcblxuICAgICAgICBpZiAobmFtZS5naXZlbikge1xuICAgICAgICAgICAgaWYgKGRpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5ICs9ICcsICc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGlzcGxheSArPSBuYW1lLmdpdmVuLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkaXNwbGF5O1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBjcmVhdGVUYWJsZUZyb21BcnJheShoZWFkZXJzLCBkYXRhKSB7XG4gICAgICAgIGxldCBvdXRwdXQgPSAnPHRhYmxlPlxcbjx0aGVhZD5cXG48dHI+XFxuJztcblxuICAgICAgICBfLmVhY2goaGVhZGVycywgKGhlYWRlcikgPT4ge1xuICAgICAgICAgICAgb3V0cHV0ICs9IGA8dGg+JHtoZWFkZXJ9PC90aD5cXG5gO1xuICAgICAgICB9KTtcblxuICAgICAgICBvdXRwdXQgKz0gJzwvdHI+XFxuPC90aGVhZD5cXG48dGJvZHk+XFxuJztcblxuICAgICAgICBfLmVhY2goZGF0YSwgKHJvdzogc3RyaW5nW10pID0+IHtcbiAgICAgICAgICAgIG91dHB1dCArPSAnPHRyPlxcbic7XG5cbiAgICAgICAgICAgIF8uZWFjaChyb3csIChjZWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGA8dGQ+JHtjZWxsfTwvdGQ+XFxuYDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBvdXRwdXQgKz0gJzwvdHI+XFxuJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb3V0cHV0ICs9ICc8L3Rib2R5PlxcbjwvdGFibGU+XFxuJztcblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2VuZFNvY2tldE1lc3NhZ2Uoc3RhdHVzLCBtZXNzYWdlKSB7XG4gICAgICAgIGlmICghdGhpcy5zb2NrZXRJZCkge1xuICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoJ1dvblxcJ3Qgc2VuZCBzb2NrZXQgbWVzc2FnZSBmb3IgZXhwb3J0IGJlY2F1c2UgdGhlIG9yaWdpbmFsIHJlcXVlc3QgZGlkIG5vdCBzcGVjaWZ5IGEgc29ja2V0SWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlvKSB7XG4gICAgICAgICAgICB0aGlzLmlvLnRvKHRoaXMuc29ja2V0SWQpLmVtaXQoJ2h0bWwtZXhwb3J0Jywge1xuICAgICAgICAgICAgICAgIHBhY2thZ2VJZDogdGhpcy5wYWNrYWdlSWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldElnUHVibGlzaGVyKHVzZUxhdGVzdDogYm9vbGVhbik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSAnb3JnLmhsNy5maGlyLmlncHVibGlzaGVyLmphcic7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9pZy1wdWJsaXNoZXInKTtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRGaWxlUGF0aCA9IHBhdGguam9pbihkZWZhdWx0UGF0aCwgZmlsZU5hbWUpO1xuXG4gICAgICAgICAgICBpZiAodXNlTGF0ZXN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoJ1JlcXVlc3QgdG8gZ2V0IGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyLiBSZXRyaWV2aW5nIGZyb206ICcgKyBmaGlyQ29uZmlnLmxhdGVzdFB1Ymxpc2hlcik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdEb3dubG9hZGluZyBsYXRlc3QgRkhJUiBJRyBwdWJsaXNoZXInKTtcblxuICAgICAgICAgICAgICAgIC8vIFRPRE86IENoZWNrIGh0dHA6Ly9idWlsZC5maGlyLm9yZy92ZXJzaW9uLmluZm8gZmlyc3RcblxuICAgICAgICAgICAgICAgIHJwKGZoaXJDb25maWcubGF0ZXN0UHVibGlzaGVyLCB7IGVuY29kaW5nOiBudWxsIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZygnU3VjY2Vzc2Z1bGx5IGRvd25sb2FkZWQgbGF0ZXN0IHZlcnNpb24gb2YgRkhJUiBJRyBQdWJsaXNoZXIuIEVuc3VyaW5nIGxhdGVzdCBkaXJlY3RvcnkgZXhpc3RzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhdGVzdFBhdGggPSBwYXRoLmpvaW4oZGVmYXVsdFBhdGgsICdsYXRlc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMobGF0ZXN0UGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZiA9IEJ1ZmZlci5mcm9tKHJlc3VsdHMsICd1dGY4Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3RGaWxlUGF0aCA9IHBhdGguam9pbihsYXRlc3RQYXRoLCBmaWxlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdTYXZpbmcgRkhJUiBJRyBwdWJsaXNoZXIgdG8gJyArIGxhdGVzdEZpbGVQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhsYXRlc3RGaWxlUGF0aCwgYnVmZik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobGF0ZXN0RmlsZVBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoYEVycm9yIGdldHRpbmcgbGF0ZXN0IHZlcnNpb24gb2YgRkhJUiBJRyBwdWJsaXNoZXI6ICR7ZXJyfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnRW5jb3VudGVyZWQgZXJyb3IgZG93bmxvYWRpbmcgbGF0ZXN0IElHIHB1Ymxpc2hlciwgd2lsbCB1c2UgcHJlLWxvYWRlZC9kZWZhdWx0IElHIHB1Ymxpc2hlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkZWZhdWx0RmlsZVBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoJ1VzaW5nIGJ1aWx0LWluIHZlcnNpb24gb2YgRkhJUiBJRyBwdWJsaXNoZXIgZm9yIGV4cG9ydCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ1VzaW5nIGV4aXN0aW5nL2RlZmF1bHQgdmVyc2lvbiBvZiBGSElSIElHIHB1Ymxpc2hlcicpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGVmYXVsdEZpbGVQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0Rpcjogc3RyaW5nLCBleHRlbnNpb25GaWxlTmFtZTogc3RyaW5nLCBpc1htbDogYm9vbGVhbiwgZmhpcjogRmhpck1vZHVsZSkge1xuICAgICAgICBjb25zdCBzb3VyY2VFeHRlbnNpb25zRGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL3NyYy9hc3NldHMvc3R1My9leHRlbnNpb25zJyk7XG4gICAgICAgIGNvbnN0IHNvdXJjZUV4dGVuc2lvbkZpbGVOYW1lID0gcGF0aC5qb2luKHNvdXJjZUV4dGVuc2lvbnNEaXIsIGV4dGVuc2lvbkZpbGVOYW1lKTtcbiAgICAgICAgbGV0IGRlc3RFeHRlbnNpb25GaWxlTmFtZSA9IHBhdGguam9pbihkZXN0RXh0ZW5zaW9uc0RpciwgZXh0ZW5zaW9uRmlsZU5hbWUpO1xuXG4gICAgICAgIGlmICghaXNYbWwpIHtcbiAgICAgICAgICAgIGZzLmNvcHlTeW5jKHNvdXJjZUV4dGVuc2lvbkZpbGVOYW1lLCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZXh0ZW5zaW9uSnNvbiA9IGZzLnJlYWRGaWxlU3luYyhzb3VyY2VFeHRlbnNpb25GaWxlTmFtZSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvblhtbCA9IGZoaXIuanNvblRvWG1sKGV4dGVuc2lvbkpzb24pO1xuXG4gICAgICAgICAgICBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUgPSBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUuc3Vic3RyaW5nKDAsIGRlc3RFeHRlbnNpb25GaWxlTmFtZS5pbmRleE9mKCcuanNvbicpKSArICcueG1sJztcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGVzdEV4dGVuc2lvbkZpbGVOYW1lLCBleHRlbnNpb25YbWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0RGVwZW5kZW5jaWVzKGNvbnRyb2wsIGlzWG1sOiBib29sZWFuLCByZXNvdXJjZXNEaXI6IHN0cmluZywgZmhpcjogRmhpck1vZHVsZSwgZmhpclNlcnZlckNvbmZpZzogRmhpckNvbmZpZ1NlcnZlcik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGlzU3R1MyA9IGZoaXJTZXJ2ZXJDb25maWcgJiYgZmhpclNlcnZlckNvbmZpZy52ZXJzaW9uID09PSAnc3R1Myc7XG5cbiAgICAgICAgLy8gTG9hZCB0aGUgaWcgZGVwZW5kZW5jeSBleHRlbnNpb25zIGludG8gdGhlIHJlc291cmNlcyBkaXJlY3RvcnlcbiAgICAgICAgaWYgKGlzU3R1MyAmJiBjb250cm9sLmRlcGVuZGVuY3lMaXN0ICYmIGNvbnRyb2wuZGVwZW5kZW5jeUxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZGVzdEV4dGVuc2lvbnNEaXIgPSBwYXRoLmpvaW4ocmVzb3VyY2VzRGlyLCAnc3RydWN0dXJlZGVmaW5pdGlvbicpO1xuXG4gICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKGRlc3RFeHRlbnNpb25zRGlyKTtcblxuICAgICAgICAgICAgdGhpcy5jb3B5RXh0ZW5zaW9uKGRlc3RFeHRlbnNpb25zRGlyLCAnZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3kuanNvbicsIGlzWG1sLCBmaGlyKTtcbiAgICAgICAgICAgIHRoaXMuY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0RpciwgJ2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LXZlcnNpb24uanNvbicsIGlzWG1sLCBmaGlyKTtcbiAgICAgICAgICAgIHRoaXMuY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0RpciwgJ2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LWxvY2F0aW9uLmpzb24nLCBpc1htbCwgZmhpcik7XG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS1uYW1lLmpzb24nLCBpc1htbCwgZmhpcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTsgICAgICAgICAgIC8vIFRoaXMgaXNuJ3QgYWN0dWFsbHkgbmVlZGVkLCBzaW5jZSB0aGUgSUcgUHVibGlzaGVyIGF0dGVtcHRzIHRvIHJlc29sdmUgdGhlc2UgZGVwZW5kZW5jeSBhdXRvbWF0aWNhbGx5XG5cbiAgICAgICAgLypcbiAgICAgICAgLy8gQXR0ZW1wdCB0byByZXNvbHZlIHRoZSBkZXBlbmRlbmN5J3MgZGVmaW5pdGlvbnMgYW5kIGluY2x1ZGUgaXQgaW4gdGhlIHBhY2thZ2VcbiAgICAgICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gXy5tYXAoY29udHJvbC5kZXBlbmRlbmN5TGlzdCwgKGRlcGVuZGVuY3kpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lVcmwgPVxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kubG9jYXRpb24gK1xuICAgICAgICAgICAgICAgIChkZXBlbmRlbmN5LmxvY2F0aW9uLmVuZHNXaXRoKCcvJykgPyAnJyA6ICcvJykgKyAnZGVmaW5pdGlvbnMuJyArXG4gICAgICAgICAgICAgICAgKGlzWG1sID8gJ3htbCcgOiAnanNvbicpICtcbiAgICAgICAgICAgICAgICAnLnppcCc7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RGVwZW5kZW5jeShkZXBlbmRlbmN5VXJsLCBkZXBlbmRlbmN5Lm5hbWUpO1xuICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgUS5hbGwocHJvbWlzZXMpXG4gICAgICAgICAgICAudGhlbihkZWZlcnJlZC5yZXNvbHZlKVxuICAgICAgICAgICAgLmNhdGNoKGRlZmVycmVkLnJlamVjdCk7XG4gICAgXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAqL1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldEZoaXJDb250cm9sVmVyc2lvbihmaGlyU2VydmVyQ29uZmlnKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZ1ZlcnNpb24gPSBmaGlyU2VydmVyQ29uZmlnID8gZmhpclNlcnZlckNvbmZpZy52ZXJzaW9uIDogbnVsbDtcblxuICAgICAgICAvLyBUT0RPOiBBZGQgbW9yZSBsb2dpY1xuICAgICAgICBzd2l0Y2ggKGNvbmZpZ1ZlcnNpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ3N0dTMnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnMy4wLjEnO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJzQuMC4wJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHVwZGF0ZVRlbXBsYXRlcyhyb290UGF0aCwgYnVuZGxlLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSkge1xuICAgICAgICBjb25zdCBtYWluUmVzb3VyY2VUeXBlcyA9IFsnSW1wbGVtZW50YXRpb25HdWlkZScsICdWYWx1ZVNldCcsICdDb2RlU3lzdGVtJywgJ1N0cnVjdHVyZURlZmluaXRpb24nLCAnQ2FwYWJpbGl0eVN0YXRlbWVudCddO1xuICAgICAgICBjb25zdCBkaXN0aW5jdFJlc291cmNlcyA9IF8uY2hhaW4oYnVuZGxlLmVudHJ5KVxuICAgICAgICAgICAgLm1hcCgoZW50cnkpID0+IGVudHJ5LnJlc291cmNlKVxuICAgICAgICAgICAgLnVuaXEoKHJlc291cmNlKSA9PiByZXNvdXJjZS5pZClcbiAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICBjb25zdCB2YWx1ZVNldHMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdWYWx1ZVNldCcpO1xuICAgICAgICBjb25zdCBjb2RlU3lzdGVtcyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0NvZGVTeXN0ZW0nKTtcbiAgICAgICAgY29uc3QgcHJvZmlsZXMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdTdHJ1Y3R1cmVEZWZpbml0aW9uJyAmJiAoIXJlc291cmNlLmJhc2VEZWZpbml0aW9uIHx8ICFyZXNvdXJjZS5iYXNlRGVmaW5pdGlvbi5lbmRzV2l0aCgnRXh0ZW5zaW9uJykpKTtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9ucyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ1N0cnVjdHVyZURlZmluaXRpb24nICYmIHJlc291cmNlLmJhc2VEZWZpbml0aW9uICYmIHJlc291cmNlLmJhc2VEZWZpbml0aW9uLmVuZHNXaXRoKCdFeHRlbnNpb24nKSk7XG4gICAgICAgIGNvbnN0IGNhcGFiaWxpdHlTdGF0ZW1lbnRzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnQ2FwYWJpbGl0eVN0YXRlbWVudCcpO1xuICAgICAgICBjb25zdCBvdGhlclJlc291cmNlcyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IG1haW5SZXNvdXJjZVR5cGVzLmluZGV4T2YocmVzb3VyY2UucmVzb3VyY2VUeXBlKSA8IDApO1xuXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvaW5kZXgubWQnKTtcblxuICAgICAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbkNvbnRlbnQgPSAnIyMjIERlc2NyaXB0aW9uXFxuXFxuJyArIGltcGxlbWVudGF0aW9uR3VpZGUuZGVzY3JpcHRpb24gKyAnXFxuXFxuJztcbiAgICAgICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhpbmRleFBhdGgsIGRlc2NyaXB0aW9uQ29udGVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhY3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdXRob3JzRGF0YSA9IF8ubWFwKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFjdCwgKGNvbnRhY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRFbWFpbCA9IF8uZmluZChjb250YWN0LnRlbGVjb20sICh0ZWxlY29tKSA9PiB0ZWxlY29tLnN5c3RlbSA9PT0gJ2VtYWlsJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbY29udGFjdC5uYW1lLCBmb3VuZEVtYWlsID8gYDxhIGhyZWY9XCJtYWlsdG86JHtmb3VuZEVtYWlsLnZhbHVlfVwiPiR7Zm91bmRFbWFpbC52YWx1ZX08L2E+YCA6ICcnXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBhdXRob3JzQ29udGVudCA9ICcjIyMgQXV0aG9yc1xcblxcbicgKyB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnTmFtZScsICdFbWFpbCddLCBhdXRob3JzRGF0YSkgKyAnXFxuXFxuJztcbiAgICAgICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhpbmRleFBhdGgsIGF1dGhvcnNDb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9maWxlc0RhdGEgPSBfLmNoYWluKHByb2ZpbGVzKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKHByb2ZpbGUpID0+IHByb2ZpbGUubmFtZSlcbiAgICAgICAgICAgICAgICAubWFwKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbYDxhIGhyZWY9XCJTdHJ1Y3R1cmVEZWZpbml0aW9uLSR7cHJvZmlsZS5pZH0uaHRtbFwiPiR7cHJvZmlsZS5uYW1lfTwvYT5gLCBwcm9maWxlLmRlc2NyaXB0aW9uIHx8ICcnXTtcbiAgICAgICAgICAgICAgICB9KS52YWx1ZSgpO1xuICAgICAgICAgICAgY29uc3QgcHJvZmlsZXNUYWJsZSA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0Rlc2NyaXB0aW9uJ10sIHByb2ZpbGVzRGF0YSk7XG4gICAgICAgICAgICBjb25zdCBwcm9maWxlc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvcHJvZmlsZXMubWQnKTtcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKHByb2ZpbGVzUGF0aCwgJyMjIyBQcm9maWxlc1xcblxcbicgKyBwcm9maWxlc1RhYmxlICsgJ1xcblxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV4dGVuc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZXh0RGF0YSA9IF8uY2hhaW4oZXh0ZW5zaW9ucylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChleHRlbnNpb24pID0+IGV4dGVuc2lvbi5uYW1lKVxuICAgICAgICAgICAgICAgIC5tYXAoKGV4dGVuc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2A8YSBocmVmPVwiU3RydWN0dXJlRGVmaW5pdGlvbi0ke2V4dGVuc2lvbi5pZH0uaHRtbFwiPiR7ZXh0ZW5zaW9uLm5hbWV9PC9hPmAsIGV4dGVuc2lvbi5kZXNjcmlwdGlvbiB8fCAnJ107XG4gICAgICAgICAgICAgICAgfSkudmFsdWUoKTtcbiAgICAgICAgICAgIGNvbnN0IGV4dENvbnRlbnQgPSB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnTmFtZScsICdEZXNjcmlwdGlvbiddLCBleHREYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGV4dFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvcHJvZmlsZXMubWQnKTtcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGV4dFBhdGgsICcjIyMgRXh0ZW5zaW9uc1xcblxcbicgKyBleHRDb250ZW50ICsgJ1xcblxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlU2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgdnNDb250ZW50ID0gJyMjIyBWYWx1ZSBTZXRzXFxuXFxuJztcbiAgICAgICAgICAgIGNvbnN0IHZzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy90ZXJtaW5vbG9neS5tZCcpO1xuXG4gICAgICAgICAgICBfLmNoYWluKHZhbHVlU2V0cylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KCh2YWx1ZVNldCkgPT4gdmFsdWVTZXQudGl0bGUgfHwgdmFsdWVTZXQubmFtZSlcbiAgICAgICAgICAgICAgICAuZWFjaCgodmFsdWVTZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdnNDb250ZW50ICs9IGAtIFske3ZhbHVlU2V0LnRpdGxlIHx8IHZhbHVlU2V0Lm5hbWV9XShWYWx1ZVNldC0ke3ZhbHVlU2V0LmlkfS5odG1sKVxcbmA7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKHZzUGF0aCwgdnNDb250ZW50ICsgJ1xcblxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvZGVTeXN0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBjc0NvbnRlbnQgPSAnIyMjIENvZGUgU3lzdGVtc1xcblxcbic7XG4gICAgICAgICAgICBjb25zdCBjc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdGVybWlub2xvZ3kubWQnKTtcblxuICAgICAgICAgICAgXy5jaGFpbihjb2RlU3lzdGVtcylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChjb2RlU3lzdGVtKSA9PiBjb2RlU3lzdGVtLnRpdGxlIHx8IGNvZGVTeXN0ZW0ubmFtZSlcbiAgICAgICAgICAgICAgICAuZWFjaCgoY29kZVN5c3RlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjc0NvbnRlbnQgKz0gYC0gWyR7Y29kZVN5c3RlbS50aXRsZSB8fCBjb2RlU3lzdGVtLm5hbWV9XShWYWx1ZVNldC0ke2NvZGVTeXN0ZW0uaWR9Lmh0bWwpXFxuYDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoY3NQYXRoLCBjc0NvbnRlbnQgKyAnXFxuXFxuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2FwYWJpbGl0eVN0YXRlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgY3NEYXRhID0gXy5jaGFpbihjYXBhYmlsaXR5U3RhdGVtZW50cylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChjYXBhYmlsaXR5U3RhdGVtZW50KSA9PiBjYXBhYmlsaXR5U3RhdGVtZW50Lm5hbWUpXG4gICAgICAgICAgICAgICAgLm1hcCgoY2FwYWJpbGl0eVN0YXRlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2A8YSBocmVmPVwiQ2FwYWJpbGl0eVN0YXRlbWVudC0ke2NhcGFiaWxpdHlTdGF0ZW1lbnQuaWR9Lmh0bWxcIj4ke2NhcGFiaWxpdHlTdGF0ZW1lbnQubmFtZX08L2E+YCwgY2FwYWJpbGl0eVN0YXRlbWVudC5kZXNjcmlwdGlvbiB8fCAnJ107XG4gICAgICAgICAgICAgICAgfSkudmFsdWUoKTtcbiAgICAgICAgICAgIGNvbnN0IGNzQ29udGVudCA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0Rlc2NyaXB0aW9uJ10sIGNzRGF0YSk7XG4gICAgICAgICAgICBjb25zdCBjc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvY2Fwc3RhdGVtZW50cy5tZCcpO1xuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoY3NQYXRoLCAnIyMjIENhcGFiaWxpdHlTdGF0ZW1lbnRzXFxuXFxuJyArIGNzQ29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3RoZXJSZXNvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgb0RhdGEgPSBfLmNoYWluKG90aGVyUmVzb3VyY2VzKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKHJlc291cmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXNwbGF5ID0gcmVzb3VyY2UudGl0bGUgfHwgdGhpcy5nZXREaXNwbGF5TmFtZShyZXNvdXJjZS5uYW1lKSB8fCByZXNvdXJjZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnJlc291cmNlVHlwZSArIGRpc3BsYXk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubWFwKChyZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHJlc291cmNlLnRpdGxlIHx8IHRoaXMuZ2V0RGlzcGxheU5hbWUocmVzb3VyY2UubmFtZSkgfHwgcmVzb3VyY2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbcmVzb3VyY2UucmVzb3VyY2VUeXBlLCBgPGEgaHJlZj1cIiR7cmVzb3VyY2UucmVzb3VyY2VUeXBlfS0ke3Jlc291cmNlLmlkfS5odG1sXCI+JHtuYW1lfTwvYT5gXTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICAgICAgY29uc3Qgb0NvbnRlbnQgPSB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnVHlwZScsICdOYW1lJ10sIG9EYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGNzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9vdGhlci5tZCcpO1xuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoY3NQYXRoLCAnIyMjIE90aGVyIFJlc291cmNlc1xcblxcbicgKyBvQ29udGVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZUZpbGVzRm9yUmVzb3VyY2VzKHJvb3RQYXRoOiBzdHJpbmcsIHJlc291cmNlOiBEb21haW5SZXNvdXJjZSkge1xuICAgICAgICBpZiAoIXJlc291cmNlIHx8ICFyZXNvdXJjZS5yZXNvdXJjZVR5cGUgfHwgcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGludHJvUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgYHNvdXJjZS9wYWdlcy9faW5jbHVkZXMvJHtyZXNvdXJjZS5pZH0taW50cm8ubWRgKTtcbiAgICAgICAgY29uc3Qgc2VhcmNoUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgYHNvdXJjZS9wYWdlcy9faW5jbHVkZXMvJHtyZXNvdXJjZS5pZH0tc2VhcmNoLm1kYCk7XG4gICAgICAgIGNvbnN0IHN1bW1hcnlQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBgc291cmNlL3BhZ2VzL19pbmNsdWRlcy8ke3Jlc291cmNlLmlkfS1zdW1tYXJ5Lm1kYCk7XG5cbiAgICAgICAgbGV0IGludHJvID0gJy0tLVxcbicgK1xuICAgICAgICAgICAgYHRpdGxlOiAke3Jlc291cmNlLnJlc291cmNlVHlwZX0tJHtyZXNvdXJjZS5pZH0taW50cm9cXG5gICtcbiAgICAgICAgICAgICdsYXlvdXQ6IGRlZmF1bHRcXG4nICtcbiAgICAgICAgICAgIGBhY3RpdmU6ICR7cmVzb3VyY2UucmVzb3VyY2VUeXBlfS0ke3Jlc291cmNlLmlkfS1pbnRyb1xcbmAgK1xuICAgICAgICAgICAgJy0tLVxcblxcbic7XG5cbiAgICAgICAgaWYgKCg8YW55PnJlc291cmNlKS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaW50cm8gKz0gKDxhbnk+cmVzb3VyY2UpLmRlc2NyaXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhpbnRyb1BhdGgsIGludHJvKTtcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhzZWFyY2hQYXRoLCAnVE9ETyAtIFNlYXJjaCcpO1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHN1bW1hcnlQYXRoLCAnVE9ETyAtIFN1bW1hcnknKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRTdHUzQ29udHJvbChpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSwgYnVuZGxlOiBTVFUzQnVuZGxlLCB2ZXJzaW9uKSB7XG4gICAgICAgIGNvbnN0IGNhbm9uaWNhbEJhc2VSZWdleCA9IC9eKC4rPylcXC9JbXBsZW1lbnRhdGlvbkd1aWRlXFwvLiskL2dtO1xuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlTWF0Y2ggPSBjYW5vbmljYWxCYXNlUmVnZXguZXhlYyhpbXBsZW1lbnRhdGlvbkd1aWRlLnVybCk7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VJZEV4dGVuc2lvbiA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gR2xvYmFscy5leHRlbnNpb25VcmxzWydleHRlbnNpb24taWctcGFja2FnZS1pZCddKTtcbiAgICAgICAgbGV0IGNhbm9uaWNhbEJhc2U7XG5cbiAgICAgICAgaWYgKCFjYW5vbmljYWxCYXNlTWF0Y2ggfHwgY2Fub25pY2FsQmFzZU1hdGNoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5zdWJzdHJpbmcoMCwgaW1wbGVtZW50YXRpb25HdWlkZS51cmwubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlID0gY2Fub25pY2FsQmFzZU1hdGNoWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogRXh0cmFjdCBucG0tbmFtZSBmcm9tIElHIGV4dGVuc2lvbi5cbiAgICAgICAgLy8gY3VycmVudGx5LCBJRyByZXNvdXJjZSBoYXMgdG8gYmUgaW4gWE1MIGZvcm1hdCBmb3IgdGhlIElHIFB1Ymxpc2hlclxuICAgICAgICBjb25zdCBjb250cm9sID0gPEZoaXJDb250cm9sPiB7XG4gICAgICAgICAgICB0b29sOiAnamVreWxsJyxcbiAgICAgICAgICAgIHNvdXJjZTogJ2ltcGxlbWVudGF0aW9uZ3VpZGUvJyArIGltcGxlbWVudGF0aW9uR3VpZGUuaWQgKyAnLnhtbCcsXG4gICAgICAgICAgICAnbnBtLW5hbWUnOiBwYWNrYWdlSWRFeHRlbnNpb24gJiYgcGFja2FnZUlkRXh0ZW5zaW9uLnZhbHVlU3RyaW5nID8gcGFja2FnZUlkRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogaW1wbGVtZW50YXRpb25HdWlkZS5pZCArICctbnBtJyxcbiAgICAgICAgICAgIGxpY2Vuc2U6ICdDQzAtMS4wJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSNDogSW1wbGVtZW50YXRpb25HdWlkZS5saWNlbnNlXG4gICAgICAgICAgICBwYXRoczoge1xuICAgICAgICAgICAgICAgIHFhOiAnZ2VuZXJhdGVkX291dHB1dC9xYScsXG4gICAgICAgICAgICAgICAgdGVtcDogJ2dlbmVyYXRlZF9vdXRwdXQvdGVtcCcsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiAnb3V0cHV0JyxcbiAgICAgICAgICAgICAgICB0eENhY2hlOiAnZ2VuZXJhdGVkX291dHB1dC90eENhY2hlJyxcbiAgICAgICAgICAgICAgICBzcGVjaWZpY2F0aW9uOiAnaHR0cDovL2hsNy5vcmcvZmhpci9TVFUzJyxcbiAgICAgICAgICAgICAgICBwYWdlczogW1xuICAgICAgICAgICAgICAgICAgICAnZnJhbWV3b3JrJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NvdXJjZS9wYWdlcydcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczogWyAnc291cmNlL3Jlc291cmNlcycgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhZ2VzOiBbJ3BhZ2VzJ10sXG4gICAgICAgICAgICAnZXh0ZW5zaW9uLWRvbWFpbnMnOiBbJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tJ10sXG4gICAgICAgICAgICAnYWxsb3dlZC1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxuICAgICAgICAgICAgJ3NjdC1lZGl0aW9uJzogJ2h0dHA6Ly9zbm9tZWQuaW5mby9zY3QvNzMxMDAwMTI0MTA4JyxcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2U6IGNhbm9uaWNhbEJhc2UsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICdMb2NhdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1Byb2NlZHVyZVJlcXVlc3QnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPcmdhbml6YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdNZWRpY2F0aW9uU3RhdGVtZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU2VhcmNoUGFyYW1ldGVyJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdTdHJ1Y3R1cmVEZWZpbml0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtbWFwcGluZ3MnOiAnc2QtbWFwcGluZ3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ3NkLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZGVmbnMnOiAnc2QtZGVmaW5pdGlvbnMuaHRtbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdJbW11bml6YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQYXRpZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU3RydWN0dXJlTWFwJzoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAnc2NyaXB0JzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAncHJvZmlsZXMnOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0NvbmNlcHRNYXAnOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lcic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ09wZXJhdGlvbkRlZmluaXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0NvZGVTeXN0ZW0nOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0NvbW11bmljYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdBbnknOiB7XG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1mb3JtYXQnOiAnZm9ybWF0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUHJhY3RpdGlvbmVyUm9sZSc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1ZhbHVlU2V0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDYXBhYmlsaXR5U3RhdGVtZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPYnNlcnZhdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IHt9XG4gICAgICAgIH07XG5cblxuICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5maGlyVmVyc2lvbikge1xuICAgICAgICAgICAgY29udHJvbC52ZXJzaW9uID0gaW1wbGVtZW50YXRpb25HdWlkZS5maGlyVmVyc2lvbjtcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJzaW9uKSB7ICAgICAgICAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHZlcnNpb24gb2YgdGhlIEZISVIgc2VydmVyIHRoZSByZXNvdXJjZXMgYXJlIGNvbWluZyBmcm9tXG4gICAgICAgICAgICBjb250cm9sLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUudmVyc2lvbikge1xuICAgICAgICAgICAgY29udHJvbFsnZml4ZWQtYnVzaW5lc3MtdmVyc2lvbiddID0gaW1wbGVtZW50YXRpb25HdWlkZS52ZXJzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoZSBkZXBlbmRlbmN5TGlzdCBiYXNlZCBvbiB0aGUgZXh0ZW5zaW9ucyBpbiB0aGUgSUdcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jeUV4dGVuc2lvbnMgPSBfLmZpbHRlcihpbXBsZW1lbnRhdGlvbkd1aWRlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3knKTtcblxuICAgICAgICAvLyBSNCBJbXBsZW1lbnRhdGlvbkd1aWRlLmRlcGVuZHNPblxuICAgICAgICBjb250cm9sLmRlcGVuZGVuY3lMaXN0ID0gXy5jaGFpbihkZXBlbmRlbmN5RXh0ZW5zaW9ucylcbiAgICAgICAgICAgIC5maWx0ZXIoKGRlcGVuZGVuY3lFeHRlbnNpb24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRlbmN5RXh0ZW5zaW9uLmV4dGVuc2lvbiwgKG5leHQpID0+IG5leHQudXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeS1sb2NhdGlvbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWVFeHRlbnNpb24gPSBfLmZpbmQoZGVwZW5kZW5jeUV4dGVuc2lvbi5leHRlbnNpb24sIChuZXh0KSA9PiBuZXh0LnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbmFtZScpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbG9jYXRpb25FeHRlbnNpb24gJiYgISFsb2NhdGlvbkV4dGVuc2lvbi52YWx1ZVN0cmluZyAmJiAhIW5hbWVFeHRlbnNpb24gJiYgISFuYW1lRXh0ZW5zaW9uLnZhbHVlU3RyaW5nO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoKGRlcGVuZGVuY3lFeHRlbnNpb24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IDxFeHRlbnNpb24+IF8uZmluZChkZXBlbmRlbmN5RXh0ZW5zaW9uLmV4dGVuc2lvbiwgKG5leHQpID0+IG5leHQudXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeS1sb2NhdGlvbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWVFeHRlbnNpb24gPSA8RXh0ZW5zaW9uPiBfLmZpbmQoZGVwZW5kZW5jeUV4dGVuc2lvbi5leHRlbnNpb24sIChuZXh0KSA9PiBuZXh0LnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbmFtZScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnNpb25FeHRlbnNpb24gPSA8RXh0ZW5zaW9uPiBfLmZpbmQoZGVwZW5kZW5jeUV4dGVuc2lvbi5leHRlbnNpb24sIChuZXh0KSA9PiBuZXh0LnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktdmVyc2lvbicpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDxGaGlyQ29udHJvbERlcGVuZGVuY3k+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uRXh0ZW5zaW9uID8gbG9jYXRpb25FeHRlbnNpb24udmFsdWVVcmkgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZUV4dGVuc2lvbiA/IG5hbWVFeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogdmVyc2lvbkV4dGVuc2lvbiA/IHZlcnNpb25FeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnZhbHVlKCk7XG5cbiAgICAgICAgLy8gRGVmaW5lIHRoZSByZXNvdXJjZXMgaW4gdGhlIGNvbnRyb2wgYW5kIHdoYXQgdGVtcGxhdGVzIHRoZXkgc2hvdWxkIHVzZVxuICAgICAgICBpZiAoYnVuZGxlICYmIGJ1bmRsZS5lbnRyeSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidW5kbGUuZW50cnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IGJ1bmRsZS5lbnRyeVtpXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZSA9IGVudHJ5LnJlc291cmNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnRyb2wucmVzb3VyY2VzW3Jlc291cmNlLnJlc291cmNlVHlwZSArICcvJyArIHJlc291cmNlLmlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTogcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy0nICsgcmVzb3VyY2UuaWQgKyAnLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBkZWZuczogcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy0nICsgcmVzb3VyY2UuaWQgKyAnLWRlZmluaXRpb25zLmh0bWwnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFI0Q29udHJvbChpbXBsZW1lbnRhdGlvbkd1aWRlOiBSNEltcGxlbWVudGF0aW9uR3VpZGUsIGJ1bmRsZTogUjRCdW5kbGUsIHZlcnNpb246IHN0cmluZykge1xuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlUmVnZXggPSAvXiguKz8pXFwvSW1wbGVtZW50YXRpb25HdWlkZVxcLy4rJC9nbTtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsQmFzZU1hdGNoID0gY2Fub25pY2FsQmFzZVJlZ2V4LmV4ZWMoaW1wbGVtZW50YXRpb25HdWlkZS51cmwpO1xuICAgICAgICBsZXQgY2Fub25pY2FsQmFzZTtcblxuICAgICAgICBpZiAoIWNhbm9uaWNhbEJhc2VNYXRjaCB8fCBjYW5vbmljYWxCYXNlTWF0Y2gubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgY2Fub25pY2FsQmFzZSA9IGltcGxlbWVudGF0aW9uR3VpZGUudXJsLnN1YnN0cmluZygwLCBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5sYXN0SW5kZXhPZignLycpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBjYW5vbmljYWxCYXNlTWF0Y2hbMV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjdXJyZW50bHksIElHIHJlc291cmNlIGhhcyB0byBiZSBpbiBYTUwgZm9ybWF0IGZvciB0aGUgSUcgUHVibGlzaGVyXG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSA8RmhpckNvbnRyb2w+IHtcbiAgICAgICAgICAgIHRvb2w6ICdqZWt5bGwnLFxuICAgICAgICAgICAgc291cmNlOiAnaW1wbGVtZW50YXRpb25ndWlkZS8nICsgaW1wbGVtZW50YXRpb25HdWlkZS5pZCArICcueG1sJyxcbiAgICAgICAgICAgICducG0tbmFtZSc6IGltcGxlbWVudGF0aW9uR3VpZGUucGFja2FnZUlkIHx8IGltcGxlbWVudGF0aW9uR3VpZGUuaWQgKyAnLW5wbScsXG4gICAgICAgICAgICBsaWNlbnNlOiBpbXBsZW1lbnRhdGlvbkd1aWRlLmxpY2Vuc2UgfHwgJ0NDMC0xLjAnLFxuICAgICAgICAgICAgcGF0aHM6IHtcbiAgICAgICAgICAgICAgICBxYTogJ2dlbmVyYXRlZF9vdXRwdXQvcWEnLFxuICAgICAgICAgICAgICAgIHRlbXA6ICdnZW5lcmF0ZWRfb3V0cHV0L3RlbXAnLFxuICAgICAgICAgICAgICAgIG91dHB1dDogJ291dHB1dCcsXG4gICAgICAgICAgICAgICAgdHhDYWNoZTogJ2dlbmVyYXRlZF9vdXRwdXQvdHhDYWNoZScsXG4gICAgICAgICAgICAgICAgc3BlY2lmaWNhdGlvbjogJ2h0dHA6Ly9obDcub3JnL2ZoaXIvUjQvJyxcbiAgICAgICAgICAgICAgICBwYWdlczogW1xuICAgICAgICAgICAgICAgICAgICAnZnJhbWV3b3JrJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NvdXJjZS9wYWdlcydcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczogWyAnc291cmNlL3Jlc291cmNlcycgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhZ2VzOiBbJ3BhZ2VzJ10sXG4gICAgICAgICAgICAnZXh0ZW5zaW9uLWRvbWFpbnMnOiBbJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tJ10sXG4gICAgICAgICAgICAnYWxsb3dlZC1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxuICAgICAgICAgICAgJ3NjdC1lZGl0aW9uJzogJ2h0dHA6Ly9zbm9tZWQuaW5mby9zY3QvNzMxMDAwMTI0MTA4JyxcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2U6IGNhbm9uaWNhbEJhc2UsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICdMb2NhdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1Byb2NlZHVyZVJlcXVlc3QnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPcmdhbml6YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdNZWRpY2F0aW9uU3RhdGVtZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU2VhcmNoUGFyYW1ldGVyJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdTdHJ1Y3R1cmVEZWZpbml0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtbWFwcGluZ3MnOiAnc2QtbWFwcGluZ3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ3NkLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZGVmbnMnOiAnc2QtZGVmaW5pdGlvbnMuaHRtbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdJbW11bml6YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQYXRpZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU3RydWN0dXJlTWFwJzoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAnc2NyaXB0JzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAncHJvZmlsZXMnOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0NvbmNlcHRNYXAnOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lcic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ09wZXJhdGlvbkRlZmluaXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0NvZGVTeXN0ZW0nOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0NvbW11bmljYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdBbnknOiB7XG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1mb3JtYXQnOiAnZm9ybWF0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUHJhY3RpdGlvbmVyUm9sZSc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1ZhbHVlU2V0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDYXBhYmlsaXR5U3RhdGVtZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPYnNlcnZhdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IHt9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuZmhpclZlcnNpb24gJiYgaW1wbGVtZW50YXRpb25HdWlkZS5maGlyVmVyc2lvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb250cm9sLnZlcnNpb24gPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmZoaXJWZXJzaW9uWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKHZlcnNpb24pIHsgICAgICAgICAgICAgICAgICAgICAgIC8vIFVzZSB0aGUgdmVyc2lvbiBvZiB0aGUgRkhJUiBzZXJ2ZXIgdGhlIHJlc291cmNlcyBhcmUgY29taW5nIGZyb21cbiAgICAgICAgICAgIGNvbnRyb2wudmVyc2lvbiA9IHZlcnNpb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS52ZXJzaW9uKSB7XG4gICAgICAgICAgICBjb250cm9sWydmaXhlZC1idXNpbmVzcy12ZXJzaW9uJ10gPSBpbXBsZW1lbnRhdGlvbkd1aWRlLnZlcnNpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb250cm9sLmRlcGVuZGVuY3lMaXN0ID0gXy5jaGFpbihpbXBsZW1lbnRhdGlvbkd1aWRlLmRlcGVuZHNPbilcbiAgICAgICAgICAgIC5maWx0ZXIoKGRlcGVuZHNPbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZHNPbi5leHRlbnNpb24sIChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiBkZXBlbmRlbmN5RXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtZmhpci5sYW50YW5hZ3JvdXAuY29tL3I0L1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZHMtb24tbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZHNPbi5leHRlbnNpb24sIChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiBkZXBlbmRlbmN5RXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtZmhpci5sYW50YW5hZ3JvdXAuY29tL3I0L1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZHMtb24tbmFtZScpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbG9jYXRpb25FeHRlbnNpb24gJiYgISFsb2NhdGlvbkV4dGVuc2lvbi52YWx1ZVN0cmluZyAmJiAhIW5hbWVFeHRlbnNpb24gJiYgISFuYW1lRXh0ZW5zaW9uLnZhbHVlU3RyaW5nO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoKGRlcGVuZHNPbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZHNPbi5leHRlbnNpb24sIChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiBkZXBlbmRlbmN5RXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtZmhpci5sYW50YW5hZ3JvdXAuY29tL3I0L1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZHMtb24tbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZHNPbi5leHRlbnNpb24sIChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiBkZXBlbmRlbmN5RXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtZmhpci5sYW50YW5hZ3JvdXAuY29tL3I0L1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZHMtb24tbmFtZScpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uRXh0ZW5zaW9uID8gbG9jYXRpb25FeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZUV4dGVuc2lvbiA/IG5hbWVFeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogZGVwZW5kc09uLnZlcnNpb25cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC52YWx1ZSgpO1xuXG4gICAgICAgIC8vIERlZmluZSB0aGUgcmVzb3VyY2VzIGluIHRoZSBjb250cm9sIGFuZCB3aGF0IHRlbXBsYXRlcyB0aGV5IHNob3VsZCB1c2VcbiAgICAgICAgaWYgKGJ1bmRsZSAmJiBidW5kbGUuZW50cnkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlLmVudHJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSBidW5kbGUuZW50cnlbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBlbnRyeS5yZXNvdXJjZTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb250cm9sLnJlc291cmNlc1tyZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLycgKyByZXNvdXJjZS5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2U6IHJlc291cmNlLnJlc291cmNlVHlwZSArICctJyArIHJlc291cmNlLmlkICsgJy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgZGVmbnM6IHJlc291cmNlLnJlc291cmNlVHlwZSArICctJyArIHJlc291cmNlLmlkICsgJy1kZWZpbml0aW9ucy5odG1sJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZTogU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUsIHBhZ2U6IFBhZ2VDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgY29udGVudEV4dGVuc2lvbiA9IF8uZmluZChwYWdlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLXBhZ2UtY29udGVudCcpO1xuXG4gICAgICAgIGlmIChjb250ZW50RXh0ZW5zaW9uICYmIGNvbnRlbnRFeHRlbnNpb24udmFsdWVSZWZlcmVuY2UgJiYgY29udGVudEV4dGVuc2lvbi52YWx1ZVJlZmVyZW5jZS5yZWZlcmVuY2UgJiYgcGFnZS5zb3VyY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IGNvbnRlbnRFeHRlbnNpb24udmFsdWVSZWZlcmVuY2UucmVmZXJlbmNlO1xuXG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lZCA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhaW5lZCwgKG5leHQ6IERvbWFpblJlc291cmNlKSA9PiBuZXh0LmlkID09PSByZWZlcmVuY2Uuc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBiaW5hcnkgPSBjb250YWluZWQgJiYgY29udGFpbmVkLnJlc291cmNlVHlwZSA9PT0gJ0JpbmFyeScgPyA8U1RVM0JpbmFyeT4gY29udGFpbmVkIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmFyeSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IHBhZ2Uuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogQnVmZmVyLmZyb20oYmluYXJ5LmNvbnRlbnQsICdiYXNlNjQnKS50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgd3JpdGVTdHUzUGFnZShwYWdlc1BhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUsIHBhZ2U6IFBhZ2VDb21wb25lbnQsIGxldmVsOiBudW1iZXIsIHRvY0VudHJpZXM6IFRhYmxlT2ZDb250ZW50c0VudHJ5W10pIHtcbiAgICAgICAgY29uc3QgcGFnZUNvbnRlbnQgPSB0aGlzLmdldFN0dTNQYWdlQ29udGVudChpbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlKTtcblxuICAgICAgICBpZiAocGFnZS5raW5kICE9PSAndG9jJyAmJiBwYWdlQ29udGVudCAmJiBwYWdlQ29udGVudC5jb250ZW50KSB7XG4gICAgICAgICAgICBjb25zdCBuZXdQYWdlUGF0aCA9IHBhdGguam9pbihwYWdlc1BhdGgsIHBhZ2VDb250ZW50LmZpbGVOYW1lKTtcblxuICAgICAgICAgICAgY29uc3QgY29udGVudCA9ICctLS1cXG4nICtcbiAgICAgICAgICAgICAgICBgdGl0bGU6ICR7cGFnZS50aXRsZX1cXG5gICtcbiAgICAgICAgICAgICAgICAnbGF5b3V0OiBkZWZhdWx0XFxuJyArXG4gICAgICAgICAgICAgICAgYGFjdGl2ZTogJHtwYWdlLnRpdGxlfVxcbmAgK1xuICAgICAgICAgICAgICAgICctLS1cXG5cXG4nICsgcGFnZUNvbnRlbnQuY29udGVudDtcblxuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhuZXdQYWdlUGF0aCwgY29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgYW4gZW50cnkgdG8gdGhlIFRPQ1xuICAgICAgICB0b2NFbnRyaWVzLnB1c2goeyBsZXZlbDogbGV2ZWwsIGZpbGVOYW1lOiBwYWdlLmtpbmQgPT09ICdwYWdlJyAmJiBwYWdlQ29udGVudCA/IHBhZ2VDb250ZW50LmZpbGVOYW1lIDogbnVsbCwgdGl0bGU6IHBhZ2UudGl0bGUgfSk7XG4gICAgICAgIF8uZWFjaChwYWdlLnBhZ2UsIChzdWJQYWdlKSA9PiB0aGlzLndyaXRlU3R1M1BhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBzdWJQYWdlLCBsZXZlbCArIDEsIHRvY0VudHJpZXMpKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRQYWdlRXh0ZW5zaW9uKHBhZ2U6IEltcGxlbWVudGF0aW9uR3VpZGVQYWdlQ29tcG9uZW50KSB7XG4gICAgICAgIHN3aXRjaCAocGFnZS5nZW5lcmF0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICAgIGNhc2UgJ2dlbmVyYXRlZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcuaHRtbCc7XG4gICAgICAgICAgICBjYXNlICd4bWwnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnLnhtbCc7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAnLm1kJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlUjRQYWdlKHBhZ2VzUGF0aDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBSNEltcGxlbWVudGF0aW9uR3VpZGUsIHBhZ2U6IEltcGxlbWVudGF0aW9uR3VpZGVQYWdlQ29tcG9uZW50LCBsZXZlbDogbnVtYmVyLCB0b2NFbnRyaWVzOiBUYWJsZU9mQ29udGVudHNFbnRyeVtdKSB7XG4gICAgICAgIGxldCBmaWxlTmFtZTtcblxuICAgICAgICBpZiAocGFnZS5uYW1lUmVmZXJlbmNlICYmIHBhZ2UubmFtZVJlZmVyZW5jZS5yZWZlcmVuY2UgJiYgcGFnZS50aXRsZSkge1xuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcGFnZS5uYW1lUmVmZXJlbmNlLnJlZmVyZW5jZTtcblxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZS5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZWQgPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWluZWQsIChjb250YWluZWQpID0+IGNvbnRhaW5lZC5pZCA9PT0gcmVmZXJlbmNlLnN1YnN0cmluZygxKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5ID0gY29udGFpbmVkICYmIGNvbnRhaW5lZC5yZXNvdXJjZVR5cGUgPT09ICdCaW5hcnknID8gPFI0QmluYXJ5PiBjb250YWluZWQgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoYmluYXJ5ICYmIGJpbmFyeS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gcGFnZS50aXRsZS5yZXBsYWNlKC8gL2csICdfJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lLmluZGV4T2YoJy4nKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lICs9IHRoaXMuZ2V0UGFnZUV4dGVuc2lvbihwYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhZ2VQYXRoID0gcGF0aC5qb2luKHBhZ2VzUGF0aCwgZmlsZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW5hcnlDb250ZW50ID0gQnVmZmVyLmZyb20oYmluYXJ5LmRhdGEsICdiYXNlNjQnKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gJy0tLVxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYHRpdGxlOiAke3BhZ2UudGl0bGV9XFxuYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGF5b3V0OiBkZWZhdWx0XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBgYWN0aXZlOiAke3BhZ2UudGl0bGV9XFxuYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgLS0tXFxuXFxuJHtiaW5hcnlDb250ZW50fWA7XG4gICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3UGFnZVBhdGgsIGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBhbiBlbnRyeSB0byB0aGUgVE9DXG4gICAgICAgIHRvY0VudHJpZXMucHVzaCh7IGxldmVsOiBsZXZlbCwgZmlsZU5hbWU6IGZpbGVOYW1lLCB0aXRsZTogcGFnZS50aXRsZSB9KTtcblxuICAgICAgICBfLmVhY2gocGFnZS5wYWdlLCAoc3ViUGFnZSkgPT4gdGhpcy53cml0ZVI0UGFnZShwYWdlc1BhdGgsIGltcGxlbWVudGF0aW9uR3VpZGUsIHN1YlBhZ2UsIGxldmVsICsgMSwgdG9jRW50cmllcykpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdlbmVyYXRlVGFibGVPZkNvbnRlbnRzKHJvb3RQYXRoOiBzdHJpbmcsIHRvY0VudHJpZXM6IFRhYmxlT2ZDb250ZW50c0VudHJ5W10sIHNob3VsZEF1dG9HZW5lcmF0ZTogYm9vbGVhbiwgcGFnZUNvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgdG9jUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy90b2MubWQnKTtcbiAgICAgICAgbGV0IHRvY0NvbnRlbnQgPSAnJztcblxuICAgICAgICBpZiAoc2hvdWxkQXV0b0dlbmVyYXRlKSB7XG4gICAgICAgICAgICBfLmVhY2godG9jRW50cmllcywgKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lID0gZW50cnkuZmlsZU5hbWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUgJiYgZmlsZU5hbWUuZW5kc1dpdGgoJy5tZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyaW5nKDAsIGZpbGVOYW1lLmxlbmd0aCAtIDMpICsgJy5odG1sJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGVudHJ5LmxldmVsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdG9jQ29udGVudCArPSAnICAgICc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG9jQ29udGVudCArPSAnKiAnO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gYDxhIGhyZWY9XCIke2ZpbGVOYW1lfVwiPiR7ZW50cnkudGl0bGV9PC9hPlxcbmA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9jQ29udGVudCArPSBgJHtlbnRyeS50aXRsZX1cXG5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHBhZ2VDb250ZW50ICYmIHBhZ2VDb250ZW50LmNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRvY0NvbnRlbnQgPSBwYWdlQ29udGVudC5jb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRvY0NvbnRlbnQpIHtcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKHRvY1BhdGgsIHRvY0NvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgd3JpdGVTdHUzUGFnZXMocm9vdFBhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUpIHtcbiAgICAgICAgY29uc3QgdG9jRmlsZVBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdG9jLm1kJyk7XG4gICAgICAgIGNvbnN0IHRvY0VudHJpZXMgPSBbXTtcblxuICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5wYWdlKSB7XG4gICAgICAgICAgICBjb25zdCBhdXRvR2VuZXJhdGVFeHRlbnNpb24gPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5wYWdlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLXBhZ2UtYXV0by1nZW5lcmF0ZS10b2MnKTtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZEF1dG9HZW5lcmF0ZSA9IGF1dG9HZW5lcmF0ZUV4dGVuc2lvbiAmJiBhdXRvR2VuZXJhdGVFeHRlbnNpb24udmFsdWVCb29sZWFuID09PSB0cnVlO1xuICAgICAgICAgICAgY29uc3QgcGFnZUNvbnRlbnQgPSB0aGlzLmdldFN0dTNQYWdlQ29udGVudChpbXBsZW1lbnRhdGlvbkd1aWRlLCBpbXBsZW1lbnRhdGlvbkd1aWRlLnBhZ2UpO1xuICAgICAgICAgICAgY29uc3QgcGFnZXNQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzJyk7XG4gICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKHBhZ2VzUGF0aCk7XG5cbiAgICAgICAgICAgIHRoaXMud3JpdGVTdHUzUGFnZShwYWdlc1BhdGgsIGltcGxlbWVudGF0aW9uR3VpZGUsIGltcGxlbWVudGF0aW9uR3VpZGUucGFnZSwgMSwgdG9jRW50cmllcyk7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlVGFibGVPZkNvbnRlbnRzKHJvb3RQYXRoLCB0b2NFbnRyaWVzLCBzaG91bGRBdXRvR2VuZXJhdGUsIHBhZ2VDb250ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlUjRQYWdlcyhyb290UGF0aDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBSNEltcGxlbWVudGF0aW9uR3VpZGUpIHtcbiAgICAgICAgY29uc3QgdG9jRW50cmllcyA9IFtdO1xuICAgICAgICBsZXQgc2hvdWxkQXV0b0dlbmVyYXRlID0gdHJ1ZTtcbiAgICAgICAgbGV0IHJvb3RQYWdlQ29udGVudDtcbiAgICAgICAgbGV0IHJvb3RQYWdlRmlsZU5hbWU7XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbiAmJiBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZSkge1xuICAgICAgICAgICAgY29uc3QgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbi5wYWdlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLXBhZ2UtYXV0by1nZW5lcmF0ZS10b2MnKTtcbiAgICAgICAgICAgIHNob3VsZEF1dG9HZW5lcmF0ZSA9IGF1dG9HZW5lcmF0ZUV4dGVuc2lvbiAmJiBhdXRvR2VuZXJhdGVFeHRlbnNpb24udmFsdWVCb29sZWFuID09PSB0cnVlO1xuICAgICAgICAgICAgY29uc3QgcGFnZXNQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzJyk7XG4gICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKHBhZ2VzUGF0aCk7XG5cbiAgICAgICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS5uYW1lUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZVJlZmVyZW5jZSA9IGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbi5wYWdlLm5hbWVSZWZlcmVuY2U7XG5cbiAgICAgICAgICAgICAgICBpZiAobmFtZVJlZmVyZW5jZS5yZWZlcmVuY2UgJiYgbmFtZVJlZmVyZW5jZS5yZWZlcmVuY2Uuc3RhcnRzV2l0aCgnIycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kQ29udGFpbmVkID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFpbmVkLCAoY29udGFpbmVkKSA9PiBjb250YWluZWQuaWQgPT09IG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlLnN1YnN0cmluZygxKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpbmFyeSA9IGZvdW5kQ29udGFpbmVkICYmIGZvdW5kQ29udGFpbmVkLnJlc291cmNlVHlwZSA9PT0gJ0JpbmFyeScgPyA8UjRCaW5hcnk+IGZvdW5kQ29udGFpbmVkIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5hcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQYWdlQ29udGVudCA9IG5ldyBCdWZmZXIoYmluYXJ5LmRhdGEsICdiYXNlNjQnKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFBhZ2VGaWxlTmFtZSA9IGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbi5wYWdlLnRpdGxlLnJlcGxhY2UoLyAvZywgJ18nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyb290UGFnZUZpbGVOYW1lLmVuZHNXaXRoKCcubWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQYWdlRmlsZU5hbWUgKz0gJy5tZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMud3JpdGVSNFBhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZSwgMSwgdG9jRW50cmllcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBcHBlbmQgVE9DIEVudHJpZXMgdG8gdGhlIHRvYy5tZCBmaWxlIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAgICB0aGlzLmdlbmVyYXRlVGFibGVPZkNvbnRlbnRzKHJvb3RQYXRoLCB0b2NFbnRyaWVzLCBzaG91bGRBdXRvR2VuZXJhdGUsIHsgZmlsZU5hbWU6IHJvb3RQYWdlRmlsZU5hbWUsIGNvbnRlbnQ6IHJvb3RQYWdlQ29udGVudCB9KTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGV4cG9ydChmb3JtYXQ6IHN0cmluZywgZXhlY3V0ZUlnUHVibGlzaGVyOiBib29sZWFuLCB1c2VUZXJtaW5vbG9neVNlcnZlcjogYm9vbGVhbiwgdXNlTGF0ZXN0OiBib29sZWFuLCBkb3dubG9hZE91dHB1dDogYm9vbGVhbiwgaW5jbHVkZUlnUHVibGlzaGVySmFyOiBib29sZWFuLCB0ZXN0Q2FsbGJhY2s/OiAobWVzc2FnZSwgZXJyPykgPT4gdm9pZCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYnVuZGxlRXhwb3J0ZXIgPSBuZXcgQnVuZGxlRXhwb3J0ZXIodGhpcy5maGlyU2VydmVyQmFzZSwgdGhpcy5maGlyU2VydmVySWQsIHRoaXMuZmhpclZlcnNpb24sIHRoaXMuZmhpciwgdGhpcy5pbXBsZW1lbnRhdGlvbkd1aWRlSWQpO1xuICAgICAgICAgICAgY29uc3QgaXNYbWwgPSBmb3JtYXQgPT09ICd4bWwnIHx8IGZvcm1hdCA9PT0gJ2FwcGxpY2F0aW9uL3htbCcgfHwgZm9ybWF0ID09PSAnYXBwbGljYXRpb24vZmhpcit4bWwnO1xuICAgICAgICAgICAgY29uc3QgZXh0ZW5zaW9uID0gKCFpc1htbCA/ICcuanNvbicgOiAnLnhtbCcpO1xuICAgICAgICAgICAgY29uc3QgaG9tZWRpciA9IHJlcXVpcmUoJ29zJykuaG9tZWRpcigpO1xuICAgICAgICAgICAgY29uc3QgZmhpclNlcnZlckNvbmZpZyA9IF8uZmluZChmaGlyQ29uZmlnLnNlcnZlcnMsIChzZXJ2ZXI6IEZoaXJDb25maWdTZXJ2ZXIpID0+IHNlcnZlci5pZCA9PT0gdGhpcy5maGlyU2VydmVySWQpO1xuICAgICAgICAgICAgbGV0IGNvbnRyb2w7XG4gICAgICAgICAgICBsZXQgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlO1xuXG4gICAgICAgICAgICB0bXAuZGlyKCh0bXBEaXJFcnIsIHJvb3RQYXRoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRtcERpckVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5lcnJvcih0bXBEaXJFcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyBhIHRlbXBvcmFyeSBkaXJlY3Rvcnk6ICcgKyB0bXBEaXJFcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnaWcuanNvbicpO1xuICAgICAgICAgICAgICAgIGxldCBidW5kbGU6IEJ1bmRsZTtcblxuICAgICAgICAgICAgICAgIHRoaXMucGFja2FnZUlkID0gcm9vdFBhdGguc3Vic3RyaW5nKHJvb3RQYXRoLmxhc3RJbmRleE9mKHBhdGguc2VwKSArIDEpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5wYWNrYWdlSWQpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0NyZWF0ZWQgdGVtcCBkaXJlY3RvcnkuIFJldHJpZXZpbmcgcmVzb3VyY2VzIGZvciBpbXBsZW1lbnRhdGlvbiBndWlkZS4nKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBQcmVwYXJlIElHIFB1Ymxpc2hlciBwYWNrYWdlXG4gICAgICAgICAgICAgICAgICAgIGJ1bmRsZUV4cG9ydGVyLmdldEJ1bmRsZShmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidW5kbGUgPSA8QnVuZGxlPiByZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlc0RpciA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9yZXNvdXJjZXMnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ1Jlc291cmNlcyByZXRyaWV2ZWQuIFBhY2thZ2luZy4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlLmVudHJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gYnVuZGxlLmVudHJ5W2ldLnJlc291cmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGVhblJlc291cmNlID0gQnVuZGxlRXhwb3J0ZXIuY2xlYW51cFJlc291cmNlKHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VUeXBlID0gcmVzb3VyY2UucmVzb3VyY2VUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHJlc291cmNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZURpciA9IHBhdGguam9pbihyZXNvdXJjZXNEaXIsIHJlc291cmNlVHlwZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc291cmNlUGF0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb3VyY2VDb250ZW50ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScgJiYgaWQgPT09IHRoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UgPSByZXNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEltcGxlbWVudGF0aW9uR3VpZGUgbXVzdCBiZSBnZW5lcmF0ZWQgYXMgYW4geG1sIGZpbGUgZm9yIHRoZSBJRyBQdWJsaXNoZXIgaW4gU1RVMy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1htbCAmJiByZXNvdXJjZVR5cGUgIT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoY2xlYW5SZXNvdXJjZSwgbnVsbCwgJ1xcdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VQYXRoID0gcGF0aC5qb2luKHJlc291cmNlRGlyLCBpZCArICcuanNvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDb250ZW50ID0gdGhpcy5maGlyLm9ialRvWG1sKGNsZWFuUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDb250ZW50ID0gdmtiZWF1dGlmeS54bWwocmVzb3VyY2VDb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlUGF0aCA9IHBhdGguam9pbihyZXNvdXJjZURpciwgaWQgKyAnLnhtbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhyZXNvdXJjZURpcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMocmVzb3VyY2VQYXRoLCByZXNvdXJjZUNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGltcGxlbWVudGF0aW9uIGd1aWRlIHdhcyBub3QgZm91bmQgaW4gdGhlIGJ1bmRsZSByZXR1cm5lZCBieSB0aGUgc2VydmVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA9PT0gJ3N0dTMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2wgPSB0aGlzLmdldFN0dTNDb250cm9sKGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSwgPFNUVTNCdW5kbGU+PGFueT4gYnVuZGxlLCB0aGlzLmdldEZoaXJDb250cm9sVmVyc2lvbihmaGlyU2VydmVyQ29uZmlnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbCA9IHRoaXMuZ2V0UjRDb250cm9sKGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSwgPFI0QnVuZGxlPjxhbnk+IGJ1bmRsZSwgdGhpcy5nZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERlcGVuZGVuY2llcyhjb250cm9sLCBpc1htbCwgcmVzb3VyY2VzRGlyLCB0aGlzLmZoaXIsIGZoaXJTZXJ2ZXJDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBjb250ZW50cyBvZiB0aGUgaWctcHVibGlzaGVyLXRlbXBsYXRlIGZvbGRlciB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vJywgJ2lnLXB1Ymxpc2hlci10ZW1wbGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmNvcHlTeW5jKHRlbXBsYXRlUGF0aCwgcm9vdFBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV3JpdGUgdGhlIGlnLmpzb24gZmlsZSB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sQ29udGVudCA9IEpTT04uc3RyaW5naWZ5KGNvbnRyb2wsIG51bGwsICdcXHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGNvbnRyb2xQYXRoLCBjb250cm9sQ29udGVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXcml0ZSB0aGUgaW50cm8sIHN1bW1hcnkgYW5kIHNlYXJjaCBNRCBmaWxlcyBmb3IgZWFjaCByZXNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChidW5kbGUuZW50cnksIChlbnRyeSkgPT4gdGhpcy53cml0ZUZpbGVzRm9yUmVzb3VyY2VzKHJvb3RQYXRoLCBlbnRyeS5yZXNvdXJjZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUZW1wbGF0ZXMocm9vdFBhdGgsIGJ1bmRsZSwgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gPT09ICdzdHUzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlU3R1M1BhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JpdGVSNFBhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0RvbmUgYnVpbGRpbmcgcGFja2FnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SWdQdWJsaXNoZXIodXNlTGF0ZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoaWdQdWJsaXNoZXJMb2NhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlSWdQdWJsaXNoZXJKYXIgJiYgaWdQdWJsaXNoZXJMb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdDb3B5aW5nIElHIFB1Ymxpc2hlciBKQVIgdG8gd29ya2luZyBkaXJlY3RvcnkuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGphckZpbGVOYW1lID0gaWdQdWJsaXNoZXJMb2NhdGlvbi5zdWJzdHJpbmcoaWdQdWJsaXNoZXJMb2NhdGlvbi5sYXN0SW5kZXhPZihwYXRoLnNlcCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdEphclBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIGphckZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weVN5bmMoaWdQdWJsaXNoZXJMb2NhdGlvbiwgZGVzdEphclBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhlY3V0ZUlnUHVibGlzaGVyIHx8ICFpZ1B1Ymxpc2hlckxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2NvbXBsZXRlJywgJ0RvbmUuIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvd25sb2FkIHRoZSBwYWNrYWdlIGluIGEgbW9tZW50LicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RDYWxsYmFjayhyb290UGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVwbG95RGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3d3d3Jvb3QvaWdzJywgdGhpcy5maGlyU2VydmVySWQsIGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhkZXBsb3lEaXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWdQdWJsaXNoZXJWZXJzaW9uID0gdXNlTGF0ZXN0ID8gJ2xhdGVzdCcgOiAnZGVmYXVsdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvY2VzcyA9IHNlcnZlckNvbmZpZy5qYXZhTG9jYXRpb24gfHwgJ2phdmEnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGphclBhcmFtcyA9IFsnLWphcicsIGlnUHVibGlzaGVyTG9jYXRpb24sICctaWcnLCBjb250cm9sUGF0aF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZVRlcm1pbm9sb2d5U2VydmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGphclBhcmFtcy5wdXNoKCctdHgnLCAnTi9BJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCBgUnVubmluZyAke2lnUHVibGlzaGVyVmVyc2lvbn0gSUcgUHVibGlzaGVyOiAke2phclBhcmFtcy5qb2luKCcgJyl9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgU3Bhd25pbmcgRkhJUiBJRyBQdWJsaXNoZXIgSmF2YSBwcm9jZXNzIGF0ICR7cHJvY2Vzc30gd2l0aCBwYXJhbXMgJHtqYXJQYXJhbXN9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZ1B1Ymxpc2hlclByb2Nlc3MgPSBzcGF3bihwcm9jZXNzLCBqYXJQYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQdWJsaXNoZXJQcm9jZXNzLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSh0bXAudG1wZGlyLCAnWFhYJykucmVwbGFjZShob21lZGlyLCAnWFhYJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgJiYgbWVzc2FnZS50cmltKCkucmVwbGFjZSgvXFwuL2csICcnKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUHVibGlzaGVyUHJvY2Vzcy5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UodG1wLnRtcGRpciwgJ1hYWCcpLnJlcGxhY2UoaG9tZWRpciwgJ1hYWCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudHJpbSgpLnJlcGxhY2UoL1xcLi9nLCAnJykgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Mub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0Vycm9yIGV4ZWN1dGluZyBGSElSIElHIFB1Ymxpc2hlcjogJyArIGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2Vycm9yJywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Mub24oJ2V4aXQnLCAoY29kZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgSUcgUHVibGlzaGVyIGlzIGRvbmUgZXhlY3V0aW5nIGZvciAke3Jvb3RQYXRofWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0lHIFB1Ymxpc2hlciBmaW5pc2hlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdXb25cXCd0IGNvcHkgb3V0cHV0IHRvIGRlcGxveW1lbnQgcGF0aC4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2NvbXBsZXRlJywgJ0RvbmUuIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvd25sb2FkIHRoZSBwYWNrYWdlIGluIGEgbW9tZW50LicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnQ29weWluZyBvdXRwdXQgdG8gZGVwbG95bWVudCBwYXRoLicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZWRQYXRoID0gcGF0aC5yZXNvbHZlKHJvb3RQYXRoLCAnZ2VuZXJhdGVkX291dHB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9IHBhdGgucmVzb2x2ZShyb290UGF0aCwgJ291dHB1dCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgRGVsZXRpbmcgY29udGVudCBnZW5lcmF0ZWQgYnkgaWcgcHVibGlzaGVyIGluICR7Z2VuZXJhdGVkUGF0aH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW1wdHlEaXIoZ2VuZXJhdGVkUGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYENvcHlpbmcgb3V0cHV0IGZyb20gJHtvdXRwdXRQYXRofSB0byAke2RlcGxveURpcn1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weShvdXRwdXRQYXRoLCBkZXBsb3lEaXIsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2Vycm9yJywgJ0Vycm9yIGNvcHlpbmcgY29udGVudHMgdG8gZGVwbG95bWVudCBwYXRoLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmFsTWVzc2FnZSA9IGBEb25lIGV4ZWN1dGluZyB0aGUgRkhJUiBJRyBQdWJsaXNoZXIuIFlvdSBtYXkgdmlldyB0aGUgSUcgPGEgaHJlZj1cIi9pbXBsZW1lbnRhdGlvbi1ndWlkZS8ke3RoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkfS92aWV3XCI+aGVyZTwvYT4uYCArIChkb3dubG9hZE91dHB1dCA/ICcgWW91IHdpbGwgYmUgcHJvbXB0ZWQgdG8gZG93bmxvYWQgdGhlIHBhY2thZ2UgaW4gYSBtb21lbnQuJyA6ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnY29tcGxldGUnLCBmaW5hbE1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZG93bmxvYWRPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYFVzZXIgaW5kaWNhdGVkIHRoZXkgZG9uJ3QgbmVlZCB0byBkb3dubG9hZC4gUmVtb3ZpbmcgdGVtcG9yYXJ5IGRpcmVjdG9yeSAke3Jvb3RQYXRofWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVtcHR5RGlyKHJvb3RQYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYERvbmUgcmVtb3ZpbmcgdGVtcG9yYXJ5IGRpcmVjdG9yeSAke3Jvb3RQYXRofWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdlcnJvcicsICdFcnJvciBkdXJpbmcgZXhwb3J0OiAnICsgZXJyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdENhbGxiYWNrKHJvb3RQYXRoLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==