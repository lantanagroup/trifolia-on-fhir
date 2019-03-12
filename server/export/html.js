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
    getStu3Control(extension, implementationGuide, bundle, version) {
        const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
        const canonicalBaseMatch = canonicalBaseRegex.exec(implementationGuide.url);
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
            'npm-name': implementationGuide.id + '-npm',
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
        control.dependencyList = _.map(dependencyExtensions, (dependencyExtension) => {
            const locationExtension = _.find(dependencyExtension.extension, (next) => next.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-location');
            const nameExtension = _.find(dependencyExtension.extension, (next) => next.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-name');
            const versionExtension = _.find(dependencyExtension.extension, (next) => next.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-version');
            return {
                location: locationExtension ? locationExtension.valueUri : '',
                name: nameExtension ? nameExtension.valueString : '',
                version: versionExtension ? versionExtension.valueString : ''
            };
        });
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
    getR4Control(extension, implementationGuide, bundle, version) {
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
        control.dependencyList = _.map(implementationGuide.dependsOn, (dependsOn) => {
            const locationExtension = _.find(dependsOn.extension, (extension) => extension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-location');
            const nameExtension = _.find(dependsOn.extension, (extension) => extension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-name');
            return {
                location: locationExtension ? locationExtension.valueString : '',
                name: nameExtension ? nameExtension.valueString : '',
                version: dependsOn.version
            };
        });
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
                            const resourceType = resource.resourceType;
                            const id = bundle.entry[i].resource.id;
                            const resourceDir = path.join(resourcesDir, resourceType.toLowerCase());
                            let resourcePath;
                            let resourceContent = null;
                            if (resourceType == 'ImplementationGuide' && id === this.implementationGuideId) {
                                implementationGuideResource = resource;
                            }
                            // ImplementationGuide must be generated as an xml file for the IG Publisher in STU3.
                            if (!isXml && resourceType !== 'ImplementationGuide') {
                                resourceContent = JSON.stringify(bundle.entry[i].resource, null, '\t');
                                resourcePath = path.join(resourceDir, id + '.json');
                            }
                            else {
                                resourceContent = this.fhir.objToXml(bundle.entry[i].resource);
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
                            control = this.getStu3Control(extension, implementationGuideResource, bundle, this.getFhirControlVersion(fhirServerConfig));
                        }
                        else {
                            control = this.getR4Control(extension, implementationGuideResource, bundle, this.getFhirControlVersion(fhirServerConfig));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpREFBb0M7QUFlcEMsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixpQ0FBaUM7QUFDakMsMkJBQTJCO0FBQzNCLHlDQUF5QztBQVN6QyxxQ0FBd0M7QUFHeEMsTUFBTSxVQUFVLEdBQWdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkQsTUFBTSxZQUFZLEdBQWtCLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFRekQsTUFBYSxZQUFZO0lBWXJCLFlBQVksY0FBc0IsRUFBRSxZQUFvQixFQUFFLFdBQW1CLEVBQUUsSUFBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBZ0IsRUFBRSxxQkFBNkI7UUFYbkosUUFBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQVk5QixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztJQUN2RCxDQUFDO0lBRU8sY0FBYyxDQUFDLElBQXNCO1FBQ3pDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxPQUFPO1NBQ1Y7UUFFRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUMxQixPQUFnQixJQUFJLENBQUM7U0FDeEI7UUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFB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QUFDO0NBQ0o7QUFuNkJELG9DQW02QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0ZoaXIgYXMgRmhpck1vZHVsZX0gZnJvbSAnZmhpci9maGlyJztcbmltcG9ydCB7U2VydmVyfSBmcm9tICdzb2NrZXQuaW8nO1xuaW1wb3J0IHtzcGF3bn0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQge1xuICAgIERvbWFpblJlc291cmNlLFxuICAgIEh1bWFuTmFtZSxcbiAgICBCdW5kbGUgYXMgU1RVM0J1bmRsZSxcbiAgICBCaW5hcnkgYXMgU1RVM0JpbmFyeSxcbiAgICBJbXBsZW1lbnRhdGlvbkd1aWRlIGFzIFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLFxuICAgIFBhZ2VDb21wb25lbnRcbn0gZnJvbSAnLi4vLi4vc3JjL2FwcC9tb2RlbHMvc3R1My9maGlyJztcbmltcG9ydCB7XG4gICAgQmluYXJ5IGFzIFI0QmluYXJ5LFxuICAgIEJ1bmRsZSBhcyBSNEJ1bmRsZSxcbiAgICBJbXBsZW1lbnRhdGlvbkd1aWRlIGFzIFI0SW1wbGVtZW50YXRpb25HdWlkZSxcbiAgICBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudFxufSBmcm9tICcuLi8uLi9zcmMvYXBwL21vZGVscy9yNC9maGlyJztcbmltcG9ydCAqIGFzIGxvZzRqcyBmcm9tICdsb2c0anMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgKiBhcyBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJ2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB0bXAgZnJvbSAndG1wJztcbmltcG9ydCAqIGFzIHZrYmVhdXRpZnkgZnJvbSAndmtiZWF1dGlmeSc7XG5pbXBvcnQge1xuICAgIEZoaXIsXG4gICAgRmhpckNvbmZpZyxcbiAgICBGaGlyQ29uZmlnU2VydmVyLFxuICAgIEZoaXJDb250cm9sLFxuICAgIEZoaXJDb250cm9sRGVwZW5kZW5jeSxcbiAgICBTZXJ2ZXJDb25maWdcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvbW9kZWxzJztcbmltcG9ydCB7QnVuZGxlRXhwb3J0ZXJ9IGZyb20gJy4vYnVuZGxlJztcbmltcG9ydCBCdW5kbGUgPSBGaGlyLkJ1bmRsZTtcblxuY29uc3QgZmhpckNvbmZpZyA9IDxGaGlyQ29uZmlnPiBjb25maWcuZ2V0KCdmaGlyJyk7XG5jb25zdCBzZXJ2ZXJDb25maWcgPSA8U2VydmVyQ29uZmlnPiBjb25maWcuZ2V0KCdzZXJ2ZXInKTtcblxuaW50ZXJmYWNlIFRhYmxlT2ZDb250ZW50c0VudHJ5IHtcbiAgICBsZXZlbDogbnVtYmVyO1xuICAgIGZpbGVOYW1lOiBzdHJpbmc7XG4gICAgdGl0bGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEh0bWxFeHBvcnRlciB7XG4gICAgcmVhZG9ubHkgbG9nID0gbG9nNGpzLmdldExvZ2dlcigpO1xuICAgIHJlYWRvbmx5IGZoaXJTZXJ2ZXJCYXNlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZmhpclNlcnZlcklkOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZmhpclZlcnNpb246IHN0cmluZztcbiAgICByZWFkb25seSBmaGlyOiBGaGlyTW9kdWxlO1xuICAgIHJlYWRvbmx5IGlvOiBTZXJ2ZXI7XG4gICAgcmVhZG9ubHkgc29ja2V0SWQ6IHN0cmluZztcbiAgICByZWFkb25seSBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ6IHN0cmluZztcblxuICAgIHByaXZhdGUgcGFja2FnZUlkOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihmaGlyU2VydmVyQmFzZTogc3RyaW5nLCBmaGlyU2VydmVySWQ6IHN0cmluZywgZmhpclZlcnNpb246IHN0cmluZywgZmhpcjogRmhpck1vZHVsZSwgaW86IFNlcnZlciwgc29ja2V0SWQ6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZUlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5maGlyU2VydmVyQmFzZSA9IGZoaXJTZXJ2ZXJCYXNlO1xuICAgICAgICB0aGlzLmZoaXJTZXJ2ZXJJZCA9IGZoaXJTZXJ2ZXJJZDtcbiAgICAgICAgdGhpcy5maGlyVmVyc2lvbiA9IGZoaXJWZXJzaW9uO1xuICAgICAgICB0aGlzLmZoaXIgPSBmaGlyO1xuICAgICAgICB0aGlzLmlvID0gaW87XG4gICAgICAgIHRoaXMuc29ja2V0SWQgPSBzb2NrZXRJZDtcbiAgICAgICAgdGhpcy5pbXBsZW1lbnRhdGlvbkd1aWRlSWQgPSBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREaXNwbGF5TmFtZShuYW1lOiBzdHJpbmd8SHVtYW5OYW1lKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gPHN0cmluZz4gbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkaXNwbGF5ID0gbmFtZS5mYW1pbHk7XG5cbiAgICAgICAgaWYgKG5hbWUuZ2l2ZW4pIHtcbiAgICAgICAgICAgIGlmIChkaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheSArPSAnLCAnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRpc3BsYXkgKz0gbmFtZS5naXZlbi5qb2luKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlzcGxheTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgY3JlYXRlVGFibGVGcm9tQXJyYXkoaGVhZGVycywgZGF0YSkge1xuICAgICAgICBsZXQgb3V0cHV0ID0gJzx0YWJsZT5cXG48dGhlYWQ+XFxuPHRyPlxcbic7XG5cbiAgICAgICAgXy5lYWNoKGhlYWRlcnMsIChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIG91dHB1dCArPSBgPHRoPiR7aGVhZGVyfTwvdGg+XFxuYDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb3V0cHV0ICs9ICc8L3RyPlxcbjwvdGhlYWQ+XFxuPHRib2R5Plxcbic7XG5cbiAgICAgICAgXy5lYWNoKGRhdGEsIChyb3c6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gJzx0cj5cXG4nO1xuXG4gICAgICAgICAgICBfLmVhY2gocm93LCAoY2VsbCkgPT4ge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBgPHRkPiR7Y2VsbH08L3RkPlxcbmA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgb3V0cHV0ICs9ICc8L3RyPlxcbic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG91dHB1dCArPSAnPC90Ym9keT5cXG48L3RhYmxlPlxcbic7XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbmRTb2NrZXRNZXNzYWdlKHN0YXR1cywgbWVzc2FnZSkge1xuICAgICAgICBpZiAoIXRoaXMuc29ja2V0SWQpIHtcbiAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKCdXb25cXCd0IHNlbmQgc29ja2V0IG1lc3NhZ2UgZm9yIGV4cG9ydCBiZWNhdXNlIHRoZSBvcmlnaW5hbCByZXF1ZXN0IGRpZCBub3Qgc3BlY2lmeSBhIHNvY2tldElkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pbykge1xuICAgICAgICAgICAgdGhpcy5pby50byh0aGlzLnNvY2tldElkKS5lbWl0KCdodG1sLWV4cG9ydCcsIHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlSWQ6IHRoaXMucGFja2FnZUlkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZ1B1Ymxpc2hlcih1c2VMYXRlc3Q6IGJvb2xlYW4sIGV4ZWN1dGVJZ1B1Ymxpc2hlcjogYm9vbGVhbik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGlmICghZXhlY3V0ZUlnUHVibGlzaGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gJ29yZy5obDcuZmhpci5pZ3B1Ymxpc2hlci5qYXInO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vaWctcHVibGlzaGVyJyk7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0RmlsZVBhdGggPSBwYXRoLmpvaW4oZGVmYXVsdFBhdGgsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgaWYgKHVzZUxhdGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdSZXF1ZXN0IHRvIGdldCBsYXRlc3QgdmVyc2lvbiBvZiBGSElSIElHIHB1Ymxpc2hlci4gUmV0cmlldmluZyBmcm9tOiAnICsgZmhpckNvbmZpZy5sYXRlc3RQdWJsaXNoZXIpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnRG93bmxvYWRpbmcgbGF0ZXN0IEZISVIgSUcgcHVibGlzaGVyJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBDaGVjayBodHRwOi8vYnVpbGQuZmhpci5vcmcvdmVyc2lvbi5pbmZvIGZpcnN0XG5cbiAgICAgICAgICAgICAgICBycChmaGlyQ29uZmlnLmxhdGVzdFB1Ymxpc2hlciwgeyBlbmNvZGluZzogbnVsbCB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoJ1N1Y2Nlc3NmdWxseSBkb3dubG9hZGVkIGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgUHVibGlzaGVyLiBFbnN1cmluZyBsYXRlc3QgZGlyZWN0b3J5IGV4aXN0cycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3RQYXRoID0gcGF0aC5qb2luKGRlZmF1bHRQYXRoLCAnbGF0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKGxhdGVzdFBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmYgPSBCdWZmZXIuZnJvbShyZXN1bHRzLCAndXRmOCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0RmlsZVBhdGggPSBwYXRoLmpvaW4obGF0ZXN0UGF0aCwgZmlsZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZygnU2F2aW5nIEZISVIgSUcgcHVibGlzaGVyIHRvICcgKyBsYXRlc3RGaWxlUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobGF0ZXN0RmlsZVBhdGgsIGJ1ZmYpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGxhdGVzdEZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGBFcnJvciBnZXR0aW5nIGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0VuY291bnRlcmVkIGVycm9yIGRvd25sb2FkaW5nIGxhdGVzdCBJRyBwdWJsaXNoZXIsIHdpbGwgdXNlIHByZS1sb2FkZWQvZGVmYXVsdCBJRyBwdWJsaXNoZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGVmYXVsdEZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdVc2luZyBidWlsdC1pbiB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyIGZvciBleHBvcnQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdVc2luZyBleGlzdGluZy9kZWZhdWx0IHZlcnNpb24gb2YgRkhJUiBJRyBwdWJsaXNoZXInKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRlZmF1bHRGaWxlUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXI6IHN0cmluZywgZXh0ZW5zaW9uRmlsZU5hbWU6IHN0cmluZywgaXNYbWw6IGJvb2xlYW4sIGZoaXI6IEZoaXJNb2R1bGUpIHtcbiAgICAgICAgY29uc3Qgc291cmNlRXh0ZW5zaW9uc0RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9zcmMvYXNzZXRzL3N0dTMvZXh0ZW5zaW9ucycpO1xuICAgICAgICBjb25zdCBzb3VyY2VFeHRlbnNpb25GaWxlTmFtZSA9IHBhdGguam9pbihzb3VyY2VFeHRlbnNpb25zRGlyLCBleHRlbnNpb25GaWxlTmFtZSk7XG4gICAgICAgIGxldCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUgPSBwYXRoLmpvaW4oZGVzdEV4dGVuc2lvbnNEaXIsIGV4dGVuc2lvbkZpbGVOYW1lKTtcblxuICAgICAgICBpZiAoIWlzWG1sKSB7XG4gICAgICAgICAgICBmcy5jb3B5U3luYyhzb3VyY2VFeHRlbnNpb25GaWxlTmFtZSwgZGVzdEV4dGVuc2lvbkZpbGVOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbkpzb24gPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlRXh0ZW5zaW9uRmlsZU5hbWUpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb25YbWwgPSBmaGlyLmpzb25Ub1htbChleHRlbnNpb25Kc29uKTtcblxuICAgICAgICAgICAgZGVzdEV4dGVuc2lvbkZpbGVOYW1lID0gZGVzdEV4dGVuc2lvbkZpbGVOYW1lLnN1YnN0cmluZygwLCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUuaW5kZXhPZignLmpzb24nKSkgKyAnLnhtbCc7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRlc3RFeHRlbnNpb25GaWxlTmFtZSwgZXh0ZW5zaW9uWG1sKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldERlcGVuZGVuY2llcyhjb250cm9sLCBpc1htbDogYm9vbGVhbiwgcmVzb3VyY2VzRGlyOiBzdHJpbmcsIGZoaXI6IEZoaXJNb2R1bGUsIGZoaXJTZXJ2ZXJDb25maWc6IEZoaXJDb25maWdTZXJ2ZXIpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBpc1N0dTMgPSBmaGlyU2VydmVyQ29uZmlnICYmIGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA9PT0gJ3N0dTMnO1xuXG4gICAgICAgIC8vIExvYWQgdGhlIGlnIGRlcGVuZGVuY3kgZXh0ZW5zaW9ucyBpbnRvIHRoZSByZXNvdXJjZXMgZGlyZWN0b3J5XG4gICAgICAgIGlmIChpc1N0dTMgJiYgY29udHJvbC5kZXBlbmRlbmN5TGlzdCAmJiBjb250cm9sLmRlcGVuZGVuY3lMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGRlc3RFeHRlbnNpb25zRGlyID0gcGF0aC5qb2luKHJlc291cmNlc0RpciwgJ3N0cnVjdHVyZWRlZmluaXRpb24nKTtcblxuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhkZXN0RXh0ZW5zaW9uc0Rpcik7XG5cbiAgICAgICAgICAgIHRoaXMuY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0RpciwgJ2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5Lmpzb24nLCBpc1htbCwgZmhpcik7XG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS12ZXJzaW9uLmpzb24nLCBpc1htbCwgZmhpcik7XG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS1sb2NhdGlvbi5qc29uJywgaXNYbWwsIGZoaXIpO1xuICAgICAgICAgICAgdGhpcy5jb3B5RXh0ZW5zaW9uKGRlc3RFeHRlbnNpb25zRGlyLCAnZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbmFtZS5qc29uJywgaXNYbWwsIGZoaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7ICAgICAgICAgICAvLyBUaGlzIGlzbid0IGFjdHVhbGx5IG5lZWRlZCwgc2luY2UgdGhlIElHIFB1Ymxpc2hlciBhdHRlbXB0cyB0byByZXNvbHZlIHRoZXNlIGRlcGVuZGVuY3kgYXV0b21hdGljYWxseVxuXG4gICAgICAgIC8qXG4gICAgICAgIC8vIEF0dGVtcHQgdG8gcmVzb2x2ZSB0aGUgZGVwZW5kZW5jeSdzIGRlZmluaXRpb25zIGFuZCBpbmNsdWRlIGl0IGluIHRoZSBwYWNrYWdlXG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IF8ubWFwKGNvbnRyb2wuZGVwZW5kZW5jeUxpc3QsIChkZXBlbmRlbmN5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5VXJsID1cbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5LmxvY2F0aW9uICtcbiAgICAgICAgICAgICAgICAoZGVwZW5kZW5jeS5sb2NhdGlvbi5lbmRzV2l0aCgnLycpID8gJycgOiAnLycpICsgJ2RlZmluaXRpb25zLicgK1xuICAgICAgICAgICAgICAgIChpc1htbCA/ICd4bWwnIDogJ2pzb24nKSArXG4gICAgICAgICAgICAgICAgJy56aXAnO1xuICAgICAgICAgICAgcmV0dXJuIGdldERlcGVuZGVuY3koZGVwZW5kZW5jeVVybCwgZGVwZW5kZW5jeS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgXG4gICAgICAgIFEuYWxsKHByb21pc2VzKVxuICAgICAgICAgICAgLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSlcbiAgICAgICAgICAgIC5jYXRjaChkZWZlcnJlZC5yZWplY3QpO1xuICAgIFxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgKi9cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykge1xuICAgICAgICBjb25zdCBjb25maWdWZXJzaW9uID0gZmhpclNlcnZlckNvbmZpZyA/IGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA6IG51bGw7XG5cbiAgICAgICAgLy8gVE9ETzogQWRkIG1vcmUgbG9naWNcbiAgICAgICAgc3dpdGNoIChjb25maWdWZXJzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICdzdHUzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJzMuMC4xJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHVwZGF0ZVRlbXBsYXRlcyhyb290UGF0aCwgYnVuZGxlLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSkge1xuICAgICAgICBjb25zdCBtYWluUmVzb3VyY2VUeXBlcyA9IFsnSW1wbGVtZW50YXRpb25HdWlkZScsICdWYWx1ZVNldCcsICdDb2RlU3lzdGVtJywgJ1N0cnVjdHVyZURlZmluaXRpb24nLCAnQ2FwYWJpbGl0eVN0YXRlbWVudCddO1xuICAgICAgICBjb25zdCBkaXN0aW5jdFJlc291cmNlcyA9IF8uY2hhaW4oYnVuZGxlLmVudHJ5KVxuICAgICAgICAgICAgLm1hcCgoZW50cnkpID0+IGVudHJ5LnJlc291cmNlKVxuICAgICAgICAgICAgLnVuaXEoKHJlc291cmNlKSA9PiByZXNvdXJjZS5pZClcbiAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICBjb25zdCB2YWx1ZVNldHMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdWYWx1ZVNldCcpO1xuICAgICAgICBjb25zdCBjb2RlU3lzdGVtcyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0NvZGVTeXN0ZW0nKTtcbiAgICAgICAgY29uc3QgcHJvZmlsZXMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdTdHJ1Y3R1cmVEZWZpbml0aW9uJyAmJiAoIXJlc291cmNlLmJhc2VEZWZpbml0aW9uIHx8ICFyZXNvdXJjZS5iYXNlRGVmaW5pdGlvbi5lbmRzV2l0aCgnRXh0ZW5zaW9uJykpKTtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9ucyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ1N0cnVjdHVyZURlZmluaXRpb24nICYmIHJlc291cmNlLmJhc2VEZWZpbml0aW9uICYmIHJlc291cmNlLmJhc2VEZWZpbml0aW9uLmVuZHNXaXRoKCdFeHRlbnNpb24nKSk7XG4gICAgICAgIGNvbnN0IGNhcGFiaWxpdHlTdGF0ZW1lbnRzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnQ2FwYWJpbGl0eVN0YXRlbWVudCcpO1xuICAgICAgICBjb25zdCBvdGhlclJlc291cmNlcyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IG1haW5SZXNvdXJjZVR5cGVzLmluZGV4T2YocmVzb3VyY2UucmVzb3VyY2VUeXBlKSA8IDApO1xuXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvaW5kZXgubWQnKTtcblxuICAgICAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbkNvbnRlbnQgPSAnIyMjIERlc2NyaXB0aW9uXFxuXFxuJyArIGltcGxlbWVudGF0aW9uR3VpZGUuZGVzY3JpcHRpb24gKyAnXFxuXFxuJztcbiAgICAgICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhpbmRleFBhdGgsIGRlc2NyaXB0aW9uQ29udGVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhY3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdXRob3JzRGF0YSA9IF8ubWFwKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFjdCwgKGNvbnRhY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRFbWFpbCA9IF8uZmluZChjb250YWN0LnRlbGVjb20sICh0ZWxlY29tKSA9PiB0ZWxlY29tLnN5c3RlbSA9PT0gJ2VtYWlsJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbY29udGFjdC5uYW1lLCBmb3VuZEVtYWlsID8gYDxhIGhyZWY9XCJtYWlsdG86JHtmb3VuZEVtYWlsLnZhbHVlfVwiPiR7Zm91bmRFbWFpbC52YWx1ZX08L2E+YCA6ICcnXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBhdXRob3JzQ29udGVudCA9ICcjIyMgQXV0aG9yc1xcblxcbicgKyB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnTmFtZScsICdFbWFpbCddLCBhdXRob3JzRGF0YSkgKyAnXFxuXFxuJztcbiAgICAgICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhpbmRleFBhdGgsIGF1dGhvcnNDb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9maWxlc0RhdGEgPSBfLmNoYWluKHByb2ZpbGVzKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKHByb2ZpbGUpID0+IHByb2ZpbGUubmFtZSlcbiAgICAgICAgICAgICAgICAubWFwKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbYDxhIGhyZWY9XCJTdHJ1Y3R1cmVEZWZpbml0aW9uLSR7cHJvZmlsZS5pZH0uaHRtbFwiPiR7cHJvZmlsZS5uYW1lfTwvYT5gLCBwcm9maWxlLmRlc2NyaXB0aW9uIHx8ICcnXTtcbiAgICAgICAgICAgICAgICB9KS52YWx1ZSgpO1xuICAgICAgICAgICAgY29uc3QgcHJvZmlsZXNUYWJsZSA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0Rlc2NyaXB0aW9uJ10sIHByb2ZpbGVzRGF0YSk7XG4gICAgICAgICAgICBjb25zdCBwcm9maWxlc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvcHJvZmlsZXMubWQnKTtcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKHByb2ZpbGVzUGF0aCwgJyMjIyBQcm9maWxlc1xcblxcbicgKyBwcm9maWxlc1RhYmxlICsgJ1xcblxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV4dGVuc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZXh0RGF0YSA9IF8uY2hhaW4oZXh0ZW5zaW9ucylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChleHRlbnNpb24pID0+IGV4dGVuc2lvbi5uYW1lKVxuICAgICAgICAgICAgICAgIC5tYXAoKGV4dGVuc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2A8YSBocmVmPVwiU3RydWN0dXJlRGVmaW5pdGlvbi0ke2V4dGVuc2lvbi5pZH0uaHRtbFwiPiR7ZXh0ZW5zaW9uLm5hbWV9PC9hPmAsIGV4dGVuc2lvbi5kZXNjcmlwdGlvbiB8fCAnJ107XG4gICAgICAgICAgICAgICAgfSkudmFsdWUoKTtcbiAgICAgICAgICAgIGNvbnN0IGV4dENvbnRlbnQgPSB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnTmFtZScsICdEZXNjcmlwdGlvbiddLCBleHREYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGV4dFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvcHJvZmlsZXMubWQnKTtcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGV4dFBhdGgsICcjIyMgRXh0ZW5zaW9uc1xcblxcbicgKyBleHRDb250ZW50ICsgJ1xcblxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlU2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgdnNDb250ZW50ID0gJyMjIyBWYWx1ZSBTZXRzXFxuXFxuJztcbiAgICAgICAgICAgIGNvbnN0IHZzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy90ZXJtaW5vbG9neS5tZCcpO1xuXG4gICAgICAgICAgICBfLmNoYWluKHZhbHVlU2V0cylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KCh2YWx1ZVNldCkgPT4gdmFsdWVTZXQudGl0bGUgfHwgdmFsdWVTZXQubmFtZSlcbiAgICAgICAgICAgICAgICAuZWFjaCgodmFsdWVTZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdnNDb250ZW50ICs9IGAtIFske3ZhbHVlU2V0LnRpdGxlIHx8IHZhbHVlU2V0Lm5hbWV9XShWYWx1ZVNldC0ke3ZhbHVlU2V0LmlkfS5odG1sKVxcbmA7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKHZzUGF0aCwgdnNDb250ZW50ICsgJ1xcblxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvZGVTeXN0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBjc0NvbnRlbnQgPSAnIyMjIENvZGUgU3lzdGVtc1xcblxcbic7XG4gICAgICAgICAgICBjb25zdCBjc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdGVybWlub2xvZ3kubWQnKTtcblxuICAgICAgICAgICAgXy5jaGFpbihjb2RlU3lzdGVtcylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChjb2RlU3lzdGVtKSA9PiBjb2RlU3lzdGVtLnRpdGxlIHx8IGNvZGVTeXN0ZW0ubmFtZSlcbiAgICAgICAgICAgICAgICAuZWFjaCgoY29kZVN5c3RlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjc0NvbnRlbnQgKz0gYC0gWyR7Y29kZVN5c3RlbS50aXRsZSB8fCBjb2RlU3lzdGVtLm5hbWV9XShWYWx1ZVNldC0ke2NvZGVTeXN0ZW0uaWR9Lmh0bWwpXFxuYDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoY3NQYXRoLCBjc0NvbnRlbnQgKyAnXFxuXFxuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2FwYWJpbGl0eVN0YXRlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgY3NEYXRhID0gXy5jaGFpbihjYXBhYmlsaXR5U3RhdGVtZW50cylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChjYXBhYmlsaXR5U3RhdGVtZW50KSA9PiBjYXBhYmlsaXR5U3RhdGVtZW50Lm5hbWUpXG4gICAgICAgICAgICAgICAgLm1hcCgoY2FwYWJpbGl0eVN0YXRlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2A8YSBocmVmPVwiQ2FwYWJpbGl0eVN0YXRlbWVudC0ke2NhcGFiaWxpdHlTdGF0ZW1lbnQuaWR9Lmh0bWxcIj4ke2NhcGFiaWxpdHlTdGF0ZW1lbnQubmFtZX08L2E+YCwgY2FwYWJpbGl0eVN0YXRlbWVudC5kZXNjcmlwdGlvbiB8fCAnJ107XG4gICAgICAgICAgICAgICAgfSkudmFsdWUoKTtcbiAgICAgICAgICAgIGNvbnN0IGNzQ29udGVudCA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydOYW1lJywgJ0Rlc2NyaXB0aW9uJ10sIGNzRGF0YSk7XG4gICAgICAgICAgICBjb25zdCBjc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvY2Fwc3RhdGVtZW50cy5tZCcpO1xuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoY3NQYXRoLCAnIyMjIENhcGFiaWxpdHlTdGF0ZW1lbnRzXFxuXFxuJyArIGNzQ29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3RoZXJSZXNvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgb0RhdGEgPSBfLmNoYWluKG90aGVyUmVzb3VyY2VzKVxuICAgICAgICAgICAgICAgIC5zb3J0QnkoKHJlc291cmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXNwbGF5ID0gcmVzb3VyY2UudGl0bGUgfHwgdGhpcy5nZXREaXNwbGF5TmFtZShyZXNvdXJjZS5uYW1lKSB8fCByZXNvdXJjZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLnJlc291cmNlVHlwZSArIGRpc3BsYXk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubWFwKChyZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHJlc291cmNlLnRpdGxlIHx8IHRoaXMuZ2V0RGlzcGxheU5hbWUocmVzb3VyY2UubmFtZSkgfHwgcmVzb3VyY2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbcmVzb3VyY2UucmVzb3VyY2VUeXBlLCBgPGEgaHJlZj1cIiR7cmVzb3VyY2UucmVzb3VyY2VUeXBlfS0ke3Jlc291cmNlLmlkfS5odG1sXCI+JHtuYW1lfTwvYT5gXTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICAgICAgY29uc3Qgb0NvbnRlbnQgPSB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnVHlwZScsICdOYW1lJ10sIG9EYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGNzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy9vdGhlci5tZCcpO1xuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoY3NQYXRoLCAnIyMjIE90aGVyIFJlc291cmNlc1xcblxcbicgKyBvQ29udGVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZUZpbGVzRm9yUmVzb3VyY2VzKHJvb3RQYXRoOiBzdHJpbmcsIHJlc291cmNlOiBEb21haW5SZXNvdXJjZSkge1xuICAgICAgICBpZiAoIXJlc291cmNlIHx8ICFyZXNvdXJjZS5yZXNvdXJjZVR5cGUgfHwgcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGludHJvUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgYHNvdXJjZS9wYWdlcy9faW5jbHVkZXMvJHtyZXNvdXJjZS5pZH0taW50cm8ubWRgKTtcbiAgICAgICAgY29uc3Qgc2VhcmNoUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgYHNvdXJjZS9wYWdlcy9faW5jbHVkZXMvJHtyZXNvdXJjZS5pZH0tc2VhcmNoLm1kYCk7XG4gICAgICAgIGNvbnN0IHN1bW1hcnlQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBgc291cmNlL3BhZ2VzL19pbmNsdWRlcy8ke3Jlc291cmNlLmlkfS1zdW1tYXJ5Lm1kYCk7XG5cbiAgICAgICAgbGV0IGludHJvID0gJy0tLVxcbicgK1xuICAgICAgICAgICAgYHRpdGxlOiAke3Jlc291cmNlLnJlc291cmNlVHlwZX0tJHtyZXNvdXJjZS5pZH0taW50cm9cXG5gICtcbiAgICAgICAgICAgICdsYXlvdXQ6IGRlZmF1bHRcXG4nICtcbiAgICAgICAgICAgIGBhY3RpdmU6ICR7cmVzb3VyY2UucmVzb3VyY2VUeXBlfS0ke3Jlc291cmNlLmlkfS1pbnRyb1xcbmAgK1xuICAgICAgICAgICAgJy0tLVxcblxcbic7XG5cbiAgICAgICAgaWYgKCg8YW55PnJlc291cmNlKS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaW50cm8gKz0gKDxhbnk+cmVzb3VyY2UpLmRlc2NyaXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhpbnRyb1BhdGgsIGludHJvKTtcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhzZWFyY2hQYXRoLCAnVE9ETyAtIFNlYXJjaCcpO1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHN1bW1hcnlQYXRoLCAnVE9ETyAtIFN1bW1hcnknKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRTdHUzQ29udHJvbChleHRlbnNpb24sIGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBidW5kbGU6IFNUVTNCdW5kbGUsIHZlcnNpb24pIHtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsQmFzZVJlZ2V4ID0gL14oLis/KVxcL0ltcGxlbWVudGF0aW9uR3VpZGVcXC8uKyQvZ207XG4gICAgICAgIGNvbnN0IGNhbm9uaWNhbEJhc2VNYXRjaCA9IGNhbm9uaWNhbEJhc2VSZWdleC5leGVjKGltcGxlbWVudGF0aW9uR3VpZGUudXJsKTtcbiAgICAgICAgbGV0IGNhbm9uaWNhbEJhc2U7XG5cbiAgICAgICAgaWYgKCFjYW5vbmljYWxCYXNlTWF0Y2ggfHwgY2Fub25pY2FsQmFzZU1hdGNoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5zdWJzdHJpbmcoMCwgaW1wbGVtZW50YXRpb25HdWlkZS51cmwubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlID0gY2Fub25pY2FsQmFzZU1hdGNoWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogRXh0cmFjdCBucG0tbmFtZSBmcm9tIElHIGV4dGVuc2lvbi5cbiAgICAgICAgLy8gY3VycmVudGx5LCBJRyByZXNvdXJjZSBoYXMgdG8gYmUgaW4gWE1MIGZvcm1hdCBmb3IgdGhlIElHIFB1Ymxpc2hlclxuICAgICAgICBjb25zdCBjb250cm9sID0gPEZoaXJDb250cm9sPiB7XG4gICAgICAgICAgICB0b29sOiAnamVreWxsJyxcbiAgICAgICAgICAgIHNvdXJjZTogJ2ltcGxlbWVudGF0aW9uZ3VpZGUvJyArIGltcGxlbWVudGF0aW9uR3VpZGUuaWQgKyAnLnhtbCcsXG4gICAgICAgICAgICAnbnBtLW5hbWUnOiBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy1ucG0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUjQ6IEltcGxlbWVudGF0aW9uR3VpZGUucGFja2FnZUlkXG4gICAgICAgICAgICBsaWNlbnNlOiAnQ0MwLTEuMCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUjQ6IEltcGxlbWVudGF0aW9uR3VpZGUubGljZW5zZVxuICAgICAgICAgICAgcGF0aHM6IHtcbiAgICAgICAgICAgICAgICBxYTogJ2dlbmVyYXRlZF9vdXRwdXQvcWEnLFxuICAgICAgICAgICAgICAgIHRlbXA6ICdnZW5lcmF0ZWRfb3V0cHV0L3RlbXAnLFxuICAgICAgICAgICAgICAgIG91dHB1dDogJ291dHB1dCcsXG4gICAgICAgICAgICAgICAgdHhDYWNoZTogJ2dlbmVyYXRlZF9vdXRwdXQvdHhDYWNoZScsXG4gICAgICAgICAgICAgICAgc3BlY2lmaWNhdGlvbjogJ2h0dHA6Ly9obDcub3JnL2ZoaXIvU1RVMycsXG4gICAgICAgICAgICAgICAgcGFnZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2ZyYW1ld29yaycsXG4gICAgICAgICAgICAgICAgICAgICdzb3VyY2UvcGFnZXMnXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFsgJ3NvdXJjZS9yZXNvdXJjZXMnIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYWdlczogWydwYWdlcyddLFxuICAgICAgICAgICAgJ2V4dGVuc2lvbi1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxuICAgICAgICAgICAgJ2FsbG93ZWQtZG9tYWlucyc6IFsnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20nXSxcbiAgICAgICAgICAgICdzY3QtZWRpdGlvbic6ICdodHRwOi8vc25vbWVkLmluZm8vc2N0LzczMTAwMDEyNDEwOCcsXG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlOiBjYW5vbmljYWxCYXNlLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAnTG9jYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcm9jZWR1cmVSZXF1ZXN0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT3JnYW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnTWVkaWNhdGlvblN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1NlYXJjaFBhcmFtZXRlcic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU3RydWN0dXJlRGVmaW5pdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLW1hcHBpbmdzJzogJ3NkLW1hcHBpbmdzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdzZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWRlZm5zJzogJ3NkLWRlZmluaXRpb25zLmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnSW1tdW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUGF0aWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZU1hcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJ3NjcmlwdCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3Byb2ZpbGVzJzogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb25jZXB0TWFwJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXInOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPcGVyYXRpb25EZWZpbml0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb2RlU3lzdGVtJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb21tdW5pY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQW55Jzoge1xuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZm9ybWF0JzogJ2Zvcm1hdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lclJvbGUnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdWYWx1ZVNldCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ2FwYWJpbGl0eVN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT2JzZXJ2YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb3VyY2VzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICBjb250cm9sLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoZSBkZXBlbmRlbmN5TGlzdCBiYXNlZCBvbiB0aGUgZXh0ZW5zaW9ucyBpbiB0aGUgSUdcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jeUV4dGVuc2lvbnMgPSBfLmZpbHRlcihpbXBsZW1lbnRhdGlvbkd1aWRlLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3knKTtcblxuICAgICAgICAvLyBSNCBJbXBsZW1lbnRhdGlvbkd1aWRlLmRlcGVuZHNPblxuICAgICAgICBjb250cm9sLmRlcGVuZGVuY3lMaXN0ID0gXy5tYXAoZGVwZW5kZW5jeUV4dGVuc2lvbnMsIChkZXBlbmRlbmN5RXh0ZW5zaW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRlbmN5RXh0ZW5zaW9uLmV4dGVuc2lvbiwgKG5leHQpID0+IG5leHQudXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeS1sb2NhdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRlbmN5RXh0ZW5zaW9uLmV4dGVuc2lvbiwgKG5leHQpID0+IG5leHQudXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeS1uYW1lJyk7XG4gICAgICAgICAgICBjb25zdCB2ZXJzaW9uRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LXZlcnNpb24nKTtcblxuICAgICAgICAgICAgcmV0dXJuIDxGaGlyQ29udHJvbERlcGVuZGVuY3k+IHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb25FeHRlbnNpb24gPyBsb2NhdGlvbkV4dGVuc2lvbi52YWx1ZVVyaSA6ICcnLFxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVFeHRlbnNpb24gPyBuYW1lRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdmVyc2lvbkV4dGVuc2lvbiA/IHZlcnNpb25FeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVmaW5lIHRoZSByZXNvdXJjZXMgaW4gdGhlIGNvbnRyb2wgYW5kIHdoYXQgdGVtcGxhdGVzIHRoZXkgc2hvdWxkIHVzZVxuICAgICAgICBpZiAoYnVuZGxlICYmIGJ1bmRsZS5lbnRyeSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidW5kbGUuZW50cnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IGJ1bmRsZS5lbnRyeVtpXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZSA9IGVudHJ5LnJlc291cmNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnRyb2wucmVzb3VyY2VzW3Jlc291cmNlLnJlc291cmNlVHlwZSArICcvJyArIHJlc291cmNlLmlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTogcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy0nICsgcmVzb3VyY2UuaWQgKyAnLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBkZWZuczogcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy0nICsgcmVzb3VyY2UuaWQgKyAnLWRlZmluaXRpb25zLmh0bWwnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFI0Q29udHJvbChleHRlbnNpb24sIGltcGxlbWVudGF0aW9uR3VpZGU6IFI0SW1wbGVtZW50YXRpb25HdWlkZSwgYnVuZGxlOiBSNEJ1bmRsZSwgdmVyc2lvbjogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNhbm9uaWNhbEJhc2VSZWdleCA9IC9eKC4rPylcXC9JbXBsZW1lbnRhdGlvbkd1aWRlXFwvLiskL2dtO1xuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlTWF0Y2ggPSBjYW5vbmljYWxCYXNlUmVnZXguZXhlYyhpbXBsZW1lbnRhdGlvbkd1aWRlLnVybCk7XG4gICAgICAgIGxldCBjYW5vbmljYWxCYXNlO1xuXG4gICAgICAgIGlmICghY2Fub25pY2FsQmFzZU1hdGNoIHx8IGNhbm9uaWNhbEJhc2VNYXRjaC5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlID0gaW1wbGVtZW50YXRpb25HdWlkZS51cmwuc3Vic3RyaW5nKDAsIGltcGxlbWVudGF0aW9uR3VpZGUudXJsLmxhc3RJbmRleE9mKCcvJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2Fub25pY2FsQmFzZSA9IGNhbm9uaWNhbEJhc2VNYXRjaFsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGN1cnJlbnRseSwgSUcgcmVzb3VyY2UgaGFzIHRvIGJlIGluIFhNTCBmb3JtYXQgZm9yIHRoZSBJRyBQdWJsaXNoZXJcbiAgICAgICAgY29uc3QgY29udHJvbCA9IDxGaGlyQ29udHJvbD4ge1xuICAgICAgICAgICAgdG9vbDogJ2pla3lsbCcsXG4gICAgICAgICAgICBzb3VyY2U6ICdpbXBsZW1lbnRhdGlvbmd1aWRlLycgKyBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy54bWwnLFxuICAgICAgICAgICAgJ25wbS1uYW1lJzogaW1wbGVtZW50YXRpb25HdWlkZS5wYWNrYWdlSWQgfHwgaW1wbGVtZW50YXRpb25HdWlkZS5pZCArICctbnBtJyxcbiAgICAgICAgICAgIGxpY2Vuc2U6IGltcGxlbWVudGF0aW9uR3VpZGUubGljZW5zZSB8fCAnQ0MwLTEuMCcsXG4gICAgICAgICAgICBwYXRoczoge1xuICAgICAgICAgICAgICAgIHFhOiAnZ2VuZXJhdGVkX291dHB1dC9xYScsXG4gICAgICAgICAgICAgICAgdGVtcDogJ2dlbmVyYXRlZF9vdXRwdXQvdGVtcCcsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiAnb3V0cHV0JyxcbiAgICAgICAgICAgICAgICB0eENhY2hlOiAnZ2VuZXJhdGVkX291dHB1dC90eENhY2hlJyxcbiAgICAgICAgICAgICAgICBzcGVjaWZpY2F0aW9uOiAnaHR0cDovL2hsNy5vcmcvZmhpci9SNC8nLFxuICAgICAgICAgICAgICAgIHBhZ2VzOiBbXG4gICAgICAgICAgICAgICAgICAgICdmcmFtZXdvcmsnLFxuICAgICAgICAgICAgICAgICAgICAnc291cmNlL3BhZ2VzJ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbICdzb3VyY2UvcmVzb3VyY2VzJyBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFnZXM6IFsncGFnZXMnXSxcbiAgICAgICAgICAgICdleHRlbnNpb24tZG9tYWlucyc6IFsnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20nXSxcbiAgICAgICAgICAgICdhbGxvd2VkLWRvbWFpbnMnOiBbJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tJ10sXG4gICAgICAgICAgICAnc2N0LWVkaXRpb24nOiAnaHR0cDovL3Nub21lZC5pbmZvL3NjdC83MzEwMDAxMjQxMDgnLFxuICAgICAgICAgICAgY2Fub25pY2FsQmFzZTogY2Fub25pY2FsQmFzZSxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgJ0xvY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUHJvY2VkdXJlUmVxdWVzdCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ09yZ2FuaXphdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ01lZGljYXRpb25TdGF0ZW1lbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdTZWFyY2hQYXJhbWV0ZXInOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZURlZmluaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1tYXBwaW5ncyc6ICdzZC1tYXBwaW5ncy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnc2QuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1kZWZucyc6ICdzZC1kZWZpbml0aW9ucy5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0ltbXVuaXphdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1BhdGllbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdTdHJ1Y3R1cmVNYXAnOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50JzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICdzY3JpcHQnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICdwcm9maWxlcyc6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnQ29uY2VwdE1hcCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUHJhY3RpdGlvbmVyJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT3BlcmF0aW9uRGVmaW5pdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ29kZVN5c3RlbSc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ29tbXVuaWNhdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0FueSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWZvcm1hdCc6ICdmb3JtYXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXJSb2xlJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnVmFsdWVTZXQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0NhcGFiaWxpdHlTdGF0ZW1lbnQnOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ09ic2VydmF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc291cmNlczoge31cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodmVyc2lvbikge1xuICAgICAgICAgICAgY29udHJvbC52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRyb2wuZGVwZW5kZW5jeUxpc3QgPSBfLm1hcChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlcGVuZHNPbiwgKGRlcGVuZHNPbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FeHRlbnNpb24gPSBfLmZpbmQoZGVwZW5kc09uLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtZmhpci5sYW50YW5hZ3JvdXAuY29tL3I0L1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZHMtb24tbG9jYXRpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVFeHRlbnNpb24gPSBfLmZpbmQoZGVwZW5kc09uLmV4dGVuc2lvbiwgKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtZmhpci5sYW50YW5hZ3JvdXAuY29tL3I0L1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZHMtb24tbmFtZScpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkV4dGVuc2lvbiA/IGxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlU3RyaW5nIDogJycsXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZUV4dGVuc2lvbiA/IG5hbWVFeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJyxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBkZXBlbmRzT24udmVyc2lvblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVmaW5lIHRoZSByZXNvdXJjZXMgaW4gdGhlIGNvbnRyb2wgYW5kIHdoYXQgdGVtcGxhdGVzIHRoZXkgc2hvdWxkIHVzZVxuICAgICAgICBpZiAoYnVuZGxlICYmIGJ1bmRsZS5lbnRyeSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidW5kbGUuZW50cnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IGJ1bmRsZS5lbnRyeVtpXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZSA9IGVudHJ5LnJlc291cmNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnRyb2wucmVzb3VyY2VzW3Jlc291cmNlLnJlc291cmNlVHlwZSArICcvJyArIHJlc291cmNlLmlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTogcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy0nICsgcmVzb3VyY2UuaWQgKyAnLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBkZWZuczogcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy0nICsgcmVzb3VyY2UuaWQgKyAnLWRlZmluaXRpb25zLmh0bWwnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFN0dTNQYWdlQ29udGVudChpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSwgcGFnZTogUGFnZUNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBjb250ZW50RXh0ZW5zaW9uID0gXy5maW5kKHBhZ2UuZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctcGFnZS1jb250ZW50Jyk7XG5cbiAgICAgICAgaWYgKGNvbnRlbnRFeHRlbnNpb24gJiYgY29udGVudEV4dGVuc2lvbi52YWx1ZVJlZmVyZW5jZSAmJiBjb250ZW50RXh0ZW5zaW9uLnZhbHVlUmVmZXJlbmNlLnJlZmVyZW5jZSAmJiBwYWdlLnNvdXJjZSkge1xuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gY29udGVudEV4dGVuc2lvbi52YWx1ZVJlZmVyZW5jZS5yZWZlcmVuY2U7XG5cbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2Uuc3RhcnRzV2l0aCgnIycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVkID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFpbmVkLCAoY29udGFpbmVkKSA9PiBjb250YWluZWQuaWQgPT09IHJlZmVyZW5jZS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmFyeSA9IGNvbnRhaW5lZCAmJiBjb250YWluZWQucmVzb3VyY2VUeXBlID09PSAnQmluYXJ5JyA/IDxTVFUzQmluYXJ5PiBjb250YWluZWQgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoYmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogcGFnZS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBCdWZmZXIuZnJvbShiaW5hcnkuY29udGVudCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZVN0dTNQYWdlKHBhZ2VzUGF0aDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSwgcGFnZTogUGFnZUNvbXBvbmVudCwgbGV2ZWw6IG51bWJlciwgdG9jRW50cmllczogVGFibGVPZkNvbnRlbnRzRW50cnlbXSkge1xuICAgICAgICBjb25zdCBwYWdlQ29udGVudCA9IHRoaXMuZ2V0U3R1M1BhZ2VDb250ZW50KGltcGxlbWVudGF0aW9uR3VpZGUsIHBhZ2UpO1xuXG4gICAgICAgIGlmIChwYWdlLmtpbmQgIT09ICd0b2MnICYmIHBhZ2VDb250ZW50ICYmIHBhZ2VDb250ZW50LmNvbnRlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhZ2VQYXRoID0gcGF0aC5qb2luKHBhZ2VzUGF0aCwgcGFnZUNvbnRlbnQuZmlsZU5hbWUpO1xuXG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gJy0tLVxcbicgK1xuICAgICAgICAgICAgICAgIGB0aXRsZTogJHtwYWdlLnRpdGxlfVxcbmAgK1xuICAgICAgICAgICAgICAgICdsYXlvdXQ6IGRlZmF1bHRcXG4nICtcbiAgICAgICAgICAgICAgICBgYWN0aXZlOiAke3BhZ2UudGl0bGV9XFxuYCArXG4gICAgICAgICAgICAgICAgJy0tLVxcblxcbicgKyBwYWdlQ29udGVudC5jb250ZW50O1xuXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG5ld1BhZ2VQYXRoLCBjb250ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBhbiBlbnRyeSB0byB0aGUgVE9DXG4gICAgICAgIHRvY0VudHJpZXMucHVzaCh7IGxldmVsOiBsZXZlbCwgZmlsZU5hbWU6IHBhZ2Uua2luZCA9PT0gJ3BhZ2UnICYmIHBhZ2VDb250ZW50ID8gcGFnZUNvbnRlbnQuZmlsZU5hbWUgOiBudWxsLCB0aXRsZTogcGFnZS50aXRsZSB9KTtcbiAgICAgICAgXy5lYWNoKHBhZ2UucGFnZSwgKHN1YlBhZ2UpID0+IHRoaXMud3JpdGVTdHUzUGFnZShwYWdlc1BhdGgsIGltcGxlbWVudGF0aW9uR3VpZGUsIHN1YlBhZ2UsIGxldmVsICsgMSwgdG9jRW50cmllcykpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFBhZ2VFeHRlbnNpb24ocGFnZTogSW1wbGVtZW50YXRpb25HdWlkZVBhZ2VDb21wb25lbnQpIHtcbiAgICAgICAgc3dpdGNoIChwYWdlLmdlbmVyYXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgICAgY2FzZSAnZ2VuZXJhdGVkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy5odG1sJztcbiAgICAgICAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcueG1sJztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcubWQnO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgd3JpdGVSNFBhZ2UocGFnZXNQYXRoOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGU6IFI0SW1wbGVtZW50YXRpb25HdWlkZSwgcGFnZTogSW1wbGVtZW50YXRpb25HdWlkZVBhZ2VDb21wb25lbnQsIGxldmVsOiBudW1iZXIsIHRvY0VudHJpZXM6IFRhYmxlT2ZDb250ZW50c0VudHJ5W10pIHtcbiAgICAgICAgbGV0IGZpbGVOYW1lO1xuXG4gICAgICAgIGlmIChwYWdlLm5hbWVSZWZlcmVuY2UgJiYgcGFnZS5uYW1lUmVmZXJlbmNlLnJlZmVyZW5jZSAmJiBwYWdlLnRpdGxlKSB7XG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBwYWdlLm5hbWVSZWZlcmVuY2UucmVmZXJlbmNlO1xuXG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lZCA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhaW5lZCwgKGNvbnRhaW5lZCkgPT4gY29udGFpbmVkLmlkID09PSByZWZlcmVuY2Uuc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBiaW5hcnkgPSBjb250YWluZWQgJiYgY29udGFpbmVkLnJlc291cmNlVHlwZSA9PT0gJ0JpbmFyeScgPyA8UjRCaW5hcnk+IGNvbnRhaW5lZCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIGlmIChiaW5hcnkgJiYgYmluYXJ5LmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBwYWdlLnRpdGxlLnJlcGxhY2UoLyAvZywgJ18nKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuaW5kZXhPZignLicpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgKz0gdGhpcy5nZXRQYWdlRXh0ZW5zaW9uKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UGFnZVBhdGggPSBwYXRoLmpvaW4ocGFnZXNQYXRoLCBmaWxlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZEZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpbmFyeUNvbnRlbnQgPSBCdWZmZXIuZnJvbShiaW5hcnkuZGF0YSwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSAnLS0tXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBgdGl0bGU6ICR7cGFnZS50aXRsZX1cXG5gICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdsYXlvdXQ6IGRlZmF1bHRcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBhY3RpdmU6ICR7cGFnZS50aXRsZX1cXG5gICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGAtLS1cXG5cXG4ke2JpbmFyeUNvbnRlbnR9YDtcbiAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhuZXdQYWdlUGF0aCwgY29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGFuIGVudHJ5IHRvIHRoZSBUT0NcbiAgICAgICAgdG9jRW50cmllcy5wdXNoKHsgbGV2ZWw6IGxldmVsLCBmaWxlTmFtZTogZmlsZU5hbWUsIHRpdGxlOiBwYWdlLnRpdGxlIH0pO1xuXG4gICAgICAgIF8uZWFjaChwYWdlLnBhZ2UsIChzdWJQYWdlKSA9PiB0aGlzLndyaXRlUjRQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgc3ViUGFnZSwgbGV2ZWwgKyAxLCB0b2NFbnRyaWVzKSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2VuZXJhdGVUYWJsZU9mQ29udGVudHMocm9vdFBhdGg6IHN0cmluZywgdG9jRW50cmllczogVGFibGVPZkNvbnRlbnRzRW50cnlbXSwgc2hvdWxkQXV0b0dlbmVyYXRlOiBib29sZWFuLCBwYWdlQ29udGVudCkge1xuICAgICAgICBjb25zdCB0b2NQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3RvYy5tZCcpO1xuICAgICAgICBsZXQgdG9jQ29udGVudCA9ICcnO1xuXG4gICAgICAgIGlmIChzaG91bGRBdXRvR2VuZXJhdGUpIHtcbiAgICAgICAgICAgIF8uZWFjaCh0b2NFbnRyaWVzLCAoZW50cnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZU5hbWUgPSBlbnRyeS5maWxlTmFtZTtcblxuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSAmJiBmaWxlTmFtZS5lbmRzV2l0aCgnLm1kJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHJpbmcoMCwgZmlsZU5hbWUubGVuZ3RoIC0gMykgKyAnLmh0bWwnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgZW50cnkubGV2ZWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0b2NDb250ZW50ICs9ICcgICAgJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0b2NDb250ZW50ICs9ICcqICc7XG5cbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9jQ29udGVudCArPSBgPGEgaHJlZj1cIiR7ZmlsZU5hbWV9XCI+JHtlbnRyeS50aXRsZX08L2E+XFxuYDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b2NDb250ZW50ICs9IGAke2VudHJ5LnRpdGxlfVxcbmA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFnZUNvbnRlbnQgJiYgcGFnZUNvbnRlbnQuY29udGVudCkge1xuICAgICAgICAgICAgdG9jQ29udGVudCA9IHBhZ2VDb250ZW50LmNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9jQ29udGVudCkge1xuICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmModG9jUGF0aCwgdG9jQ29udGVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZVN0dTNQYWdlcyhyb290UGF0aDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSkge1xuICAgICAgICBjb25zdCB0b2NGaWxlUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcy90b2MubWQnKTtcbiAgICAgICAgY29uc3QgdG9jRW50cmllcyA9IFtdO1xuXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLnBhZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGF1dG9HZW5lcmF0ZUV4dGVuc2lvbiA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLnBhZ2UuZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctcGFnZS1hdXRvLWdlbmVyYXRlLXRvYycpO1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkQXV0b0dlbmVyYXRlID0gYXV0b0dlbmVyYXRlRXh0ZW5zaW9uICYmIGF1dG9HZW5lcmF0ZUV4dGVuc2lvbi52YWx1ZUJvb2xlYW4gPT09IHRydWU7XG4gICAgICAgICAgICBjb25zdCBwYWdlQ29udGVudCA9IHRoaXMuZ2V0U3R1M1BhZ2VDb250ZW50KGltcGxlbWVudGF0aW9uR3VpZGUsIGltcGxlbWVudGF0aW9uR3VpZGUucGFnZSk7XG4gICAgICAgICAgICBjb25zdCBwYWdlc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMnKTtcbiAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMocGFnZXNQYXRoKTtcblxuICAgICAgICAgICAgdGhpcy53cml0ZVN0dTNQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5wYWdlLCAxLCB0b2NFbnRyaWVzKTtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVUYWJsZU9mQ29udGVudHMocm9vdFBhdGgsIHRvY0VudHJpZXMsIHNob3VsZEF1dG9HZW5lcmF0ZSwgcGFnZUNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgd3JpdGVSNFBhZ2VzKHJvb3RQYXRoOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGU6IFI0SW1wbGVtZW50YXRpb25HdWlkZSkge1xuICAgICAgICBjb25zdCB0b2NFbnRyaWVzID0gW107XG4gICAgICAgIGxldCBzaG91bGRBdXRvR2VuZXJhdGUgPSB0cnVlO1xuICAgICAgICBsZXQgcm9vdFBhZ2VDb250ZW50O1xuICAgICAgICBsZXQgcm9vdFBhZ2VGaWxlTmFtZTtcblxuICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uICYmIGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbi5wYWdlKSB7XG4gICAgICAgICAgICBjb25zdCBhdXRvR2VuZXJhdGVFeHRlbnNpb24gPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UuZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctcGFnZS1hdXRvLWdlbmVyYXRlLXRvYycpO1xuICAgICAgICAgICAgc2hvdWxkQXV0b0dlbmVyYXRlID0gYXV0b0dlbmVyYXRlRXh0ZW5zaW9uICYmIGF1dG9HZW5lcmF0ZUV4dGVuc2lvbi52YWx1ZUJvb2xlYW4gPT09IHRydWU7XG4gICAgICAgICAgICBjb25zdCBwYWdlc1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMnKTtcbiAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMocGFnZXNQYXRoKTtcblxuICAgICAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbi5wYWdlLm5hbWVSZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lUmVmZXJlbmNlID0gaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UubmFtZVJlZmVyZW5jZTtcblxuICAgICAgICAgICAgICAgIGlmIChuYW1lUmVmZXJlbmNlLnJlZmVyZW5jZSAmJiBuYW1lUmVmZXJlbmNlLnJlZmVyZW5jZS5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRDb250YWluZWQgPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWluZWQsIChjb250YWluZWQpID0+IGNvbnRhaW5lZC5pZCA9PT0gbmFtZVJlZmVyZW5jZS5yZWZlcmVuY2Uuc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5ID0gZm91bmRDb250YWluZWQgJiYgZm91bmRDb250YWluZWQucmVzb3VyY2VUeXBlID09PSAnQmluYXJ5JyA/IDxSNEJpbmFyeT4gZm91bmRDb250YWluZWQgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmFyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFBhZ2VDb250ZW50ID0gbmV3IEJ1ZmZlcihiaW5hcnkuZGF0YSwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UGFnZUZpbGVOYW1lID0gaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UudGl0bGUucmVwbGFjZSgvIC9nLCAnXycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJvb3RQYWdlRmlsZU5hbWUuZW5kc1dpdGgoJy5tZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFBhZ2VGaWxlTmFtZSArPSAnLm1kJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy53cml0ZVI0UGFnZShwYWdlc1BhdGgsIGltcGxlbWVudGF0aW9uR3VpZGUsIGltcGxlbWVudGF0aW9uR3VpZGUuZGVmaW5pdGlvbi5wYWdlLCAxLCB0b2NFbnRyaWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFwcGVuZCBUT0MgRW50cmllcyB0byB0aGUgdG9jLm1kIGZpbGUgaW4gdGhlIHRlbXBsYXRlXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVUYWJsZU9mQ29udGVudHMocm9vdFBhdGgsIHRvY0VudHJpZXMsIHNob3VsZEF1dG9HZW5lcmF0ZSwgeyBmaWxlTmFtZTogcm9vdFBhZ2VGaWxlTmFtZSwgY29udGVudDogcm9vdFBhZ2VDb250ZW50IH0pO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZXhwb3J0KGZvcm1hdDogc3RyaW5nLCBleGVjdXRlSWdQdWJsaXNoZXI6IGJvb2xlYW4sIHVzZVRlcm1pbm9sb2d5U2VydmVyOiBib29sZWFuLCB1c2VMYXRlc3Q6IGJvb2xlYW4sIGRvd25sb2FkT3V0cHV0OiBib29sZWFuLCBpbmNsdWRlSWdQdWJsaXNoZXJKYXI6IGJvb2xlYW4sIHRlc3RDYWxsYmFjaz86IChtZXNzYWdlLCBlcnI/KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidW5kbGVFeHBvcnRlciA9IG5ldyBCdW5kbGVFeHBvcnRlcih0aGlzLmZoaXJTZXJ2ZXJCYXNlLCB0aGlzLmZoaXJTZXJ2ZXJJZCwgdGhpcy5maGlyVmVyc2lvbiwgdGhpcy5maGlyLCB0aGlzLmltcGxlbWVudGF0aW9uR3VpZGVJZCk7XG4gICAgICAgICAgICBjb25zdCBpc1htbCA9IGZvcm1hdCA9PT0gJ3htbCcgfHwgZm9ybWF0ID09PSAnYXBwbGljYXRpb24veG1sJyB8fCBmb3JtYXQgPT09ICdhcHBsaWNhdGlvbi9maGlyK3htbCc7XG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb24gPSAoIWlzWG1sID8gJy5qc29uJyA6ICcueG1sJyk7XG4gICAgICAgICAgICBjb25zdCBob21lZGlyID0gcmVxdWlyZSgnb3MnKS5ob21lZGlyKCk7XG4gICAgICAgICAgICBjb25zdCBmaGlyU2VydmVyQ29uZmlnID0gXy5maW5kKGZoaXJDb25maWcuc2VydmVycywgKHNlcnZlcjogRmhpckNvbmZpZ1NlcnZlcikgPT4gc2VydmVyLmlkID09PSB0aGlzLmZoaXJTZXJ2ZXJJZCk7XG4gICAgICAgICAgICBsZXQgY29udHJvbDtcbiAgICAgICAgICAgIGxldCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2U7XG5cbiAgICAgICAgICAgIHRtcC5kaXIoKHRtcERpckVyciwgcm9vdFBhdGgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodG1wRGlyRXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKHRtcERpckVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGNyZWF0aW5nIGEgdGVtcG9yYXJ5IGRpcmVjdG9yeTogJyArIHRtcERpckVycik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdpZy5qc29uJyk7XG4gICAgICAgICAgICAgICAgbGV0IGJ1bmRsZTogQnVuZGxlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wYWNrYWdlSWQgPSByb290UGF0aC5zdWJzdHJpbmcocm9vdFBhdGgubGFzdEluZGV4T2YocGF0aC5zZXApICsgMSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnBhY2thZ2VJZCk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnQ3JlYXRlZCB0ZW1wIGRpcmVjdG9yeS4gUmV0cmlldmluZyByZXNvdXJjZXMgZm9yIGltcGxlbWVudGF0aW9uIGd1aWRlLicpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXBhcmUgSUcgUHVibGlzaGVyIHBhY2thZ2VcbiAgICAgICAgICAgICAgICAgICAgYnVuZGxlRXhwb3J0ZXIuZ2V0QnVuZGxlKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHM6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZSA9IDxCdW5kbGU+IHJlc3VsdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VzRGlyID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3Jlc291cmNlcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnUmVzb3VyY2VzIHJldHJpZXZlZC4gUGFja2FnaW5nLicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidW5kbGUuZW50cnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBidW5kbGUuZW50cnlbaV0ucmVzb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlVHlwZSA9IHJlc291cmNlLnJlc291cmNlVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBidW5kbGUuZW50cnlbaV0ucmVzb3VyY2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlRGlyID0gcGF0aC5qb2luKHJlc291cmNlc0RpciwgcmVzb3VyY2VUeXBlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb3VyY2VQYXRoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNvdXJjZUNvbnRlbnQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZVR5cGUgPT0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnICYmIGlkID09PSB0aGlzLmltcGxlbWVudGF0aW9uR3VpZGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlID0gcmVzb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbXBsZW1lbnRhdGlvbkd1aWRlIG11c3QgYmUgZ2VuZXJhdGVkIGFzIGFuIHhtbCBmaWxlIGZvciB0aGUgSUcgUHVibGlzaGVyIGluIFNUVTMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNYbWwgJiYgcmVzb3VyY2VUeXBlICE9PSAnSW1wbGVtZW50YXRpb25HdWlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlQ29udGVudCA9IEpTT04uc3RyaW5naWZ5KGJ1bmRsZS5lbnRyeVtpXS5yZXNvdXJjZSwgbnVsbCwgJ1xcdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VQYXRoID0gcGF0aC5qb2luKHJlc291cmNlRGlyLCBpZCArICcuanNvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDb250ZW50ID0gdGhpcy5maGlyLm9ialRvWG1sKGJ1bmRsZS5lbnRyeVtpXS5yZXNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZUNvbnRlbnQgPSB2a2JlYXV0aWZ5LnhtbChyZXNvdXJjZUNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VQYXRoID0gcGF0aC5qb2luKHJlc291cmNlRGlyLCBpZCArICcueG1sJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKHJlc291cmNlRGlyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhyZXNvdXJjZVBhdGgsIHJlc291cmNlQ29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgaW1wbGVtZW50YXRpb24gZ3VpZGUgd2FzIG5vdCBmb3VuZCBpbiB0aGUgYnVuZGxlIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmhpclNlcnZlckNvbmZpZy52ZXJzaW9uID09PSAnc3R1MycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbCA9IHRoaXMuZ2V0U3R1M0NvbnRyb2woZXh0ZW5zaW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UsIDxTVFUzQnVuZGxlPjxhbnk+IGJ1bmRsZSwgdGhpcy5nZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2wgPSB0aGlzLmdldFI0Q29udHJvbChleHRlbnNpb24sIGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSwgPFI0QnVuZGxlPjxhbnk+IGJ1bmRsZSwgdGhpcy5nZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERlcGVuZGVuY2llcyhjb250cm9sLCBpc1htbCwgcmVzb3VyY2VzRGlyLCB0aGlzLmZoaXIsIGZoaXJTZXJ2ZXJDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBjb250ZW50cyBvZiB0aGUgaWctcHVibGlzaGVyLXRlbXBsYXRlIGZvbGRlciB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vJywgJ2lnLXB1Ymxpc2hlci10ZW1wbGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmNvcHlTeW5jKHRlbXBsYXRlUGF0aCwgcm9vdFBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV3JpdGUgdGhlIGlnLmpzb24gZmlsZSB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sQ29udGVudCA9IEpTT04uc3RyaW5naWZ5KGNvbnRyb2wsIG51bGwsICdcXHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGNvbnRyb2xQYXRoLCBjb250cm9sQ29udGVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXcml0ZSB0aGUgaW50cm8sIHN1bW1hcnkgYW5kIHNlYXJjaCBNRCBmaWxlcyBmb3IgZWFjaCByZXNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChidW5kbGUuZW50cnksIChlbnRyeSkgPT4gdGhpcy53cml0ZUZpbGVzRm9yUmVzb3VyY2VzKHJvb3RQYXRoLCBlbnRyeS5yZXNvdXJjZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUZW1wbGF0ZXMocm9vdFBhdGgsIGJ1bmRsZSwgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gPT09ICdzdHUzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlU3R1M1BhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JpdGVSNFBhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0RvbmUgYnVpbGRpbmcgcGFja2FnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SWdQdWJsaXNoZXIodXNlTGF0ZXN0LCBleGVjdXRlSWdQdWJsaXNoZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChpZ1B1Ymxpc2hlckxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluY2x1ZGVJZ1B1Ymxpc2hlckphcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdDb3B5aW5nIElHIFB1Ymxpc2hlciBKQVIgdG8gd29ya2luZyBkaXJlY3RvcnkuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGphckZpbGVOYW1lID0gaWdQdWJsaXNoZXJMb2NhdGlvbi5zdWJzdHJpbmcoaWdQdWJsaXNoZXJMb2NhdGlvbi5sYXN0SW5kZXhPZihwYXRoLnNlcCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdEphclBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIGphckZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weVN5bmMoaWdQdWJsaXNoZXJMb2NhdGlvbiwgZGVzdEphclBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhlY3V0ZUlnUHVibGlzaGVyIHx8ICFpZ1B1Ymxpc2hlckxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2NvbXBsZXRlJywgJ0RvbmUuIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvd25sb2FkIHRoZSBwYWNrYWdlIGluIGEgbW9tZW50LicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RDYWxsYmFjayhyb290UGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVwbG95RGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3d3d3Jvb3QvaWdzJywgdGhpcy5maGlyU2VydmVySWQsIGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhkZXBsb3lEaXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWdQdWJsaXNoZXJWZXJzaW9uID0gdXNlTGF0ZXN0ID8gJ2xhdGVzdCcgOiAnZGVmYXVsdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvY2VzcyA9IHNlcnZlckNvbmZpZy5qYXZhTG9jYXRpb24gfHwgJ2phdmEnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGphclBhcmFtcyA9IFsnLWphcicsIGlnUHVibGlzaGVyTG9jYXRpb24sICctaWcnLCBjb250cm9sUGF0aF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZVRlcm1pbm9sb2d5U2VydmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGphclBhcmFtcy5wdXNoKCctdHgnLCAnTi9BJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCBgUnVubmluZyAke2lnUHVibGlzaGVyVmVyc2lvbn0gSUcgUHVibGlzaGVyOiAke2phclBhcmFtcy5qb2luKCcgJyl9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgU3Bhd25pbmcgRkhJUiBJRyBQdWJsaXNoZXIgSmF2YSBwcm9jZXNzIGF0ICR7cHJvY2Vzc30gd2l0aCBwYXJhbXMgJHtqYXJQYXJhbXN9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZ1B1Ymxpc2hlclByb2Nlc3MgPSBzcGF3bihwcm9jZXNzLCBqYXJQYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQdWJsaXNoZXJQcm9jZXNzLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSh0bXAudG1wZGlyLCAnWFhYJykucmVwbGFjZShob21lZGlyLCAnWFhYJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgJiYgbWVzc2FnZS50cmltKCkucmVwbGFjZSgvXFwuL2csICcnKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUHVibGlzaGVyUHJvY2Vzcy5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UodG1wLnRtcGRpciwgJ1hYWCcpLnJlcGxhY2UoaG9tZWRpciwgJ1hYWCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudHJpbSgpLnJlcGxhY2UoL1xcLi9nLCAnJykgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Mub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0Vycm9yIGV4ZWN1dGluZyBGSElSIElHIFB1Ymxpc2hlcjogJyArIGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2Vycm9yJywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Mub24oJ2V4aXQnLCAoY29kZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgSUcgUHVibGlzaGVyIGlzIGRvbmUgZXhlY3V0aW5nIGZvciAke3Jvb3RQYXRofWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0lHIFB1Ymxpc2hlciBmaW5pc2hlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdXb25cXCd0IGNvcHkgb3V0cHV0IHRvIGRlcGxveW1lbnQgcGF0aC4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2NvbXBsZXRlJywgJ0RvbmUuIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvd25sb2FkIHRoZSBwYWNrYWdlIGluIGEgbW9tZW50LicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnQ29weWluZyBvdXRwdXQgdG8gZGVwbG95bWVudCBwYXRoLicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZWRQYXRoID0gcGF0aC5yZXNvbHZlKHJvb3RQYXRoLCAnZ2VuZXJhdGVkX291dHB1dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9IHBhdGgucmVzb2x2ZShyb290UGF0aCwgJ291dHB1dCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZyhgRGVsZXRpbmcgY29udGVudCBnZW5lcmF0ZWQgYnkgaWcgcHVibGlzaGVyIGluICR7Z2VuZXJhdGVkUGF0aH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuZW1wdHlEaXIoZ2VuZXJhdGVkUGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYENvcHlpbmcgb3V0cHV0IGZyb20gJHtvdXRwdXRQYXRofSB0byAke2RlcGxveURpcn1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weShvdXRwdXRQYXRoLCBkZXBsb3lEaXIsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2Vycm9yJywgJ0Vycm9yIGNvcHlpbmcgY29udGVudHMgdG8gZGVwbG95bWVudCBwYXRoLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmFsTWVzc2FnZSA9IGBEb25lIGV4ZWN1dGluZyB0aGUgRkhJUiBJRyBQdWJsaXNoZXIuIFlvdSBtYXkgdmlldyB0aGUgSUcgPGEgaHJlZj1cIi9pbXBsZW1lbnRhdGlvbi1ndWlkZS8ke3RoaXMuaW1wbGVtZW50YXRpb25HdWlkZUlkfS92aWV3XCI+aGVyZTwvYT4uYCArIChkb3dubG9hZE91dHB1dCA/ICcgWW91IHdpbGwgYmUgcHJvbXB0ZWQgdG8gZG93bmxvYWQgdGhlIHBhY2thZ2UgaW4gYSBtb21lbnQuJyA6ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnY29tcGxldGUnLCBmaW5hbE1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZG93bmxvYWRPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYFVzZXIgaW5kaWNhdGVkIHRoZXkgZG9uJ3QgbmVlZCB0byBkb3dubG9hZC4gUmVtb3ZpbmcgdGVtcG9yYXJ5IGRpcmVjdG9yeSAke3Jvb3RQYXRofWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVtcHR5RGlyKHJvb3RQYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYERvbmUgcmVtb3ZpbmcgdGVtcG9yYXJ5IGRpcmVjdG9yeSAke3Jvb3RQYXRofWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdlcnJvcicsICdFcnJvciBkdXJpbmcgZXhwb3J0OiAnICsgZXJyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdENhbGxiYWNrKHJvb3RQYXRoLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==