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
const bundle_1 = require("./bundle");
const fhirConfig = config.get('fhir');
const serverConfig = config.get('server');
class HtmlExporter {
    constructor(fhirServerBase, fhirServerId, fhir, io, socketId, implementationGuideId) {
        this.log = log4js.getLogger();
        this.fhirServerBase = fhirServerBase;
        this.fhirServerId = fhirServerId;
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
        const mainResourceTypes = ['ValueSet', 'CodeSystem', 'StructureDefinition', 'CapabilityStatement'];
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
                return [resource.resourceType, `<a href="CapabilityStatement-${resource.id}.html">${name}</a>`];
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
    export(format, executeIgPublisher, useTerminologyServer, useLatest, downloadOutput, testCallback) {
        return new Promise((resolve, reject) => {
            const bundleExporter = new bundle_1.BundleExporter(this.fhirServerBase, this.fhirServerId, this.fhir, this.implementationGuideId);
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
                    bundleExporter.getBundle()
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
                        if (!executeIgPublisher || !igPublisherLocation) {
                            this.sendSocketMessage('complete', 'Done. You will be prompted to download the package in a moment.');
                            if (testCallback) {
                                testCallback(rootPath);
                            }
                            return;
                        }
                        const deployDir = path.resolve(__dirname, '../../wwwroot/igs', implementationGuideResource.id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpREFBb0M7QUFlcEMsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQixpQ0FBaUM7QUFDakMsMkJBQTJCO0FBUzNCLHFDQUF3QztBQUd4QyxNQUFNLFVBQVUsR0FBZ0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRCxNQUFNLFlBQVksR0FBa0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQVF6RCxNQUFhLFlBQVk7SUFXckIsWUFBWSxjQUFzQixFQUFFLFlBQW9CLEVBQUUsSUFBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBZ0IsRUFBRSxxQkFBNkI7UUFWOUgsUUFBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQVc5QixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztJQUN2RCxDQUFDO0lBRU8sY0FBYyxDQUFDLElBQXNCO1FBQ3pDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxPQUFPO1NBQ1Y7UUFFRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUMxQixPQUFnQixJQUFJLENBQUM7U0FDeEI7UUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRTFCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksT0FBTyxFQUFFO2dC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QUNMLENBQUMsQ0FBQyxDQUFDOzZCQUNOO3dCQUNMLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQzt5QkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTt3QkFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSx1QkFBdUIsR0FBRyxHQUFHLENBQUMsQ0FBQzt3QkFFL0QsSUFBSSxZQUFZLEVBQUU7NEJBQ2QsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDL0I7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXo1QkQsb0NBeTVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RmhpciBhcyBGaGlyTW9kdWxlfSBmcm9tICdmaGlyL2ZoaXInO1xuaW1wb3J0IHtTZXJ2ZXJ9IGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQge3NwYXdufSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7XG4gICAgRG9tYWluUmVzb3VyY2UsXG4gICAgSHVtYW5OYW1lLFxuICAgIEJ1bmRsZSBhcyBTVFUzQnVuZGxlLFxuICAgIEJpbmFyeSBhcyBTVFUzQmluYXJ5LFxuICAgIEltcGxlbWVudGF0aW9uR3VpZGUgYXMgU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUsXG4gICAgUGFnZUNvbXBvbmVudFxufSBmcm9tICcuLi8uLi9zcmMvYXBwL21vZGVscy9zdHUzL2ZoaXInO1xuaW1wb3J0IHtcbiAgICBCaW5hcnkgYXMgUjRCaW5hcnksXG4gICAgQnVuZGxlIGFzIFI0QnVuZGxlLFxuICAgIEltcGxlbWVudGF0aW9uR3VpZGUgYXMgUjRJbXBsZW1lbnRhdGlvbkd1aWRlLFxuICAgIEltcGxlbWVudGF0aW9uR3VpZGVQYWdlQ29tcG9uZW50XG59IGZyb20gJy4uLy4uL3NyYy9hcHAvbW9kZWxzL3I0L2ZoaXInO1xuaW1wb3J0ICogYXMgbG9nNGpzIGZyb20gJ2xvZzRqcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCAqIGFzIHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnY29uZmlnJztcbmltcG9ydCAqIGFzIHRtcCBmcm9tICd0bXAnO1xuaW1wb3J0IHtcbiAgICBGaGlyLFxuICAgIEZoaXJDb25maWcsXG4gICAgRmhpckNvbmZpZ1NlcnZlcixcbiAgICBGaGlyQ29udHJvbCxcbiAgICBGaGlyQ29udHJvbERlcGVuZGVuY3ksXG4gICAgU2VydmVyQ29uZmlnXG59IGZyb20gJy4uL2NvbnRyb2xsZXJzL21vZGVscyc7XG5pbXBvcnQge0J1bmRsZUV4cG9ydGVyfSBmcm9tICcuL2J1bmRsZSc7XG5pbXBvcnQgQnVuZGxlID0gRmhpci5CdW5kbGU7XG5cbmNvbnN0IGZoaXJDb25maWcgPSA8RmhpckNvbmZpZz4gY29uZmlnLmdldCgnZmhpcicpO1xuY29uc3Qgc2VydmVyQ29uZmlnID0gPFNlcnZlckNvbmZpZz4gY29uZmlnLmdldCgnc2VydmVyJyk7XG5cbmludGVyZmFjZSBUYWJsZU9mQ29udGVudHNFbnRyeSB7XG4gICAgbGV2ZWw6IG51bWJlcjtcbiAgICBmaWxlTmFtZTogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBIdG1sRXhwb3J0ZXIge1xuICAgIHJlYWRvbmx5IGxvZyA9IGxvZzRqcy5nZXRMb2dnZXIoKTtcbiAgICByZWFkb25seSBmaGlyU2VydmVyQmFzZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGZoaXJTZXJ2ZXJJZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGZoaXI6IEZoaXJNb2R1bGU7XG4gICAgcmVhZG9ubHkgaW86IFNlcnZlcjtcbiAgICByZWFkb25seSBzb2NrZXRJZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGltcGxlbWVudGF0aW9uR3VpZGVJZDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBwYWNrYWdlSWQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGZoaXJTZXJ2ZXJCYXNlOiBzdHJpbmcsIGZoaXJTZXJ2ZXJJZDogc3RyaW5nLCBmaGlyOiBGaGlyTW9kdWxlLCBpbzogU2VydmVyLCBzb2NrZXRJZDogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmZoaXJTZXJ2ZXJCYXNlID0gZmhpclNlcnZlckJhc2U7XG4gICAgICAgIHRoaXMuZmhpclNlcnZlcklkID0gZmhpclNlcnZlcklkO1xuICAgICAgICB0aGlzLmZoaXIgPSBmaGlyO1xuICAgICAgICB0aGlzLmlvID0gaW87XG4gICAgICAgIHRoaXMuc29ja2V0SWQgPSBzb2NrZXRJZDtcbiAgICAgICAgdGhpcy5pbXBsZW1lbnRhdGlvbkd1aWRlSWQgPSBpbXBsZW1lbnRhdGlvbkd1aWRlSWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREaXNwbGF5TmFtZShuYW1lOiBzdHJpbmd8SHVtYW5OYW1lKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gPHN0cmluZz4gbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkaXNwbGF5ID0gbmFtZS5mYW1pbHk7XG5cbiAgICAgICAgaWYgKG5hbWUuZ2l2ZW4pIHtcbiAgICAgICAgICAgIGlmIChkaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheSArPSAnLCAnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRpc3BsYXkgKz0gbmFtZS5naXZlbi5qb2luKCcgJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlzcGxheTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgY3JlYXRlVGFibGVGcm9tQXJyYXkoaGVhZGVycywgZGF0YSkge1xuICAgICAgICBsZXQgb3V0cHV0ID0gJzx0YWJsZT5cXG48dGhlYWQ+XFxuPHRyPlxcbic7XG5cbiAgICAgICAgXy5lYWNoKGhlYWRlcnMsIChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIG91dHB1dCArPSBgPHRoPiR7aGVhZGVyfTwvdGg+XFxuYDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb3V0cHV0ICs9ICc8L3RyPlxcbjwvdGhlYWQ+XFxuPHRib2R5Plxcbic7XG5cbiAgICAgICAgXy5lYWNoKGRhdGEsIChyb3c6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gJzx0cj5cXG4nO1xuXG4gICAgICAgICAgICBfLmVhY2gocm93LCAoY2VsbCkgPT4ge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBgPHRkPiR7Y2VsbH08L3RkPlxcbmA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgb3V0cHV0ICs9ICc8L3RyPlxcbic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG91dHB1dCArPSAnPC90Ym9keT5cXG48L3RhYmxlPlxcbic7XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNlbmRTb2NrZXRNZXNzYWdlKHN0YXR1cywgbWVzc2FnZSkge1xuICAgICAgICBpZiAoIXRoaXMuc29ja2V0SWQpIHtcbiAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKCdXb25cXCd0IHNlbmQgc29ja2V0IG1lc3NhZ2UgZm9yIGV4cG9ydCBiZWNhdXNlIHRoZSBvcmlnaW5hbCByZXF1ZXN0IGRpZCBub3Qgc3BlY2lmeSBhIHNvY2tldElkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pbykge1xuICAgICAgICAgICAgdGhpcy5pby50byh0aGlzLnNvY2tldElkKS5lbWl0KCdodG1sLWV4cG9ydCcsIHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlSWQ6IHRoaXMucGFja2FnZUlkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJZ1B1Ymxpc2hlcih1c2VMYXRlc3Q6IGJvb2xlYW4sIGV4ZWN1dGVJZ1B1Ymxpc2hlcjogYm9vbGVhbik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGlmICghZXhlY3V0ZUlnUHVibGlzaGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gJ29yZy5obDcuZmhpci5pZ3B1Ymxpc2hlci5qYXInO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vaWctcHVibGlzaGVyJyk7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0RmlsZVBhdGggPSBwYXRoLmpvaW4oZGVmYXVsdFBhdGgsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgaWYgKHVzZUxhdGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdSZXF1ZXN0IHRvIGdldCBsYXRlc3QgdmVyc2lvbiBvZiBGSElSIElHIHB1Ymxpc2hlci4gUmV0cmlldmluZyBmcm9tOiAnICsgZmhpckNvbmZpZy5sYXRlc3RQdWJsaXNoZXIpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnRG93bmxvYWRpbmcgbGF0ZXN0IEZISVIgSUcgcHVibGlzaGVyJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBDaGVjayBodHRwOi8vYnVpbGQuZmhpci5vcmcvdmVyc2lvbi5pbmZvIGZpcnN0XG5cbiAgICAgICAgICAgICAgICBycChmaGlyQ29uZmlnLmxhdGVzdFB1Ymxpc2hlciwgeyBlbmNvZGluZzogbnVsbCB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoJ1N1Y2Nlc3NmdWxseSBkb3dubG9hZGVkIGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgUHVibGlzaGVyLiBFbnN1cmluZyBsYXRlc3QgZGlyZWN0b3J5IGV4aXN0cycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXRlc3RQYXRoID0gcGF0aC5qb2luKGRlZmF1bHRQYXRoLCAnbGF0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKGxhdGVzdFBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmYgPSBCdWZmZXIuZnJvbShyZXN1bHRzLCAndXRmOCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0RmlsZVBhdGggPSBwYXRoLmpvaW4obGF0ZXN0UGF0aCwgZmlsZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5kZWJ1ZygnU2F2aW5nIEZISVIgSUcgcHVibGlzaGVyIHRvICcgKyBsYXRlc3RGaWxlUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobGF0ZXN0RmlsZVBhdGgsIGJ1ZmYpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGxhdGVzdEZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGBFcnJvciBnZXR0aW5nIGxhdGVzdCB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0VuY291bnRlcmVkIGVycm9yIGRvd25sb2FkaW5nIGxhdGVzdCBJRyBwdWJsaXNoZXIsIHdpbGwgdXNlIHByZS1sb2FkZWQvZGVmYXVsdCBJRyBwdWJsaXNoZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGVmYXVsdEZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKCdVc2luZyBidWlsdC1pbiB2ZXJzaW9uIG9mIEZISVIgSUcgcHVibGlzaGVyIGZvciBleHBvcnQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdVc2luZyBleGlzdGluZy9kZWZhdWx0IHZlcnNpb24gb2YgRkhJUiBJRyBwdWJsaXNoZXInKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRlZmF1bHRGaWxlUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXI6IHN0cmluZywgZXh0ZW5zaW9uRmlsZU5hbWU6IHN0cmluZywgaXNYbWw6IGJvb2xlYW4sIGZoaXI6IEZoaXJNb2R1bGUpIHtcbiAgICAgICAgY29uc3Qgc291cmNlRXh0ZW5zaW9uc0RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9zcmMvYXNzZXRzL3N0dTMvZXh0ZW5zaW9ucycpO1xuICAgICAgICBjb25zdCBzb3VyY2VFeHRlbnNpb25GaWxlTmFtZSA9IHBhdGguam9pbihzb3VyY2VFeHRlbnNpb25zRGlyLCBleHRlbnNpb25GaWxlTmFtZSk7XG4gICAgICAgIGxldCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUgPSBwYXRoLmpvaW4oZGVzdEV4dGVuc2lvbnNEaXIsIGV4dGVuc2lvbkZpbGVOYW1lKTtcblxuICAgICAgICBpZiAoIWlzWG1sKSB7XG4gICAgICAgICAgICBmcy5jb3B5U3luYyhzb3VyY2VFeHRlbnNpb25GaWxlTmFtZSwgZGVzdEV4dGVuc2lvbkZpbGVOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbkpzb24gPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlRXh0ZW5zaW9uRmlsZU5hbWUpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb25YbWwgPSBmaGlyLmpzb25Ub1htbChleHRlbnNpb25Kc29uKTtcblxuICAgICAgICAgICAgZGVzdEV4dGVuc2lvbkZpbGVOYW1lID0gZGVzdEV4dGVuc2lvbkZpbGVOYW1lLnN1YnN0cmluZygwLCBkZXN0RXh0ZW5zaW9uRmlsZU5hbWUuaW5kZXhPZignLmpzb24nKSkgKyAnLnhtbCc7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRlc3RFeHRlbnNpb25GaWxlTmFtZSwgZXh0ZW5zaW9uWG1sKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldERlcGVuZGVuY2llcyhjb250cm9sLCBpc1htbDogYm9vbGVhbiwgcmVzb3VyY2VzRGlyOiBzdHJpbmcsIGZoaXI6IEZoaXJNb2R1bGUsIGZoaXJTZXJ2ZXJDb25maWc6IEZoaXJDb25maWdTZXJ2ZXIpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBpc1N0dTMgPSBmaGlyU2VydmVyQ29uZmlnICYmIGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA9PT0gJ3N0dTMnO1xuXG4gICAgICAgIC8vIExvYWQgdGhlIGlnIGRlcGVuZGVuY3kgZXh0ZW5zaW9ucyBpbnRvIHRoZSByZXNvdXJjZXMgZGlyZWN0b3J5XG4gICAgICAgIGlmIChpc1N0dTMgJiYgY29udHJvbC5kZXBlbmRlbmN5TGlzdCAmJiBjb250cm9sLmRlcGVuZGVuY3lMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGRlc3RFeHRlbnNpb25zRGlyID0gcGF0aC5qb2luKHJlc291cmNlc0RpciwgJ3N0cnVjdHVyZWRlZmluaXRpb24nKTtcblxuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhkZXN0RXh0ZW5zaW9uc0Rpcik7XG5cbiAgICAgICAgICAgIHRoaXMuY29weUV4dGVuc2lvbihkZXN0RXh0ZW5zaW9uc0RpciwgJ2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5Lmpzb24nLCBpc1htbCwgZmhpcik7XG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS12ZXJzaW9uLmpzb24nLCBpc1htbCwgZmhpcik7XG4gICAgICAgICAgICB0aGlzLmNvcHlFeHRlbnNpb24oZGVzdEV4dGVuc2lvbnNEaXIsICdleHRlbnNpb24taWctZGVwZW5kZW5jeS1sb2NhdGlvbi5qc29uJywgaXNYbWwsIGZoaXIpO1xuICAgICAgICAgICAgdGhpcy5jb3B5RXh0ZW5zaW9uKGRlc3RFeHRlbnNpb25zRGlyLCAnZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktbmFtZS5qc29uJywgaXNYbWwsIGZoaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7ICAgICAgICAgICAvLyBUaGlzIGlzbid0IGFjdHVhbGx5IG5lZWRlZCwgc2luY2UgdGhlIElHIFB1Ymxpc2hlciBhdHRlbXB0cyB0byByZXNvbHZlIHRoZXNlIGRlcGVuZGVuY3kgYXV0b21hdGljYWxseVxuXG4gICAgICAgIC8qXG4gICAgICAgIC8vIEF0dGVtcHQgdG8gcmVzb2x2ZSB0aGUgZGVwZW5kZW5jeSdzIGRlZmluaXRpb25zIGFuZCBpbmNsdWRlIGl0IGluIHRoZSBwYWNrYWdlXG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IF8ubWFwKGNvbnRyb2wuZGVwZW5kZW5jeUxpc3QsIChkZXBlbmRlbmN5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5VXJsID1cbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5LmxvY2F0aW9uICtcbiAgICAgICAgICAgICAgICAoZGVwZW5kZW5jeS5sb2NhdGlvbi5lbmRzV2l0aCgnLycpID8gJycgOiAnLycpICsgJ2RlZmluaXRpb25zLicgK1xuICAgICAgICAgICAgICAgIChpc1htbCA/ICd4bWwnIDogJ2pzb24nKSArXG4gICAgICAgICAgICAgICAgJy56aXAnO1xuICAgICAgICAgICAgcmV0dXJuIGdldERlcGVuZGVuY3koZGVwZW5kZW5jeVVybCwgZGVwZW5kZW5jeS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgXG4gICAgICAgIFEuYWxsKHByb21pc2VzKVxuICAgICAgICAgICAgLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSlcbiAgICAgICAgICAgIC5jYXRjaChkZWZlcnJlZC5yZWplY3QpO1xuICAgIFxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgKi9cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykge1xuICAgICAgICBjb25zdCBjb25maWdWZXJzaW9uID0gZmhpclNlcnZlckNvbmZpZyA/IGZoaXJTZXJ2ZXJDb25maWcudmVyc2lvbiA6IG51bGw7XG5cbiAgICAgICAgLy8gVE9ETzogQWRkIG1vcmUgbG9naWNcbiAgICAgICAgc3dpdGNoIChjb25maWdWZXJzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICdzdHUzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJzMuMC4xJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHVwZGF0ZVRlbXBsYXRlcyhyb290UGF0aCwgYnVuZGxlLCBpbXBsZW1lbnRhdGlvbkd1aWRlOiBTVFUzSW1wbGVtZW50YXRpb25HdWlkZSkge1xuICAgICAgICBjb25zdCBtYWluUmVzb3VyY2VUeXBlcyA9IFsnVmFsdWVTZXQnLCAnQ29kZVN5c3RlbScsICdTdHJ1Y3R1cmVEZWZpbml0aW9uJywgJ0NhcGFiaWxpdHlTdGF0ZW1lbnQnXTtcbiAgICAgICAgY29uc3QgZGlzdGluY3RSZXNvdXJjZXMgPSBfLmNoYWluKGJ1bmRsZS5lbnRyeSlcbiAgICAgICAgICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS5yZXNvdXJjZSlcbiAgICAgICAgICAgIC51bmlxKChyZXNvdXJjZSkgPT4gcmVzb3VyY2UuaWQpXG4gICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgY29uc3QgdmFsdWVTZXRzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnVmFsdWVTZXQnKTtcbiAgICAgICAgY29uc3QgY29kZVN5c3RlbXMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdDb2RlU3lzdGVtJyk7XG4gICAgICAgIGNvbnN0IHByb2ZpbGVzID0gXy5maWx0ZXIoZGlzdGluY3RSZXNvdXJjZXMsIChyZXNvdXJjZSkgPT4gcmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnU3RydWN0dXJlRGVmaW5pdGlvbicgJiYgKCFyZXNvdXJjZS5iYXNlRGVmaW5pdGlvbiB8fCAhcmVzb3VyY2UuYmFzZURlZmluaXRpb24uZW5kc1dpdGgoJ0V4dGVuc2lvbicpKSk7XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbnMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdTdHJ1Y3R1cmVEZWZpbml0aW9uJyAmJiByZXNvdXJjZS5iYXNlRGVmaW5pdGlvbiAmJiByZXNvdXJjZS5iYXNlRGVmaW5pdGlvbi5lbmRzV2l0aCgnRXh0ZW5zaW9uJykpO1xuICAgICAgICBjb25zdCBjYXBhYmlsaXR5U3RhdGVtZW50cyA9IF8uZmlsdGVyKGRpc3RpbmN0UmVzb3VyY2VzLCAocmVzb3VyY2UpID0+IHJlc291cmNlLnJlc291cmNlVHlwZSA9PT0gJ0NhcGFiaWxpdHlTdGF0ZW1lbnQnKTtcbiAgICAgICAgY29uc3Qgb3RoZXJSZXNvdXJjZXMgPSBfLmZpbHRlcihkaXN0aW5jdFJlc291cmNlcywgKHJlc291cmNlKSA9PiBtYWluUmVzb3VyY2VUeXBlcy5pbmRleE9mKHJlc291cmNlLnJlc291cmNlVHlwZSkgPCAwKTtcblxuICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZSkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXhQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL2luZGV4Lm1kJyk7XG5cbiAgICAgICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRpb25Db250ZW50ID0gJyMjIyBEZXNjcmlwdGlvblxcblxcbicgKyBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlc2NyaXB0aW9uICsgJ1xcblxcbic7XG4gICAgICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoaW5kZXhQYXRoLCBkZXNjcmlwdGlvbkNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWN0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yc0RhdGEgPSBfLm1hcChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhY3QsIChjb250YWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kRW1haWwgPSBfLmZpbmQoY29udGFjdC50ZWxlY29tLCAodGVsZWNvbSkgPT4gdGVsZWNvbS5zeXN0ZW0gPT09ICdlbWFpbCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvbnRhY3QubmFtZSwgZm91bmRFbWFpbCA/IGA8YSBocmVmPVwibWFpbHRvOiR7Zm91bmRFbWFpbC52YWx1ZX1cIj4ke2ZvdW5kRW1haWwudmFsdWV9PC9hPmAgOiAnJ107XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yc0NvbnRlbnQgPSAnIyMjIEF1dGhvcnNcXG5cXG4nICsgdGhpcy5jcmVhdGVUYWJsZUZyb21BcnJheShbJ05hbWUnLCAnRW1haWwnXSwgYXV0aG9yc0RhdGEpICsgJ1xcblxcbic7XG4gICAgICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVN5bmMoaW5kZXhQYXRoLCBhdXRob3JzQ29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgcHJvZmlsZXNEYXRhID0gXy5jaGFpbihwcm9maWxlcylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChwcm9maWxlKSA9PiBwcm9maWxlLm5hbWUpXG4gICAgICAgICAgICAgICAgLm1hcCgocHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2A8YSBocmVmPVwiU3RydWN0dXJlRGVmaW5pdGlvbi0ke3Byb2ZpbGUuaWR9Lmh0bWxcIj4ke3Byb2ZpbGUubmFtZX08L2E+YCwgcHJvZmlsZS5kZXNjcmlwdGlvbiB8fCAnJ107XG4gICAgICAgICAgICAgICAgfSkudmFsdWUoKTtcbiAgICAgICAgICAgIGNvbnN0IHByb2ZpbGVzVGFibGUgPSB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnTmFtZScsICdEZXNjcmlwdGlvbiddLCBwcm9maWxlc0RhdGEpO1xuICAgICAgICAgICAgY29uc3QgcHJvZmlsZXNQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3Byb2ZpbGVzLm1kJyk7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhwcm9maWxlc1BhdGgsICcjIyMgUHJvZmlsZXNcXG5cXG4nICsgcHJvZmlsZXNUYWJsZSArICdcXG5cXG4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChleHRlbnNpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dERhdGEgPSBfLmNoYWluKGV4dGVuc2lvbnMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24ubmFtZSlcbiAgICAgICAgICAgICAgICAubWFwKChleHRlbnNpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtgPGEgaHJlZj1cIlN0cnVjdHVyZURlZmluaXRpb24tJHtleHRlbnNpb24uaWR9Lmh0bWxcIj4ke2V4dGVuc2lvbi5uYW1lfTwvYT5gLCBleHRlbnNpb24uZGVzY3JpcHRpb24gfHwgJyddO1xuICAgICAgICAgICAgICAgIH0pLnZhbHVlKCk7XG4gICAgICAgICAgICBjb25zdCBleHRDb250ZW50ID0gdGhpcy5jcmVhdGVUYWJsZUZyb21BcnJheShbJ05hbWUnLCAnRGVzY3JpcHRpb24nXSwgZXh0RGF0YSk7XG4gICAgICAgICAgICBjb25zdCBleHRQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3Byb2ZpbGVzLm1kJyk7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhleHRQYXRoLCAnIyMjIEV4dGVuc2lvbnNcXG5cXG4nICsgZXh0Q29udGVudCArICdcXG5cXG4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZVNldHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHZzQ29udGVudCA9ICcjIyMgVmFsdWUgU2V0c1xcblxcbic7XG4gICAgICAgICAgICBjb25zdCB2c1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdGVybWlub2xvZ3kubWQnKTtcblxuICAgICAgICAgICAgXy5jaGFpbih2YWx1ZVNldHMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgodmFsdWVTZXQpID0+IHZhbHVlU2V0LnRpdGxlIHx8IHZhbHVlU2V0Lm5hbWUpXG4gICAgICAgICAgICAgICAgLmVhY2goKHZhbHVlU2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZzQ29udGVudCArPSBgLSBbJHt2YWx1ZVNldC50aXRsZSB8fCB2YWx1ZVNldC5uYW1lfV0oVmFsdWVTZXQtJHt2YWx1ZVNldC5pZH0uaHRtbClcXG5gO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyh2c1BhdGgsIHZzQ29udGVudCArICdcXG5cXG4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2RlU3lzdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgY3NDb250ZW50ID0gJyMjIyBDb2RlIFN5c3RlbXNcXG5cXG4nO1xuICAgICAgICAgICAgY29uc3QgY3NQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3Rlcm1pbm9sb2d5Lm1kJyk7XG5cbiAgICAgICAgICAgIF8uY2hhaW4oY29kZVN5c3RlbXMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgoY29kZVN5c3RlbSkgPT4gY29kZVN5c3RlbS50aXRsZSB8fCBjb2RlU3lzdGVtLm5hbWUpXG4gICAgICAgICAgICAgICAgLmVhY2goKGNvZGVTeXN0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY3NDb250ZW50ICs9IGAtIFske2NvZGVTeXN0ZW0udGl0bGUgfHwgY29kZVN5c3RlbS5uYW1lfV0oVmFsdWVTZXQtJHtjb2RlU3lzdGVtLmlkfS5odG1sKVxcbmA7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGNzUGF0aCwgY3NDb250ZW50ICsgJ1xcblxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhcGFiaWxpdHlTdGF0ZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGNzRGF0YSA9IF8uY2hhaW4oY2FwYWJpbGl0eVN0YXRlbWVudHMpXG4gICAgICAgICAgICAgICAgLnNvcnRCeSgoY2FwYWJpbGl0eVN0YXRlbWVudCkgPT4gY2FwYWJpbGl0eVN0YXRlbWVudC5uYW1lKVxuICAgICAgICAgICAgICAgIC5tYXAoKGNhcGFiaWxpdHlTdGF0ZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtgPGEgaHJlZj1cIkNhcGFiaWxpdHlTdGF0ZW1lbnQtJHtjYXBhYmlsaXR5U3RhdGVtZW50LmlkfS5odG1sXCI+JHtjYXBhYmlsaXR5U3RhdGVtZW50Lm5hbWV9PC9hPmAsIGNhcGFiaWxpdHlTdGF0ZW1lbnQuZGVzY3JpcHRpb24gfHwgJyddO1xuICAgICAgICAgICAgICAgIH0pLnZhbHVlKCk7XG4gICAgICAgICAgICBjb25zdCBjc0NvbnRlbnQgPSB0aGlzLmNyZWF0ZVRhYmxlRnJvbUFycmF5KFsnTmFtZScsICdEZXNjcmlwdGlvbiddLCBjc0RhdGEpO1xuICAgICAgICAgICAgY29uc3QgY3NQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL2NhcHN0YXRlbWVudHMubWQnKTtcbiAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGNzUGF0aCwgJyMjIyBDYXBhYmlsaXR5U3RhdGVtZW50c1xcblxcbicgKyBjc0NvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG90aGVyUmVzb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9EYXRhID0gXy5jaGFpbihvdGhlclJlc291cmNlcylcbiAgICAgICAgICAgICAgICAuc29ydEJ5KChyZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzcGxheSA9IHJlc291cmNlLnRpdGxlIHx8IHRoaXMuZ2V0RGlzcGxheU5hbWUocmVzb3VyY2UubmFtZSkgfHwgcmVzb3VyY2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyBkaXNwbGF5O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm1hcCgocmVzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSByZXNvdXJjZS50aXRsZSB8fCB0aGlzLmdldERpc3BsYXlOYW1lKHJlc291cmNlLm5hbWUpIHx8IHJlc291cmNlLmlkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Jlc291cmNlLnJlc291cmNlVHlwZSwgYDxhIGhyZWY9XCJDYXBhYmlsaXR5U3RhdGVtZW50LSR7cmVzb3VyY2UuaWR9Lmh0bWxcIj4ke25hbWV9PC9hPmBdO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgICAgICBjb25zdCBvQ29udGVudCA9IHRoaXMuY3JlYXRlVGFibGVGcm9tQXJyYXkoWydUeXBlJywgJ05hbWUnXSwgb0RhdGEpO1xuICAgICAgICAgICAgY29uc3QgY3NQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL290aGVyLm1kJyk7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhjc1BhdGgsICcjIyMgT3RoZXIgUmVzb3VyY2VzXFxuXFxuJyArIG9Db250ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlRmlsZXNGb3JSZXNvdXJjZXMocm9vdFBhdGg6IHN0cmluZywgcmVzb3VyY2U6IERvbWFpblJlc291cmNlKSB7XG4gICAgICAgIGlmICghcmVzb3VyY2UgfHwgIXJlc291cmNlLnJlc291cmNlVHlwZSB8fCByZXNvdXJjZS5yZXNvdXJjZVR5cGUgPT09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW50cm9QYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBgc291cmNlL3BhZ2VzL19pbmNsdWRlcy8ke3Jlc291cmNlLmlkfS1pbnRyby5tZGApO1xuICAgICAgICBjb25zdCBzZWFyY2hQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBgc291cmNlL3BhZ2VzL19pbmNsdWRlcy8ke3Jlc291cmNlLmlkfS1zZWFyY2gubWRgKTtcbiAgICAgICAgY29uc3Qgc3VtbWFyeVBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIGBzb3VyY2UvcGFnZXMvX2luY2x1ZGVzLyR7cmVzb3VyY2UuaWR9LXN1bW1hcnkubWRgKTtcblxuICAgICAgICBsZXQgaW50cm8gPSAnLS0tXFxuJyArXG4gICAgICAgICAgICBgdGl0bGU6ICR7cmVzb3VyY2UucmVzb3VyY2VUeXBlfS0ke3Jlc291cmNlLmlkfS1pbnRyb1xcbmAgK1xuICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xuICAgICAgICAgICAgYGFjdGl2ZTogJHtyZXNvdXJjZS5yZXNvdXJjZVR5cGV9LSR7cmVzb3VyY2UuaWR9LWludHJvXFxuYCArXG4gICAgICAgICAgICAnLS0tXFxuXFxuJztcblxuICAgICAgICBpZiAoKDxhbnk+cmVzb3VyY2UpLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpbnRybyArPSAoPGFueT5yZXNvdXJjZSkuZGVzY3JpcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGludHJvUGF0aCwgaW50cm8pO1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHNlYXJjaFBhdGgsICdUT0RPIC0gU2VhcmNoJyk7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoc3VtbWFyeVBhdGgsICdUT0RPIC0gU3VtbWFyeScpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGdldFN0dTNDb250cm9sKGV4dGVuc2lvbiwgaW1wbGVtZW50YXRpb25HdWlkZTogU1RVM0ltcGxlbWVudGF0aW9uR3VpZGUsIGJ1bmRsZTogU1RVM0J1bmRsZSwgdmVyc2lvbikge1xuICAgICAgICBjb25zdCBjYW5vbmljYWxCYXNlUmVnZXggPSAvXiguKz8pXFwvSW1wbGVtZW50YXRpb25HdWlkZVxcLy4rJC9nbTtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsQmFzZU1hdGNoID0gY2Fub25pY2FsQmFzZVJlZ2V4LmV4ZWMoaW1wbGVtZW50YXRpb25HdWlkZS51cmwpO1xuICAgICAgICBsZXQgY2Fub25pY2FsQmFzZTtcblxuICAgICAgICBpZiAoIWNhbm9uaWNhbEJhc2VNYXRjaCB8fCBjYW5vbmljYWxCYXNlTWF0Y2gubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgY2Fub25pY2FsQmFzZSA9IGltcGxlbWVudGF0aW9uR3VpZGUudXJsLnN1YnN0cmluZygwLCBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5sYXN0SW5kZXhPZignLycpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBjYW5vbmljYWxCYXNlTWF0Y2hbMV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBFeHRyYWN0IG5wbS1uYW1lIGZyb20gSUcgZXh0ZW5zaW9uLlxuICAgICAgICAvLyBjdXJyZW50bHksIElHIHJlc291cmNlIGhhcyB0byBiZSBpbiBYTUwgZm9ybWF0IGZvciB0aGUgSUcgUHVibGlzaGVyXG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSA8RmhpckNvbnRyb2w+IHtcbiAgICAgICAgICAgIHRvb2w6ICdqZWt5bGwnLFxuICAgICAgICAgICAgc291cmNlOiAnaW1wbGVtZW50YXRpb25ndWlkZS8nICsgaW1wbGVtZW50YXRpb25HdWlkZS5pZCArICcueG1sJyxcbiAgICAgICAgICAgICducG0tbmFtZSc6IGltcGxlbWVudGF0aW9uR3VpZGUuaWQgKyAnLW5wbScsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSNDogSW1wbGVtZW50YXRpb25HdWlkZS5wYWNrYWdlSWRcbiAgICAgICAgICAgIGxpY2Vuc2U6ICdDQzAtMS4wJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSNDogSW1wbGVtZW50YXRpb25HdWlkZS5saWNlbnNlXG4gICAgICAgICAgICBwYXRoczoge1xuICAgICAgICAgICAgICAgIHFhOiAnZ2VuZXJhdGVkX291dHB1dC9xYScsXG4gICAgICAgICAgICAgICAgdGVtcDogJ2dlbmVyYXRlZF9vdXRwdXQvdGVtcCcsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiAnb3V0cHV0JyxcbiAgICAgICAgICAgICAgICB0eENhY2hlOiAnZ2VuZXJhdGVkX291dHB1dC90eENhY2hlJyxcbiAgICAgICAgICAgICAgICBzcGVjaWZpY2F0aW9uOiAnaHR0cDovL2hsNy5vcmcvZmhpci9TVFUzJyxcbiAgICAgICAgICAgICAgICBwYWdlczogW1xuICAgICAgICAgICAgICAgICAgICAnZnJhbWV3b3JrJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NvdXJjZS9wYWdlcydcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczogWyAnc291cmNlL3Jlc291cmNlcycgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhZ2VzOiBbJ3BhZ2VzJ10sXG4gICAgICAgICAgICAnZXh0ZW5zaW9uLWRvbWFpbnMnOiBbJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tJ10sXG4gICAgICAgICAgICAnYWxsb3dlZC1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxuICAgICAgICAgICAgJ3NjdC1lZGl0aW9uJzogJ2h0dHA6Ly9zbm9tZWQuaW5mby9zY3QvNzMxMDAwMTI0MTA4JyxcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2U6IGNhbm9uaWNhbEJhc2UsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICdMb2NhdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1Byb2NlZHVyZVJlcXVlc3QnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPcmdhbml6YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdNZWRpY2F0aW9uU3RhdGVtZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU2VhcmNoUGFyYW1ldGVyJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdTdHJ1Y3R1cmVEZWZpbml0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtbWFwcGluZ3MnOiAnc2QtbWFwcGluZ3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ3NkLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZGVmbnMnOiAnc2QtZGVmaW5pdGlvbnMuaHRtbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdJbW11bml6YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQYXRpZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU3RydWN0dXJlTWFwJzoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAnc2NyaXB0JzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAncHJvZmlsZXMnOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0NvbmNlcHRNYXAnOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lcic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ09wZXJhdGlvbkRlZmluaXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0NvZGVTeXN0ZW0nOiB7J3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ0NvbW11bmljYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdBbnknOiB7XG4gICAgICAgICAgICAgICAgICAgICd0ZW1wbGF0ZS1mb3JtYXQnOiAnZm9ybWF0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUHJhY3RpdGlvbmVyUm9sZSc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1ZhbHVlU2V0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDYXBhYmlsaXR5U3RhdGVtZW50Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPYnNlcnZhdGlvbic6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IHt9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHZlcnNpb24pIHtcbiAgICAgICAgICAgIGNvbnRyb2wudmVyc2lvbiA9IHZlcnNpb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGRlcGVuZGVuY3lMaXN0IGJhc2VkIG9uIHRoZSBleHRlbnNpb25zIGluIHRoZSBJR1xuICAgICAgICBjb25zdCBkZXBlbmRlbmN5RXh0ZW5zaW9ucyA9IF8uZmlsdGVyKGltcGxlbWVudGF0aW9uR3VpZGUuZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20vU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kZW5jeScpO1xuXG4gICAgICAgIC8vIFI0IEltcGxlbWVudGF0aW9uR3VpZGUuZGVwZW5kc09uXG4gICAgICAgIGNvbnRyb2wuZGVwZW5kZW5jeUxpc3QgPSBfLm1hcChkZXBlbmRlbmN5RXh0ZW5zaW9ucywgKGRlcGVuZGVuY3lFeHRlbnNpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LWxvY2F0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBuYW1lRXh0ZW5zaW9uID0gXy5maW5kKGRlcGVuZGVuY3lFeHRlbnNpb24uZXh0ZW5zaW9uLCAobmV4dCkgPT4gbmV4dC51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1kZXBlbmRlbmN5LW5hbWUnKTtcbiAgICAgICAgICAgIGNvbnN0IHZlcnNpb25FeHRlbnNpb24gPSBfLmZpbmQoZGVwZW5kZW5jeUV4dGVuc2lvbi5leHRlbnNpb24sIChuZXh0KSA9PiBuZXh0LnVybCA9PT0gJ2h0dHBzOi8vdHJpZm9saWEtb24tZmhpci5sYW50YW5hZ3JvdXAuY29tL1N0cnVjdHVyZURlZmluaXRpb24vZXh0ZW5zaW9uLWlnLWRlcGVuZGVuY3ktdmVyc2lvbicpO1xuXG4gICAgICAgICAgICByZXR1cm4gPEZoaXJDb250cm9sRGVwZW5kZW5jeT4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkV4dGVuc2lvbiA/IGxvY2F0aW9uRXh0ZW5zaW9uLnZhbHVlVXJpIDogJycsXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZUV4dGVuc2lvbiA/IG5hbWVFeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJyxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uRXh0ZW5zaW9uID8gdmVyc2lvbkV4dGVuc2lvbi52YWx1ZVN0cmluZyA6ICcnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEZWZpbmUgdGhlIHJlc291cmNlcyBpbiB0aGUgY29udHJvbCBhbmQgd2hhdCB0ZW1wbGF0ZXMgdGhleSBzaG91bGQgdXNlXG4gICAgICAgIGlmIChidW5kbGUgJiYgYnVuZGxlLmVudHJ5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1bmRsZS5lbnRyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gYnVuZGxlLmVudHJ5W2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gZW50cnkucmVzb3VyY2U7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29udHJvbC5yZXNvdXJjZXNbcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy8nICsgcmVzb3VyY2UuaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICBiYXNlOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGRlZm5zOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICctZGVmaW5pdGlvbnMuaHRtbCdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0UjRDb250cm9sKGV4dGVuc2lvbiwgaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlLCBidW5kbGU6IFI0QnVuZGxlLCB2ZXJzaW9uOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsQmFzZVJlZ2V4ID0gL14oLis/KVxcL0ltcGxlbWVudGF0aW9uR3VpZGVcXC8uKyQvZ207XG4gICAgICAgIGNvbnN0IGNhbm9uaWNhbEJhc2VNYXRjaCA9IGNhbm9uaWNhbEJhc2VSZWdleC5leGVjKGltcGxlbWVudGF0aW9uR3VpZGUudXJsKTtcbiAgICAgICAgbGV0IGNhbm9uaWNhbEJhc2U7XG5cbiAgICAgICAgaWYgKCFjYW5vbmljYWxCYXNlTWF0Y2ggfHwgY2Fub25pY2FsQmFzZU1hdGNoLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEJhc2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLnVybC5zdWJzdHJpbmcoMCwgaW1wbGVtZW50YXRpb25HdWlkZS51cmwubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlID0gY2Fub25pY2FsQmFzZU1hdGNoWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY3VycmVudGx5LCBJRyByZXNvdXJjZSBoYXMgdG8gYmUgaW4gWE1MIGZvcm1hdCBmb3IgdGhlIElHIFB1Ymxpc2hlclxuICAgICAgICBjb25zdCBjb250cm9sID0gPEZoaXJDb250cm9sPiB7XG4gICAgICAgICAgICB0b29sOiAnamVreWxsJyxcbiAgICAgICAgICAgIHNvdXJjZTogJ2ltcGxlbWVudGF0aW9uZ3VpZGUvJyArIGltcGxlbWVudGF0aW9uR3VpZGUuaWQgKyAnLnhtbCcsXG4gICAgICAgICAgICAnbnBtLW5hbWUnOiBpbXBsZW1lbnRhdGlvbkd1aWRlLnBhY2thZ2VJZCB8fCBpbXBsZW1lbnRhdGlvbkd1aWRlLmlkICsgJy1ucG0nLFxuICAgICAgICAgICAgbGljZW5zZTogaW1wbGVtZW50YXRpb25HdWlkZS5saWNlbnNlIHx8ICdDQzAtMS4wJyxcbiAgICAgICAgICAgIHBhdGhzOiB7XG4gICAgICAgICAgICAgICAgcWE6ICdnZW5lcmF0ZWRfb3V0cHV0L3FhJyxcbiAgICAgICAgICAgICAgICB0ZW1wOiAnZ2VuZXJhdGVkX291dHB1dC90ZW1wJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6ICdvdXRwdXQnLFxuICAgICAgICAgICAgICAgIHR4Q2FjaGU6ICdnZW5lcmF0ZWRfb3V0cHV0L3R4Q2FjaGUnLFxuICAgICAgICAgICAgICAgIHNwZWNpZmljYXRpb246ICdodHRwOi8vaGw3Lm9yZy9maGlyL1I0LycsXG4gICAgICAgICAgICAgICAgcGFnZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2ZyYW1ld29yaycsXG4gICAgICAgICAgICAgICAgICAgICdzb3VyY2UvcGFnZXMnXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFsgJ3NvdXJjZS9yZXNvdXJjZXMnIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYWdlczogWydwYWdlcyddLFxuICAgICAgICAgICAgJ2V4dGVuc2lvbi1kb21haW5zJzogWydodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbSddLFxuICAgICAgICAgICAgJ2FsbG93ZWQtZG9tYWlucyc6IFsnaHR0cHM6Ly90cmlmb2xpYS1vbi1maGlyLmxhbnRhbmFncm91cC5jb20nXSxcbiAgICAgICAgICAgICdzY3QtZWRpdGlvbic6ICdodHRwOi8vc25vbWVkLmluZm8vc2N0LzczMTAwMDEyNDEwOCcsXG4gICAgICAgICAgICBjYW5vbmljYWxCYXNlOiBjYW5vbmljYWxCYXNlLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAnTG9jYXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcm9jZWR1cmVSZXF1ZXN0Jzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT3JnYW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnTWVkaWNhdGlvblN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1NlYXJjaFBhcmFtZXRlcic6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnU3RydWN0dXJlRGVmaW5pdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLW1hcHBpbmdzJzogJ3NkLW1hcHBpbmdzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdzZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWRlZm5zJzogJ3NkLWRlZmluaXRpb25zLmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnSW1tdW5pemF0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnUGF0aWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJ30sXG4gICAgICAgICAgICAgICAgJ1N0cnVjdHVyZU1hcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgJ3NjcmlwdCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtYmFzZSc6ICdleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3Byb2ZpbGVzJzogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb25jZXB0TWFwJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdQcmFjdGl0aW9uZXInOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdPcGVyYXRpb25EZWZpbml0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb2RlU3lzdGVtJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2Jhc2UuaHRtbCd9LFxuICAgICAgICAgICAgICAgICdDb21tdW5pY2F0aW9uJzogeyd0ZW1wbGF0ZS1iYXNlJzogJ2V4Lmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQW55Jzoge1xuICAgICAgICAgICAgICAgICAgICAndGVtcGxhdGUtZm9ybWF0JzogJ2Zvcm1hdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RlbXBsYXRlLWJhc2UnOiAnYmFzZS5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1ByYWN0aXRpb25lclJvbGUnOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9LFxuICAgICAgICAgICAgICAgICdWYWx1ZVNldCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnQ2FwYWJpbGl0eVN0YXRlbWVudCc6IHsndGVtcGxhdGUtYmFzZSc6ICdiYXNlLmh0bWwnfSxcbiAgICAgICAgICAgICAgICAnT2JzZXJ2YXRpb24nOiB7J3RlbXBsYXRlLWJhc2UnOiAnZXguaHRtbCd9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb3VyY2VzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICBjb250cm9sLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udHJvbC5kZXBlbmRlbmN5TGlzdCA9IF8ubWFwKGltcGxlbWVudGF0aW9uR3VpZGUuZGVwZW5kc09uLCAoZGVwZW5kc09uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbkV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1maGlyLmxhbnRhbmFncm91cC5jb20vcjQvU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kcy1vbi1sb2NhdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgbmFtZUV4dGVuc2lvbiA9IF8uZmluZChkZXBlbmRzT24uZXh0ZW5zaW9uLCAoZXh0ZW5zaW9uKSA9PiBleHRlbnNpb24udXJsID09PSAnaHR0cHM6Ly90cmlmb2xpYS1maGlyLmxhbnRhbmFncm91cC5jb20vcjQvU3RydWN0dXJlRGVmaW5pdGlvbi9leHRlbnNpb24taWctZGVwZW5kcy1vbi1uYW1lJyk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uRXh0ZW5zaW9uID8gbG9jYXRpb25FeHRlbnNpb24udmFsdWVTdHJpbmcgOiAnJyxcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lRXh0ZW5zaW9uID8gbmFtZUV4dGVuc2lvbi52YWx1ZVN0cmluZyA6ICcnLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IGRlcGVuZHNPbi52ZXJzaW9uXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEZWZpbmUgdGhlIHJlc291cmNlcyBpbiB0aGUgY29udHJvbCBhbmQgd2hhdCB0ZW1wbGF0ZXMgdGhleSBzaG91bGQgdXNlXG4gICAgICAgIGlmIChidW5kbGUgJiYgYnVuZGxlLmVudHJ5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1bmRsZS5lbnRyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gYnVuZGxlLmVudHJ5W2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gZW50cnkucmVzb3VyY2U7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UucmVzb3VyY2VUeXBlID09PSAnSW1wbGVtZW50YXRpb25HdWlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29udHJvbC5yZXNvdXJjZXNbcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy8nICsgcmVzb3VyY2UuaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICBiYXNlOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGRlZm5zOiByZXNvdXJjZS5yZXNvdXJjZVR5cGUgKyAnLScgKyByZXNvdXJjZS5pZCArICctZGVmaW5pdGlvbnMuaHRtbCdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbnRyb2w7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0U3R1M1BhZ2VDb250ZW50KGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBQYWdlQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRFeHRlbnNpb24gPSBfLmZpbmQocGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWNvbnRlbnQnKTtcblxuICAgICAgICBpZiAoY29udGVudEV4dGVuc2lvbiAmJiBjb250ZW50RXh0ZW5zaW9uLnZhbHVlUmVmZXJlbmNlICYmIGNvbnRlbnRFeHRlbnNpb24udmFsdWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIHBhZ2Uuc291cmNlKSB7XG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBjb250ZW50RXh0ZW5zaW9uLnZhbHVlUmVmZXJlbmNlLnJlZmVyZW5jZTtcblxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZS5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZWQgPSBfLmZpbmQoaW1wbGVtZW50YXRpb25HdWlkZS5jb250YWluZWQsIChjb250YWluZWQpID0+IGNvbnRhaW5lZC5pZCA9PT0gcmVmZXJlbmNlLnN1YnN0cmluZygxKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5ID0gY29udGFpbmVkICYmIGNvbnRhaW5lZC5yZXNvdXJjZVR5cGUgPT09ICdCaW5hcnknID8gPFNUVTNCaW5hcnk+IGNvbnRhaW5lZCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIGlmIChiaW5hcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBwYWdlLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IEJ1ZmZlci5mcm9tKGJpbmFyeS5jb250ZW50LCAnYmFzZTY0JykudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlU3R1M1BhZ2UocGFnZXNQYXRoOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBQYWdlQ29tcG9uZW50LCBsZXZlbDogbnVtYmVyLCB0b2NFbnRyaWVzOiBUYWJsZU9mQ29udGVudHNFbnRyeVtdKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gdGhpcy5nZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZSwgcGFnZSk7XG5cbiAgICAgICAgaWYgKHBhZ2Uua2luZCAhPT0gJ3RvYycgJiYgcGFnZUNvbnRlbnQgJiYgcGFnZUNvbnRlbnQuY29udGVudCkge1xuICAgICAgICAgICAgY29uc3QgbmV3UGFnZVBhdGggPSBwYXRoLmpvaW4ocGFnZXNQYXRoLCBwYWdlQ29udGVudC5maWxlTmFtZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSAnLS0tXFxuJyArXG4gICAgICAgICAgICAgICAgYHRpdGxlOiAke3BhZ2UudGl0bGV9XFxuYCArXG4gICAgICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xuICAgICAgICAgICAgICAgIGBhY3RpdmU6ICR7cGFnZS50aXRsZX1cXG5gICtcbiAgICAgICAgICAgICAgICAnLS0tXFxuXFxuJyArIHBhZ2VDb250ZW50LmNvbnRlbnQ7XG5cbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3UGFnZVBhdGgsIGNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGFuIGVudHJ5IHRvIHRoZSBUT0NcbiAgICAgICAgdG9jRW50cmllcy5wdXNoKHsgbGV2ZWw6IGxldmVsLCBmaWxlTmFtZTogcGFnZS5raW5kID09PSAncGFnZScgJiYgcGFnZUNvbnRlbnQgPyBwYWdlQ29udGVudC5maWxlTmFtZSA6IG51bGwsIHRpdGxlOiBwYWdlLnRpdGxlIH0pO1xuICAgICAgICBfLmVhY2gocGFnZS5wYWdlLCAoc3ViUGFnZSkgPT4gdGhpcy53cml0ZVN0dTNQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgc3ViUGFnZSwgbGV2ZWwgKyAxLCB0b2NFbnRyaWVzKSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZ2V0UGFnZUV4dGVuc2lvbihwYWdlOiBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudCkge1xuICAgICAgICBzd2l0Y2ggKHBhZ2UuZ2VuZXJhdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgICBjYXNlICdnZW5lcmF0ZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnLmh0bWwnO1xuICAgICAgICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy54bWwnO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy5tZCc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZVI0UGFnZShwYWdlc1BhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlLCBwYWdlOiBJbXBsZW1lbnRhdGlvbkd1aWRlUGFnZUNvbXBvbmVudCwgbGV2ZWw6IG51bWJlciwgdG9jRW50cmllczogVGFibGVPZkNvbnRlbnRzRW50cnlbXSkge1xuICAgICAgICBsZXQgZmlsZU5hbWU7XG5cbiAgICAgICAgaWYgKHBhZ2UubmFtZVJlZmVyZW5jZSAmJiBwYWdlLm5hbWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIHBhZ2UudGl0bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHBhZ2UubmFtZVJlZmVyZW5jZS5yZWZlcmVuY2U7XG5cbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2Uuc3RhcnRzV2l0aCgnIycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVkID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUuY29udGFpbmVkLCAoY29udGFpbmVkKSA9PiBjb250YWluZWQuaWQgPT09IHJlZmVyZW5jZS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmFyeSA9IGNvbnRhaW5lZCAmJiBjb250YWluZWQucmVzb3VyY2VUeXBlID09PSAnQmluYXJ5JyA/IDxSNEJpbmFyeT4gY29udGFpbmVkIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmFyeSAmJiBiaW5hcnkuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IHBhZ2UudGl0bGUucmVwbGFjZSgvIC9nLCAnXycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS5pbmRleE9mKCcuJykgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSArPSB0aGlzLmdldFBhZ2VFeHRlbnNpb24ocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQYWdlUGF0aCA9IHBhdGguam9pbihwYWdlc1BhdGgsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluYXJ5Q29udGVudCA9IEJ1ZmZlci5mcm9tKGJpbmFyeS5kYXRhLCAnYmFzZTY0JykudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9ICctLS1cXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGB0aXRsZTogJHtwYWdlLnRpdGxlfVxcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2xheW91dDogZGVmYXVsdFxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYGFjdGl2ZTogJHtwYWdlLnRpdGxlfVxcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYC0tLVxcblxcbiR7YmluYXJ5Q29udGVudH1gO1xuICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG5ld1BhZ2VQYXRoLCBjb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgYW4gZW50cnkgdG8gdGhlIFRPQ1xuICAgICAgICB0b2NFbnRyaWVzLnB1c2goeyBsZXZlbDogbGV2ZWwsIGZpbGVOYW1lOiBmaWxlTmFtZSwgdGl0bGU6IHBhZ2UudGl0bGUgfSk7XG5cbiAgICAgICAgXy5lYWNoKHBhZ2UucGFnZSwgKHN1YlBhZ2UpID0+IHRoaXMud3JpdGVSNFBhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBzdWJQYWdlLCBsZXZlbCArIDEsIHRvY0VudHJpZXMpKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aDogc3RyaW5nLCB0b2NFbnRyaWVzOiBUYWJsZU9mQ29udGVudHNFbnRyeVtdLCBzaG91bGRBdXRvR2VuZXJhdGU6IGJvb2xlYW4sIHBhZ2VDb250ZW50KSB7XG4gICAgICAgIGNvbnN0IHRvY1BhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdzb3VyY2UvcGFnZXMvdG9jLm1kJyk7XG4gICAgICAgIGxldCB0b2NDb250ZW50ID0gJyc7XG5cbiAgICAgICAgaWYgKHNob3VsZEF1dG9HZW5lcmF0ZSkge1xuICAgICAgICAgICAgXy5lYWNoKHRvY0VudHJpZXMsIChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZSA9IGVudHJ5LmZpbGVOYW1lO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lICYmIGZpbGVOYW1lLmVuZHNXaXRoKCcubWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZygwLCBmaWxlTmFtZS5sZW5ndGggLSAzKSArICcuaHRtbCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBlbnRyeS5sZXZlbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gJyAgICAnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gJyogJztcblxuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0b2NDb250ZW50ICs9IGA8YSBocmVmPVwiJHtmaWxlTmFtZX1cIj4ke2VudHJ5LnRpdGxlfTwvYT5cXG5gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRvY0NvbnRlbnQgKz0gYCR7ZW50cnkudGl0bGV9XFxuYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChwYWdlQ29udGVudCAmJiBwYWdlQ29udGVudC5jb250ZW50KSB7XG4gICAgICAgICAgICB0b2NDb250ZW50ID0gcGFnZUNvbnRlbnQuY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b2NDb250ZW50KSB7XG4gICAgICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyh0b2NQYXRoLCB0b2NDb250ZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHdyaXRlU3R1M1BhZ2VzKHJvb3RQYXRoOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uR3VpZGU6IFNUVTNJbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgIGNvbnN0IHRvY0ZpbGVQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCAnc291cmNlL3BhZ2VzL3RvYy5tZCcpO1xuICAgICAgICBjb25zdCB0b2NFbnRyaWVzID0gW107XG5cbiAgICAgICAgaWYgKGltcGxlbWVudGF0aW9uR3VpZGUucGFnZSkge1xuICAgICAgICAgICAgY29uc3QgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uID0gXy5maW5kKGltcGxlbWVudGF0aW9uR3VpZGUucGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWF1dG8tZ2VuZXJhdGUtdG9jJyk7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRBdXRvR2VuZXJhdGUgPSBhdXRvR2VuZXJhdGVFeHRlbnNpb24gJiYgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uLnZhbHVlQm9vbGVhbiA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gdGhpcy5nZXRTdHUzUGFnZUNvbnRlbnQoaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5wYWdlKTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcycpO1xuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhwYWdlc1BhdGgpO1xuXG4gICAgICAgICAgICB0aGlzLndyaXRlU3R1M1BhZ2UocGFnZXNQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlLCBpbXBsZW1lbnRhdGlvbkd1aWRlLnBhZ2UsIDEsIHRvY0VudHJpZXMpO1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aCwgdG9jRW50cmllcywgc2hvdWxkQXV0b0dlbmVyYXRlLCBwYWdlQ29udGVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB3cml0ZVI0UGFnZXMocm9vdFBhdGg6IHN0cmluZywgaW1wbGVtZW50YXRpb25HdWlkZTogUjRJbXBsZW1lbnRhdGlvbkd1aWRlKSB7XG4gICAgICAgIGNvbnN0IHRvY0VudHJpZXMgPSBbXTtcbiAgICAgICAgbGV0IHNob3VsZEF1dG9HZW5lcmF0ZSA9IHRydWU7XG4gICAgICAgIGxldCByb290UGFnZUNvbnRlbnQ7XG4gICAgICAgIGxldCByb290UGFnZUZpbGVOYW1lO1xuXG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24gJiYgaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGF1dG9HZW5lcmF0ZUV4dGVuc2lvbiA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS5leHRlbnNpb24sIChleHRlbnNpb24pID0+IGV4dGVuc2lvbi51cmwgPT09ICdodHRwczovL3RyaWZvbGlhLW9uLWZoaXIubGFudGFuYWdyb3VwLmNvbS9TdHJ1Y3R1cmVEZWZpbml0aW9uL2V4dGVuc2lvbi1pZy1wYWdlLWF1dG8tZ2VuZXJhdGUtdG9jJyk7XG4gICAgICAgICAgICBzaG91bGRBdXRvR2VuZXJhdGUgPSBhdXRvR2VuZXJhdGVFeHRlbnNpb24gJiYgYXV0b0dlbmVyYXRlRXh0ZW5zaW9uLnZhbHVlQm9vbGVhbiA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9wYWdlcycpO1xuICAgICAgICAgICAgZnMuZW5zdXJlRGlyU3luYyhwYWdlc1BhdGgpO1xuXG4gICAgICAgICAgICBpZiAoaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UubmFtZVJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWVSZWZlcmVuY2UgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS5uYW1lUmVmZXJlbmNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlICYmIG5hbWVSZWZlcmVuY2UucmVmZXJlbmNlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZENvbnRhaW5lZCA9IF8uZmluZChpbXBsZW1lbnRhdGlvbkd1aWRlLmNvbnRhaW5lZCwgKGNvbnRhaW5lZCkgPT4gY29udGFpbmVkLmlkID09PSBuYW1lUmVmZXJlbmNlLnJlZmVyZW5jZS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW5hcnkgPSBmb3VuZENvbnRhaW5lZCAmJiBmb3VuZENvbnRhaW5lZC5yZXNvdXJjZVR5cGUgPT09ICdCaW5hcnknID8gPFI0QmluYXJ5PiBmb3VuZENvbnRhaW5lZCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UGFnZUNvbnRlbnQgPSBuZXcgQnVmZmVyKGJpbmFyeS5kYXRhLCAnYmFzZTY0JykudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQYWdlRmlsZU5hbWUgPSBpbXBsZW1lbnRhdGlvbkd1aWRlLmRlZmluaXRpb24ucGFnZS50aXRsZS5yZXBsYWNlKC8gL2csICdfJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcm9vdFBhZ2VGaWxlTmFtZS5lbmRzV2l0aCgnLm1kJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UGFnZUZpbGVOYW1lICs9ICcubWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLndyaXRlUjRQYWdlKHBhZ2VzUGF0aCwgaW1wbGVtZW50YXRpb25HdWlkZSwgaW1wbGVtZW50YXRpb25HdWlkZS5kZWZpbml0aW9uLnBhZ2UsIDEsIHRvY0VudHJpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwZW5kIFRPQyBFbnRyaWVzIHRvIHRoZSB0b2MubWQgZmlsZSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVRhYmxlT2ZDb250ZW50cyhyb290UGF0aCwgdG9jRW50cmllcywgc2hvdWxkQXV0b0dlbmVyYXRlLCB7IGZpbGVOYW1lOiByb290UGFnZUZpbGVOYW1lLCBjb250ZW50OiByb290UGFnZUNvbnRlbnQgfSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBleHBvcnQoZm9ybWF0OiBzdHJpbmcsIGV4ZWN1dGVJZ1B1Ymxpc2hlcjogYm9vbGVhbiwgdXNlVGVybWlub2xvZ3lTZXJ2ZXI6IGJvb2xlYW4sIHVzZUxhdGVzdDogYm9vbGVhbiwgZG93bmxvYWRPdXRwdXQ6IGJvb2xlYW4sIHRlc3RDYWxsYmFjaz86IChtZXNzYWdlLCBlcnI/KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidW5kbGVFeHBvcnRlciA9IG5ldyBCdW5kbGVFeHBvcnRlcih0aGlzLmZoaXJTZXJ2ZXJCYXNlLCB0aGlzLmZoaXJTZXJ2ZXJJZCwgdGhpcy5maGlyLCB0aGlzLmltcGxlbWVudGF0aW9uR3VpZGVJZCk7XG4gICAgICAgICAgICBjb25zdCBpc1htbCA9IGZvcm1hdCA9PT0gJ3htbCcgfHwgZm9ybWF0ID09PSAnYXBwbGljYXRpb24veG1sJyB8fCBmb3JtYXQgPT09ICdhcHBsaWNhdGlvbi9maGlyK3htbCc7XG4gICAgICAgICAgICBjb25zdCBleHRlbnNpb24gPSAoIWlzWG1sID8gJy5qc29uJyA6ICcueG1sJyk7XG4gICAgICAgICAgICBjb25zdCBob21lZGlyID0gcmVxdWlyZSgnb3MnKS5ob21lZGlyKCk7XG4gICAgICAgICAgICBjb25zdCBmaGlyU2VydmVyQ29uZmlnID0gXy5maW5kKGZoaXJDb25maWcuc2VydmVycywgKHNlcnZlcjogRmhpckNvbmZpZ1NlcnZlcikgPT4gc2VydmVyLmlkID09PSB0aGlzLmZoaXJTZXJ2ZXJJZCk7XG4gICAgICAgICAgICBsZXQgY29udHJvbDtcbiAgICAgICAgICAgIGxldCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2U7XG5cbiAgICAgICAgICAgIHRtcC5kaXIoKHRtcERpckVyciwgcm9vdFBhdGgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodG1wRGlyRXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKHRtcERpckVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGNyZWF0aW5nIGEgdGVtcG9yYXJ5IGRpcmVjdG9yeTogJyArIHRtcERpckVycik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsICdpZy5qc29uJyk7XG4gICAgICAgICAgICAgICAgbGV0IGJ1bmRsZTogQnVuZGxlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wYWNrYWdlSWQgPSByb290UGF0aC5zdWJzdHJpbmcocm9vdFBhdGgubGFzdEluZGV4T2YocGF0aC5zZXApICsgMSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnBhY2thZ2VJZCk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnQ3JlYXRlZCB0ZW1wIGRpcmVjdG9yeS4gUmV0cmlldmluZyByZXNvdXJjZXMgZm9yIGltcGxlbWVudGF0aW9uIGd1aWRlLicpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXBhcmUgSUcgUHVibGlzaGVyIHBhY2thZ2VcbiAgICAgICAgICAgICAgICAgICAgYnVuZGxlRXhwb3J0ZXIuZ2V0QnVuZGxlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzOiBCdW5kbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidW5kbGUgPSByZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlc0RpciA9IHBhdGguam9pbihyb290UGF0aCwgJ3NvdXJjZS9yZXNvdXJjZXMnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ1Jlc291cmNlcyByZXRyaWV2ZWQuIFBhY2thZ2luZy4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVuZGxlLmVudHJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlID0gYnVuZGxlLmVudHJ5W2ldLnJlc291cmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZVR5cGUgPSByZXNvdXJjZS5yZXNvdXJjZVR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYnVuZGxlLmVudHJ5W2ldLnJlc291cmNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZURpciA9IHBhdGguam9pbihyZXNvdXJjZXNEaXIsIHJlc291cmNlVHlwZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc291cmNlUGF0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb3VyY2VDb250ZW50ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VUeXBlID09ICdJbXBsZW1lbnRhdGlvbkd1aWRlJyAmJiBpZCA9PT0gdGhpcy5pbXBsZW1lbnRhdGlvbkd1aWRlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSA9IHJlc291cmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW1wbGVtZW50YXRpb25HdWlkZSBtdXN0IGJlIGdlbmVyYXRlZCBhcyBhbiB4bWwgZmlsZSBmb3IgdGhlIElHIFB1Ymxpc2hlciBpbiBTVFUzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzWG1sICYmIHJlc291cmNlVHlwZSAhPT0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZUNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShidW5kbGUuZW50cnlbaV0ucmVzb3VyY2UsIG51bGwsICdcXHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlUGF0aCA9IHBhdGguam9pbihyZXNvdXJjZURpciwgaWQgKyAnLmpzb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlQ29udGVudCA9IHRoaXMuZmhpci5vYmpUb1htbChidW5kbGUuZW50cnlbaV0ucmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VQYXRoID0gcGF0aC5qb2luKHJlc291cmNlRGlyLCBpZCArICcueG1sJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5lbnN1cmVEaXJTeW5jKHJlc291cmNlRGlyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhyZXNvdXJjZVBhdGgsIHJlc291cmNlQ29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgaW1wbGVtZW50YXRpb24gZ3VpZGUgd2FzIG5vdCBmb3VuZCBpbiB0aGUgYnVuZGxlIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmhpclNlcnZlckNvbmZpZy52ZXJzaW9uID09PSAnc3R1MycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbCA9IHRoaXMuZ2V0U3R1M0NvbnRyb2woZXh0ZW5zaW9uLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UsIDxTVFUzQnVuZGxlPjxhbnk+IGJ1bmRsZSwgdGhpcy5nZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2wgPSB0aGlzLmdldFI0Q29udHJvbChleHRlbnNpb24sIGltcGxlbWVudGF0aW9uR3VpZGVSZXNvdXJjZSwgPFI0QnVuZGxlPjxhbnk+IGJ1bmRsZSwgdGhpcy5nZXRGaGlyQ29udHJvbFZlcnNpb24oZmhpclNlcnZlckNvbmZpZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERlcGVuZGVuY2llcyhjb250cm9sLCBpc1htbCwgcmVzb3VyY2VzRGlyLCB0aGlzLmZoaXIsIGZoaXJTZXJ2ZXJDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBjb250ZW50cyBvZiB0aGUgaWctcHVibGlzaGVyLXRlbXBsYXRlIGZvbGRlciB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vJywgJ2lnLXB1Ymxpc2hlci10ZW1wbGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmNvcHlTeW5jKHRlbXBsYXRlUGF0aCwgcm9vdFBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV3JpdGUgdGhlIGlnLmpzb24gZmlsZSB0byB0aGUgZXhwb3J0IHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sQ29udGVudCA9IEpTT04uc3RyaW5naWZ5KGNvbnRyb2wsIG51bGwsICdcXHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGNvbnRyb2xQYXRoLCBjb250cm9sQ29udGVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXcml0ZSB0aGUgaW50cm8sIHN1bW1hcnkgYW5kIHNlYXJjaCBNRCBmaWxlcyBmb3IgZWFjaCByZXNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChidW5kbGUuZW50cnksIChlbnRyeSkgPT4gdGhpcy53cml0ZUZpbGVzRm9yUmVzb3VyY2VzKHJvb3RQYXRoLCBlbnRyeS5yZXNvdXJjZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUZW1wbGF0ZXMocm9vdFBhdGgsIGJ1bmRsZSwgaW1wbGVtZW50YXRpb25HdWlkZVJlc291cmNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaGlyU2VydmVyQ29uZmlnLnZlcnNpb24gPT09ICdzdHUzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlU3R1M1BhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JpdGVSNFBhZ2VzKHJvb3RQYXRoLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0RvbmUgYnVpbGRpbmcgcGFja2FnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SWdQdWJsaXNoZXIodXNlTGF0ZXN0LCBleGVjdXRlSWdQdWJsaXNoZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChpZ1B1Ymxpc2hlckxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFleGVjdXRlSWdQdWJsaXNoZXIgfHwgIWlnUHVibGlzaGVyTG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnY29tcGxldGUnLCAnRG9uZS4gWW91IHdpbGwgYmUgcHJvbXB0ZWQgdG8gZG93bmxvYWQgdGhlIHBhY2thZ2UgaW4gYSBtb21lbnQuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3RDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdENhbGxiYWNrKHJvb3RQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXBsb3lEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vd3d3cm9vdC9pZ3MnLCBpbXBsZW1lbnRhdGlvbkd1aWRlUmVzb3VyY2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVuc3VyZURpclN5bmMoZGVwbG95RGlyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlnUHVibGlzaGVyVmVyc2lvbiA9IHVzZUxhdGVzdCA/ICdsYXRlc3QnIDogJ2RlZmF1bHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2Nlc3MgPSBzZXJ2ZXJDb25maWcuamF2YUxvY2F0aW9uIHx8ICdqYXZhJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqYXJQYXJhbXMgPSBbJy1qYXInLCBpZ1B1Ymxpc2hlckxvY2F0aW9uLCAnLWlnJywgY29udHJvbFBhdGhdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VUZXJtaW5vbG9neVNlcnZlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqYXJQYXJhbXMucHVzaCgnLXR4JywgJ04vQScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgYFJ1bm5pbmcgJHtpZ1B1Ymxpc2hlclZlcnNpb259IElHIFB1Ymxpc2hlcjogJHtqYXJQYXJhbXMuam9pbignICcpfWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYFNwYXduaW5nIEZISVIgSUcgUHVibGlzaGVyIEphdmEgcHJvY2VzcyBhdCAke3Byb2Nlc3N9IHdpdGggcGFyYW1zICR7amFyUGFyYW1zfWApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWdQdWJsaXNoZXJQcm9jZXNzID0gc3Bhd24ocHJvY2VzcywgamFyUGFyYW1zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlnUHVibGlzaGVyUHJvY2Vzcy5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UodG1wLnRtcGRpciwgJ1hYWCcpLnJlcGxhY2UoaG9tZWRpciwgJ1hYWCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudHJpbSgpLnJlcGxhY2UoL1xcLi9nLCAnJykgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ1B1Ymxpc2hlclByb2Nlc3Muc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKHRtcC50bXBkaXIsICdYWFgnKS5yZXBsYWNlKGhvbWVkaXIsICdYWFgnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnRyaW0oKS5yZXBsYWNlKC9cXC4vZywgJycpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQdWJsaXNoZXJQcm9jZXNzLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdFcnJvciBleGVjdXRpbmcgRkhJUiBJRyBQdWJsaXNoZXI6ICcgKyBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdlcnJvcicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdQdWJsaXNoZXJQcm9jZXNzLm9uKCdleGl0JywgKGNvZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYElHIFB1Ymxpc2hlciBpcyBkb25lIGV4ZWN1dGluZyBmb3IgJHtyb290UGF0aH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdwcm9ncmVzcycsICdJRyBQdWJsaXNoZXIgZmluaXNoZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29kZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgncHJvZ3Jlc3MnLCAnV29uXFwndCBjb3B5IG91dHB1dCB0byBkZXBsb3ltZW50IHBhdGguJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdjb21wbGV0ZScsICdEb25lLiBZb3Ugd2lsbCBiZSBwcm9tcHRlZCB0byBkb3dubG9hZCB0aGUgcGFja2FnZSBpbiBhIG1vbWVudC4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ3Byb2dyZXNzJywgJ0NvcHlpbmcgb3V0cHV0IHRvIGRlcGxveW1lbnQgcGF0aC4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVkUGF0aCA9IHBhdGgucmVzb2x2ZShyb290UGF0aCwgJ2dlbmVyYXRlZF9vdXRwdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dFBhdGggPSBwYXRoLnJlc29sdmUocm9vdFBhdGgsICdvdXRwdXQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2cuZGVidWcoYERlbGV0aW5nIGNvbnRlbnQgZ2VuZXJhdGVkIGJ5IGlnIHB1Ymxpc2hlciBpbiAke2dlbmVyYXRlZFBhdGh9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmVtcHR5RGlyKGdlbmVyYXRlZFBhdGgsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBDb3B5aW5nIG91dHB1dCBmcm9tICR7b3V0cHV0UGF0aH0gdG8gJHtkZXBsb3lEaXJ9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmNvcHkob3V0cHV0UGF0aCwgZGVwbG95RGlyLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRTb2NrZXRNZXNzYWdlKCdlcnJvcicsICdFcnJvciBjb3B5aW5nIGNvbnRlbnRzIHRvIGRlcGxveW1lbnQgcGF0aC4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaW5hbE1lc3NhZ2UgPSBgRG9uZSBleGVjdXRpbmcgdGhlIEZISVIgSUcgUHVibGlzaGVyLiBZb3UgbWF5IHZpZXcgdGhlIElHIDxhIGhyZWY9XCIvaW1wbGVtZW50YXRpb24tZ3VpZGUvJHt0aGlzLmltcGxlbWVudGF0aW9uR3VpZGVJZH0vdmlld1wiPmhlcmU8L2E+LmAgKyAoZG93bmxvYWRPdXRwdXQgPyAnIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvd25sb2FkIHRoZSBwYWNrYWdlIGluIGEgbW9tZW50LicgOiAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZFNvY2tldE1lc3NhZ2UoJ2NvbXBsZXRlJywgZmluYWxNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRvd25sb2FkT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBVc2VyIGluZGljYXRlZCB0aGV5IGRvbid0IG5lZWQgdG8gZG93bmxvYWQuIFJlbW92aW5nIHRlbXBvcmFyeSBkaXJlY3RvcnkgJHtyb290UGF0aH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5lbXB0eURpcihyb290UGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmRlYnVnKGBEb25lIHJlbW92aW5nIHRlbXBvcmFyeSBkaXJlY3RvcnkgJHtyb290UGF0aH1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU29ja2V0TWVzc2FnZSgnZXJyb3InLCAnRXJyb3IgZHVyaW5nIGV4cG9ydDogJyArIGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RDYWxsYmFjayhyb290UGF0aCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=