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
        fs.writeFileSync(searchPath, '');
        fs.writeFileSync(summaryPath, '');
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
            this.log.info(`Starting export of HTML package. Home directory is ${homedir}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpREFBb0M7QUFlcEMsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixpQ0FBaUM7QUFDakMsMkJBQTJCO0FBQzNCLHlDQUF5QztBQVN6QyxxQ0FBd0M7QUFFeEMsbURBQThDO0FBRTlDLE1BQU0sVUFBVSxHQUFnQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELE1BQU0sWUFBWSxHQUFrQixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBUXpELE1BQWEsWUFBWTtJQVlyQixZQUFZLGNBQXNCLEVBQUUsWUFBb0IsRUFBRSxXQUFtQixFQUFFLElBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQWdCLEVBQUUscUJBQTZCO1FBWG5KLFFBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFZOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMscUJBQXFCLEdBQUcscUJBQXFCLENBQUM7SUFDdkQsQ0FBQztJQUVPLGNBQWMsQ0FBQyxJQUFzQjtRQUN6QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTztTQUNWO1FBRUQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDMUIsT0FBZ0IsSUFBSSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxPQUFPLEdBQUcs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QUFRLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7NENBQzFCLElBQUksR0FBRyxFQUFFO2dEQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZDQUN2QjtpREFBTTtnREFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsUUFBUSxFQUFFLENBQUMsQ0FBQzs2Q0FDbkU7d0NBQ0wsQ0FBQyxDQUFDLENBQUM7cUNBQ047Z0NBQ0wsQ0FBQyxDQUFDLENBQUM7NkJBQ047d0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDO3lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO3dCQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLHVCQUF1QixHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUUvRCxJQUFJLFlBQVksRUFBRTs0QkFDZCxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUMvQjtvQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDYixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBbDhCRCxvQ0FrOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtGaGlyIGFzIEZoaXJNb2R1bGV9IGZyb20gJ2ZoaXIvZmhpcic7XG5pbXBvcnQge1NlcnZlcn0gZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCB7c3Bhd259IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHtcbiAgICBEb21haW5SZXNvdXJjZSxcbiAgICBIdW1hbk5hbWUsXG4gICAgQnVuZGxlIGFzIFNUVTNCdW5kbGUsXG4gICAgQmluYXJ5IGFzIFNUVTNCaW5hcnksXG4gICAgSW1wbGVtZW50YXRpb25HdWlkZSBhcyBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSxcbiAgICBQYWdlQ29tcG9uZW50LCBFeHRlbnNpb25cbn0gZnJvbSAnLi4vLi4vc3JjL2FwcC9tb2RlbHMvc3R1My9maGlyJztcbmltcG9ydCB7XG4gICAgQmluYXJ5IGFzIFI0QmluYXJ5LFxuICAgIEJ1bmRsZSBhcyBSNEJ1bmRsZSxcbiAgICBJbXBsZW1lbnRhdGlvbkd1aWRlIGFzIFI0SW1wbGVtZW50YXRpb25HdWlkZSxcbiAgICBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudFxufSBmcm9tICcuLi8uLi9zcmMvYXBwL21vZGVscy9yNC9maGlyJztcbmltcG9ydCAqIGFzIGxvZzRqcyBmcm9tICdsb2c0anMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgKiBhcyBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJ2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB0bXAgZnJvbSAndG1wJztcbmltcG9ydCAqIGFzIHZrYmVhdXRpZnkgZnJvbSAndmtiZWF1dGlmeSc7XG5pbXBvcnQge1xuICAgIEZoaXIsXG4gICAgRmhpckNvbmZpZyxcbiAgICBGaGlyQ29uZmlnU2VydmVyLFxuICAgIEZoaXJDb250cm9sLFxuICAgIEZoaXJDb250cm9sRGVwZW5kZW5jeSxcbiAgICBTZXJ2ZXJDb25maWdcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvbW9kZWxzJztcbmltcG9ydCB7QnVuZGxlRXhwb3J0ZXJ9IGZyb20gJy4vYnVuZGxlJztcbmltcG9ydCBCdW5kbGUgPSBGaGlyLkJ1bmRsZTtcbmltcG9ydCB7R2xvYmFsc30gZnJvbSAnLi4vLi4vc3JjL2FwcC9nbG9iYWxzJztcblxuY29uc3QgZmhpckNvbmZpZyA9IDxGaGlyQ29uZmlnPiBjb25maWcuZ2V0KCdmaGlyJyk7XG5jb25zdCBzZXJ2ZXJDb25maWcgPSA8U2VydmVyQ29uZmlnPiBjb25maWcuZ2V0KCdzZXJ2ZXInKTtcblxuaW50ZXJmYWNlIFRhYmxlT2ZDb250ZW50c0VudHJ5IHtcbiAgICBsZXZlbDogbnVtYmVyO1xuICAgIGZpbGVOYW1lOiBzdHJpbmc7XG4gICAgdGl0bGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEh0bWxFeHBvcnRlciB7XG4gICAgcmVhZG9ubHkgbG9nID0gbG9nNGpzLmdldExvZ2dlcigpO1xuICAgIHJlYWRvbmx5IGZoaXJTZXJ2ZXJCYXNlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZmhpclNlcnZlcklkOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZmhpclZlcnNpb246IHN0cmluZztcbiAgICByZWFkb25seSBmaGlyOiBGaGlyTW9kdWxlO1xuICAgIHJlYWRvbmx5IGlvOiBTZXJ2ZXI7XG4gICAgcmVhZG9ubHkgc29ja2V0SWQ6IHN0cmluZztcbiAgICByZWFkb25seSBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ6IHN0cmluZztcblxuICAgIHByaXZhdGUgcGFja2FnZUlkOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihmaGlyU2VydmVyQmFzZTogc3RyaW5nLCBmaGlyU2VydmVySWQ6IHN0cmluZywgZmhpclZlcnNpb246IHN0cmluZywgZmhpcjogRmhpck1vZHVsZSwgaW86IFNlcnZlciwgc29ja2V0SWQ6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZUlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5maGlyU2VydmVyQmFzZSA9IGZoaXJTZXJ2ZXJCYXNlO1xuICAgICAgICB0aGlzLmZoaXJTZXJ2ZXJJZCA9IGZoaXJTZXJ2ZXJJZDtcbiAgICAgICAgdGhpcy5maGlyVmVyc2lvbiA9IGZoaXJWZXJzaW9uO1xuICAgICAgICB0aGlzLmZoaXIgPSBmaGlyO1xuICAgICAgICB0aGlzLmlvID0gaW87XG4gICAgICAgIHRoaXMuc29ja2V0SWQgPSBzb2NrZXRJZDtcbiAgICAgICAgdGhpcy5pbXBsZW1lbnRhdGlvbkd1aWRlSWQgPSBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREaXNwbGF5TmFtZShuYW1lOiBzdHJpbmd8SHVtYW5OYW1lKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gPHN0cmluZz4gbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkaXNwbGF5ID0gbmFtZS5mYW1pbHk7XG5cbiAgICAgICAgaWYgKG5hbWUuZ2l2ZW4pIHtcbiAgICAgICAgICAgIGlmIChkaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheSArPSAnLCAnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRpc3BsYXkgKz0gbmFtZS5naXZlbi5qb2luKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlzcGxheTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgY3JlYXRlVGFibGVGcm9tQXJyYXkoaGVhZGVycywgZGF0YSkge1xuICAgICAgICBsZXQgb3V0cHV0ID0gJzx0YWJsZT5cXG48dGhlYWQ+XFxuPHRyPlxcbic7XG5cbiAgICAgICAgXy5lYWNoKGhlYWRlcnMsIChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIG91dHB1dCArPSBgPHRoPiR7aGVhZGVyfTwvdGg+XFxuYDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb3V0cHV0ICs9ICc8L3RyPlxcbjwvdGhlYWQ+XFxuPHRib2R5Plxcbic7XG5cbiAgICAgICAgXy5lYWNoKGRhdGEsIChyb3c6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gJzx0cj5cXG4nO1xuXG4gICAgICAgICAgICBfLmVhY2gocm93LCAoY2VsbCkgPT4ge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBgPHRkPiR7Y2VsbH08L3RkPlxcbmA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgb3V0cHV0ICs9ICc8L3RyPlxcbic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG91dHB1dCArPSAnPC90Ym9keT5cXG48L3RhYmxlPlxcbic7XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbmRTb2NrZXRNZXNzYWdlKHN0YXR1cywgbWVzc2FnZSkge1xuICAgICAgICBpZiAoIXRoaXMuc29ja2V0SWQpIHtcbiAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKCdXb25cXCd0IHNlbmQgc29ja2V0IG1lc3NhZ2UgZm9yIGV4cG9ydCBiZWNhdXNlIHRoZSBvcmlnaW5hbCByZXF1ZXN0IGRpZCBub3Qgc3BlY2lmeSBhIHNvY2tldElkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pbykge1xuICAgICAgICAgICAgdGhpcy5pby50byh0aGlzLnNvY2tldElkKS5lbWl0KCdodG1sLWV4cG9ydCcsIHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlSWQ6IHRoaXMucGFja2FnZUlkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZ1B1Ymxpc2hlcih1c2VMYXRlc3Q6IGJvb2xlYW4pOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gJ29yZy5obDcuZmhpci5pZ3B1Ymxpc2hlci5qYXInO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vaWctcHVibGlzaGVyJyk7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0RmlsZVBhdGggPSBwYXRoLmpvaW4oZGVmYXVsdFBhdGgsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgaWYgKHVzZUxhdGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdSZXF1ZXN0IHRvIGdldCBsYXRlc3QgdmVyc2lvbiBvZiBGSElSIElHIHB1Ymxpc2hlci4gUmV0cmlldmluZyBmcm9tOiAnICsgZmhpckNvbmZpZy5sYXRlc3RQdWJsaXNoZXIpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnRG93bmxvYWRpbmcgbGF0ZXN0IEZISVIgSUcgcHVibGlzaGVyJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBDaGVjayBodHRwOi8vYnVpbGQuZmhpci5vcmcvdmVyc2lvbi5pbmZvIGZpcnN0XG5cbiAgICAgICAgICAgICAgICBycChmaGlyQ29uZmlnLmxhdGVzdFB1Ymxpc2hlciwgeyBlbmNvZGluZzogbnVsbCB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoJ1N1Y2Nlc3NmdWxseSBkb3dubG9hZGVkIGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgUHVibGlzaGVyLiBFbnN1cmluZyBsYXRlc3QgZGlyZWN0b3J5IGV4aXN0cycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3RQYXRoID0gcGF0aC5qb2luKGRlZmF1bHRQYXRoLCAnbGF0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKGxhdGVzdFBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmYgPSBCdWZmZXIuZnJvbShyZXN1bHRzLCAndXRmOCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0RmlsZVBhdGggPSBwYXRoLmpvaW4obGF0ZXN0UGF0aCwgZmlsZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZygnU2F2aW5nIEZISVIgSUcgcHVibGlzaGVyIHRvICcgKyBsYXRlc3RGaWxlUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobGF0ZXN0RmlsZVBhdGgsIGJ1ZmYpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGxhdGVzdEZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGBFcnJvciBnZXR0aW5nIGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0VuY291bnRlcmVkIGVycm9yIGRvd25sb2FkaW5nIGxhdGVzdCBJRyBwdWJsaXNoZXIsIHdpbGwgdXNlIHByZS1sb2FkZWQvZGVmYXVsdCBJRyBwdWJsaXNoZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGVmYXVsdEZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdVc2luZyBidWlsdC1pbiB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyIGZvciBleHBvcnQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdVc2luZyBleGlzdGluZy9kZWZhdWx0IHZlcnNpb24gb2YgRkhJUiBJRyBwdWJsaXNoZXInKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRlZmF1bHRGaWxlUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXI6IHN0cmluZywgZXh0ZW5zaW9uRmlsZU5hbWU6IHN0cmluZywgaXNYbWw6IGJvb2xlYW4sIGZoaXI6IEZoaXJNb2R1bGUpIHtcbiAgICAgICAgY29uc3Qgc291cmNlRXh0ZW5zaW9uc0RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9zcmMvYXNzZXRzL3N0dTMvZXh0ZW5zaW9ucycpO1xuICAgICAgICBjb25zdCBzb3VyY2VFeHRlbnNpb25GaWxlTmFtZSA9IHBhdGguam9pbihzb3VyY2VFeHRlbnNpb25zRGlyLCBleHRlbnNpb25GaWxlTmFtZSk7XG4gICAgICAgIGxldCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUgPSBwYXRoLmpvaW4oZGVzdEV4dGVuc2lvbnNEaXIsIGV4dGVuc2lvbkZpbGVOYW1lKTtcblxuICAgICAgICBpZiAoIWlzWG1sKSB7XG4gICAgICAgICAgICBmcy5jb3B5U3luYyhzb3VyY2VFeHRlbnNpb25GaWxlTmFtZSwgZGVzdEV4dGVuc2lvbkZpbGVOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbkpzb24gPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlRXh0ZW5zaW9uRmlsZU5hbWUpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb25YbWwgPSBmaGlyLmpzb25Ub1htbChleHRlbnNpb25Kc29uKTtcblxuICAgICAgICAgICAgZGVzdEV4dGVuc2lvbkZpbGVOYW1lID0gZGVzdEV4dGVuc2lvbkZpbGVOYW1lLnN1YnN0cmluZygwLCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUuaW5kZXhPZignLmpzb24nKSkgKyAnLnhtbCc7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRlc3RFeHRlbnNpb25GaWxlTmFtZSwgZXh0ZW5zaW9uWG1sKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldERlcGVuZGVuY2llcyhjb250cm9sLCBpc1htbDogYm9vbGVhbiwgcmVzb3VyY2VzRGlyOiBzdHJpbmcsIGZoaXI6IEZoaXJNb2R1bGUsIGZoaXJTZXJ2ZXJDb25maWc6IEZoaXJDb25maWdTZXJ2ZXIpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBpc1N0dTMgPSBmaGlyU2VydmVyQ29uZmlnICYmIGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA9PT0gJ3N0dTMnO1xuXG4gICAgICAgIC8vIExvYWQgdGhlIGlnIGRlcGVuZGVuY3kgZXh0ZW5zaW9ucyBpbnRvIHRoZSByZXNvdXJjZXMgZGlyZWN0b3J5XG4gICAgICAgIGlmIChpc1N0dTMgJiYgY29udHJvbC5kZXBlbmRlbmN5TGlzdCAmJiBjb250cm9sLmRlcGVuZGVuY3lMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGRlc3RFeHRlbnNpb25zRGlyID0gcGF0aC5qb2luKHJlc291cmNlc0RpciwgJ3N0cnVjdHVyZWRlZmluaXRpb24nKTtcblxuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhkZXN0RXh0ZW5zaW9uc0Rpcik7XG5cbiAgICAgICAgICAgIHRoaXMuY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0RpciwgJ2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5Lmpzb24nLCBpc1htbCwgZmhpcik7XG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS12ZXJzaW9uLmpzb24nLCBpc1htbCwgZmhpcik7XG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS1sb2NhdGlvbi5qc29uJywgaXNYbWwsIGZoaXIpO1xuICAgICAgICAgICAgdGhpcy5jb3B5RXh0ZW5zaW9uKGRlc3RFeHRlbnNpb25zRGlyLCAnZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbmFtZS5qc29uJywgaXNYbWwsIGZoaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7ICAgICAgICAgICAvLyBUaGlzIGlzbid0IGFjdHVhbGx5IG5lZWRlZCwgc2luY2UgdGhlIElHIFB1Ymxpc2hlciBhdHRlbXB0cyB0byByZXNvbHZlIHRoZXNlIGRlcGVuZGVuY3kgYXV0b21hdGljYWxseVxuXG4gICAgICAgIC8qXG4gICAgICAgIC8vIEF0dGVtcHQgdG8gcmVzb2x2ZSB0aGUgZGVwZW5kZW5jeSdzIGRlZmluaXRpb25zIGFuZCBpbmNsdWRlIGl0IGluIHRoZSBwYWNrYWdlXG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IF8ubWFwKGNvbnRyb2wuZGVwZW5kZW5jeUxpc3QsIChkZXBlbmRlbmN5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5VXJsID1cbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5LmxvY2F0aW9uICtcbiAgICAgICAgICAgICAgICAoZGVwZW5kZW5jeS5sb2NhdGlvbi5lbmRzV2l0aCgnLycpID8gJycgOiAnLycpICsgJ2RlZmluaXRpb25zLicgK1xuICAgICAgICAgICAgICAgIChpc1htbCA/ICd4bWwnIDogJ2pzb24nKSArXG4gICAgICAgICAgICAgICAgJy56aXAnO1xuICAgICAgICAgICAgcmV0dXJuIGdldERlcGVuZGVuY3koZGVwZW5kZW5jeVVybCwgZGVwZW5kZW5jeS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgXG4gICAgICAgIFEuYWxsKHByb21pc2VzKVxuICAgICAgICAgICAgLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSlcbiAgICAgICAgICAgIC5jYXRjaChkZWZlcnJlZC5yZWplY3QpO1xuICAgIFxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgKi9cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykge1xuICAgICAgICBjb25zdCBjb25maWdWZXJzaW9uID0gZmhpclNlcnZlckNvbmZpZyA/IGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA6IG51bGw7XG5cbiAgICAgICAgLy8gVE9ETzogQWRkIG1vcmUgbG9naWNcbiAgICAgICAgc3dpdGNoIChjb25maWdWZXJzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICdzdHUzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJzMuMC4xJztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICc0LjAuMCc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB1cGRhdGVUZW1wbGF0ZXMocm9vdFBhdGgsIGJ1bmRsZSwgaW1wbGVtZW50YXRpb25HdWlkZTogU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUpIHtcbiAgICAgICAgY29uc3QgbWFpblJlc291cmNlVHlwZXMgPSBbJ0ltcGxlbWVudGF0aW9uR3VpZGUnLCAnVmFsdWVTZXQnLCAnQ29kZVN5c3RlbScsICdTdHJ1Y3R1cmVEZWZpbml0aW9uJywgJ0NhcGFiaWxpdHlTdGF0ZW1lbnQnXTtcbiAgICAgICAgY29uc3QgZGlzdGluY3RSZXNvdXJjZXMgPSBfLmNoYWluKGJ1bmRsZS5lbnRyeSlcbiAgICAgICAgICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS5yZXNvdXJjZSlcbiAgICAgICAgICAgIC51bmlxKChyZXNvdXJjZSkgPT4gcmVzb3VyY2UuaWQpXG4gICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgY29uc3QgdmFsdWVTZXRzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnVmFsdWVTZXQnKTtcbiAgICAgICAgY29uc3QgY29kZVN5c3RlbXMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdDb2RlU3lzdGVtJyk7XG4gICAgICAgIGNvbnN0IHByb2ZpbGVzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnU3RydWN0dXJlRGVmaW5pdGlvbicgJiYgKCFyZXNvdXJjZS5iYXNlRGVmaW5pdGlvbiB8fCAhcmVzb3VyY2UuYmFzZURlZmluaXRpb24uZW5kc1dpdGgoJ0V4dGVuc2lvbicpKSk7XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbnMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdTdHJ1Y3R1cmVEZWZpbml0aW9uJyAmJiByZXNvdXJjZS5iYXNlRGVmaW5pdGlvbiAmJiByZXNvdXJjZS5iYXNlRGVmaW5pdGlvbi5lbmRzV2l0aCgnRXh0ZW5zaW9uJykpO1xuICAgICAgICBjb25zdCBjYXBhYmlsaXR5U3RhdGVtZW50cyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0NhcGFiaWxpdHlTdGF0ZW1lbnQnKTtcbiAgICAgICAgY29uc3Qgb3RoZXJSZXNvdXJjZXMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiBtYWluUmVzb3VyY2VUeXBlcy5pbmRleE9mKHJlc291cmNlLnJlc291cmNlVHlwZSkgPCAwKTtcblxuICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZSkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXhQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL2luZGV4Lm1kJyk7XG5cbiAgICAgICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRpb25Db250ZW50ID0gJyMjIyBEZXNjcmlwdGlvblxcblxcbicgKyBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlc2NyaXB0aW9uICsgJ1xcblxcbic7XG4gICAgICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoaW5kZXhQYXRoLCBkZXNjcmlwdGlvbkNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWN0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yc0RhdGEgPSBfLm1hcChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhY3QsIChjb250YWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kRW1haWwgPSBfLmZpbmQoY29udGFjdC50ZWxlY29tLCAodGVsZWNvbSkgPT4gdGVsZWNvbS5zeXN0ZW0gPT09ICdlbWFpbCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvbnRhY3QubmFtZSwgZm91bmRFbWFpbCA/IGA8YSBocmVmPVwibWFpbHRvOiR7Zm91bmRFbWFpbC52YWx1ZX1cIj4ke2ZvdW5kRW1haWwudmFsdWV9PC9hPmAgOiAnJ107XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yc0NvbnRlbnQgPSAnIyMjIEF1dGhvcnNcXG5cXG4nICsgdGhpcy5jcmVhdGVUYWJsZUZyb21BcnJheShbJ05hbWUnLCAnRW1haWwnXSwgYXV0aG9yc0RhdGEpICsgJ1xcblxcbic7XG4gICAgICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoaW5kZXhQYXRoLCBhdXRob3JzQ29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgcHJvZmlsZXNEYXRhID0gXy5jaGFpbihwcm9maWxlcylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChwcm9maWxlKSA9PiBwcm9maWxlLm5hbWUpXG4gICAgICAgICAgICAgICAgLm1hcCgocHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2A8YSBocmVmPVwiU3RydWN0dXJlRGVmaW5pdGlvbi0ke3Byb2ZpbGUuaWR9Lmh0bWxcIj4ke3Byb2ZpbGUubmFtZX08L2E+YCwgcHJvZmlsZS5kZXNjcmlwdGlvbiB8fCAnJ107XG4gICAgICAgICAgICAgICAgfSkudmFsdWUoKTtcbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzVGFibGUgPSB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnTmFtZScsICdEZXNjcmlwdGlvbiddLCBwcm9maWxlc0RhdGEpO1xuICAgICAgICAgICAgY29uc3QgcHJvZmlsZXNQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3Byb2ZpbGVzLm1kJyk7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhwcm9maWxlc1BhdGgsICcjIyMgUHJvZmlsZXNcXG5cXG4nICsgcHJvZmlsZXNUYWJsZSArICdcXG5cXG4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChleHRlbnNpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dERhdGEgPSBfLmNoYWluKGV4dGVuc2lvbnMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24ubmFtZSlcbiAgICAgICAgICAgICAgICAubWFwKChleHRlbnNpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtgPGEgaHJlZj1cIlN0cnVjdHVyZURlZmluaXRpb24tJHtleHRlbnNpb24uaWR9Lmh0bWxcIj4ke2V4dGVuc2lvbi5uYW1lfTwvYT5gLCBleHRlbnNpb24uZGVzY3JpcHRpb24gfHwgJyddO1xuICAgICAgICAgICAgICAgIH0pLnZhbHVlKCk7XG4gICAgICAgICAgICBjb25zdCBleHRDb250ZW50ID0gdGhpcy5jcmVhdGVUYWJsZUZyb21BcnJheShbJ05hbWUnLCAnRGVzY3JpcHRpb24nXSwgZXh0RGF0YSk7XG4gICAgICAgICAgICBjb25zdCBleHRQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3Byb2ZpbGVzLm1kJyk7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhleHRQYXRoLCAnIyMjIEV4dGVuc2lvbnNcXG5cXG4nICsgZXh0Q29udGVudCArICdcXG5cXG4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZVNldHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHZzQ29udGVudCA9ICcjIyMgVmFsdWUgU2V0c1xcblxcbic7XG4gICAgICAgICAgICBjb25zdCB2c1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdGVybWlub2xvZ3kubWQnKTtcblxuICAgICAgICAgICAgXy5jaGFpbih2YWx1ZVNldHMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgodmFsdWVTZXQpID0+IHZhbHVlU2V0LnRpdGxlIHx8IHZhbHVlU2V0Lm5hbWUpXG4gICAgICAgICAgICAgICAgLmVhY2goKHZhbHVlU2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZzQ29udGVudCArPSBgLSBbJHt2YWx1ZVNldC50aXRsZSB8fCB2YWx1ZVNldC5uYW1lfV0oVmFsdWVTZXQtJHt2YWx1ZVNldC5pZH0uaHRtbClcXG5gO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyh2c1BhdGgsIHZzQ29udGVudCArICdcXG5cXG4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2RlU3lzdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgY3NDb250ZW50ID0gJyMjIyBDb2RlIFN5c3RlbXNcXG5cXG4nO1xuICAgICAgICAgICAgY29uc3QgY3NQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3Rlcm1pbm9sb2d5Lm1kJyk7XG5cbiAgICAgICAgICAgIF8uY2hhaW4oY29kZVN5c3RlbXMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgoY29kZVN5c3RlbSkgPT4gY29kZVN5c3RlbS50aXRsZSB8fCBjb2RlU3lzdGVtLm5hbWUpXG4gICAgICAgICAgICAgICAgLmVhY2goKGNvZGVTeXN0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY3NDb250ZW50ICs9IGAtIFske2NvZGVTeXN0ZW0udGl0bGUgfHwgY29kZVN5c3RlbS5uYW1lfV0oVmFsdWVTZXQtJHtjb2RlU3lzdGVtLmlkfS5odG1sKVxcbmA7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGNzUGF0aCwgY3NDb250ZW50ICsgJ1xcblxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhcGFiaWxpdHlTdGF0ZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGNzRGF0YSA9IF8uY2hhaW4oY2FwYWJpbGl0eVN0YXRlbWVudHMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgoY2FwYWJpbGl0eVN0YXRlbWVudCkgPT4gY2FwYWJpbGl0eVN0YXRlbWVudC5uYW1lKVxuICAgICAgICAgICAgICAgIC5tYXAoKGNhcGFiaWxpdHlTdGF0ZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtgPGEgaHJlZj1cIkNhcGFiaWxpdHlTdGF0ZW1lbnQtJHtjYXBhYmlsaXR5U3RhdGVtZW50LmlkfS5odG1sXCI+JHtjYXBhYmlsaXR5U3RhdGVtZW50Lm5hbWV9PC9hPmAsIGNhcGFiaWxpdHlTdGF0ZW1lbnQuZGVzY3JpcHRpb24gfHwgJyddO1xuICAgICAgICAgICAgICAgIH0pLnZhbHVlKCk7XG4gICAgICAgICAgICBjb25zdCBjc0NvbnRlbnQgPSB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnTmFtZScsICdEZXNjcmlwdGlvbiddLCBjc0RhdGEpO1xuICAgICAgICAgICAgY29uc3QgY3NQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL2NhcHN0YXRlbWVudHMubWQnKTtcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGNzUGF0aCwgJyMjIyBDYXBhYmlsaXR5U3RhdGVtZW50c1xcblxcbicgKyBjc0NvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG90aGVyUmVzb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9EYXRhID0gXy5jaGFpbihvdGhlclJlc291cmNlcylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChyZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzcGxheSA9IHJlc291cmNlLnRpdGxlIHx8IHRoaXMuZ2V0RGlzcGxheU5hbWUocmVzb3VyY2UubmFtZSkgfHwgcmVzb3VyY2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyBkaXNwbGF5O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm1hcCgocmVzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSByZXNvdXJjZS50aXRsZSB8fCB0aGlzLmdldERpc3BsYXlOYW1lKHJlc291cmNlLm5hbWUpIHx8IHJlc291cmNlLmlkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Jlc291cmNlLnJlc291cmNlVHlwZSwgYDxhIGhyZWY9XCIke3Jlc291cmNlLnJlc291cmNlVHlwZX0tJHtyZXNvdXJjZS5pZH0uaHRtbFwiPiR7bmFtZX08L2E+YF07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgICAgIGNvbnN0IG9Db250ZW50ID0gdGhpcy5jcmVhdGVUYWJsZUZyb21BcnJheShbJ1R5cGUnLCAnTmFtZSddLCBvRGF0YSk7XG4gICAgICAgICAgICBjb25zdCBjc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvb3RoZXIubWQnKTtcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGNzUGF0aCwgJyMjIyBPdGhlciBSZXNvdXJjZXNcXG5cXG4nICsgb0NvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgd3JpdGVGaWxlc0ZvclJlc291cmNlcyhyb290UGF0aDogc3RyaW5nLCByZXNvdXJjZTogRG9tYWluUmVzb3VyY2UpIHtcbiAgICAgICAgaWYgKCFyZXNvdXJjZSB8fCAhcmVzb3VyY2UucmVzb3VyY2VUeXBlIHx8IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbnRyb1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIGBzb3VyY2UvcGFnZXMvX2luY2x1ZGVzLyR7cmVzb3VyY2UuaWR9LWludHJvLm1kYCk7XG4gICAgICAgIGNvbnN0IHNlYXJjaFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIGBzb3VyY2UvcGFnZXMvX2luY2x1ZGVzLyR7cmVzb3VyY2UuaWR9LXNlYXJjaC5tZGApO1xuICAgICAgICBjb25zdCBzdW1tYXJ5UGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgYHNvdXJjZS9wYWdlcy9faW5jbHVkZXMvJHtyZXNvdXJjZS5pZH0tc3VtbWFyeS5tZGApO1xuXG4gICAgICAgIGxldCBpbnRybyA9ICctLS1cXG4nICtcbiAgICAgICAgICAgIGB0aXRsZTogJHtyZXNvdXJjZS5yZXNvdXJjZVR5cGV9LSR7cmVzb3VyY2UuaWR9LWludHJvXFxuYCArXG4gICAgICAgICAgICAnbGF5b3V0OiBkZWZhdWx0XFxuJyArXG4gICAgICAgICAgICBgYWN0aXZlOiAke3Jlc291cmNlLnJlc291cmNlVHlwZX0tJHtyZXNvdXJjZS5pZH0taW50cm9cXG5gICtcbiAgICAgICAgICAgICctLS1cXG5cXG4nO1xuXG4gICAgICAgIGlmICgoPGFueT5yZXNvdXJjZSkuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGludHJvICs9ICg8YW55PnJlc291cmNlKS5kZXNjcmlwdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoaW50cm9QYXRoLCBpbnRybyk7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoc2VhcmNoUGF0aCwgJycpO1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHN1bW1hcnlQYXRoLCAnJyk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0U3R1M0NvbnRyb2woaW1wbGVtZW50YXRpb25HdWlkZTogU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUsIGJ1bmRsZTogU1RVM0J1bmRsZSwgdmVyc2lvbikge1xuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlUmVnZXggPSAvXiguKz8pXFwvSW1wbGVtZW50YXRpb25HdWlkZVxcLy4rJC9nbTtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsQmFzZU1hdGNoID0gY2Fub25pY2FsQmFzZVJlZ2V4LmV4ZWMoaW1wbGVtZW50YXRpb25HdWlkZS51cmwpO1xuICAgICAgICBjb25zdCBwYWNrYWdlSWRFeHRlbnNpb24gPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09IEdsb2JhbHMuZXh0ZW5zaW9uVXJsc1snZXh0ZW5zaW9uLWlnLXBhY2thZ2UtaWQnXSk7XG4gICAgICAgIGxldCBjYW5vbmljYWxCYXNlO1xuXG4gICAgICAgIGlmICghY2Fub25pY2FsQmFzZU1hdGNoIHx8IGNhbm9uaWNhbEJhc2VNYXRjaC5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlID0gaW1wbGVtZW50YXRpb25HdWlkZS51cmwuc3Vic3RyaW5nKDAsIGltcGxlbWVudGF0aW9uR3VpZGUudXJsLmxhc3RJbmRleE9mKCcvJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2Fub25pY2FsQmFzZSA9IGNhbm9uaWNhbEJhc2VNYXRjaFsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IEV4dHJhY3QgbnBtLW5hbWUgZnJvbSBJRyBleHRlbnNpb24uXG4gICAgICAgIC8vIGN1cnJlbnRseSwgSUcgcmVzb3VyY2UgaGFzIHRvIGJlIGluIFhNTCBmb3JtYXQgZm9yIHRoZSBJRyBQdWJsaXNoZXJcbiAgICAgICAgY29uc3QgY29udHJvbCA9IDxGaGlyQ29udHJvbD4ge1xuICAgICAgICAgICAgdG9vbDogJ2pla3lsbCcsXG4gICAgICAgICAgICBzb3VyY2U6ICdpbXBsZW1lbnRhdGlvbmd1aWRlLycgKyBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy54bWwnLFxuICAgICAgICAgICAgJ25wbS1uYW1lJzogcGFja2FnZUlkRXh0ZW5zaW9uICYmIHBhY2thZ2VJZEV4dGVuc2lvbi52YWx1ZVN0cmluZyA/IHBhY2thZ2VJZEV4dGVuc2lvbi52YWx1ZVN0cmluZyA6IGltcGxlbWVudGF0aW9uR3VpZGUuaWQgKyAnLW5wbScsXG4gICAgICAgICAgICBsaWNlbnNlOiAnQ0MwLTEuMCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUjQ6IEltcGxlbWVudGF0aW9uR3VpZGUubGljZW5zZVxuICAgICAgICAgICAgcGF0aHM6IHtcbiAgICAgICAgICAgICAgICBxYTogJ2dlbmVyYXRlZF9vdXRwdXQvcWEnLFxuICAgICAgICAgICAgICAgIHRlbXA6ICdnZW5lcmF0ZWRfb3V0cHV0L3RlbXAnLFxuICAgICAgICAgICAgICAgIG91dHB1dDogJ291dHB1dCcsXG4gICAgICAgICAgICAgICAgdHhDYWNoZTogJ2dlbmVyYXRlZF9vdXRwdXQvdHhDYWNoZScsXG4gICAgICAgICAgICAgICAgc3BlY2lmaWNhdGlvbjogJ2h0dHA6Ly9obDcub3JnL2ZoaXIvU1RVMycsXG4gICAgICAgICAgICAgICAgcGFnZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2ZyYW1ld29yaycsXG4gICAgICAgICAgICAgICAgICAgICdzb3VyY2UvcGFnZXMnXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFsgJ3NvdXJjZS9yZXNvdXJjZXMnIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYWdlczogWydwYWdlcyddLFxuICAgICAgICAgICAgJ2V4dGVuc2lvbi1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxuICAgICAgICAgICAgJ2FsbG93ZWQtZG9tYWlucyc6IFsnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20nXSxcbiAgICAgICAgICAgICdzY3QtZWRpdGlvbic6ICdodHRwOi8vc25vbWVkLmluZm8vc2N0LzczMTAwMDEyNDEwOCcsXG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlOiBjYW5vbmljYWxCYXNlLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAnTG9jYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcm9jZWR1cmVSZXF1ZXN0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT3JnYW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnTWVkaWNhdGlvblN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1NlYXJjaFBhcmFtZXRlcic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU3RydWN0dXJlRGVmaW5pdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLW1hcHBpbmdzJzogJ3NkLW1hcHBpbmdzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdzZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWRlZm5zJzogJ3NkLWRlZmluaXRpb25zLmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnSW1tdW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUGF0aWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZU1hcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJ3NjcmlwdCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3Byb2ZpbGVzJzogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb25jZXB0TWFwJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXInOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPcGVyYXRpb25EZWZpbml0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb2RlU3lzdGVtJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb21tdW5pY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQW55Jzoge1xuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZm9ybWF0JzogJ2Zvcm1hdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lclJvbGUnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdWYWx1ZVNldCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ2FwYWJpbGl0eVN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT2JzZXJ2YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb3VyY2VzOiB7fVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuZmhpclZlcnNpb24pIHtcbiAgICAgICAgICAgIGNvbnRyb2wudmVyc2lvbiA9IGltcGxlbWVudGF0aW9uR3VpZGUuZmhpclZlcnNpb247XG4gICAgICAgIH0gZWxzZSBpZiAodmVyc2lvbikgeyAgICAgICAgICAgICAgICAgICAgICAgLy8gVXNlIHRoZSB2ZXJzaW9uIG9mIHRoZSBGSElSIHNlcnZlciB0aGUgcmVzb3VyY2VzIGFyZSBjb21pbmcgZnJvbVxuICAgICAgICAgICAgY29udHJvbC52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLnZlcnNpb24pIHtcbiAgICAgICAgICAgIGNvbnRyb2xbJ2ZpeGVkLWJ1c2luZXNzLXZlcnNpb24nXSA9IGltcGxlbWVudGF0aW9uR3VpZGUudmVyc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCB0aGUgZGVwZW5kZW5jeUxpc3QgYmFzZWQgb24gdGhlIGV4dGVuc2lvbnMgaW4gdGhlIElHXG4gICAgICAgIGNvbnN0IGRlcGVuZGVuY3lFeHRlbnNpb25zID0gXy5maWx0ZXIoaW1wbGVtZW50YXRpb25HdWlkZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5Jyk7XG5cbiAgICAgICAgLy8gUjQgSW1wbGVtZW50YXRpb25HdWlkZS5kZXBlbmRzT25cbiAgICAgICAgY29udHJvbC5kZXBlbmRlbmN5TGlzdCA9IF8uY2hhaW4oZGVwZW5kZW5jeUV4dGVuc2lvbnMpXG4gICAgICAgICAgICAuZmlsdGVyKChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FeHRlbnNpb24gPSBfLmZpbmQoZGVwZW5kZW5jeUV4dGVuc2lvbi5leHRlbnNpb24sIChuZXh0KSA9PiBuZXh0LnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LW5hbWUnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAhIWxvY2F0aW9uRXh0ZW5zaW9uICYmICEhbG9jYXRpb25FeHRlbnNpb24udmFsdWVTdHJpbmcgJiYgISFuYW1lRXh0ZW5zaW9uICYmICEhbmFtZUV4dGVuc2lvbi52YWx1ZVN0cmluZztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FeHRlbnNpb24gPSA8RXh0ZW5zaW9uPiBfLmZpbmQoZGVwZW5kZW5jeUV4dGVuc2lvbi5leHRlbnNpb24sIChuZXh0KSA9PiBuZXh0LnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lRXh0ZW5zaW9uID0gPEV4dGVuc2lvbj4gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LW5hbWUnKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJzaW9uRXh0ZW5zaW9uID0gPEV4dGVuc2lvbj4gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LXZlcnNpb24nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiA8RmhpckNvbnRyb2xEZXBlbmRlbmN5PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkV4dGVuc2lvbiA/IGxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlVXJpIDogJycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVFeHRlbnNpb24gPyBuYW1lRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb25FeHRlbnNpb24gPyB2ZXJzaW9uRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC52YWx1ZSgpO1xuXG4gICAgICAgIC8vIERlZmluZSB0aGUgcmVzb3VyY2VzIGluIHRoZSBjb250cm9sIGFuZCB3aGF0IHRlbXBsYXRlcyB0aGV5IHNob3VsZCB1c2VcbiAgICAgICAgaWYgKGJ1bmRsZSAmJiBidW5kbGUuZW50cnkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlLmVudHJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSBidW5kbGUuZW50cnlbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBlbnRyeS5yZXNvdXJjZTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb250cm9sLnJlc291cmNlc1tyZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLycgKyByZXNvdXJjZS5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2U6IHJlc291cmNlLnJlc291cmNlVHlwZSArICctJyArIHJlc291cmNlLmlkICsgJy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgZGVmbnM6IHJlc291cmNlLnJlc291cmNlVHlwZSArICctJyArIHJlc291cmNlLmlkICsgJy1kZWZpbml0aW9ucy5odG1sJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRSNENvbnRyb2woaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlLCBidW5kbGU6IFI0QnVuZGxlLCB2ZXJzaW9uOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsQmFzZVJlZ2V4ID0gL14oLis/KVxcL0ltcGxlbWVudGF0aW9uR3VpZGVcXC8uKyQvZ207XG4gICAgICAgIGNvbnN0IGNhbm9uaWNhbEJhc2VNYXRjaCA9IGNhbm9uaWNhbEJhc2VSZWdleC5leGVjKGltcGxlbWVudGF0aW9uR3VpZGUudXJsKTtcbiAgICAgICAgbGV0IGNhbm9uaWNhbEJhc2U7XG5cbiAgICAgICAgaWYgKCFjYW5vbmljYWxCYXNlTWF0Y2ggfHwgY2Fub25pY2FsQmFzZU1hdGNoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5zdWJzdHJpbmcoMCwgaW1wbGVtZW50YXRpb25HdWlkZS51cmwubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlID0gY2Fub25pY2FsQmFzZU1hdGNoWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY3VycmVudGx5LCBJRyByZXNvdXJjZSBoYXMgdG8gYmUgaW4gWE1MIGZvcm1hdCBmb3IgdGhlIElHIFB1Ymxpc2hlclxuICAgICAgICBjb25zdCBjb250cm9sID0gPEZoaXJDb250cm9sPiB7XG4gICAgICAgICAgICB0b29sOiAnamVreWxsJyxcbiAgICAgICAgICAgIHNvdXJjZTogJ2ltcGxlbWVudGF0aW9uZ3VpZGUvJyArIGltcGxlbWVudGF0aW9uR3VpZGUuaWQgKyAnLnhtbCcsXG4gICAgICAgICAgICAnbnBtLW5hbWUnOiBpbXBsZW1lbnRhdGlvbkd1aWRlLnBhY2thZ2VJZCB8fCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy1ucG0nLFxuICAgICAgICAgICAgbGljZW5zZTogaW1wbGVtZW50YXRpb25HdWlkZS5saWNlbnNlIHx8ICdDQzAtMS4wJyxcbiAgICAgICAgICAgIHBhdGhzOiB7XG4gICAgICAgICAgICAgICAgcWE6ICdnZW5lcmF0ZWRfb3V0cHV0L3FhJyxcbiAgICAgICAgICAgICAgICB0ZW1wOiAnZ2VuZXJhdGVkX291dHB1dC90ZW1wJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6ICdvdXRwdXQnLFxuICAgICAgICAgICAgICAgIHR4Q2FjaGU6ICdnZW5lcmF0ZWRfb3V0cHV0L3R4Q2FjaGUnLFxuICAgICAgICAgICAgICAgIHNwZWNpZmljYXRpb246ICdodHRwOi8vaGw3Lm9yZy9maGlyL1I0LycsXG4gICAgICAgICAgICAgICAgcGFnZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2ZyYW1ld29yaycsXG4gICAgICAgICAgICAgICAgICAgICdzb3VyY2UvcGFnZXMnXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFsgJ3NvdXJjZS9yZXNvdXJjZXMnIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYWdlczogWydwYWdlcyddLFxuICAgICAgICAgICAgJ2V4dGVuc2lvbi1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxuICAgICAgICAgICAgJ2FsbG93ZWQtZG9tYWlucyc6IFsnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20nXSxcbiAgICAgICAgICAgICdzY3QtZWRpdGlvbic6ICdodHRwOi8vc25vbWVkLmluZm8vc2N0LzczMTAwMDEyNDEwOCcsXG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlOiBjYW5vbmljYWxCYXNlLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAnTG9jYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcm9jZWR1cmVSZXF1ZXN0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT3JnYW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnTWVkaWNhdGlvblN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1NlYXJjaFBhcmFtZXRlcic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU3RydWN0dXJlRGVmaW5pdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLW1hcHBpbmdzJzogJ3NkLW1hcHBpbmdzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdzZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWRlZm5zJzogJ3NkLWRlZmluaXRpb25zLmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnSW1tdW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUGF0aWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZU1hcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJ3NjcmlwdCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3Byb2ZpbGVzJzogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb25jZXB0TWFwJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXInOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPcGVyYXRpb25EZWZpbml0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb2RlU3lzdGVtJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb21tdW5pY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQW55Jzoge1xuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZm9ybWF0JzogJ2Zvcm1hdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lclJvbGUnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdWYWx1ZVNldCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ2FwYWJpbGl0eVN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT2JzZXJ2YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb3VyY2VzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmZoaXJWZXJzaW9uICYmIGltcGxlbWVudGF0aW9uR3VpZGUuZmhpclZlcnNpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29udHJvbC52ZXJzaW9uID0gaW1wbGVtZW50YXRpb25HdWlkZS5maGlyVmVyc2lvblswXTtcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJzaW9uKSB7ICAgICAgICAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHZlcnNpb24gb2YgdGhlIEZISVIgc2VydmVyIHRoZSByZXNvdXJjZXMgYXJlIGNvbWluZyBmcm9tXG4gICAgICAgICAgICBjb250cm9sLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUudmVyc2lvbikge1xuICAgICAgICAgICAgY29udHJvbFsnZml4ZWQtYnVzaW5lc3MtdmVyc2lvbiddID0gaW1wbGVtZW50YXRpb25HdWlkZS52ZXJzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udHJvbC5kZXBlbmRlbmN5TGlzdCA9IF8uY2hhaW4oaW1wbGVtZW50YXRpb25HdWlkZS5kZXBlbmRzT24pXG4gICAgICAgICAgICAuZmlsdGVyKChkZXBlbmRzT24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLWxvY2F0aW9uJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLW5hbWUnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAhIWxvY2F0aW9uRXh0ZW5zaW9uICYmICEhbG9jYXRpb25FeHRlbnNpb24udmFsdWVTdHJpbmcgJiYgISFuYW1lRXh0ZW5zaW9uICYmICEhbmFtZUV4dGVuc2lvbi52YWx1ZVN0cmluZztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKChkZXBlbmRzT24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLWxvY2F0aW9uJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLW5hbWUnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkV4dGVuc2lvbiA/IGxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVFeHRlbnNpb24gPyBuYW1lRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IGRlcGVuZHNPbi52ZXJzaW9uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudmFsdWUoKTtcblxuICAgICAgICAvLyBEZWZpbmUgdGhlIHJlc291cmNlcyBpbiB0aGUgY29udHJvbCBhbmQgd2hhdCB0ZW1wbGF0ZXMgdGhleSBzaG91bGQgdXNlXG4gICAgICAgIGlmIChidW5kbGUgJiYgYnVuZGxlLmVudHJ5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1bmRsZS5lbnRyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gYnVuZGxlLmVudHJ5W2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gZW50cnkucmVzb3VyY2U7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29udHJvbC5yZXNvdXJjZXNbcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy8nICsgcmVzb3VyY2UuaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICBiYXNlOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGRlZm5zOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICctZGVmaW5pdGlvbnMuaHRtbCdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0U3R1M1BhZ2VDb250ZW50KGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBQYWdlQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRFeHRlbnNpb24gPSBfLmZpbmQocGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWNvbnRlbnQnKTtcblxuICAgICAgICBpZiAoY29udGVudEV4dGVuc2lvbiAmJiBjb250ZW50RXh0ZW5zaW9uLnZhbHVlUmVmZXJlbmNlICYmIGNvbnRlbnRFeHRlbnNpb24udmFsdWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIHBhZ2Uuc291cmNlKSB7XG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBjb250ZW50RXh0ZW5zaW9uLnZhbHVlUmVmZXJlbmNlLnJlZmVyZW5jZTtcblxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZS5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZWQgPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWluZWQsIChuZXh0OiBEb21haW5SZXNvdXJjZSkgPT4gbmV4dC5pZCA9PT0gcmVmZXJlbmNlLnN1YnN0cmluZygxKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5ID0gY29udGFpbmVkICYmIGNvbnRhaW5lZC5yZXNvdXJjZVR5cGUgPT09ICdCaW5hcnknID8gPFNUVTNCaW5hcnk+IGNvbnRhaW5lZCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIGlmIChiaW5hcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBwYWdlLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IEJ1ZmZlci5mcm9tKGJpbmFyeS5jb250ZW50LCAnYmFzZTY0JykudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlU3R1M1BhZ2UocGFnZXNQYXRoOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBQYWdlQ29tcG9uZW50LCBsZXZlbDogbnVtYmVyLCB0b2NFbnRyaWVzOiBUYWJsZU9mQ29udGVudHNFbnRyeVtdKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gdGhpcy5nZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZSwgcGFnZSk7XG5cbiAgICAgICAgaWYgKHBhZ2Uua2luZCAhPT0gJ3RvYycgJiYgcGFnZUNvbnRlbnQgJiYgcGFnZUNvbnRlbnQuY29udGVudCkge1xuICAgICAgICAgICAgY29uc3QgbmV3UGFnZVBhdGggPSBwYXRoLmpvaW4ocGFnZXNQYXRoLCBwYWdlQ29udGVudC5maWxlTmFtZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSAnLS0tXFxuJyArXG4gICAgICAgICAgICAgICAgYHRpdGxlOiAke3BhZ2UudGl0bGV9XFxuYCArXG4gICAgICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xuICAgICAgICAgICAgICAgIGBhY3RpdmU6ICR7cGFnZS50aXRsZX1cXG5gICtcbiAgICAgICAgICAgICAgICAnLS0tXFxuXFxuJyArIHBhZ2VDb250ZW50LmNvbnRlbnQ7XG5cbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3UGFnZVBhdGgsIGNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGFuIGVudHJ5IHRvIHRoZSBUT0NcbiAgICAgICAgdG9jRW50cmllcy5wdXNoKHsgbGV2ZWw6IGxldmVsLCBmaWxlTmFtZTogcGFnZS5raW5kID09PSAncGFnZScgJiYgcGFnZUNvbnRlbnQgPyBwYWdlQ29udGVudC5maWxlTmFtZSA6IG51bGwsIHRpdGxlOiBwYWdlLnRpdGxlIH0pO1xuICAgICAgICBfLmVhY2gocGFnZS5wYWdlLCAoc3ViUGFnZSkgPT4gdGhpcy53cml0ZVN0dTNQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgc3ViUGFnZSwgbGV2ZWwgKyAxLCB0b2NFbnRyaWVzKSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0UGFnZUV4dGVuc2lvbihwYWdlOiBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudCkge1xuICAgICAgICBzd2l0Y2ggKHBhZ2UuZ2VuZXJhdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgICBjYXNlICdnZW5lcmF0ZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnLmh0bWwnO1xuICAgICAgICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy54bWwnO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy5tZCc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZVI0UGFnZShwYWdlc1BhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudCwgbGV2ZWw6IG51bWJlciwgdG9jRW50cmllczogVGFibGVPZkNvbnRlbnRzRW50cnlbXSkge1xuICAgICAgICBsZXQgZmlsZU5hbWU7XG5cbiAgICAgICAgaWYgKHBhZ2UubmFtZVJlZmVyZW5jZSAmJiBwYWdlLm5hbWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIHBhZ2UudGl0bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHBhZ2UubmFtZVJlZmVyZW5jZS5yZWZlcmVuY2U7XG5cbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2Uuc3RhcnRzV2l0aCgnIycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVkID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFpbmVkLCAoY29udGFpbmVkKSA9PiBjb250YWluZWQuaWQgPT09IHJlZmVyZW5jZS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmFyeSA9IGNvbnRhaW5lZCAmJiBjb250YWluZWQucmVzb3VyY2VUeXBlID09PSAnQmluYXJ5JyA/IDxSNEJpbmFyeT4gY29udGFpbmVkIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmFyeSAmJiBiaW5hcnkuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IHBhZ2UudGl0bGUucmVwbGFjZSgvIC9nLCAnXycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS5pbmRleE9mKCcuJykgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSB0aGlzLmdldFBhZ2VFeHRlbnNpb24ocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQYWdlUGF0aCA9IHBhdGguam9pbihwYWdlc1BhdGgsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5Q29udGVudCA9IEJ1ZmZlci5mcm9tKGJpbmFyeS5kYXRhLCAnYmFzZTY0JykudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9ICctLS1cXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGB0aXRsZTogJHtwYWdlLnRpdGxlfVxcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYGFjdGl2ZTogJHtwYWdlLnRpdGxlfVxcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYC0tLVxcblxcbiR7YmluYXJ5Q29udGVudH1gO1xuICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG5ld1BhZ2VQYXRoLCBjb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgYW4gZW50cnkgdG8gdGhlIFRPQ1xuICAgICAgICB0b2NFbnRyaWVzLnB1c2goeyBsZXZlbDogbGV2ZWwsIGZpbGVOYW1lOiBmaWxlTmFtZSwgdGl0bGU6IHBhZ2UudGl0bGUgfSk7XG5cbiAgICAgICAgXy5lYWNoKHBhZ2UucGFnZSwgKHN1YlBhZ2UpID0+IHRoaXMud3JpdGVSNFBhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBzdWJQYWdlLCBsZXZlbCArIDEsIHRvY0VudHJpZXMpKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aDogc3RyaW5nLCB0b2NFbnRyaWVzOiBUYWJsZU9mQ29udGVudHNFbnRyeVtdLCBzaG91bGRBdXRvR2VuZXJhdGU6IGJvb2xlYW4sIHBhZ2VDb250ZW50KSB7XG4gICAgICAgIGNvbnN0IHRvY1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdG9jLm1kJyk7XG4gICAgICAgIGxldCB0b2NDb250ZW50ID0gJyc7XG5cbiAgICAgICAgaWYgKHNob3VsZEF1dG9HZW5lcmF0ZSkge1xuICAgICAgICAgICAgXy5lYWNoKHRvY0VudHJpZXMsIChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZSA9IGVudHJ5LmZpbGVOYW1lO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lICYmIGZpbGVOYW1lLmVuZHNXaXRoKCcubWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZygwLCBmaWxlTmFtZS5sZW5ndGggLSAzKSArICcuaHRtbCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBlbnRyeS5sZXZlbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gJyAgICAnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gJyogJztcblxuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0b2NDb250ZW50ICs9IGA8YSBocmVmPVwiJHtmaWxlTmFtZX1cIj4ke2VudHJ5LnRpdGxlfTwvYT5cXG5gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gYCR7ZW50cnkudGl0bGV9XFxuYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChwYWdlQ29udGVudCAmJiBwYWdlQ29udGVudC5jb250ZW50KSB7XG4gICAgICAgICAgICB0b2NDb250ZW50ID0gcGFnZUNvbnRlbnQuY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b2NDb250ZW50KSB7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyh0b2NQYXRoLCB0b2NDb250ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlU3R1M1BhZ2VzKHJvb3RQYXRoOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgIGNvbnN0IHRvY0ZpbGVQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3RvYy5tZCcpO1xuICAgICAgICBjb25zdCB0b2NFbnRyaWVzID0gW107XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUucGFnZSkge1xuICAgICAgICAgICAgY29uc3QgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUucGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWF1dG8tZ2VuZXJhdGUtdG9jJyk7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRBdXRvR2VuZXJhdGUgPSBhdXRvR2VuZXJhdGVFeHRlbnNpb24gJiYgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uLnZhbHVlQm9vbGVhbiA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gdGhpcy5nZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5wYWdlKTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcycpO1xuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhwYWdlc1BhdGgpO1xuXG4gICAgICAgICAgICB0aGlzLndyaXRlU3R1M1BhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBpbXBsZW1lbnRhdGlvbkd1aWRlLnBhZ2UsIDEsIHRvY0VudHJpZXMpO1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aCwgdG9jRW50cmllcywgc2hvdWxkQXV0b0dlbmVyYXRlLCBwYWdlQ29udGVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZVI0UGFnZXMocm9vdFBhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgIGNvbnN0IHRvY0VudHJpZXMgPSBbXTtcbiAgICAgICAgbGV0IHNob3VsZEF1dG9HZW5lcmF0ZSA9IHRydWU7XG4gICAgICAgIGxldCByb290UGFnZUNvbnRlbnQ7XG4gICAgICAgIGxldCByb290UGFnZUZpbGVOYW1lO1xuXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24gJiYgaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGF1dG9HZW5lcmF0ZUV4dGVuc2lvbiA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWF1dG8tZ2VuZXJhdGUtdG9jJyk7XG4gICAgICAgICAgICBzaG91bGRBdXRvR2VuZXJhdGUgPSBhdXRvR2VuZXJhdGVFeHRlbnNpb24gJiYgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uLnZhbHVlQm9vbGVhbiA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcycpO1xuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhwYWdlc1BhdGgpO1xuXG4gICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UubmFtZVJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWVSZWZlcmVuY2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS5uYW1lUmVmZXJlbmNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZENvbnRhaW5lZCA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhaW5lZCwgKGNvbnRhaW5lZCkgPT4gY29udGFpbmVkLmlkID09PSBuYW1lUmVmZXJlbmNlLnJlZmVyZW5jZS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW5hcnkgPSBmb3VuZENvbnRhaW5lZCAmJiBmb3VuZENvbnRhaW5lZC5yZXNvdXJjZVR5cGUgPT09ICdCaW5hcnknID8gPFI0QmluYXJ5PiBmb3VuZENvbnRhaW5lZCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UGFnZUNvbnRlbnQgPSBuZXcgQnVmZmVyKGJpbmFyeS5kYXRhLCAnYmFzZTY0JykudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQYWdlRmlsZU5hbWUgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS50aXRsZS5yZXBsYWNlKC8gL2csICdfJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcm9vdFBhZ2VGaWxlTmFtZS5lbmRzV2l0aCgnLm1kJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UGFnZUZpbGVOYW1lICs9ICcubWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLndyaXRlUjRQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UsIDEsIHRvY0VudHJpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwZW5kIFRPQyBFbnRyaWVzIHRvIHRoZSB0b2MubWQgZmlsZSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aCwgdG9jRW50cmllcywgc2hvdWxkQXV0b0dlbmVyYXRlLCB7IGZpbGVOYW1lOiByb290UGFnZUZpbGVOYW1lLCBjb250ZW50OiByb290UGFnZUNvbnRlbnQgfSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBleHBvcnQoZm9ybWF0OiBzdHJpbmcsIGV4ZWN1dGVJZ1B1Ymxpc2hlcjogYm9vbGVhbiwgdXNlVGVybWlub2xvZ3lTZXJ2ZXI6IGJvb2xlYW4sIHVzZUxhdGVzdDogYm9vbGVhbiwgZG93bmxvYWRPdXRwdXQ6IGJvb2xlYW4sIGluY2x1ZGVJZ1B1Ymxpc2hlckphcjogYm9vbGVhbiwgdGVzdENhbGxiYWNrPzogKG1lc3NhZ2UsIGVycj8pID0+IHZvaWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJ1bmRsZUV4cG9ydGVyID0gbmV3IEJ1bmRsZUV4cG9ydGVyKHRoaXMuZmhpclNlcnZlckJhc2UsIHRoaXMuZmhpclNlcnZlcklkLCB0aGlzLmZoaXJWZXJzaW9uLCB0aGlzLmZoaXIsIHRoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkKTtcbiAgICAgICAgICAgIGNvbnN0IGlzWG1sID0gZm9ybWF0ID09PSAneG1sJyB8fCBmb3JtYXQgPT09ICdhcHBsaWNhdGlvbi94bWwnIHx8IGZvcm1hdCA9PT0gJ2FwcGxpY2F0aW9uL2ZoaXIreG1sJztcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9ICghaXNYbWwgPyAnLmpzb24nIDogJy54bWwnKTtcbiAgICAgICAgICAgIGNvbnN0IGhvbWVkaXIgPSByZXF1aXJlKCdvcycpLmhvbWVkaXIoKTtcbiAgICAgICAgICAgIGNvbnN0IGZoaXJTZXJ2ZXJDb25maWcgPSBfLmZpbmQoZmhpckNvbmZpZy5zZXJ2ZXJzLCAoc2VydmVyOiBGaGlyQ29uZmlnU2VydmVyKSA9PiBzZXJ2ZXIuaWQgPT09IHRoaXMuZmhpclNlcnZlcklkKTtcbiAgICAgICAgICAgIGxldCBjb250cm9sO1xuICAgICAgICAgICAgbGV0IGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZTtcblxuICAgICAgICAgICAgdGhpcy5sb2cuaW5mbyhgU3RhcnRpbmcgZXhwb3J0IG9mIEhUTUwgcGFja2FnZS4gSG9tZSBkaXJlY3RvcnkgaXMgJHtob21lZGlyfWApO1xuXG4gICAgICAgICAgICB0bXAuZGlyKCh0bXBEaXJFcnIsIHJvb3RQYXRoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRtcERpckVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5lcnJvcih0bXBEaXJFcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyBhIHRlbXBvcmFyeSBkaXJlY3Rvcnk6ICcgKyB0bXBEaXJFcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnaWcuanNvbicpO1xuICAgICAgICAgICAgICAgIGxldCBidW5kbGU6IEJ1bmRsZTtcblxuICAgICAgICAgICAgICAgIHRoaXMucGFja2FnZUlkID0gcm9vdFBhdGguc3Vic3RyaW5nKHJvb3RQYXRoLmxhc3RJbmRleE9mKHBhdGguc2VwKSArIDEpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5wYWNrYWdlSWQpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0NyZWF0ZWQgdGVtcCBkaXJlY3RvcnkuIFJldHJpZXZpbmcgcmVzb3VyY2VzIGZvciBpbXBsZW1lbnRhdGlvbiBndWlkZS4nKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBQcmVwYXJlIElHIFB1Ymxpc2hlciBwYWNrYWdlXG4gICAgICAgICAgICAgICAgICAgIGJ1bmRsZUV4cG9ydGVyLmdldEJ1bmRsZShmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidW5kbGUgPSA8QnVuZGxlPiByZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlc0RpciA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9yZXNvdXJjZXMnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ1Jlc291cmNlcyByZXRyaWV2ZWQuIFBhY2thZ2luZy4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlLmVudHJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gYnVuZGxlLmVudHJ5W2ldLnJlc291cmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGVhblJlc291cmNlID0gQnVuZGxlRXhwb3J0ZXIuY2xlYW51cFJlc291cmNlKHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VUeXBlID0gcmVzb3VyY2UucmVzb3VyY2VUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHJlc291cmNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZURpciA9IHBhdGguam9pbihyZXNvdXJjZXNEaXIsIHJlc291cmNlVHlwZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc291cmNlUGF0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb3VyY2VDb250ZW50ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScgJiYgaWQgPT09IHRoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UgPSByZXNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEltcGxlbWVudGF0aW9uR3VpZGUgbXVzdCBiZSBnZW5lcmF0ZWQgYXMgYW4geG1sIGZpbGUgZm9yIHRoZSBJRyBQdWJsaXNoZXIgaW4gU1RVMy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1htbCAmJiByZXNvdXJjZVR5cGUgIT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoY2xlYW5SZXNvdXJjZSwgbnVsbCwgJ1xcdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VQYXRoID0gcGF0aC5qb2luKHJlc291cmNlRGlyLCBpZCArICcuanNvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDb250ZW50ID0gdGhpcy5maGlyLm9ialRvWG1sKGNsZWFuUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDb250ZW50ID0gdmtiZWF1dGlmeS54bWwocmVzb3VyY2VDb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlUGF0aCA9IHBhdGguam9pbihyZXNvdXJjZURpciwgaWQgKyAnLnhtbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhyZXNvdXJjZURpcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMocmVzb3VyY2VQYXRoLCByZXNvdXJjZUNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGltcGxlbWVudGF0aW9uIGd1aWRlIHdhcyBub3QgZm91bmQgaW4gdGhlIGJ1bmRsZSByZXR1cm5lZCBieSB0aGUgc2VydmVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA9PT0gJ3N0dTMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2wgPSB0aGlzLmdldFN0dTNDb250cm9sKGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSwgPFNUVTNCdW5kbGU+PGFueT4gYnVuZGxlLCB0aGlzLmdldEZoaXJDb250cm9sVmVyc2lvbihmaGlyU2VydmVyQ29uZmlnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbCA9IHRoaXMuZ2V0UjRDb250cm9sKGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSwgPFI0QnVuZGxlPjxhbnk+IGJ1bmRsZSwgdGhpcy5nZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERlcGVuZGVuY2llcyhjb250cm9sLCBpc1htbCwgcmVzb3VyY2VzRGlyLCB0aGlzLmZoaXIsIGZoaXJTZXJ2ZXJDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBjb250ZW50cyBvZiB0aGUgaWctcHVibGlzaGVyLXRlbXBsYXRlIGZvbGRlciB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vJywgJ2lnLXB1Ymxpc2hlci10ZW1wbGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmNvcHlTeW5jKHRlbXBsYXRlUGF0aCwgcm9vdFBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV3JpdGUgdGhlIGlnLmpzb24gZmlsZSB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sQ29udGVudCA9IEpTT04uc3RyaW5naWZ5KGNvbnRyb2wsIG51bGwsICdcXHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGNvbnRyb2xQYXRoLCBjb250cm9sQ29udGVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXcml0ZSB0aGUgaW50cm8sIHN1bW1hcnkgYW5kIHNlYXJjaCBNRCBmaWxlcyBmb3IgZWFjaCByZXNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChidW5kbGUuZW50cnksIChlbnRyeSkgPT4gdGhpcy53cml0ZUZpbGVzRm9yUmVzb3VyY2VzKHJvb3RQYXRoLCBlbnRyeS5yZXNvdXJjZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUZW1wbGF0ZXMocm9vdFBhdGgsIGJ1bmRsZSwgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gPT09ICdzdHUzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlU3R1M1BhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JpdGVSNFBhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0RvbmUgYnVpbGRpbmcgcGFja2FnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SWdQdWJsaXNoZXIodXNlTGF0ZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoaWdQdWJsaXNoZXJMb2NhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlSWdQdWJsaXNoZXJKYXIgJiYgaWdQdWJsaXNoZXJMb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdDb3B5aW5nIElHIFB1Ymxpc2hlciBKQVIgdG8gd29ya2luZyBkaXJlY3RvcnkuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGphckZpbGVOYW1lID0gaWdQdWJsaXNoZXJMb2NhdGlvbi5zdWJzdHJpbmcoaWdQdWJsaXNoZXJMb2NhdGlvbi5sYXN0SW5kZXhPZihwYXRoLnNlcCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdEphclBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIGphckZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weVN5bmMoaWdQdWJsaXNoZXJMb2NhdGlvbiwgZGVzdEphclBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhlY3V0ZUlnUHVibGlzaGVyIHx8ICFpZ1B1Ymxpc2hlckxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2NvbXBsZXRlJywgJ0RvbmUuIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvd25sb2FkIHRoZSBwYWNrYWdlIGluIGEgbW9tZW50LicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RDYWxsYmFjayhyb290UGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVwbG95RGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3d3d3Jvb3QvaWdzJywgdGhpcy5maGlyU2VydmVySWQsIGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhkZXBsb3lEaXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWdQdWJsaXNoZXJWZXJzaW9uID0gdXNlTGF0ZXN0ID8gJ2xhdGVzdCcgOiAnZGVmYXVsdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvY2VzcyA9IHNlcnZlckNvbmZpZy5qYXZhTG9jYXRpb24gfHwgJ2phdmEnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGphclBhcmFtcyA9IFsnLWphcicsIGlnUHVibGlzaGVyTG9jYXRpb24sICctaWcnLCBjb250cm9sUGF0aF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZVRlcm1pbm9sb2d5U2VydmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGphclBhcmFtcy5wdXNoKCctdHgnLCAnTi9BJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCBgUnVubmluZyAke2lnUHVibGlzaGVyVmVyc2lvbn0gSUcgUHVibGlzaGVyOiAke2phclBhcmFtcy5qb2luKCcgJyl9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgU3Bhd25pbmcgRkhJUiBJRyBQdWJsaXNoZXIgSmF2YSBwcm9jZXNzIGF0ICR7cHJvY2Vzc30gd2l0aCBwYXJhbXMgJHtqYXJQYXJhbXN9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZ1B1Ymxpc2hlclByb2Nlc3MgPSBzcGF3bihwcm9jZXNzLCBqYXJQYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQdWJsaXNoZXJQcm9jZXNzLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSh0bXAudG1wZGlyLCAnWFhYJykucmVwbGFjZShob21lZGlyLCAnWFhYJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgJiYgbWVzc2FnZS50cmltKCkucmVwbGFjZSgvXFwuL2csICcnKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUHVibGlzaGVyUHJvY2Vzcy5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UodG1wLnRtcGRpciwgJ1hYWCcpLnJlcGxhY2UoaG9tZWRpciwgJ1hYWCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudHJpbSgpLnJlcGxhY2UoL1xcLi9nLCAnJykgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Mub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0Vycm9yIGV4ZWN1dGluZyBGSElSIElHIFB1Ymxpc2hlcjogJyArIGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2Vycm9yJywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Mub24oJ2V4aXQnLCAoY29kZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgSUcgUHVibGlzaGVyIGlzIGRvbmUgZXhlY3V0aW5nIGZvciAke3Jvb3RQYXRofWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0lHIFB1Ymxpc2hlciBmaW5pc2hlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdXb25cXCd0IGNvcHkgb3V0cHV0IHRvIGRlcGxveW1lbnQgcGF0aC4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2NvbXBsZXRlJywgJ0RvbmUuIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvd25sb2FkIHRoZSBwYWNrYWdlIGluIGEgbW9tZW50LicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnQ29weWluZyBvdXRwdXQgdG8gZGVwbG95bWVudCBwYXRoLicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZWRQYXRoID0gcGF0aC5yZXNvbHZlKHJvb3RQYXRoLCAnZ2VuZXJhdGVkX291dHB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9IHBhdGgucmVzb2x2ZShyb290UGF0aCwgJ291dHB1dCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgRGVsZXRpbmcgY29udGVudCBnZW5lcmF0ZWQgYnkgaWcgcHVibGlzaGVyIGluICR7Z2VuZXJhdGVkUGF0aH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW1wdHlEaXIoZ2VuZXJhdGVkUGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYENvcHlpbmcgb3V0cHV0IGZyb20gJHtvdXRwdXRQYXRofSB0byAke2RlcGxveURpcn1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weShvdXRwdXRQYXRoLCBkZXBsb3lEaXIsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2Vycm9yJywgJ0Vycm9yIGNvcHlpbmcgY29udGVudHMgdG8gZGVwbG95bWVudCBwYXRoLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmFsTWVzc2FnZSA9IGBEb25lIGV4ZWN1dGluZyB0aGUgRkhJUiBJRyBQdWJsaXNoZXIuIFlvdSBtYXkgdmlldyB0aGUgSUcgPGEgaHJlZj1cIi9pbXBsZW1lbnRhdGlvbi1ndWlkZS8ke3RoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkfS92aWV3XCI+aGVyZTwvYT4uYCArIChkb3dubG9hZE91dHB1dCA/ICcgWW91IHdpbGwgYmUgcHJvbXB0ZWQgdG8gZG93bmxvYWQgdGhlIHBhY2thZ2UgaW4gYSBtb21lbnQuJyA6ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnY29tcGxldGUnLCBmaW5hbE1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZG93bmxvYWRPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYFVzZXIgaW5kaWNhdGVkIHRoZXkgZG9uJ3QgbmVlZCB0byBkb3dubG9hZC4gUmVtb3ZpbmcgdGVtcG9yYXJ5IGRpcmVjdG9yeSAke3Jvb3RQYXRofWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVtcHR5RGlyKHJvb3RQYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYERvbmUgcmVtb3ZpbmcgdGVtcG9yYXJ5IGRpcmVjdG9yeSAke3Jvb3RQYXRofWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdlcnJvcicsICdFcnJvciBkdXJpbmcgZXhwb3J0OiAnICsgZXJyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdENhbGxiYWNrKHJvb3RQYXRoLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==