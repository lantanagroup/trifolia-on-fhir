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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpREFBb0M7QUFlcEMsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixpQ0FBaUM7QUFDakMsMkJBQTJCO0FBQzNCLHlDQUF5QztBQVN6QyxxQ0FBd0M7QUFFeEMsbURBQThDO0FBRTlDLE1BQU0sVUFBVSxHQUFnQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELE1BQU0sWUFBWSxHQUFrQixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBUXpELE1BQWEsWUFBWTtJQVlyQixZQUFZLGNBQXNCLEVBQUUsWUFBb0IsRUFBRSxXQUFtQixFQUFFLElBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQWdCLEVBQUUscUJBQTZCO1FBWG5KLFFBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFZOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMscUJBQXFCLEdBQUcscUJBQXFCLENBQUM7SUFDdkQsQ0FBQztJQUVPLGNBQWMsQ0FBQyxJQUFzQjtRQUN6QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTztTQUNWO1FBRUQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDMUIsT0FBZ0IsSUFBSSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxPQUFPLEdBQUcs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QUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLHVCQUF1QixHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUUvRCxJQUFJLFlBQVksRUFBRTs0QkFDZCxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUMvQjtvQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDYixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBdjdCRCxvQ0F1N0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtGaGlyIGFzIEZoaXJNb2R1bGV9IGZyb20gJ2ZoaXIvZmhpcic7XHJcbmltcG9ydCB7U2VydmVyfSBmcm9tICdzb2NrZXQuaW8nO1xyXG5pbXBvcnQge3NwYXdufSBmcm9tICdjaGlsZF9wcm9jZXNzJztcclxuaW1wb3J0IHtcclxuICAgIERvbWFpblJlc291cmNlLFxyXG4gICAgSHVtYW5OYW1lLFxyXG4gICAgQnVuZGxlIGFzIFNUVTNCdW5kbGUsXHJcbiAgICBCaW5hcnkgYXMgU1RVM0JpbmFyeSxcclxuICAgIEltcGxlbWVudGF0aW9uR3VpZGUgYXMgU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUsXHJcbiAgICBQYWdlQ29tcG9uZW50LCBFeHRlbnNpb25cclxufSBmcm9tICcuLi8uLi9zcmMvYXBwL21vZGVscy9zdHUzL2ZoaXInO1xyXG5pbXBvcnQge1xyXG4gICAgQmluYXJ5IGFzIFI0QmluYXJ5LFxyXG4gICAgQnVuZGxlIGFzIFI0QnVuZGxlLFxyXG4gICAgSW1wbGVtZW50YXRpb25HdWlkZSBhcyBSNEltcGxlbWVudGF0aW9uR3VpZGUsXHJcbiAgICBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudFxyXG59IGZyb20gJy4uLy4uL3NyYy9hcHAvbW9kZWxzL3I0L2ZoaXInO1xyXG5pbXBvcnQgKiBhcyBsb2c0anMgZnJvbSAnbG9nNGpzJztcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcclxuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcclxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xyXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnY29uZmlnJztcclxuaW1wb3J0ICogYXMgdG1wIGZyb20gJ3RtcCc7XHJcbmltcG9ydCAqIGFzIHZrYmVhdXRpZnkgZnJvbSAndmtiZWF1dGlmeSc7XHJcbmltcG9ydCB7XHJcbiAgICBGaGlyLFxyXG4gICAgRmhpckNvbmZpZyxcclxuICAgIEZoaXJDb25maWdTZXJ2ZXIsXHJcbiAgICBGaGlyQ29udHJvbCxcclxuICAgIEZoaXJDb250cm9sRGVwZW5kZW5jeSxcclxuICAgIFNlcnZlckNvbmZpZ1xyXG59IGZyb20gJy4uL2NvbnRyb2xsZXJzL21vZGVscyc7XHJcbmltcG9ydCB7QnVuZGxlRXhwb3J0ZXJ9IGZyb20gJy4vYnVuZGxlJztcclxuaW1wb3J0IEJ1bmRsZSA9IEZoaXIuQnVuZGxlO1xyXG5pbXBvcnQge0dsb2JhbHN9IGZyb20gJy4uLy4uL3NyYy9hcHAvZ2xvYmFscyc7XHJcblxyXG5jb25zdCBmaGlyQ29uZmlnID0gPEZoaXJDb25maWc+IGNvbmZpZy5nZXQoJ2ZoaXInKTtcclxuY29uc3Qgc2VydmVyQ29uZmlnID0gPFNlcnZlckNvbmZpZz4gY29uZmlnLmdldCgnc2VydmVyJyk7XHJcblxyXG5pbnRlcmZhY2UgVGFibGVPZkNvbnRlbnRzRW50cnkge1xyXG4gICAgbGV2ZWw6IG51bWJlcjtcclxuICAgIGZpbGVOYW1lOiBzdHJpbmc7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSHRtbEV4cG9ydGVyIHtcclxuICAgIHJlYWRvbmx5IGxvZyA9IGxvZzRqcy5nZXRMb2dnZXIoKTtcclxuICAgIHJlYWRvbmx5IGZoaXJTZXJ2ZXJCYXNlOiBzdHJpbmc7XHJcbiAgICByZWFkb25seSBmaGlyU2VydmVySWQ6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGZoaXJWZXJzaW9uOiBzdHJpbmc7XHJcbiAgICByZWFkb25seSBmaGlyOiBGaGlyTW9kdWxlO1xyXG4gICAgcmVhZG9ubHkgaW86IFNlcnZlcjtcclxuICAgIHJlYWRvbmx5IHNvY2tldElkOiBzdHJpbmc7XHJcbiAgICByZWFkb25seSBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIHBhY2thZ2VJZDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZoaXJTZXJ2ZXJCYXNlOiBzdHJpbmcsIGZoaXJTZXJ2ZXJJZDogc3RyaW5nLCBmaGlyVmVyc2lvbjogc3RyaW5nLCBmaGlyOiBGaGlyTW9kdWxlLCBpbzogU2VydmVyLCBzb2NrZXRJZDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZmhpclNlcnZlckJhc2UgPSBmaGlyU2VydmVyQmFzZTtcclxuICAgICAgICB0aGlzLmZoaXJTZXJ2ZXJJZCA9IGZoaXJTZXJ2ZXJJZDtcclxuICAgICAgICB0aGlzLmZoaXJWZXJzaW9uID0gZmhpclZlcnNpb247XHJcbiAgICAgICAgdGhpcy5maGlyID0gZmhpcjtcclxuICAgICAgICB0aGlzLmlvID0gaW87XHJcbiAgICAgICAgdGhpcy5zb2NrZXRJZCA9IHNvY2tldElkO1xyXG4gICAgICAgIHRoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkID0gaW1wbGVtZW50YXRpb25HdWlkZUlkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0RGlzcGxheU5hbWUobmFtZTogc3RyaW5nfEh1bWFuTmFtZSk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxzdHJpbmc+IG5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGlzcGxheSA9IG5hbWUuZmFtaWx5O1xyXG5cclxuICAgICAgICBpZiAobmFtZS5naXZlbikge1xyXG4gICAgICAgICAgICBpZiAoZGlzcGxheSkge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheSArPSAnLCAnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkaXNwbGF5ICs9IG5hbWUuZ2l2ZW4uam9pbignICcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRpc3BsYXk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVGFibGVGcm9tQXJyYXkoaGVhZGVycywgZGF0YSkge1xyXG4gICAgICAgIGxldCBvdXRwdXQgPSAnPHRhYmxlPlxcbjx0aGVhZD5cXG48dHI+XFxuJztcclxuXHJcbiAgICAgICAgXy5lYWNoKGhlYWRlcnMsIChoZWFkZXIpID0+IHtcclxuICAgICAgICAgICAgb3V0cHV0ICs9IGA8dGg+JHtoZWFkZXJ9PC90aD5cXG5gO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvdXRwdXQgKz0gJzwvdHI+XFxuPC90aGVhZD5cXG48dGJvZHk+XFxuJztcclxuXHJcbiAgICAgICAgXy5lYWNoKGRhdGEsIChyb3c6IHN0cmluZ1tdKSA9PiB7XHJcbiAgICAgICAgICAgIG91dHB1dCArPSAnPHRyPlxcbic7XHJcblxyXG4gICAgICAgICAgICBfLmVhY2gocm93LCAoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGA8dGQ+JHtjZWxsfTwvdGQ+XFxuYDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBvdXRwdXQgKz0gJzwvdHI+XFxuJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3V0cHV0ICs9ICc8L3Rib2R5PlxcbjwvdGFibGU+XFxuJztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbmRTb2NrZXRNZXNzYWdlKHN0YXR1cywgbWVzc2FnZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5zb2NrZXRJZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZy5lcnJvcignV29uXFwndCBzZW5kIHNvY2tldCBtZXNzYWdlIGZvciBleHBvcnQgYmVjYXVzZSB0aGUgb3JpZ2luYWwgcmVxdWVzdCBkaWQgbm90IHNwZWNpZnkgYSBzb2NrZXRJZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pbykge1xyXG4gICAgICAgICAgICB0aGlzLmlvLnRvKHRoaXMuc29ja2V0SWQpLmVtaXQoJ2h0bWwtZXhwb3J0Jywge1xyXG4gICAgICAgICAgICAgICAgcGFja2FnZUlkOiB0aGlzLnBhY2thZ2VJZCxcclxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRJZ1B1Ymxpc2hlcih1c2VMYXRlc3Q6IGJvb2xlYW4pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9ICdvcmcuaGw3LmZoaXIuaWdwdWJsaXNoZXIuamFyJztcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vaWctcHVibGlzaGVyJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRGaWxlUGF0aCA9IHBhdGguam9pbihkZWZhdWx0UGF0aCwgZmlsZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVzZUxhdGVzdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoJ1JlcXVlc3QgdG8gZ2V0IGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyLiBSZXRyaWV2aW5nIGZyb206ICcgKyBmaGlyQ29uZmlnLmxhdGVzdFB1Ymxpc2hlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnRG93bmxvYWRpbmcgbGF0ZXN0IEZISVIgSUcgcHVibGlzaGVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogQ2hlY2sgaHR0cDovL2J1aWxkLmZoaXIub3JnL3ZlcnNpb24uaW5mbyBmaXJzdFxyXG5cclxuICAgICAgICAgICAgICAgIHJwKGZoaXJDb25maWcubGF0ZXN0UHVibGlzaGVyLCB7IGVuY29kaW5nOiBudWxsIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoJ1N1Y2Nlc3NmdWxseSBkb3dubG9hZGVkIGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgUHVibGlzaGVyLiBFbnN1cmluZyBsYXRlc3QgZGlyZWN0b3J5IGV4aXN0cycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0UGF0aCA9IHBhdGguam9pbihkZWZhdWx0UGF0aCwgJ2xhdGVzdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKGxhdGVzdFBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmYgPSBCdWZmZXIuZnJvbShyZXN1bHRzLCAndXRmOCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3RGaWxlUGF0aCA9IHBhdGguam9pbihsYXRlc3RQYXRoLCBmaWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZygnU2F2aW5nIEZISVIgSUcgcHVibGlzaGVyIHRvICcgKyBsYXRlc3RGaWxlUGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGxhdGVzdEZpbGVQYXRoLCBidWZmKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobGF0ZXN0RmlsZVBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoYEVycm9yIGdldHRpbmcgbGF0ZXN0IHZlcnNpb24gb2YgRkhJUiBJRyBwdWJsaXNoZXI6ICR7ZXJyfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdFbmNvdW50ZXJlZCBlcnJvciBkb3dubG9hZGluZyBsYXRlc3QgSUcgcHVibGlzaGVyLCB3aWxsIHVzZSBwcmUtbG9hZGVkL2RlZmF1bHQgSUcgcHVibGlzaGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGVmYXVsdEZpbGVQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdVc2luZyBidWlsdC1pbiB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyIGZvciBleHBvcnQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ1VzaW5nIGV4aXN0aW5nL2RlZmF1bHQgdmVyc2lvbiBvZiBGSElSIElHIHB1Ymxpc2hlcicpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkZWZhdWx0RmlsZVBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0Rpcjogc3RyaW5nLCBleHRlbnNpb25GaWxlTmFtZTogc3RyaW5nLCBpc1htbDogYm9vbGVhbiwgZmhpcjogRmhpck1vZHVsZSkge1xyXG4gICAgICAgIGNvbnN0IHNvdXJjZUV4dGVuc2lvbnNEaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vc3JjL2Fzc2V0cy9zdHUzL2V4dGVuc2lvbnMnKTtcclxuICAgICAgICBjb25zdCBzb3VyY2VFeHRlbnNpb25GaWxlTmFtZSA9IHBhdGguam9pbihzb3VyY2VFeHRlbnNpb25zRGlyLCBleHRlbnNpb25GaWxlTmFtZSk7XHJcbiAgICAgICAgbGV0IGRlc3RFeHRlbnNpb25GaWxlTmFtZSA9IHBhdGguam9pbihkZXN0RXh0ZW5zaW9uc0RpciwgZXh0ZW5zaW9uRmlsZU5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIWlzWG1sKSB7XHJcbiAgICAgICAgICAgIGZzLmNvcHlTeW5jKHNvdXJjZUV4dGVuc2lvbkZpbGVOYW1lLCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbkpzb24gPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlRXh0ZW5zaW9uRmlsZU5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvblhtbCA9IGZoaXIuanNvblRvWG1sKGV4dGVuc2lvbkpzb24pO1xyXG5cclxuICAgICAgICAgICAgZGVzdEV4dGVuc2lvbkZpbGVOYW1lID0gZGVzdEV4dGVuc2lvbkZpbGVOYW1lLnN1YnN0cmluZygwLCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUuaW5kZXhPZignLmpzb24nKSkgKyAnLnhtbCc7XHJcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGVzdEV4dGVuc2lvbkZpbGVOYW1lLCBleHRlbnNpb25YbWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBnZXREZXBlbmRlbmNpZXMoY29udHJvbCwgaXNYbWw6IGJvb2xlYW4sIHJlc291cmNlc0Rpcjogc3RyaW5nLCBmaGlyOiBGaGlyTW9kdWxlLCBmaGlyU2VydmVyQ29uZmlnOiBGaGlyQ29uZmlnU2VydmVyKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBjb25zdCBpc1N0dTMgPSBmaGlyU2VydmVyQ29uZmlnICYmIGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA9PT0gJ3N0dTMnO1xyXG5cclxuICAgICAgICAvLyBMb2FkIHRoZSBpZyBkZXBlbmRlbmN5IGV4dGVuc2lvbnMgaW50byB0aGUgcmVzb3VyY2VzIGRpcmVjdG9yeVxyXG4gICAgICAgIGlmIChpc1N0dTMgJiYgY29udHJvbC5kZXBlbmRlbmN5TGlzdCAmJiBjb250cm9sLmRlcGVuZGVuY3lMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgZGVzdEV4dGVuc2lvbnNEaXIgPSBwYXRoLmpvaW4ocmVzb3VyY2VzRGlyLCAnc3RydWN0dXJlZGVmaW5pdGlvbicpO1xyXG5cclxuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhkZXN0RXh0ZW5zaW9uc0Rpcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS5qc29uJywgaXNYbWwsIGZoaXIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS12ZXJzaW9uLmpzb24nLCBpc1htbCwgZmhpcik7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0RpciwgJ2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LWxvY2F0aW9uLmpzb24nLCBpc1htbCwgZmhpcik7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0RpciwgJ2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LW5hbWUuanNvbicsIGlzWG1sLCBmaGlyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pOyAgICAgICAgICAgLy8gVGhpcyBpc24ndCBhY3R1YWxseSBuZWVkZWQsIHNpbmNlIHRoZSBJRyBQdWJsaXNoZXIgYXR0ZW1wdHMgdG8gcmVzb2x2ZSB0aGVzZSBkZXBlbmRlbmN5IGF1dG9tYXRpY2FsbHlcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAvLyBBdHRlbXB0IHRvIHJlc29sdmUgdGhlIGRlcGVuZGVuY3kncyBkZWZpbml0aW9ucyBhbmQgaW5jbHVkZSBpdCBpbiB0aGUgcGFja2FnZVxyXG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xyXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gXy5tYXAoY29udHJvbC5kZXBlbmRlbmN5TGlzdCwgKGRlcGVuZGVuY3kpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGVwZW5kZW5jeVVybCA9XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5LmxvY2F0aW9uICtcclxuICAgICAgICAgICAgICAgIChkZXBlbmRlbmN5LmxvY2F0aW9uLmVuZHNXaXRoKCcvJykgPyAnJyA6ICcvJykgKyAnZGVmaW5pdGlvbnMuJyArXHJcbiAgICAgICAgICAgICAgICAoaXNYbWwgPyAneG1sJyA6ICdqc29uJykgK1xyXG4gICAgICAgICAgICAgICAgJy56aXAnO1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0RGVwZW5kZW5jeShkZXBlbmRlbmN5VXJsLCBkZXBlbmRlbmN5Lm5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgUS5hbGwocHJvbWlzZXMpXHJcbiAgICAgICAgICAgIC50aGVuKGRlZmVycmVkLnJlc29sdmUpXHJcbiAgICAgICAgICAgIC5jYXRjaChkZWZlcnJlZC5yZWplY3QpO1xyXG4gICAgXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgKi9cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBnZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZ1ZlcnNpb24gPSBmaGlyU2VydmVyQ29uZmlnID8gZmhpclNlcnZlckNvbmZpZy52ZXJzaW9uIDogbnVsbDtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogQWRkIG1vcmUgbG9naWNcclxuICAgICAgICBzd2l0Y2ggKGNvbmZpZ1ZlcnNpb24pIHtcclxuICAgICAgICAgICAgY2FzZSAnc3R1Myc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJzMuMC4xJztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiAnNC4wLjAnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSB1cGRhdGVUZW1wbGF0ZXMocm9vdFBhdGgsIGJ1bmRsZSwgaW1wbGVtZW50YXRpb25HdWlkZTogU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUpIHtcclxuICAgICAgICBjb25zdCBtYWluUmVzb3VyY2VUeXBlcyA9IFsnSW1wbGVtZW50YXRpb25HdWlkZScsICdWYWx1ZVNldCcsICdDb2RlU3lzdGVtJywgJ1N0cnVjdHVyZURlZmluaXRpb24nLCAnQ2FwYWJpbGl0eVN0YXRlbWVudCddO1xyXG4gICAgICAgIGNvbnN0IGRpc3RpbmN0UmVzb3VyY2VzID0gXy5jaGFpbihidW5kbGUuZW50cnkpXHJcbiAgICAgICAgICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS5yZXNvdXJjZSlcclxuICAgICAgICAgICAgLnVuaXEoKHJlc291cmNlKSA9PiByZXNvdXJjZS5pZClcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWVTZXRzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnVmFsdWVTZXQnKTtcclxuICAgICAgICBjb25zdCBjb2RlU3lzdGVtcyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0NvZGVTeXN0ZW0nKTtcclxuICAgICAgICBjb25zdCBwcm9maWxlcyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ1N0cnVjdHVyZURlZmluaXRpb24nICYmICghcmVzb3VyY2UuYmFzZURlZmluaXRpb24gfHwgIXJlc291cmNlLmJhc2VEZWZpbml0aW9uLmVuZHNXaXRoKCdFeHRlbnNpb24nKSkpO1xyXG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbnMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdTdHJ1Y3R1cmVEZWZpbml0aW9uJyAmJiByZXNvdXJjZS5iYXNlRGVmaW5pdGlvbiAmJiByZXNvdXJjZS5iYXNlRGVmaW5pdGlvbi5lbmRzV2l0aCgnRXh0ZW5zaW9uJykpO1xyXG4gICAgICAgIGNvbnN0IGNhcGFiaWxpdHlTdGF0ZW1lbnRzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnQ2FwYWJpbGl0eVN0YXRlbWVudCcpO1xyXG4gICAgICAgIGNvbnN0IG90aGVyUmVzb3VyY2VzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gbWFpblJlc291cmNlVHlwZXMuaW5kZXhPZihyZXNvdXJjZS5yZXNvdXJjZVR5cGUpIDwgMCk7XHJcblxyXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4UGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9pbmRleC5tZCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuZGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uQ29udGVudCA9ICcjIyMgRGVzY3JpcHRpb25cXG5cXG4nICsgaW1wbGVtZW50YXRpb25HdWlkZS5kZXNjcmlwdGlvbiArICdcXG5cXG4nO1xyXG4gICAgICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoaW5kZXhQYXRoLCBkZXNjcmlwdGlvbkNvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdXRob3JzRGF0YSA9IF8ubWFwKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFjdCwgKGNvbnRhY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZEVtYWlsID0gXy5maW5kKGNvbnRhY3QudGVsZWNvbSwgKHRlbGVjb20pID0+IHRlbGVjb20uc3lzdGVtID09PSAnZW1haWwnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvbnRhY3QubmFtZSwgZm91bmRFbWFpbCA/IGA8YSBocmVmPVwibWFpbHRvOiR7Zm91bmRFbWFpbC52YWx1ZX1cIj4ke2ZvdW5kRW1haWwudmFsdWV9PC9hPmAgOiAnJ107XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvcnNDb250ZW50ID0gJyMjIyBBdXRob3JzXFxuXFxuJyArIHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0VtYWlsJ10sIGF1dGhvcnNEYXRhKSArICdcXG5cXG4nO1xyXG4gICAgICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoaW5kZXhQYXRoLCBhdXRob3JzQ29udGVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcm9maWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzRGF0YSA9IF8uY2hhaW4ocHJvZmlsZXMpXHJcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChwcm9maWxlKSA9PiBwcm9maWxlLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAubWFwKChwcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtgPGEgaHJlZj1cIlN0cnVjdHVyZURlZmluaXRpb24tJHtwcm9maWxlLmlkfS5odG1sXCI+JHtwcm9maWxlLm5hbWV9PC9hPmAsIHByb2ZpbGUuZGVzY3JpcHRpb24gfHwgJyddO1xyXG4gICAgICAgICAgICAgICAgfSkudmFsdWUoKTtcclxuICAgICAgICAgICAgY29uc3QgcHJvZmlsZXNUYWJsZSA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0Rlc2NyaXB0aW9uJ10sIHByb2ZpbGVzRGF0YSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9wcm9maWxlcy5tZCcpO1xyXG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhwcm9maWxlc1BhdGgsICcjIyMgUHJvZmlsZXNcXG5cXG4nICsgcHJvZmlsZXNUYWJsZSArICdcXG5cXG4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChleHRlbnNpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgZXh0RGF0YSA9IF8uY2hhaW4oZXh0ZW5zaW9ucylcclxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAubWFwKChleHRlbnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2A8YSBocmVmPVwiU3RydWN0dXJlRGVmaW5pdGlvbi0ke2V4dGVuc2lvbi5pZH0uaHRtbFwiPiR7ZXh0ZW5zaW9uLm5hbWV9PC9hPmAsIGV4dGVuc2lvbi5kZXNjcmlwdGlvbiB8fCAnJ107XHJcbiAgICAgICAgICAgICAgICB9KS52YWx1ZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBleHRDb250ZW50ID0gdGhpcy5jcmVhdGVUYWJsZUZyb21BcnJheShbJ05hbWUnLCAnRGVzY3JpcHRpb24nXSwgZXh0RGF0YSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4dFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvcHJvZmlsZXMubWQnKTtcclxuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoZXh0UGF0aCwgJyMjIyBFeHRlbnNpb25zXFxuXFxuJyArIGV4dENvbnRlbnQgKyAnXFxuXFxuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWVTZXRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IHZzQ29udGVudCA9ICcjIyMgVmFsdWUgU2V0c1xcblxcbic7XHJcbiAgICAgICAgICAgIGNvbnN0IHZzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy90ZXJtaW5vbG9neS5tZCcpO1xyXG5cclxuICAgICAgICAgICAgXy5jaGFpbih2YWx1ZVNldHMpXHJcbiAgICAgICAgICAgICAgICAuc29ydEJ5KCh2YWx1ZVNldCkgPT4gdmFsdWVTZXQudGl0bGUgfHwgdmFsdWVTZXQubmFtZSlcclxuICAgICAgICAgICAgICAgIC5lYWNoKCh2YWx1ZVNldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZzQ29udGVudCArPSBgLSBbJHt2YWx1ZVNldC50aXRsZSB8fCB2YWx1ZVNldC5uYW1lfV0oVmFsdWVTZXQtJHt2YWx1ZVNldC5pZH0uaHRtbClcXG5gO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyh2c1BhdGgsIHZzQ29udGVudCArICdcXG5cXG4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb2RlU3lzdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBjc0NvbnRlbnQgPSAnIyMjIENvZGUgU3lzdGVtc1xcblxcbic7XHJcbiAgICAgICAgICAgIGNvbnN0IGNzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy90ZXJtaW5vbG9neS5tZCcpO1xyXG5cclxuICAgICAgICAgICAgXy5jaGFpbihjb2RlU3lzdGVtcylcclxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKGNvZGVTeXN0ZW0pID0+IGNvZGVTeXN0ZW0udGl0bGUgfHwgY29kZVN5c3RlbS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgLmVhY2goKGNvZGVTeXN0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjc0NvbnRlbnQgKz0gYC0gWyR7Y29kZVN5c3RlbS50aXRsZSB8fCBjb2RlU3lzdGVtLm5hbWV9XShWYWx1ZVNldC0ke2NvZGVTeXN0ZW0uaWR9Lmh0bWwpXFxuYDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoY3NQYXRoLCBjc0NvbnRlbnQgKyAnXFxuXFxuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FwYWJpbGl0eVN0YXRlbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBjc0RhdGEgPSBfLmNoYWluKGNhcGFiaWxpdHlTdGF0ZW1lbnRzKVxyXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgoY2FwYWJpbGl0eVN0YXRlbWVudCkgPT4gY2FwYWJpbGl0eVN0YXRlbWVudC5uYW1lKVxyXG4gICAgICAgICAgICAgICAgLm1hcCgoY2FwYWJpbGl0eVN0YXRlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbYDxhIGhyZWY9XCJDYXBhYmlsaXR5U3RhdGVtZW50LSR7Y2FwYWJpbGl0eVN0YXRlbWVudC5pZH0uaHRtbFwiPiR7Y2FwYWJpbGl0eVN0YXRlbWVudC5uYW1lfTwvYT5gLCBjYXBhYmlsaXR5U3RhdGVtZW50LmRlc2NyaXB0aW9uIHx8ICcnXTtcclxuICAgICAgICAgICAgICAgIH0pLnZhbHVlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNzQ29udGVudCA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0Rlc2NyaXB0aW9uJ10sIGNzRGF0YSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9jYXBzdGF0ZW1lbnRzLm1kJyk7XHJcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGNzUGF0aCwgJyMjIyBDYXBhYmlsaXR5U3RhdGVtZW50c1xcblxcbicgKyBjc0NvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG90aGVyUmVzb3VyY2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgb0RhdGEgPSBfLmNoYWluKG90aGVyUmVzb3VyY2VzKVxyXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgocmVzb3VyY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzcGxheSA9IHJlc291cmNlLnRpdGxlIHx8IHRoaXMuZ2V0RGlzcGxheU5hbWUocmVzb3VyY2UubmFtZSkgfHwgcmVzb3VyY2UuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnJlc291cmNlVHlwZSArIGRpc3BsYXk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm1hcCgocmVzb3VyY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHJlc291cmNlLnRpdGxlIHx8IHRoaXMuZ2V0RGlzcGxheU5hbWUocmVzb3VyY2UubmFtZSkgfHwgcmVzb3VyY2UuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtyZXNvdXJjZS5yZXNvdXJjZVR5cGUsIGA8YSBocmVmPVwiJHtyZXNvdXJjZS5yZXNvdXJjZVR5cGV9LSR7cmVzb3VyY2UuaWR9Lmh0bWxcIj4ke25hbWV9PC9hPmBdO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBvQ29udGVudCA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydUeXBlJywgJ05hbWUnXSwgb0RhdGEpO1xyXG4gICAgICAgICAgICBjb25zdCBjc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvb3RoZXIubWQnKTtcclxuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoY3NQYXRoLCAnIyMjIE90aGVyIFJlc291cmNlc1xcblxcbicgKyBvQ29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHdyaXRlRmlsZXNGb3JSZXNvdXJjZXMocm9vdFBhdGg6IHN0cmluZywgcmVzb3VyY2U6IERvbWFpblJlc291cmNlKSB7XHJcbiAgICAgICAgaWYgKCFyZXNvdXJjZSB8fCAhcmVzb3VyY2UucmVzb3VyY2VUeXBlIHx8IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGludHJvUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgYHNvdXJjZS9wYWdlcy9faW5jbHVkZXMvJHtyZXNvdXJjZS5pZH0taW50cm8ubWRgKTtcclxuICAgICAgICBjb25zdCBzZWFyY2hQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBgc291cmNlL3BhZ2VzL19pbmNsdWRlcy8ke3Jlc291cmNlLmlkfS1zZWFyY2gubWRgKTtcclxuICAgICAgICBjb25zdCBzdW1tYXJ5UGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgYHNvdXJjZS9wYWdlcy9faW5jbHVkZXMvJHtyZXNvdXJjZS5pZH0tc3VtbWFyeS5tZGApO1xyXG5cclxuICAgICAgICBsZXQgaW50cm8gPSAnLS0tXFxuJyArXHJcbiAgICAgICAgICAgIGB0aXRsZTogJHtyZXNvdXJjZS5yZXNvdXJjZVR5cGV9LSR7cmVzb3VyY2UuaWR9LWludHJvXFxuYCArXHJcbiAgICAgICAgICAgICdsYXlvdXQ6IGRlZmF1bHRcXG4nICtcclxuICAgICAgICAgICAgYGFjdGl2ZTogJHtyZXNvdXJjZS5yZXNvdXJjZVR5cGV9LSR7cmVzb3VyY2UuaWR9LWludHJvXFxuYCArXHJcbiAgICAgICAgICAgICctLS1cXG5cXG4nO1xyXG5cclxuICAgICAgICBpZiAoKDxhbnk+cmVzb3VyY2UpLmRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgIGludHJvICs9ICg8YW55PnJlc291cmNlKS5kZXNjcmlwdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoaW50cm9QYXRoLCBpbnRybyk7XHJcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhzZWFyY2hQYXRoLCAnVE9ETyAtIFNlYXJjaCcpO1xyXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoc3VtbWFyeVBhdGgsICdUT0RPIC0gU3VtbWFyeScpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGdldFN0dTNDb250cm9sKGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBidW5kbGU6IFNUVTNCdW5kbGUsIHZlcnNpb24pIHtcclxuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlUmVnZXggPSAvXiguKz8pXFwvSW1wbGVtZW50YXRpb25HdWlkZVxcLy4rJC9nbTtcclxuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlTWF0Y2ggPSBjYW5vbmljYWxCYXNlUmVnZXguZXhlYyhpbXBsZW1lbnRhdGlvbkd1aWRlLnVybCk7XHJcbiAgICAgICAgY29uc3QgcGFja2FnZUlkRXh0ZW5zaW9uID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSBuZXcgR2xvYmFscygpLmV4dGVuc2lvblVybHNbJ2V4dGVuc2lvbi1pZy1wYWNrYWdlLWlkJ10pO1xyXG4gICAgICAgIGxldCBjYW5vbmljYWxCYXNlO1xyXG5cclxuICAgICAgICBpZiAoIWNhbm9uaWNhbEJhc2VNYXRjaCB8fCBjYW5vbmljYWxCYXNlTWF0Y2gubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlID0gaW1wbGVtZW50YXRpb25HdWlkZS51cmwuc3Vic3RyaW5nKDAsIGltcGxlbWVudGF0aW9uR3VpZGUudXJsLmxhc3RJbmRleE9mKCcvJykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBjYW5vbmljYWxCYXNlTWF0Y2hbMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBFeHRyYWN0IG5wbS1uYW1lIGZyb20gSUcgZXh0ZW5zaW9uLlxyXG4gICAgICAgIC8vIGN1cnJlbnRseSwgSUcgcmVzb3VyY2UgaGFzIHRvIGJlIGluIFhNTCBmb3JtYXQgZm9yIHRoZSBJRyBQdWJsaXNoZXJcclxuICAgICAgICBjb25zdCBjb250cm9sID0gPEZoaXJDb250cm9sPiB7XHJcbiAgICAgICAgICAgIHRvb2w6ICdqZWt5bGwnLFxyXG4gICAgICAgICAgICBzb3VyY2U6ICdpbXBsZW1lbnRhdGlvbmd1aWRlLycgKyBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy54bWwnLFxyXG4gICAgICAgICAgICAnbnBtLW5hbWUnOiBwYWNrYWdlSWRFeHRlbnNpb24gJiYgcGFja2FnZUlkRXh0ZW5zaW9uLnZhbHVlU3RyaW5nID8gcGFja2FnZUlkRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogaW1wbGVtZW50YXRpb25HdWlkZS5pZCArICctbnBtJyxcclxuICAgICAgICAgICAgbGljZW5zZTogJ0NDMC0xLjAnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFI0OiBJbXBsZW1lbnRhdGlvbkd1aWRlLmxpY2Vuc2VcclxuICAgICAgICAgICAgcGF0aHM6IHtcclxuICAgICAgICAgICAgICAgIHFhOiAnZ2VuZXJhdGVkX291dHB1dC9xYScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wOiAnZ2VuZXJhdGVkX291dHB1dC90ZW1wJyxcclxuICAgICAgICAgICAgICAgIG91dHB1dDogJ291dHB1dCcsXHJcbiAgICAgICAgICAgICAgICB0eENhY2hlOiAnZ2VuZXJhdGVkX291dHB1dC90eENhY2hlJyxcclxuICAgICAgICAgICAgICAgIHNwZWNpZmljYXRpb246ICdodHRwOi8vaGw3Lm9yZy9maGlyL1NUVTMnLFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnZnJhbWV3b3JrJyxcclxuICAgICAgICAgICAgICAgICAgICAnc291cmNlL3BhZ2VzJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlczogWyAnc291cmNlL3Jlc291cmNlcycgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYWdlczogWydwYWdlcyddLFxyXG4gICAgICAgICAgICAnZXh0ZW5zaW9uLWRvbWFpbnMnOiBbJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tJ10sXHJcbiAgICAgICAgICAgICdhbGxvd2VkLWRvbWFpbnMnOiBbJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tJ10sXHJcbiAgICAgICAgICAgICdzY3QtZWRpdGlvbic6ICdodHRwOi8vc25vbWVkLmluZm8vc2N0LzczMTAwMDEyNDEwOCcsXHJcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2U6IGNhbm9uaWNhbEJhc2UsXHJcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgICAgICAgICAnTG9jYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ1Byb2NlZHVyZVJlcXVlc3QnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ09yZ2FuaXphdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXHJcbiAgICAgICAgICAgICAgICAnTWVkaWNhdGlvblN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXHJcbiAgICAgICAgICAgICAgICAnU2VhcmNoUGFyYW1ldGVyJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZURlZmluaXRpb24nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLW1hcHBpbmdzJzogJ3NkLW1hcHBpbmdzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ3NkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1kZWZucyc6ICdzZC1kZWZpbml0aW9ucy5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdJbW11bml6YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ1BhdGllbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZU1hcCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICdzY3JpcHQnOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAncHJvZmlsZXMnOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdDb25jZXB0TWFwJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lcic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXHJcbiAgICAgICAgICAgICAgICAnT3BlcmF0aW9uRGVmaW5pdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdDb2RlU3lzdGVtJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ0NvbW11bmljYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ0FueSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZm9ybWF0JzogJ2Zvcm1hdC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lclJvbGUnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ1ZhbHVlU2V0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ0NhcGFiaWxpdHlTdGF0ZW1lbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXHJcbiAgICAgICAgICAgICAgICAnT2JzZXJ2YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc291cmNlczoge31cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodmVyc2lvbikge1xyXG4gICAgICAgICAgICBjb250cm9sLnZlcnNpb24gPSB2ZXJzaW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSBkZXBlbmRlbmN5TGlzdCBiYXNlZCBvbiB0aGUgZXh0ZW5zaW9ucyBpbiB0aGUgSUdcclxuICAgICAgICBjb25zdCBkZXBlbmRlbmN5RXh0ZW5zaW9ucyA9IF8uZmlsdGVyKGltcGxlbWVudGF0aW9uR3VpZGUuZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeScpO1xyXG5cclxuICAgICAgICAvLyBSNCBJbXBsZW1lbnRhdGlvbkd1aWRlLmRlcGVuZHNPblxyXG4gICAgICAgIGNvbnRyb2wuZGVwZW5kZW5jeUxpc3QgPSBfLmNoYWluKGRlcGVuZGVuY3lFeHRlbnNpb25zKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRlbmN5RXh0ZW5zaW9uLmV4dGVuc2lvbiwgKG5leHQpID0+IG5leHQudXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeS1sb2NhdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRlbmN5RXh0ZW5zaW9uLmV4dGVuc2lvbiwgKG5leHQpID0+IG5leHQudXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeS1uYW1lJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbG9jYXRpb25FeHRlbnNpb24gJiYgISFsb2NhdGlvbkV4dGVuc2lvbi52YWx1ZVN0cmluZyAmJiAhIW5hbWVFeHRlbnNpb24gJiYgISFuYW1lRXh0ZW5zaW9uLnZhbHVlU3RyaW5nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IDxFeHRlbnNpb24+IF8uZmluZChkZXBlbmRlbmN5RXh0ZW5zaW9uLmV4dGVuc2lvbiwgKG5leHQpID0+IG5leHQudXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeS1sb2NhdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IDxFeHRlbnNpb24+IF8uZmluZChkZXBlbmRlbmN5RXh0ZW5zaW9uLmV4dGVuc2lvbiwgKG5leHQpID0+IG5leHQudXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeS1uYW1lJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJzaW9uRXh0ZW5zaW9uID0gPEV4dGVuc2lvbj4gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LXZlcnNpb24nKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gPEZoaXJDb250cm9sRGVwZW5kZW5jeT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkV4dGVuc2lvbiA/IGxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlVXJpIDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZUV4dGVuc2lvbiA/IG5hbWVFeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uRXh0ZW5zaW9uID8gdmVyc2lvbkV4dGVuc2lvbi52YWx1ZVN0cmluZyA6ICcnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuXHJcbiAgICAgICAgLy8gRGVmaW5lIHRoZSByZXNvdXJjZXMgaW4gdGhlIGNvbnRyb2wgYW5kIHdoYXQgdGVtcGxhdGVzIHRoZXkgc2hvdWxkIHVzZVxyXG4gICAgICAgIGlmIChidW5kbGUgJiYgYnVuZGxlLmVudHJ5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlLmVudHJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IGJ1bmRsZS5lbnRyeVtpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gZW50cnkucmVzb3VyY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29udHJvbC5yZXNvdXJjZXNbcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy8nICsgcmVzb3VyY2UuaWRdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhc2U6IHJlc291cmNlLnJlc291cmNlVHlwZSArICctJyArIHJlc291cmNlLmlkICsgJy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWZuczogcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy0nICsgcmVzb3VyY2UuaWQgKyAnLWRlZmluaXRpb25zLmh0bWwnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29udHJvbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBnZXRSNENvbnRyb2woaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlLCBidW5kbGU6IFI0QnVuZGxlLCB2ZXJzaW9uOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlUmVnZXggPSAvXiguKz8pXFwvSW1wbGVtZW50YXRpb25HdWlkZVxcLy4rJC9nbTtcclxuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlTWF0Y2ggPSBjYW5vbmljYWxCYXNlUmVnZXguZXhlYyhpbXBsZW1lbnRhdGlvbkd1aWRlLnVybCk7XHJcbiAgICAgICAgbGV0IGNhbm9uaWNhbEJhc2U7XHJcblxyXG4gICAgICAgIGlmICghY2Fub25pY2FsQmFzZU1hdGNoIHx8IGNhbm9uaWNhbEJhc2VNYXRjaC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5zdWJzdHJpbmcoMCwgaW1wbGVtZW50YXRpb25HdWlkZS51cmwubGFzdEluZGV4T2YoJy8nKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2Fub25pY2FsQmFzZSA9IGNhbm9uaWNhbEJhc2VNYXRjaFsxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGN1cnJlbnRseSwgSUcgcmVzb3VyY2UgaGFzIHRvIGJlIGluIFhNTCBmb3JtYXQgZm9yIHRoZSBJRyBQdWJsaXNoZXJcclxuICAgICAgICBjb25zdCBjb250cm9sID0gPEZoaXJDb250cm9sPiB7XHJcbiAgICAgICAgICAgIHRvb2w6ICdqZWt5bGwnLFxyXG4gICAgICAgICAgICBzb3VyY2U6ICdpbXBsZW1lbnRhdGlvbmd1aWRlLycgKyBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy54bWwnLFxyXG4gICAgICAgICAgICAnbnBtLW5hbWUnOiBpbXBsZW1lbnRhdGlvbkd1aWRlLnBhY2thZ2VJZCB8fCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy1ucG0nLFxyXG4gICAgICAgICAgICBsaWNlbnNlOiBpbXBsZW1lbnRhdGlvbkd1aWRlLmxpY2Vuc2UgfHwgJ0NDMC0xLjAnLFxyXG4gICAgICAgICAgICBwYXRoczoge1xyXG4gICAgICAgICAgICAgICAgcWE6ICdnZW5lcmF0ZWRfb3V0cHV0L3FhJyxcclxuICAgICAgICAgICAgICAgIHRlbXA6ICdnZW5lcmF0ZWRfb3V0cHV0L3RlbXAnLFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0OiAnb3V0cHV0JyxcclxuICAgICAgICAgICAgICAgIHR4Q2FjaGU6ICdnZW5lcmF0ZWRfb3V0cHV0L3R4Q2FjaGUnLFxyXG4gICAgICAgICAgICAgICAgc3BlY2lmaWNhdGlvbjogJ2h0dHA6Ly9obDcub3JnL2ZoaXIvUjQvJyxcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2ZyYW1ld29yaycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3NvdXJjZS9wYWdlcydcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFsgJ3NvdXJjZS9yZXNvdXJjZXMnIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFnZXM6IFsncGFnZXMnXSxcclxuICAgICAgICAgICAgJ2V4dGVuc2lvbi1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxyXG4gICAgICAgICAgICAnYWxsb3dlZC1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxyXG4gICAgICAgICAgICAnc2N0LWVkaXRpb24nOiAnaHR0cDovL3Nub21lZC5pbmZvL3NjdC83MzEwMDAxMjQxMDgnLFxyXG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlOiBjYW5vbmljYWxCYXNlLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICAgICAgJ0xvY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdQcm9jZWR1cmVSZXF1ZXN0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdPcmdhbml6YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ01lZGljYXRpb25TdGF0ZW1lbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ1NlYXJjaFBhcmFtZXRlcic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdTdHJ1Y3R1cmVEZWZpbml0aW9uJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1tYXBwaW5ncyc6ICdzZC1tYXBwaW5ncy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdzZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZGVmbnMnOiAnc2QtZGVmaW5pdGlvbnMuaHRtbCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnSW1tdW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdQYXRpZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdTdHJ1Y3R1cmVNYXAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAnc2NyaXB0JzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3Byb2ZpbGVzJzogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnQ29uY2VwdE1hcCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXInOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ09wZXJhdGlvbkRlZmluaXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXHJcbiAgICAgICAgICAgICAgICAnQ29kZVN5c3RlbSc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdDb21tdW5pY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdBbnknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWZvcm1hdCc6ICdmb3JtYXQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXJSb2xlJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdWYWx1ZVNldCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcclxuICAgICAgICAgICAgICAgICdDYXBhYmlsaXR5U3RhdGVtZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxyXG4gICAgICAgICAgICAgICAgJ09ic2VydmF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXNvdXJjZXM6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHZlcnNpb24pIHtcclxuICAgICAgICAgICAgY29udHJvbC52ZXJzaW9uID0gdmVyc2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmZoaXJWZXJzaW9uICYmIGltcGxlbWVudGF0aW9uR3VpZGUuZmhpclZlcnNpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb250cm9sWydmaXhlZC1idXNpbmVzcy12ZXJzaW9uJ10gPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmZoaXJWZXJzaW9uWzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udHJvbC5kZXBlbmRlbmN5TGlzdCA9IF8uY2hhaW4oaW1wbGVtZW50YXRpb25HdWlkZS5kZXBlbmRzT24pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGRlcGVuZHNPbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FeHRlbnNpb24gPSBfLmZpbmQoZGVwZW5kc09uLmV4dGVuc2lvbiwgKGRlcGVuZGVuY3lFeHRlbnNpb24pID0+IGRlcGVuZGVuY3lFeHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1maGlyLmxhbnRhbmFncm91cC5jb20vcjQvU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kcy1vbi1sb2NhdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLW5hbWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsb2NhdGlvbkV4dGVuc2lvbiAmJiAhIWxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlU3RyaW5nICYmICEhbmFtZUV4dGVuc2lvbiAmJiAhIW5hbWVFeHRlbnNpb24udmFsdWVTdHJpbmc7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXAoKGRlcGVuZHNPbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FeHRlbnNpb24gPSBfLmZpbmQoZGVwZW5kc09uLmV4dGVuc2lvbiwgKGRlcGVuZGVuY3lFeHRlbnNpb24pID0+IGRlcGVuZGVuY3lFeHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1maGlyLmxhbnRhbmFncm91cC5jb20vcjQvU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kcy1vbi1sb2NhdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZGVwZW5kZW5jeUV4dGVuc2lvbikgPT4gZGVwZW5kZW5jeUV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLWZoaXIubGFudGFuYWdyb3VwLmNvbS9yNC9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRzLW9uLW5hbWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkV4dGVuc2lvbiA/IGxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZUV4dGVuc2lvbiA/IG5hbWVFeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBkZXBlbmRzT24udmVyc2lvblxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICAgIC8vIERlZmluZSB0aGUgcmVzb3VyY2VzIGluIHRoZSBjb250cm9sIGFuZCB3aGF0IHRlbXBsYXRlcyB0aGV5IHNob3VsZCB1c2VcclxuICAgICAgICBpZiAoYnVuZGxlICYmIGJ1bmRsZS5lbnRyeSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1bmRsZS5lbnRyeS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSBidW5kbGUuZW50cnlbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZSA9IGVudHJ5LnJlc291cmNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnRyb2wucmVzb3VyY2VzW3Jlc291cmNlLnJlc291cmNlVHlwZSArICcvJyArIHJlc291cmNlLmlkXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBiYXNlOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICcuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmbnM6IHJlc291cmNlLnJlc291cmNlVHlwZSArICctJyArIHJlc291cmNlLmlkICsgJy1kZWZpbml0aW9ucy5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgZ2V0U3R1M1BhZ2VDb250ZW50KGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBQYWdlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29udGVudEV4dGVuc2lvbiA9IF8uZmluZChwYWdlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLXBhZ2UtY29udGVudCcpO1xyXG5cclxuICAgICAgICBpZiAoY29udGVudEV4dGVuc2lvbiAmJiBjb250ZW50RXh0ZW5zaW9uLnZhbHVlUmVmZXJlbmNlICYmIGNvbnRlbnRFeHRlbnNpb24udmFsdWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIHBhZ2Uuc291cmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IGNvbnRlbnRFeHRlbnNpb24udmFsdWVSZWZlcmVuY2UucmVmZXJlbmNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZS5zdGFydHNXaXRoKCcjJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lZCA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhaW5lZCwgKGNvbnRhaW5lZCkgPT4gY29udGFpbmVkLmlkID09PSByZWZlcmVuY2Uuc3Vic3RyaW5nKDEpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmFyeSA9IGNvbnRhaW5lZCAmJiBjb250YWluZWQucmVzb3VyY2VUeXBlID09PSAnQmluYXJ5JyA/IDxTVFUzQmluYXJ5PiBjb250YWluZWQgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBwYWdlLnNvdXJjZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogQnVmZmVyLmZyb20oYmluYXJ5LmNvbnRlbnQsICdiYXNlNjQnKS50b1N0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSB3cml0ZVN0dTNQYWdlKHBhZ2VzUGF0aDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSwgcGFnZTogUGFnZUNvbXBvbmVudCwgbGV2ZWw6IG51bWJlciwgdG9jRW50cmllczogVGFibGVPZkNvbnRlbnRzRW50cnlbXSkge1xyXG4gICAgICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gdGhpcy5nZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZSwgcGFnZSk7XHJcblxyXG4gICAgICAgIGlmIChwYWdlLmtpbmQgIT09ICd0b2MnICYmIHBhZ2VDb250ZW50ICYmIHBhZ2VDb250ZW50LmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3UGFnZVBhdGggPSBwYXRoLmpvaW4ocGFnZXNQYXRoLCBwYWdlQ29udGVudC5maWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gJy0tLVxcbicgK1xyXG4gICAgICAgICAgICAgICAgYHRpdGxlOiAke3BhZ2UudGl0bGV9XFxuYCArXHJcbiAgICAgICAgICAgICAgICAnbGF5b3V0OiBkZWZhdWx0XFxuJyArXHJcbiAgICAgICAgICAgICAgICBgYWN0aXZlOiAke3BhZ2UudGl0bGV9XFxuYCArXHJcbiAgICAgICAgICAgICAgICAnLS0tXFxuXFxuJyArIHBhZ2VDb250ZW50LmNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG5ld1BhZ2VQYXRoLCBjb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbiBlbnRyeSB0byB0aGUgVE9DXHJcbiAgICAgICAgdG9jRW50cmllcy5wdXNoKHsgbGV2ZWw6IGxldmVsLCBmaWxlTmFtZTogcGFnZS5raW5kID09PSAncGFnZScgJiYgcGFnZUNvbnRlbnQgPyBwYWdlQ29udGVudC5maWxlTmFtZSA6IG51bGwsIHRpdGxlOiBwYWdlLnRpdGxlIH0pO1xyXG4gICAgICAgIF8uZWFjaChwYWdlLnBhZ2UsIChzdWJQYWdlKSA9PiB0aGlzLndyaXRlU3R1M1BhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBzdWJQYWdlLCBsZXZlbCArIDEsIHRvY0VudHJpZXMpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBnZXRQYWdlRXh0ZW5zaW9uKHBhZ2U6IEltcGxlbWVudGF0aW9uR3VpZGVQYWdlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgc3dpdGNoIChwYWdlLmdlbmVyYXRpb24pIHtcclxuICAgICAgICAgICAgY2FzZSAnaHRtbCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ2dlbmVyYXRlZCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJy5odG1sJztcclxuICAgICAgICAgICAgY2FzZSAneG1sJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAnLnhtbCc7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJy5tZCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHdyaXRlUjRQYWdlKHBhZ2VzUGF0aDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBSNEltcGxlbWVudGF0aW9uR3VpZGUsIHBhZ2U6IEltcGxlbWVudGF0aW9uR3VpZGVQYWdlQ29tcG9uZW50LCBsZXZlbDogbnVtYmVyLCB0b2NFbnRyaWVzOiBUYWJsZU9mQ29udGVudHNFbnRyeVtdKSB7XHJcbiAgICAgICAgbGV0IGZpbGVOYW1lO1xyXG5cclxuICAgICAgICBpZiAocGFnZS5uYW1lUmVmZXJlbmNlICYmIHBhZ2UubmFtZVJlZmVyZW5jZS5yZWZlcmVuY2UgJiYgcGFnZS50aXRsZSkge1xyXG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBwYWdlLm5hbWVSZWZlcmVuY2UucmVmZXJlbmNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZS5zdGFydHNXaXRoKCcjJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lZCA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhaW5lZCwgKGNvbnRhaW5lZCkgPT4gY29udGFpbmVkLmlkID09PSByZWZlcmVuY2Uuc3Vic3RyaW5nKDEpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmFyeSA9IGNvbnRhaW5lZCAmJiBjb250YWluZWQucmVzb3VyY2VUeXBlID09PSAnQmluYXJ5JyA/IDxSNEJpbmFyeT4gY29udGFpbmVkIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiaW5hcnkgJiYgYmluYXJ5LmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IHBhZ2UudGl0bGUucmVwbGFjZSgvIC9nLCAnXycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuaW5kZXhPZignLicpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSB0aGlzLmdldFBhZ2VFeHRlbnNpb24ocGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQYWdlUGF0aCA9IHBhdGguam9pbihwYWdlc1BhdGgsIGZpbGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5Q29udGVudCA9IEJ1ZmZlci5mcm9tKGJpbmFyeS5kYXRhLCAnYmFzZTY0JykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gJy0tLVxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgdGl0bGU6ICR7cGFnZS50aXRsZX1cXG5gICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgYWN0aXZlOiAke3BhZ2UudGl0bGV9XFxuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGAtLS1cXG5cXG4ke2JpbmFyeUNvbnRlbnR9YDtcclxuICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG5ld1BhZ2VQYXRoLCBjb250ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIGFuIGVudHJ5IHRvIHRoZSBUT0NcclxuICAgICAgICB0b2NFbnRyaWVzLnB1c2goeyBsZXZlbDogbGV2ZWwsIGZpbGVOYW1lOiBmaWxlTmFtZSwgdGl0bGU6IHBhZ2UudGl0bGUgfSk7XHJcblxyXG4gICAgICAgIF8uZWFjaChwYWdlLnBhZ2UsIChzdWJQYWdlKSA9PiB0aGlzLndyaXRlUjRQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgc3ViUGFnZSwgbGV2ZWwgKyAxLCB0b2NFbnRyaWVzKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgZ2VuZXJhdGVUYWJsZU9mQ29udGVudHMocm9vdFBhdGg6IHN0cmluZywgdG9jRW50cmllczogVGFibGVPZkNvbnRlbnRzRW50cnlbXSwgc2hvdWxkQXV0b0dlbmVyYXRlOiBib29sZWFuLCBwYWdlQ29udGVudCkge1xyXG4gICAgICAgIGNvbnN0IHRvY1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdG9jLm1kJyk7XHJcbiAgICAgICAgbGV0IHRvY0NvbnRlbnQgPSAnJztcclxuXHJcbiAgICAgICAgaWYgKHNob3VsZEF1dG9HZW5lcmF0ZSkge1xyXG4gICAgICAgICAgICBfLmVhY2godG9jRW50cmllcywgKGVudHJ5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmlsZU5hbWUgPSBlbnRyeS5maWxlTmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUgJiYgZmlsZU5hbWUuZW5kc1dpdGgoJy5tZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHJpbmcoMCwgZmlsZU5hbWUubGVuZ3RoIC0gMykgKyAnLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgZW50cnkubGV2ZWw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gJyAgICAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gJyogJztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b2NDb250ZW50ICs9IGA8YSBocmVmPVwiJHtmaWxlTmFtZX1cIj4ke2VudHJ5LnRpdGxlfTwvYT5cXG5gO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0b2NDb250ZW50ICs9IGAke2VudHJ5LnRpdGxlfVxcbmA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocGFnZUNvbnRlbnQgJiYgcGFnZUNvbnRlbnQuY29udGVudCkge1xyXG4gICAgICAgICAgICB0b2NDb250ZW50ID0gcGFnZUNvbnRlbnQuY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b2NDb250ZW50KSB7XHJcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKHRvY1BhdGgsIHRvY0NvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSB3cml0ZVN0dTNQYWdlcyhyb290UGF0aDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSkge1xyXG4gICAgICAgIGNvbnN0IHRvY0ZpbGVQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3RvYy5tZCcpO1xyXG4gICAgICAgIGNvbnN0IHRvY0VudHJpZXMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUucGFnZSkge1xyXG4gICAgICAgICAgICBjb25zdCBhdXRvR2VuZXJhdGVFeHRlbnNpb24gPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5wYWdlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLXBhZ2UtYXV0by1nZW5lcmF0ZS10b2MnKTtcclxuICAgICAgICAgICAgY29uc3Qgc2hvdWxkQXV0b0dlbmVyYXRlID0gYXV0b0dlbmVyYXRlRXh0ZW5zaW9uICYmIGF1dG9HZW5lcmF0ZUV4dGVuc2lvbi52YWx1ZUJvb2xlYW4gPT09IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gdGhpcy5nZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5wYWdlKTtcclxuICAgICAgICAgICAgY29uc3QgcGFnZXNQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzJyk7XHJcbiAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMocGFnZXNQYXRoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3JpdGVTdHUzUGFnZShwYWdlc1BhdGgsIGltcGxlbWVudGF0aW9uR3VpZGUsIGltcGxlbWVudGF0aW9uR3VpZGUucGFnZSwgMSwgdG9jRW50cmllcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVUYWJsZU9mQ29udGVudHMocm9vdFBhdGgsIHRvY0VudHJpZXMsIHNob3VsZEF1dG9HZW5lcmF0ZSwgcGFnZUNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSB3cml0ZVI0UGFnZXMocm9vdFBhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlKSB7XHJcbiAgICAgICAgY29uc3QgdG9jRW50cmllcyA9IFtdO1xyXG4gICAgICAgIGxldCBzaG91bGRBdXRvR2VuZXJhdGUgPSB0cnVlO1xyXG4gICAgICAgIGxldCByb290UGFnZUNvbnRlbnQ7XHJcbiAgICAgICAgbGV0IHJvb3RQYWdlRmlsZU5hbWU7XHJcblxyXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24gJiYgaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UpIHtcclxuICAgICAgICAgICAgY29uc3QgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbi5wYWdlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLXBhZ2UtYXV0by1nZW5lcmF0ZS10b2MnKTtcclxuICAgICAgICAgICAgc2hvdWxkQXV0b0dlbmVyYXRlID0gYXV0b0dlbmVyYXRlRXh0ZW5zaW9uICYmIGF1dG9HZW5lcmF0ZUV4dGVuc2lvbi52YWx1ZUJvb2xlYW4gPT09IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcycpO1xyXG4gICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKHBhZ2VzUGF0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UubmFtZVJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZVJlZmVyZW5jZSA9IGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbi5wYWdlLm5hbWVSZWZlcmVuY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kQ29udGFpbmVkID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFpbmVkLCAoY29udGFpbmVkKSA9PiBjb250YWluZWQuaWQgPT09IG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlLnN1YnN0cmluZygxKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5ID0gZm91bmRDb250YWluZWQgJiYgZm91bmRDb250YWluZWQucmVzb3VyY2VUeXBlID09PSAnQmluYXJ5JyA/IDxSNEJpbmFyeT4gZm91bmRDb250YWluZWQgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5hcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFBhZ2VDb250ZW50ID0gbmV3IEJ1ZmZlcihiaW5hcnkuZGF0YSwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQYWdlRmlsZU5hbWUgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS50aXRsZS5yZXBsYWNlKC8gL2csICdfJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJvb3RQYWdlRmlsZU5hbWUuZW5kc1dpdGgoJy5tZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UGFnZUZpbGVOYW1lICs9ICcubWQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLndyaXRlUjRQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UsIDEsIHRvY0VudHJpZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQXBwZW5kIFRPQyBFbnRyaWVzIHRvIHRoZSB0b2MubWQgZmlsZSBpbiB0aGUgdGVtcGxhdGVcclxuICAgICAgICB0aGlzLmdlbmVyYXRlVGFibGVPZkNvbnRlbnRzKHJvb3RQYXRoLCB0b2NFbnRyaWVzLCBzaG91bGRBdXRvR2VuZXJhdGUsIHsgZmlsZU5hbWU6IHJvb3RQYWdlRmlsZU5hbWUsIGNvbnRlbnQ6IHJvb3RQYWdlQ29udGVudCB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGV4cG9ydChmb3JtYXQ6IHN0cmluZywgZXhlY3V0ZUlnUHVibGlzaGVyOiBib29sZWFuLCB1c2VUZXJtaW5vbG9neVNlcnZlcjogYm9vbGVhbiwgdXNlTGF0ZXN0OiBib29sZWFuLCBkb3dubG9hZE91dHB1dDogYm9vbGVhbiwgaW5jbHVkZUlnUHVibGlzaGVySmFyOiBib29sZWFuLCB0ZXN0Q2FsbGJhY2s/OiAobWVzc2FnZSwgZXJyPykgPT4gdm9pZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1bmRsZUV4cG9ydGVyID0gbmV3IEJ1bmRsZUV4cG9ydGVyKHRoaXMuZmhpclNlcnZlckJhc2UsIHRoaXMuZmhpclNlcnZlcklkLCB0aGlzLmZoaXJWZXJzaW9uLCB0aGlzLmZoaXIsIHRoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkKTtcclxuICAgICAgICAgICAgY29uc3QgaXNYbWwgPSBmb3JtYXQgPT09ICd4bWwnIHx8IGZvcm1hdCA9PT0gJ2FwcGxpY2F0aW9uL3htbCcgfHwgZm9ybWF0ID09PSAnYXBwbGljYXRpb24vZmhpcit4bWwnO1xyXG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb24gPSAoIWlzWG1sID8gJy5qc29uJyA6ICcueG1sJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhvbWVkaXIgPSByZXF1aXJlKCdvcycpLmhvbWVkaXIoKTtcclxuICAgICAgICAgICAgY29uc3QgZmhpclNlcnZlckNvbmZpZyA9IF8uZmluZChmaGlyQ29uZmlnLnNlcnZlcnMsIChzZXJ2ZXI6IEZoaXJDb25maWdTZXJ2ZXIpID0+IHNlcnZlci5pZCA9PT0gdGhpcy5maGlyU2VydmVySWQpO1xyXG4gICAgICAgICAgICBsZXQgY29udHJvbDtcclxuICAgICAgICAgICAgbGV0IGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZTtcclxuXHJcbiAgICAgICAgICAgIHRtcC5kaXIoKHRtcERpckVyciwgcm9vdFBhdGgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0bXBEaXJFcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5lcnJvcih0bXBEaXJFcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGNyZWF0aW5nIGEgdGVtcG9yYXJ5IGRpcmVjdG9yeTogJyArIHRtcERpckVycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdpZy5qc29uJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVuZGxlOiBCdW5kbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWNrYWdlSWQgPSByb290UGF0aC5zdWJzdHJpbmcocm9vdFBhdGgubGFzdEluZGV4T2YocGF0aC5zZXApICsgMSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucGFja2FnZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdDcmVhdGVkIHRlbXAgZGlyZWN0b3J5LiBSZXRyaWV2aW5nIHJlc291cmNlcyBmb3IgaW1wbGVtZW50YXRpb24gZ3VpZGUuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXBhcmUgSUcgUHVibGlzaGVyIHBhY2thZ2VcclxuICAgICAgICAgICAgICAgICAgICBidW5kbGVFeHBvcnRlci5nZXRCdW5kbGUoZmFsc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZSA9IDxCdW5kbGU+IHJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZXNEaXIgPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcmVzb3VyY2VzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnUmVzb3VyY2VzIHJldHJpZXZlZC4gUGFja2FnaW5nLicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlLmVudHJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBidW5kbGUuZW50cnlbaV0ucmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xlYW5SZXNvdXJjZSA9IEJ1bmRsZUV4cG9ydGVyLmNsZWFudXBSZXNvdXJjZShyZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VUeXBlID0gcmVzb3VyY2UucmVzb3VyY2VUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gcmVzb3VyY2UuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VEaXIgPSBwYXRoLmpvaW4ocmVzb3VyY2VzRGlyLCByZXNvdXJjZVR5cGUudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc291cmNlUGF0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc291cmNlQ29udGVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZVR5cGUgPT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJyAmJiBpZCA9PT0gdGhpcy5pbXBsZW1lbnRhdGlvbkd1aWRlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlID0gcmVzb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbXBsZW1lbnRhdGlvbkd1aWRlIG11c3QgYmUgZ2VuZXJhdGVkIGFzIGFuIHhtbCBmaWxlIGZvciB0aGUgSUcgUHVibGlzaGVyIGluIFNUVTMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1htbCAmJiByZXNvdXJjZVR5cGUgIT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZUNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShjbGVhblJlc291cmNlLCBudWxsLCAnXFx0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlUGF0aCA9IHBhdGguam9pbihyZXNvdXJjZURpciwgaWQgKyAnLmpzb24nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZUNvbnRlbnQgPSB0aGlzLmZoaXIub2JqVG9YbWwoY2xlYW5SZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlQ29udGVudCA9IHZrYmVhdXRpZnkueG1sKHJlc291cmNlQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlUGF0aCA9IHBhdGguam9pbihyZXNvdXJjZURpciwgaWQgKyAnLnhtbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhyZXNvdXJjZURpcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhyZXNvdXJjZVBhdGgsIHJlc291cmNlQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBpbXBsZW1lbnRhdGlvbiBndWlkZSB3YXMgbm90IGZvdW5kIGluIHRoZSBidW5kbGUgcmV0dXJuZWQgYnkgdGhlIHNlcnZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gPT09ICdzdHUzJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2wgPSB0aGlzLmdldFN0dTNDb250cm9sKGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSwgPFNUVTNCdW5kbGU+PGFueT4gYnVuZGxlLCB0aGlzLmdldEZoaXJDb250cm9sVmVyc2lvbihmaGlyU2VydmVyQ29uZmlnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2wgPSB0aGlzLmdldFI0Q29udHJvbChpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UsIDxSNEJ1bmRsZT48YW55PiBidW5kbGUsIHRoaXMuZ2V0RmhpckNvbnRyb2xWZXJzaW9uKGZoaXJTZXJ2ZXJDb25maWcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXREZXBlbmRlbmNpZXMoY29udHJvbCwgaXNYbWwsIHJlc291cmNlc0RpciwgdGhpcy5maGlyLCBmaGlyU2VydmVyQ29uZmlnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29weSB0aGUgY29udGVudHMgb2YgdGhlIGlnLXB1Ymxpc2hlci10ZW1wbGF0ZSBmb2xkZXIgdG8gdGhlIGV4cG9ydCB0ZW1wb3JhcnkgZm9sZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vJywgJ2lnLXB1Ymxpc2hlci10ZW1wbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weVN5bmModGVtcGxhdGVQYXRoLCByb290UGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV3JpdGUgdGhlIGlnLmpzb24gZmlsZSB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xDb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoY29udHJvbCwgbnVsbCwgJ1xcdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhjb250cm9sUGF0aCwgY29udHJvbENvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdyaXRlIHRoZSBpbnRybywgc3VtbWFyeSBhbmQgc2VhcmNoIE1EIGZpbGVzIGZvciBlYWNoIHJlc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goYnVuZGxlLmVudHJ5LCAoZW50cnkpID0+IHRoaXMud3JpdGVGaWxlc0ZvclJlc291cmNlcyhyb290UGF0aCwgZW50cnkucmVzb3VyY2UpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlcyhyb290UGF0aCwgYnVuZGxlLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gPT09ICdzdHUzJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JpdGVTdHUzUGFnZXMocm9vdFBhdGgsIGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JpdGVSNFBhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0RvbmUgYnVpbGRpbmcgcGFja2FnZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldElnUHVibGlzaGVyKHVzZUxhdGVzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChpZ1B1Ymxpc2hlckxvY2F0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5jbHVkZUlnUHVibGlzaGVySmFyICYmIGlnUHVibGlzaGVyTG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdDb3B5aW5nIElHIFB1Ymxpc2hlciBKQVIgdG8gd29ya2luZyBkaXJlY3RvcnkuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgamFyRmlsZU5hbWUgPSBpZ1B1Ymxpc2hlckxvY2F0aW9uLnN1YnN0cmluZyhpZ1B1Ymxpc2hlckxvY2F0aW9uLmxhc3RJbmRleE9mKHBhdGguc2VwKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3RKYXJQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBqYXJGaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weVN5bmMoaWdQdWJsaXNoZXJMb2NhdGlvbiwgZGVzdEphclBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhlY3V0ZUlnUHVibGlzaGVyIHx8ICFpZ1B1Ymxpc2hlckxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnY29tcGxldGUnLCAnRG9uZS4gWW91IHdpbGwgYmUgcHJvbXB0ZWQgdG8gZG93bmxvYWQgdGhlIHBhY2thZ2UgaW4gYSBtb21lbnQuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdENhbGxiYWNrKHJvb3RQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXBsb3lEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vd3d3cm9vdC9pZ3MnLCB0aGlzLmZoaXJTZXJ2ZXJJZCwgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMoZGVwbG95RGlyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZ1B1Ymxpc2hlclZlcnNpb24gPSB1c2VMYXRlc3QgPyAnbGF0ZXN0JyA6ICdkZWZhdWx0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2Nlc3MgPSBzZXJ2ZXJDb25maWcuamF2YUxvY2F0aW9uIHx8ICdqYXZhJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGphclBhcmFtcyA9IFsnLWphcicsIGlnUHVibGlzaGVyTG9jYXRpb24sICctaWcnLCBjb250cm9sUGF0aF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VUZXJtaW5vbG9neVNlcnZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGphclBhcmFtcy5wdXNoKCctdHgnLCAnTi9BJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCBgUnVubmluZyAke2lnUHVibGlzaGVyVmVyc2lvbn0gSUcgUHVibGlzaGVyOiAke2phclBhcmFtcy5qb2luKCcgJyl9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYFNwYXduaW5nIEZISVIgSUcgUHVibGlzaGVyIEphdmEgcHJvY2VzcyBhdCAke3Byb2Nlc3N9IHdpdGggcGFyYW1zICR7amFyUGFyYW1zfWApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlnUHVibGlzaGVyUHJvY2VzcyA9IHNwYXduKHByb2Nlc3MsIGphclBhcmFtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQdWJsaXNoZXJQcm9jZXNzLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKHRtcC50bXBkaXIsICdYWFgnKS5yZXBsYWNlKGhvbWVkaXIsICdYWFgnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgJiYgbWVzc2FnZS50cmltKCkucmVwbGFjZSgvXFwuL2csICcnKSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Muc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UodG1wLnRtcGRpciwgJ1hYWCcpLnJlcGxhY2UoaG9tZWRpciwgJ1hYWCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnRyaW0oKS5yZXBsYWNlKC9cXC4vZywgJycpICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUHVibGlzaGVyUHJvY2Vzcy5vbignZXJyb3InLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdFcnJvciBleGVjdXRpbmcgRkhJUiBJRyBQdWJsaXNoZXI6ICcgKyBlcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IobWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnZXJyb3InLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUHVibGlzaGVyUHJvY2Vzcy5vbignZXhpdCcsIChjb2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYElHIFB1Ymxpc2hlciBpcyBkb25lIGV4ZWN1dGluZyBmb3IgJHtyb290UGF0aH1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnSUcgUHVibGlzaGVyIGZpbmlzaGVkIHdpdGggY29kZSAnICsgY29kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ1dvblxcJ3QgY29weSBvdXRwdXQgdG8gZGVwbG95bWVudCBwYXRoLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdjb21wbGV0ZScsICdEb25lLiBZb3Ugd2lsbCBiZSBwcm9tcHRlZCB0byBkb3dubG9hZCB0aGUgcGFja2FnZSBpbiBhIG1vbWVudC4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdDb3B5aW5nIG91dHB1dCB0byBkZXBsb3ltZW50IHBhdGguJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZWRQYXRoID0gcGF0aC5yZXNvbHZlKHJvb3RQYXRoLCAnZ2VuZXJhdGVkX291dHB1dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXRQYXRoID0gcGF0aC5yZXNvbHZlKHJvb3RQYXRoLCAnb3V0cHV0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgRGVsZXRpbmcgY29udGVudCBnZW5lcmF0ZWQgYnkgaWcgcHVibGlzaGVyIGluICR7Z2VuZXJhdGVkUGF0aH1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVtcHR5RGlyKGdlbmVyYXRlZFBhdGgsIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBDb3B5aW5nIG91dHB1dCBmcm9tICR7b3V0cHV0UGF0aH0gdG8gJHtkZXBsb3lEaXJ9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5jb3B5KG91dHB1dFBhdGgsIGRlcGxveURpciwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnZXJyb3InLCAnRXJyb3IgY29weWluZyBjb250ZW50cyB0byBkZXBsb3ltZW50IHBhdGguJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmFsTWVzc2FnZSA9IGBEb25lIGV4ZWN1dGluZyB0aGUgRkhJUiBJRyBQdWJsaXNoZXIuIFlvdSBtYXkgdmlldyB0aGUgSUcgPGEgaHJlZj1cIi9pbXBsZW1lbnRhdGlvbi1ndWlkZS8ke3RoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkfS92aWV3XCI+aGVyZTwvYT4uYCArIChkb3dubG9hZE91dHB1dCA/ICcgWW91IHdpbGwgYmUgcHJvbXB0ZWQgdG8gZG93bmxvYWQgdGhlIHBhY2thZ2UgaW4gYSBtb21lbnQuJyA6ICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdjb21wbGV0ZScsIGZpbmFsTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkb3dubG9hZE91dHB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBVc2VyIGluZGljYXRlZCB0aGV5IGRvbid0IG5lZWQgdG8gZG93bmxvYWQuIFJlbW92aW5nIHRlbXBvcmFyeSBkaXJlY3RvcnkgJHtyb290UGF0aH1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW1wdHlEaXIocm9vdFBhdGgsIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBEb25lIHJlbW92aW5nIHRlbXBvcmFyeSBkaXJlY3RvcnkgJHtyb290UGF0aH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdlcnJvcicsICdFcnJvciBkdXJpbmcgZXhwb3J0OiAnICsgZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdENhbGxiYWNrKHJvb3RQYXRoLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=