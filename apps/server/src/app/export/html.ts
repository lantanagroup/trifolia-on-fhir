import {Fhir as FhirModule} from 'fhir/fhir';
import {Server} from 'socket.io';
import {spawn} from 'child_process';
import {
  DomainResource,
  HumanName,
  Bundle as STU3Bundle,
  Binary as STU3Binary,
  ImplementationGuide as STU3ImplementationGuide,
  PageComponent,
  Extension,
  ContactDetail, Media, PackageResourceComponent
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  Binary as R4Binary,
  Bundle as R4Bundle,
  ImplementationGuide as R4ImplementationGuide,
  ImplementationGuidePageComponent, ImplementationGuideResourceComponent
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {BundleExporter} from './bundle';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {IServerConfig} from '../models/server-config';
import {IFhirConfig, IFhirConfigServer} from '../models/fhir-config';
import {HttpService, Logger, MethodNotAllowedException} from '@nestjs/common';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';
import * as vkbeautify from 'vkbeautify';
import {reduceDistinct} from '../../../../../libs/tof-lib/src/lib/helper';
import {Formats} from '../models/export-options';

interface TableOfContentsEntry {
  level: number;
  fileName: string;
  title: string;
}

interface FhirControlDependency {
  location: string;
  name: string;
  version: string;
  package: string;
}

interface FhirControl {
  tool: string;
  source: string;
  'npm-name': string;
  license: string;
  paths: {
    qa: string;
    temp: string;
    output: string;
    txCache: string;
    specification: string;
    pages: string[];
    resources: string[];
  };
  version?: string;
  'fixed-business-version'?: string;
  pages: string[];
  'extension-domains': string[];
  'allowed-domains': string[];
  'sct-edition': string;
  canonicalBase: string;
  defaults?: {
    [key: string]: {
      'template-base'?: string;
      'template-mappings'?: string;
      'template-defns'?: string;
      'template-format'?: string;
      content?: boolean;
      script?: boolean;
      profiles?: boolean;
    };
  };
  dependencyList?: FhirControlDependency[];
  resources?: {
    [key: string]: {
      base?: string;
      defns?: string;
    };
  };
}

class PageInfo {
  page: PageComponent | ImplementationGuidePageComponent;
  fileName: string;
  content: string;
  shouldAutoGenerate: boolean;

  get finalFileName() {
    if (this.fileName && this.fileName.endsWith('.md')) {
      return this.fileName.substring(0, this.fileName.lastIndexOf('.')) + '.html';
    }
  }
}

export class ExportResults {
  rootPath: string;
  packageId: string;
}

export class HtmlExporter {
  readonly httpService: HttpService;
  readonly logger: Logger;
  readonly fhirServerBase: string;
  readonly fhirServerId: string;
  readonly fhirVersion: string;
  readonly fhir: FhirModule;
  readonly io: Server;
  readonly socketId: string;
  readonly implementationGuideId: string;
  readonly serverConfig: IServerConfig;
  readonly fhirConfig: IFhirConfig;

  readonly homedir: string;

  private igPublisherLocation: string;
  private implementationGuide: STU3ImplementationGuide | R4ImplementationGuide;
  public packageId: string;
  public rootPath: string;
  public controlPath: string;

  // TODO: Refactor so that there aren't so many constructor params
  constructor(serverConfig: IServerConfig, fhirConfig: IFhirConfig, httpService: HttpService, logger: Logger, fhirServerBase: string, fhirServerId: string, fhirVersion: string, fhir: FhirModule, io: Server, socketId: string, implementationGuideId: string) {
    this.serverConfig = serverConfig;
    this.fhirConfig = fhirConfig;
    this.httpService = httpService;
    this.logger = logger;
    this.fhirServerBase = fhirServerBase;
    this.fhirServerId = fhirServerId;
    this.fhirVersion = fhirVersion;
    this.fhir = fhir;
    this.io = io;
    this.socketId = socketId;
    this.implementationGuideId = implementationGuideId;

    this.homedir = require('os').homedir();
  }

  private get stu3ImplementationGuide(): STU3ImplementationGuide {
    return <STU3ImplementationGuide> this.implementationGuide;
  }

  private get r4ImplementationGuide(): R4ImplementationGuide {
    return <R4ImplementationGuide> this.implementationGuide;
  }

  static getStu3Control(implementationGuide: STU3ImplementationGuide, bundle: STU3Bundle, version) {
    const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
    const canonicalBaseMatch = canonicalBaseRegex.exec(implementationGuide.url);
    const packageIdExtension = (implementationGuide.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-package-id']);
    let canonicalBase;

    if (!canonicalBaseMatch || canonicalBaseMatch.length < 2) {
      canonicalBase = implementationGuide.url.substring(0, implementationGuide.url.lastIndexOf('/'));
    } else {
      canonicalBase = canonicalBaseMatch[1];
    }

    // TODO: Extract npm-name from IG extension.
    // currently, IG resource has to be in XML format for the IG Publisher
    const control = <FhirControl>{
      tool: 'jekyll',
      source: 'implementationguide/' + implementationGuide.id + '.xml',
      'npm-name': packageIdExtension && packageIdExtension.valueString ? packageIdExtension.valueString : implementationGuide.id + '-npm',
      license: 'CC0-1.0',                                                         // R4: ImplementationGuide.license
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
        'Location': {'template-base': 'ex.html'},
        'ProcedureRequest': {'template-base': 'ex.html'},
        'Organization': {'template-base': 'ex.html'},
        'MedicationStatement': {'template-base': 'ex.html'},
        'SearchParameter': {'template-base': 'base.html'},
        'StructureDefinition': {
          'template-mappings': 'sd-mappings.html',
          'template-base': 'sd.html',
          'template-defns': 'sd-definitions.html'
        },
        'Immunization': {'template-base': 'ex.html'},
        'Patient': {'template-base': 'ex.html'},
        'StructureMap': {
          'content': false,
          'script': false,
          'template-base': 'ex.html',
          'profiles': false
        },
        'ConceptMap': {'template-base': 'base.html'},
        'Practitioner': {'template-base': 'ex.html'},
        'OperationDefinition': {'template-base': 'base.html'},
        'CodeSystem': {'template-base': 'base.html'},
        'Communication': {'template-base': 'ex.html'},
        'Any': {
          'template-format': 'format.html',
          'template-base': 'base.html'
        },
        'PractitionerRole': {'template-base': 'ex.html'},
        'ValueSet': {'template-base': 'base.html'},
        'CapabilityStatement': {'template-base': 'base.html'},
        'Observation': {'template-base': 'ex.html'}
      },
      resources: {}
    };


    if (implementationGuide.fhirVersion) {
      control.version = implementationGuide.fhirVersion;
    } else if (version) {                       // Use the version of the FHIR server the resources are coming from
      control.version = version;
    }

    if (implementationGuide.version) {
      control['fixed-business-version'] = implementationGuide.version;
    }

    // Set the dependencyList based on the extensions in the IG
    const dependencyExtensions = (implementationGuide.extension || []).filter((extension) => extension.url === Globals.extensionUrls['extension-ig-dependency']);

    // R4 ImplementationGuide.dependsOn
    control.dependencyList = dependencyExtensions
      .filter((dependencyExtension) => {
        const locationExtension = (dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-location']);
        const nameExtension = (dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-name']);

        return !!locationExtension && !!locationExtension.valueUri && !!nameExtension && !!nameExtension.valueString;
      })
      .map((dependencyExtension) => {
        const locationExtension = <Extension>(dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-location']);
        const nameExtension = <Extension>(dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-name']);
        const versionExtension = <Extension>(dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-version']);

        return <FhirControlDependency>{
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

  public static getR4Control(implementationGuide: R4ImplementationGuide, bundle: R4Bundle, version: string) {
    const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
    const canonicalBaseMatch = canonicalBaseRegex.exec(implementationGuide.url);
    let canonicalBase;

    if (!canonicalBaseMatch || canonicalBaseMatch.length < 2) {
      canonicalBase = implementationGuide.url.substring(0, implementationGuide.url.lastIndexOf('/'));
    } else {
      canonicalBase = canonicalBaseMatch[1];
    }

    // currently, IG resource has to be in XML format for the IG Publisher
    const control = <FhirControl>{
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
        'Location': {'template-base': 'ex.html'},
        'ProcedureRequest': {'template-base': 'ex.html'},
        'Organization': {'template-base': 'ex.html'},
        'MedicationStatement': {'template-base': 'ex.html'},
        'SearchParameter': {'template-base': 'base.html'},
        'StructureDefinition': {
          'template-mappings': 'sd-mappings.html',
          'template-base': 'sd.html',
          'template-defns': 'sd-definitions.html'
        },
        'Immunization': {'template-base': 'ex.html'},
        'Patient': {'template-base': 'ex.html'},
        'StructureMap': {
          'content': false,
          'script': false,
          'template-base': 'ex.html',
          'profiles': false
        },
        'ConceptMap': {'template-base': 'base.html'},
        'Practitioner': {'template-base': 'ex.html'},
        'OperationDefinition': {'template-base': 'base.html'},
        'CodeSystem': {'template-base': 'base.html'},
        'Communication': {'template-base': 'ex.html'},
        'Any': {
          'template-format': 'format.html',
          'template-base': 'base.html'
        },
        'PractitionerRole': {'template-base': 'ex.html'},
        'ValueSet': {'template-base': 'base.html'},
        'CapabilityStatement': {'template-base': 'base.html'},
        'Observation': {'template-base': 'ex.html'}
      },
      resources: {}
    };

    if (implementationGuide.fhirVersion && implementationGuide.fhirVersion.length > 0) {
      control.version = implementationGuide.fhirVersion[0];
    } else if (version) {                       // Use the version of the FHIR server the resources are coming from
      control.version = version;
    }

    if (implementationGuide.version) {
      control['fixed-business-version'] = implementationGuide.version;
    }

    control.dependencyList = (implementationGuide.dependsOn || [])
      .filter((dependsOn) => {
        const locationExtension = (dependsOn.extension || []).find((dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-location');
        const nameExtension = (dependsOn.extension || []).find((dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-name');

        return !!locationExtension && !!locationExtension.valueString && !!nameExtension && !!nameExtension.valueString;
      })
      .map((dependsOn) => {
        const locationExtension = (dependsOn.extension || []).find((dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-location');
        const nameExtension = (dependsOn.extension || []).find((dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-name');

        return {
          location: locationExtension ? locationExtension.valueString : '',
          name: nameExtension ? nameExtension.valueString : '',
          version: dependsOn.version,
          package: dependsOn.packageId
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

  private getDisplayName(name: string | HumanName): string {
    if (!name) {
      return;
    }

    if (typeof name === 'string') {
      return <string>name;
    }

    let display = name.family;

    if (name.given) {
      if (display) {
        display += ', ';
      } else {
        display = '';
      }

      display += name.given.join(' ');
    }

    return display;
  }


  private createTableFromArray(headers, data) {
    let output = '<table>\n<thead>\n<tr>\n';

    headers.forEach((header) => {
      output += `<th>${header}</th>\n`;
    });

    output += '</tr>\n</thead>\n<tbody>\n';

    data.forEach((row: string[]) => {
      output += '<tr>\n';

      row.forEach((cell) => {
        output += `<td>${cell}</td>\n`;
      });

      output += '</tr>\n';
    });

    output += '</tbody>\n</table>\n';

    return output;
  }

  private sendSocketMessage(status, message, shouldLog?: boolean) {
    if (!this.socketId) {
      this.logger.error('Won\'t send socket message for export because the original request did not specify a socketId');
      return;
    }

    if (this.io) {
      this.io.to(this.socketId).emit('html-export', {
        packageId: this.packageId,
        status: status,
        message: message
      });
    }

    if (shouldLog) {
      this.logger.log(`${status}: ${message}`);
    }
  }

  private getIgPublisher(useLatest: boolean): Promise<string> {
    return new Promise((resolve) => {
      const fileName = 'org.hl7.fhir.igpublisher.jar';
      const defaultPath = path.join(__dirname, 'assets', 'ig-publisher');
      const defaultFilePath = path.join(defaultPath, fileName);

      if (useLatest === true) {
        this.logger.log('Request to get latest version of FHIR IG publisher. Retrieving from: ' + this.fhirConfig.latestPublisher);

        this.sendSocketMessage('progress', 'Downloading latest FHIR IG publisher');

        // TODO: Check http://build.fhir.org/version.info first

        // TODO: Set config on GET request to return binary
        this.httpService.get(this.fhirConfig.latestPublisher, { responseType: 'arraybuffer' }).toPromise()
          .then((results) => {
            this.logger.log('Successfully downloaded latest version of FHIR IG Publisher. Ensuring latest directory exists');

            const latestPath = path.join(defaultPath, 'latest');
            fs.ensureDirSync(latestPath);

            // noinspection JSUnresolvedFunction
            const latestFilePath = path.join(latestPath, fileName);

            this.logger.log('Saving FHIR IG publisher to ' + latestFilePath);

            fs.writeFileSync(latestFilePath, results.data);

            resolve(latestFilePath);
          })
          .catch((err) => {
            this.logger.error(`Error getting latest version of FHIR IG publisher: ${err}`);
            this.sendSocketMessage('progress', 'Encountered error downloading latest IG publisher, will use pre-loaded/default IG publisher');
            resolve(defaultFilePath);
          });
      } else {
        this.logger.log('Using built-in version of FHIR IG publisher for export');
        this.sendSocketMessage('progress', 'Using existing/default version of FHIR IG publisher');
        resolve(defaultFilePath);
      }
    });
  }

  private getFhirControlVersion(fhirServerConfig) {
    const configVersion = fhirServerConfig ? fhirServerConfig.version : null;

    // Add more logic case statements as needed
    switch (configVersion) {
      case 'stu3':
        return '3.0.1';
      default:
        return '4.0.0';
    }
  }

  private updateTemplates(rootPath, bundle, implementationGuide: STU3ImplementationGuide | R4ImplementationGuide) {
    const mainResourceTypes = ['ImplementationGuide', 'ValueSet', 'CodeSystem', 'StructureDefinition', 'CapabilityStatement'];
    const distinctResources = (bundle.entry || [])
      .map((entry) => <DomainResource> entry.resource)
      .reduce(reduceDistinct((resource: DomainResource) => resource.id), []);
    const valueSets = distinctResources.filter((resource) => resource.resourceType === 'ValueSet');
    const codeSystems = distinctResources.filter((resource) => resource.resourceType === 'CodeSystem');
    const profiles = distinctResources.filter((resource) => resource.resourceType === 'StructureDefinition' && (!resource.baseDefinition || !resource.baseDefinition.endsWith('Extension')));
    const extensions = distinctResources.filter((resource) => resource.resourceType === 'StructureDefinition' && resource.baseDefinition && resource.baseDefinition.endsWith('Extension'));
    const capabilityStatements = distinctResources.filter((resource) => resource.resourceType === 'CapabilityStatement');
    const otherResources = distinctResources.filter((resource) => mainResourceTypes.indexOf(resource.resourceType) < 0);

    if (implementationGuide) {
      const indexPath = path.join(rootPath, 'source/pages/index.md');

      if (implementationGuide.description) {
        const descriptionContent = '### Description\n\n' + implementationGuide.description + '\n\n';
        fs.appendFileSync(indexPath, descriptionContent);
      }

      if (implementationGuide.contact) {
        const authorsData = (<any> implementationGuide.contact || []).map((contact: ContactDetail) => {
          const foundEmail = (contact.telecom || []).find((telecom) => telecom.system === 'email');
          return [contact.name, foundEmail ? `<a href="mailto:${foundEmail.value}">${foundEmail.value}</a>` : ''];
        });
        const authorsContent = '### Authors\n\n' + this.createTableFromArray(['Name', 'Email'], authorsData) + '\n\n';
        fs.appendFileSync(indexPath, authorsContent);
      }
    }

    if (profiles.length > 0) {
      const profilesData = profiles
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map((profile) => {
          return [`<a href="StructureDefinition-${profile.id}.html">${profile.name}</a>`, profile.description || ''];
        });
      const profilesTable = this.createTableFromArray(['Name', 'Description'], profilesData);
      const profilesPath = path.join(rootPath, 'source/pages/profiles.md');
      fs.appendFileSync(profilesPath, '### Profiles\n\n' + profilesTable + '\n\n');
    }

    if (extensions.length > 0) {
      const extData = extensions
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map((extension) => {
          return [`<a href="StructureDefinition-${extension.id}.html">${extension.name}</a>`, extension.description || ''];
        });
      const extContent = this.createTableFromArray(['Name', 'Description'], extData);
      const extPath = path.join(rootPath, 'source/pages/profiles.md');
      fs.appendFileSync(extPath, '### Extensions\n\n' + extContent + '\n\n');
    }

    if (valueSets.length > 0) {
      let vsContent = '### Value Sets\n\n';
      const vsPath = path.join(rootPath, 'source/pages/terminology.md');

      valueSets
        .sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''))
        .forEach((valueSet) => {
          vsContent += `- [${valueSet.title || valueSet.name}](ValueSet-${valueSet.id}.html)\n`;
        });

      fs.appendFileSync(vsPath, vsContent + '\n\n');
    }

    if (codeSystems.length > 0) {
      let csContent = '### Code Systems\n\n';
      const csPath = path.join(rootPath, 'source/pages/terminology.md');

      codeSystems
        .sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''))
        .forEach((codeSystem) => {
          csContent += `- [${codeSystem.title || codeSystem.name}](ValueSet-${codeSystem.id}.html)\n`;
        });

      fs.appendFileSync(csPath, csContent + '\n\n');
    }

    if (capabilityStatements.length > 0) {
      const csData = capabilityStatements
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map((capabilityStatement) => {
          return [`<a href="CapabilityStatement-${capabilityStatement.id}.html">${capabilityStatement.name}</a>`, capabilityStatement.description || ''];
        });
      const csContent = this.createTableFromArray(['Name', 'Description'], csData);
      const csPath = path.join(rootPath, 'source/pages/capstatements.md');
      fs.appendFileSync(csPath, '### CapabilityStatements\n\n' + csContent);
    }

    if (otherResources.length > 0) {
      const oData = otherResources
        .sort((a, b) => {
          const aDisplay = a.title || this.getDisplayName(a.name) || a.id || '';
          const aCompare = a.resourceType + aDisplay;
          const bDisplay = b.title || this.getDisplayName(b.name) || b.id || '';
          const bCompare = b.resourceType + bDisplay;
          return aCompare.localeCompare(bCompare);
        })
        .map((resource) => {
          let name = resource.title || this.getDisplayName(resource.name) || resource.id;
          return [resource.resourceType, `<a href="${resource.resourceType}-${resource.id}.html">${name}</a>`];
        });
      const oContent = this.createTableFromArray(['Type', 'Name'], oData);
      const csPath = path.join(rootPath, 'source/pages/other.md');
      fs.appendFileSync(csPath, '### Other Resources\n\n' + oContent);
    }
  }

  private writeFilesForResources(rootPath: string, resource: DomainResource) {
    if (!resource || !resource.resourceType || resource.resourceType === 'ImplementationGuide') {
      return;
    }

    if (resource.resourceType === 'Media') {
      const fileNameIdentifier = ((<Media>resource).identifier || []).find(id => !!id.value);

      if (fileNameIdentifier && (<Media>resource).content && (<Media>resource).content.data) {
        const outputPath = path.join(this.rootPath, 'source/pages', fileNameIdentifier.value);

        try {
          fs.writeFileSync(outputPath, new Buffer((<Media>resource).content.data, 'base64'));
        } catch (ex) {
          this.logger.error(`Error writing media/image to export directory: ${ex.message}`);
        }
      }

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

    if ((<any>resource).description) {
      intro += (<any>resource).description;
    }

    fs.writeFileSync(introPath, intro);
    fs.writeFileSync(searchPath, '');
    fs.writeFileSync(summaryPath, '');
  }

  private writeStu3Page(pagesPath: string, page: PageComponent, level: number, tocEntries: TableOfContentsEntry[], pageList: PageInfo[]) {
    const pageInfo = pageList.find(next => next.page === page);
    const pageIndex = pageList.indexOf(pageInfo);
    const previousPage = pageIndex === 0 ? null : pageList[pageIndex - 1];
    const nextPage = pageIndex === pageList.length - 1 ? null : pageList[pageIndex + 1];
    const previousPageLink = previousPage ?
      `<a href="${previousPage.finalFileName}">Previous Page</a>\n` :
      null;
    const nextPageLink = nextPage ?
      `\n<a href="${nextPage.finalFileName}">Next Page</a>` :
      null;

    if (page.kind !== 'toc' && pageInfo.content) {
      const newPagePath = path.join(pagesPath, pageInfo.fileName);

      const content = '---\n' +
        `title: ${page.title}\n` +
        'layout: default\n' +
        `active: ${page.title}\n` +
        `---\n\n${previousPageLink}${pageInfo.content}${nextPageLink}`;

      fs.writeFileSync(newPagePath, content);
    }

    // Add an entry to the TOC
    tocEntries.push({level: level, fileName: page.kind === 'page' && pageInfo.fileName, title: page.title});
    (page.page || []).forEach((subPage) => this.writeStu3Page(pagesPath, subPage, level + 1, tocEntries, pageList));
  }

  private getPageExtension(page: ImplementationGuidePageComponent) {
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

  private writeR4Page(pagesPath: string, page: ImplementationGuidePageComponent, level: number, tocEntries: TableOfContentsEntry[], pageList: PageInfo[]) {
    const pageInfo = pageList.find(next => next.page === page);
    const pageInfoIndex = pageList.indexOf(pageInfo);
    const previousPage = pageInfoIndex > 0 ? pageList[pageInfoIndex - 1] : null;
    const nextPage = pageInfoIndex < pageList.length - 1 ? pageList[pageInfoIndex + 1] : null;

    const previousPageLink = previousPage ?
      `<a href="${previousPage.finalFileName}">Previous Page</a>\n` :
      null;
    const nextPageLink = nextPage ?
      `\n<a href="${nextPage.finalFileName}">Next Page</a>` :
      null;

    if (pageInfo.content && pageInfo.fileName) {
      const newPagePath = path.join(pagesPath, pageInfo.fileName);

      // noinspection JSUnresolvedFunction
      const content = '---\n' +
        `title: ${page.title}\n` +
        'layout: default\n' +
        `active: ${page.title}\n` +
        `---\n\n${previousPageLink}${pageInfo.content}${nextPageLink}`;
      fs.writeFileSync(newPagePath, content);
    }

    // Add an entry to the TOC
    tocEntries.push({level: level, fileName: pageInfo.fileName, title: page.title});
    (page.page || []).forEach((subPage) => this.writeR4Page(pagesPath, subPage, level + 1, tocEntries, pageList));
  }

  private generateTableOfContents(rootPath: string, tocEntries: TableOfContentsEntry[], shouldAutoGenerate: boolean, content) {
    const tocPath = path.join(rootPath, 'source/pages/toc.md');
    let tocContent = '';

    if (shouldAutoGenerate) {
      tocEntries.forEach((entry) => {
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
        } else {
          tocContent += `${entry.title}\n`;
        }
      });
    } else if (content) {
      tocContent = content;
    }

    if (tocContent) {
      fs.appendFileSync(tocPath, tocContent);
    }
  }

  private writeStu3Pages(rootPath: string) {
    // Flatten the hierarchy of pages into a single array that we can use to determine previous and next pages
    const getPagesList = (theList: PageInfo[], page: PageComponent) => {
      if (!page) {
        return theList;
      }

      const contentExtension = (page.extension || []).find((extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content');
      const autoGenerateExtension = (page.extension || []).find((extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc');

      const pageInfo = new PageInfo();
      pageInfo.page = page;
      pageInfo.shouldAutoGenerate = autoGenerateExtension && autoGenerateExtension.valueBoolean === true;

      if (contentExtension && contentExtension.valueReference && contentExtension.valueReference.reference && page.source) {
        const reference = contentExtension.valueReference.reference;

        if (reference.startsWith('#')) {
          const contained = (this.stu3ImplementationGuide.contained || []).find((next: DomainResource) => next.id === reference.substring(1));
          const binary = contained && contained.resourceType === 'Binary' ? <STU3Binary>contained : undefined;

          if (binary) {
            pageInfo.fileName = page.source;
            pageInfo.content = Buffer.from(binary.content, 'base64').toString();
          }
        }
      }

      pageList.push(pageInfo);

      (page.page || []).forEach((next) => getPagesList(theList, next));

      return theList;
    };

    const tocEntries = [];
    const pageList: PageInfo[] = getPagesList([], this.stu3ImplementationGuide.page);
    const rootPageInfo = pageList.length > 0 ? pageList[0] : null;

    if (rootPageInfo) {
      const pagesPath = path.join(rootPath, 'source/pages');
      fs.ensureDirSync(pagesPath);

      this.writeStu3Page(pagesPath, <PageComponent> rootPageInfo.page, 1, tocEntries, pageList);
      this.generateTableOfContents(rootPath, tocEntries, rootPageInfo.shouldAutoGenerate, rootPageInfo.content);
    }
  }

  private writeR4Pages(rootPath: string) {
    // Flatten the hierarchy of pages into a single array that we can use to determine previous and next pages
    const getPagesList = (theList: PageInfo[], page: ImplementationGuidePageComponent) => {
      if (!page) {
        return theList;
      }

      const pageInfo = new PageInfo();
      pageInfo.page = page;

      const autoGenerateExtension = (page.extension || []).find((extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc');
      pageInfo.shouldAutoGenerate = autoGenerateExtension && autoGenerateExtension.valueBoolean === true;

      if (page.nameReference && page.nameReference.reference) {
        const reference = page.nameReference.reference;

        if (reference.startsWith('#')) {
          const contained = (this.r4ImplementationGuide.contained || []).find((contained) => contained.id === reference.substring(1));
          const binary = contained && contained.resourceType === 'Binary' ? <R4Binary>contained : undefined;

          if (binary && binary.data) {
            pageInfo.fileName = page.title.replace(/ /g, '_');

            if (pageInfo.fileName.indexOf('.') < 0) {
              pageInfo.fileName += this.getPageExtension(page);
            }
          }

          if (binary && binary.data) {
            pageInfo.content = Buffer.from(binary.data, 'base64').toString();
          }
        }
      } else if (page.nameUrl) {
        pageInfo.fileName = page.nameUrl;
      }

      theList.push(pageInfo);

      (page.page || []).forEach((next) => getPagesList(theList, next));

      return theList;
    };

    const pageList = getPagesList([], this.r4ImplementationGuide.definition ? this.r4ImplementationGuide.definition.page : null);
    const rootPageInfo = pageList.length > 0 ? pageList[0] : null;
    const tocEntries = [];

    if (rootPageInfo) {
      const pagesPath = path.join(rootPath, 'source/pages');
      fs.ensureDirSync(pagesPath);

      this.writeR4Page(pagesPath, this.r4ImplementationGuide.definition.page, 1, tocEntries, pageList);

      // Append TOC Entries to the toc.md file in the template
      this.generateTableOfContents(rootPath, tocEntries, rootPageInfo.shouldAutoGenerate, {fileName: rootPageInfo.fileName, content: rootPageInfo.content});
    }
  }

  private createTempDirectory(): Promise<string> {
    return new Promise((resolve, reject) => {
      tmp.dir((tmpDirErr, rootPath) => {
        if (tmpDirErr) {
          reject(tmpDirErr);
        } else {
          resolve(rootPath);
        }
      });
    });
  }

  public async publish(format: Formats, useTerminologyServer: boolean, useLatest: boolean, downloadOutput: boolean, includeIgPublisherJar: boolean, testCallback?: (message, err?) => void) {
    if (!this.packageId) {
      throw new MethodNotAllowedException('export() must be executed before publish()');
    }

    const deployDir = path.resolve(this.serverConfig.publishedIgsDirectory || __dirname, 'igs', this.fhirServerId, this.implementationGuide.id);
    fs.ensureDirSync(deployDir);

    const igPublisherVersion = useLatest ? 'latest' : 'default';
    const process = this.serverConfig.javaLocation || 'java';
    const jarParams = ['-jar', this.igPublisherLocation, '-ig', this.controlPath];

    if (!useTerminologyServer) {
      jarParams.push('-tx', 'N/A');
    }

    this.sendSocketMessage('progress', `Running ${igPublisherVersion} IG Publisher: ${jarParams.join(' ')}`, true);

    this.logger.log(`Spawning FHIR IG Publisher Java process at ${process} with params ${jarParams}`);

    const igPublisherProcess = spawn(process, jarParams);

    igPublisherProcess.stdout.on('data', (data) => {
      const message = data.toString()
        .replace(tmp.tmpdir, 'XXX')
        .replace(tmp.tmpdir.replace(/\\/g, '/'), 'XXX')
        .replace(this.homedir, 'XXX');

      if (message && message.trim().replace(/\./g, '') !== '') {
        this.sendSocketMessage('progress', message);
      }
    });

    igPublisherProcess.stderr.on('data', (data) => {
      const message = data.toString().replace(tmp.tmpdir, 'XXX').replace(this.homedir, 'XXX');

      if (message && message.trim().replace(/\./g, '') !== '') {
        this.sendSocketMessage('progress', message);
      }
    });

    igPublisherProcess.on('error', (err) => {
      const message = 'Error executing FHIR IG Publisher: ' + err;
      this.logger.error(message);
      this.sendSocketMessage('error', message);
    });

    igPublisherProcess.on('exit', (code) => {
      this.logger.log(`IG Publisher is done executing for ${this.rootPath}`);

      this.sendSocketMessage('progress', 'IG Publisher finished with code ' + code, true);

      if (code !== 0) {
        this.sendSocketMessage('progress', 'Won\'t copy output to deployment path.', true);
        this.sendSocketMessage('complete', 'Done. You will be prompted to download the package in a moment.');
      } else {
        this.sendSocketMessage('progress', 'Copying output to deployment path.', true);

        const generatedPath = path.resolve(this.rootPath, 'generated_output');
        const outputPath = path.resolve(this.rootPath, 'output');

        this.logger.log(`Deleting content generated by ig publisher in ${generatedPath}`);

        fs.emptyDir(generatedPath, (err) => {
          if (err) {
            this.logger.error(err);
          }
        });

        this.logger.log(`Copying output from ${outputPath} to ${deployDir}`);

        fs.copy(outputPath, deployDir, (err) => {
          if (err) {
            this.logger.error(err);
            this.sendSocketMessage('error', 'Error copying contents to deployment path.');
          } else {
            const finalMessage = `Done executing the FHIR IG Publisher. You may view the IG <a href="/${this.fhirServerId}/implementation-guide/${this.implementationGuideId}/view">here</a>.` + (downloadOutput ? ' You will be prompted to download the package in a moment.' : '');
            this.sendSocketMessage('complete', finalMessage, true);
          }

          if (!downloadOutput) {
            this.logger.log(`User indicated they don't need to download. Removing temporary directory ${this.rootPath}`);

            fs.emptyDir(this.rootPath, (err) => {
              if (err) {
                this.logger.error(err);
              } else {
                this.logger.log(`Done removing temporary directory ${this.rootPath}`);
              }
            });
          }
        });
      }
    });
  }

  private isImplementationGuideReferenceExample(igReference: PackageResourceComponent | ImplementationGuideResourceComponent): boolean {
    if (!igReference) {
      return false;
    }

    if (this.fhirVersion === 'stu3') {
      const obj = <PackageResourceComponent> igReference;
      return obj.example || !!obj.exampleFor;
    } else if (this.fhirVersion === 'r4') {
      const obj = <ImplementationGuideResourceComponent> igReference;
      return obj.exampleBoolean || !!obj.exampleCanonical;
    } else {
      throw new Error('Unexpected FHIR version');
    }
  }

  private getImplementationGuideReference(resourceType: string, id: string): PackageResourceComponent | ImplementationGuideResourceComponent {
    if (this.fhirVersion === 'stu3') {
      if (this.stu3ImplementationGuide.package) {
        for (let i = 0; i < this.stu3ImplementationGuide.package.length; i++) {
          const pkg = this.stu3ImplementationGuide.package[i];
          const found = (pkg.resource || [])
            .find(res => res.sourceReference && res.sourceReference.reference === `${resourceType}/${id}`);

          if (found) {
            return found;
          }
        }
      }
    } else if (this.fhirVersion === 'r4') {
      if (this.r4ImplementationGuide.definition) {
        const found = (this.r4ImplementationGuide.definition.resource || [])
          .find(res => res.reference && res.reference.reference === `${resourceType}/${id}`);
        return found;
      }
    } else {
      throw new Error('Unexpected FHIR version');
    }
  }

  public async export(format: Formats, includeIgPublisherJar: boolean, useLatest: boolean): Promise<void> {
    if (!this.fhirConfig.servers) {
      throw new InvalidModuleConfigException('This server is not configured with FHIR servers');
    }

    const bundleExporter = new BundleExporter(this.httpService, this.logger, this.fhirServerBase, this.fhirServerId, this.fhirVersion, this.fhir, this.implementationGuideId);
    const isXml = format === 'xml' || format === 'application/xml' || format === 'application/fhir+xml';
    const fhirServerConfig = this.fhirConfig.servers.find((server: IFhirConfigServer) => server.id === this.fhirServerId);
    let control, bundle;

    this.logger.log(`Starting export of HTML package. Home directory is ${this.homedir}`);

    try {
      this.rootPath = await this.createTempDirectory();
      this.controlPath = path.join(this.rootPath, 'ig.json');
      this.packageId = this.rootPath.substring(this.rootPath.lastIndexOf(path.sep) + 1);
    } catch (ex) {
      this.logger.error(`Error while creating temporary directory for export: ${ex.message}`, ex.stack);
      throw ex;
    }

    this.logger.log('Retrieving resources for export');

    try {
      bundle = await bundleExporter.getBundle();
    } catch (ex) {
      this.logger.error(`Error while retrieving bundle: ${ex.message}`, ex.stack);
      throw ex;
    }

    const resourcesDir = path.join(this.rootPath, 'source/resources');

    this.logger.log('Resources retrieved. Writing resources to file system.');

    for (let i = 0; i < bundle.entry.length; i++) {
      const resource = bundle.entry[i].resource;
      const cleanResource = BundleExporter.cleanupResource(resource);
      const resourceType = resource.resourceType;
      const id = resource.id;
      const resourceDir = path.join(resourcesDir, resourceType.toLowerCase());
      let resourcePath, resourceContent;

      if (resourceType === 'ImplementationGuide' && id === this.implementationGuideId) {
        this.implementationGuide = resource;
      }

      // ImplementationGuide must be generated as an xml file for the IG Publisher in STU3.
      if (!isXml && resourceType !== 'ImplementationGuide') {
        resourceContent = JSON.stringify(cleanResource, null, '\t');
        resourcePath = path.join(resourceDir, id + '.json');
      } else {
        resourceContent = this.fhir.objToXml(cleanResource);
        resourceContent = vkbeautify.xml(resourceContent);
        resourcePath = path.join(resourceDir, id + '.xml');
      }

      if (resource.resourceType === 'Media') {
        const mediaReference = this.getImplementationGuideReference('Media', resource.id);

        // If the Media is not an example, don't save it to the resources folder
        if (!this.isImplementationGuideReferenceExample(mediaReference)) {
          continue;
        }
      }

      fs.ensureDirSync(resourceDir);
      fs.writeFileSync(resourcePath, resourceContent);
    }

    this.logger.log('Done writing resources to file system.');

    if (!this.implementationGuide) {
      throw new Error('The implementation guide was not found in the bundle returned by the server');
    }

    if (fhirServerConfig.version === 'stu3') {
      control = HtmlExporter.getStu3Control(<STU3ImplementationGuide> this.implementationGuide, <STU3Bundle><any>bundle, this.getFhirControlVersion(fhirServerConfig));
    } else {
      control = HtmlExporter.getR4Control(<R4ImplementationGuide> this.implementationGuide, <R4Bundle><any>bundle, this.getFhirControlVersion(fhirServerConfig));
    }

    this.logger.log('Copying IG Publisher template/framework to temp directory');

    // Copy the contents of the ig-publisher-template folder to the export temporary folder
    const templatePath = path.join(__dirname, 'assets', 'ig-publisher-template');
    fs.copySync(templatePath, this.rootPath);

    this.logger.log('Saving the control file to the temp directory');

    // Write the ig.json file to the export temporary folder
    const controlContent = JSON.stringify(control, null, '\t');
    fs.writeFileSync(this.controlPath, controlContent);

    // Write the intro, summary and search MD files for each resource
    (bundle.entry || []).forEach((entry) => this.writeFilesForResources(this.rootPath, entry.resource));

    this.logger.log('Updating the IG publisher templates for the resources');

    this.updateTemplates(this.rootPath, bundle, this.implementationGuide);

    this.logger.log('Writing pages for the implementation guide to the temp directory');

    if (fhirServerConfig.version === 'stu3') {
      this.writeStu3Pages(this.rootPath);
    } else {
      this.writeR4Pages(this.rootPath);
    }

    this.igPublisherLocation = await this.getIgPublisher(useLatest);

    if (includeIgPublisherJar && this.igPublisherLocation) {
      this.logger.log('Copying IG Publisher JAR to working directory.');

      const jarFileName = this.igPublisherLocation.substring(this.igPublisherLocation.lastIndexOf(path.sep) + 1);
      const destJarPath = path.join(this.rootPath, jarFileName);
      fs.copySync(this.igPublisherLocation, destJarPath);

      // Create .sh and .bat files for easy execution of the IG publisher jar
      const shContent = '#!/bin/bash\n' +
        'export JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8\n' +
        'java -jar org.hl7.fhir.igpublisher.jar -ig ig.json';
      fs.writeFileSync(path.join(this.rootPath, 'publisher.sh'), shContent);

      const batContent = 'java -jar org.hl7.fhir.igpublisher.jar -ig ig.json';
      fs.writeFileSync(path.join(this.rootPath, 'publisher.bat'), batContent);
    }

    this.logger.log(`Done creating HTML export for IG ${this.implementationGuideId}`);
  }
}
