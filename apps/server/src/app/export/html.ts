import {Fhir as FhirModule} from 'fhir/fhir';
import {Server} from 'socket.io';
import {spawn} from 'child_process';
import {
  ContactDetail,
  DomainResource,
  Extension,
  ImplementationGuide as STU3ImplementationGuide,
  Media,
  PackageResourceComponent
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  ImplementationGuide as R4ImplementationGuide,
  ImplementationGuidePageComponent,
  ImplementationGuideResourceComponent
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {BundleExporter} from './bundle';
import {IServerConfig} from '../models/server-config';
import {IFhirConfig, IFhirConfigServer} from '../models/fhir-config';
import {HttpService, Logger, MethodNotAllowedException} from '@nestjs/common';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';
import * as vkbeautify from 'vkbeautify';
import {createTableFromArray, getDisplayName, reduceDistinct} from '../../../../../libs/tof-lib/src/lib/helper';
import {Formats} from '../models/export-options';
import {PageInfo, TableOfContentsEntry} from './html.models';
import {
  getDefaultImplementationGuideResourcePath,
  getExtensionString
} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';

export class HtmlExporter {
  readonly homedir: string;

  protected igPublisherLocation: string;
  protected pageInfos: PageInfo[];
  public implementationGuide: STU3ImplementationGuide | R4ImplementationGuide;
  public packageId: string;
  public rootPath: string;
  public controlPath: string;

  // TODO: Refactor so that there aren't so many constructor params
  constructor(
    protected serverConfig: IServerConfig,
    protected fhirConfig: IFhirConfig,
    protected httpService: HttpService,
    protected logger: Logger,
    protected fhirServerBase: string,
    protected fhirServerId: string,
    protected fhirVersion: string,
    protected fhir: FhirModule,
    protected io: Server,
    protected socketId: string,
    protected implementationGuideId: string) {

    this.homedir = require('os').homedir();
  }

  protected get stu3ImplementationGuide(): STU3ImplementationGuide {
    return <STU3ImplementationGuide> this.implementationGuide;
  }

  protected get r4ImplementationGuide(): R4ImplementationGuide {
    return <R4ImplementationGuide> this.implementationGuide;
  }

  // This is public so it can be unit-tested
  public getControl(bundle: any) {
    // Override in version-specific class
  }

  protected writePages(rootPath: string) {
    // Override with version-specific class
  }

  /**
   * Finds the resource within the ImplementationGuide, which contains information
   * on how the resource is used within the implementation guide. This is separate logic
   * because the structure of ImplementationGuide is majorly different between STU3
   * and R4.
   * @param resourceType {string}
   * @param id {string}
   */
  protected getImplementationGuideResource(resourceType: string, id: string): PackageResourceComponent | ImplementationGuideResourceComponent {
    // Override with version-specific class
    return;
  }

  protected sendSocketMessage(status: 'error'|'progress'|'complete', message, shouldLog?: boolean) {
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

  static getIgPublisherBuildInfo(content: string): string {
    if (!content) {
      return;
    }

    const lines = content.replace(/\r/g, '').split('\n');

    if (lines.length < 6) {
      return;
    }

    const buildId = lines.find(l => l.split('=')[0] === 'buildId');
    const buildIdSplit = buildId.split('=');

    if (buildIdSplit.length !== 2) {
      return;
    }

    return buildIdSplit[1];
  }

  private async getIgPublisher(useLatest: boolean): Promise<string> {
    const fileName = 'org.hl7.fhir.igpublisher.jar';
    const defaultPath = path.join(__dirname, 'assets', 'ig-publisher');
    const defaultFilePath = path.join(defaultPath, fileName);
    const latestPath = path.join(defaultPath, 'latest');
    const latestFilePath = path.join(latestPath, fileName);
    const localVersionPath = path.join(latestPath, 'version.info');
    let versionContent;

    if (useLatest === true) {
      fs.ensureDirSync(latestPath);

      this.logger.log('Request to get latest version of FHIR IG publisher. Retrieving from: ' + this.fhirConfig.latestPublisher);

      this.sendSocketMessage('progress', 'Client requests to get the latest FHIR IG publisher. Checking latest version downloaded.');

      // Check http://build.fhir.org/version.info first
      try {
        const versionResults = await this.httpService.get('http://build.fhir.org/version.info', { responseType: 'text' }).toPromise();
        versionContent = versionResults.data;
        const version = HtmlExporter.getIgPublisherBuildInfo(versionContent);

        const localVersionContent = fs.existsSync(localVersionPath) ? fs.readFileSync(localVersionPath).toString() : undefined;
        const localVersion = HtmlExporter.getIgPublisherBuildInfo(localVersionContent);

        if (version === localVersion) {
          this.sendSocketMessage('progress', 'Already have the latest version of the IG publisher... Won\'t download again.', true);
          return latestFilePath;
        }

        this.sendSocketMessage('progress', 'Server does not have the latest version of the IG publisher... Downloading.', true);
      } catch (ex) {
        this.logger.error(`Error getting version information about the FHIR IG publisher: ${ex.message}`);
        this.sendSocketMessage('progress', 'Encountered error downloading version info for the latest IG publisher, will use pre-loaded/default IG publisher');
        return defaultFilePath;
      }

      try {
        const results = await this.httpService.get(this.fhirConfig.latestPublisher, { responseType: 'arraybuffer' }).toPromise();

        this.logger.log(`Successfully downloaded latest version of FHIR IG Publisher. Ensuring latest directory exists: ${latestFilePath}`);

        fs.writeFileSync(latestFilePath, results.data);
        fs.writeFileSync(localVersionPath, versionContent);

        return latestFilePath;
      } catch (ex) {
        this.logger.error(`Error getting latest version of FHIR IG publisher: ${ex.message}`);
        this.sendSocketMessage('progress', 'Encountered error downloading latest IG publisher, will use pre-loaded/default IG publisher');
        return defaultFilePath;
      }
    } else {
      this.logger.log('Using built-in version of FHIR IG publisher for export');
      this.sendSocketMessage('progress', 'Using existing/default version of FHIR IG publisher');
      return defaultFilePath;
    }
  }

  /**
   * Updates the default templates for the pages "Profiles", "Terminology", "Capability Statements", etc.
   * with links to the resources in the implementation guide.
   * @param rootPath
   * @param bundle
   * @param implementationGuide
   */
  private updateTemplates(rootPath, bundle, implementationGuide: STU3ImplementationGuide | R4ImplementationGuide) {
    const mainResourceTypes = ['ImplementationGuide', 'ValueSet', 'CodeSystem', 'StructureDefinition', 'CapabilityStatement'];
    const distinctResources = (bundle.entry || [])
      .map((entry) => <DomainResource> entry.resource)
      .reduce(reduceDistinct((resource: DomainResource) => resource.id), []);
    const valueSets = distinctResources.filter((resource) => resource.resourceType === 'ValueSet');
    const terminologyPath = path.join(rootPath, 'source/pages/terminology.md');
    const codeSystems = distinctResources.filter((resource) => resource.resourceType === 'CodeSystem');
    const profiles = distinctResources.filter((resource) => resource.resourceType === 'StructureDefinition' && (!resource.baseDefinition || !resource.baseDefinition.endsWith('Extension')));
    const profilesPath = path.join(rootPath, 'source/pages/profiles.md');
    const extensions = distinctResources.filter((resource) => resource.resourceType === 'StructureDefinition' && resource.baseDefinition && resource.baseDefinition.endsWith('Extension'));
    const capabilityStatements = distinctResources.filter((resource) => resource.resourceType === 'CapabilityStatement');
    const csPath = path.join(rootPath, 'source/pages/capstatements.md');
    const otherResources = distinctResources.filter((resource) => {
      // If the resource is Media, only show it in the "Other" page if it is an example
      if (resource.resourceType === 'Media') {
        const igResource = this.getImplementationGuideResource(resource.resourceType, resource.id);
        return this.isImplementationGuideReferenceExample(igResource);
      }

      return mainResourceTypes.indexOf(resource.resourceType) < 0;
    });
    const otherPath = path.join(rootPath, 'source/pages/other.md');

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
        const authorsContent = '### Authors\n\n' + createTableFromArray(['Name', 'Email'], authorsData) + '\n\n';
        fs.appendFileSync(indexPath, authorsContent);
      }
    }

    // Profiles
    if (profiles.length > 0) {
      const profilesData = profiles
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map((profile) => {
          return [`<a href="StructureDefinition-${profile.id}.html">${profile.name}</a>`, profile.description || ''];
        });
      const profilesTable = createTableFromArray(['Name', 'Description'], profilesData);
      fs.appendFileSync(profilesPath, '### Profiles\n\n' + profilesTable + '\n\n');
    } else {
      fs.appendFileSync(profilesPath, '**No profiles are defined for this implementation guide**\n\n');
    }

    // Extensions
    if (extensions.length > 0) {
      const extData = extensions
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map((extension) => {
          return [`<a href="StructureDefinition-${extension.id}.html">${extension.name}</a>`, extension.description || ''];
        });
      const extContent = createTableFromArray(['Name', 'Description'], extData);
      fs.appendFileSync(profilesPath, '### Extensions\n\n' + extContent + '\n\n');
    } else {
      fs.appendFileSync(profilesPath, '### Extensions\n\n**No extensions are defined for this implementation guide**\n\n');
    }

    // Value Sets
    let vsContent = '### Value Sets\n\n';

    if (valueSets.length > 0) {
      valueSets
        .sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''))
        .forEach((valueSet) => {
          vsContent += `- [${valueSet.title || valueSet.name}](ValueSet-${valueSet.id}.html)\n`;
        });
    } else {
      vsContent += '**No value sets are defined for this implementation guide**\n\n';
    }

    fs.appendFileSync(terminologyPath, vsContent + '\n\n');

    // Code Systems
    let csContent = '### Code Systems\n\n';

    if (codeSystems.length > 0) {
      codeSystems
        .sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''))
        .forEach((codeSystem) => {
          csContent += `- [${codeSystem.title || codeSystem.name}](CodeSystem-${codeSystem.id}.html)\n`;
        });
    } else {
      csContent += '**No code systems are defined for this implementation guide**\n\n';
    }

    fs.appendFileSync(terminologyPath, csContent + '\n\n');

    // Capability Statements
    if (capabilityStatements.length > 0) {
      const csData = capabilityStatements
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map((capabilityStatement) => {
          return [`<a href="CapabilityStatement-${capabilityStatement.id}.html">${capabilityStatement.name}</a>`, capabilityStatement.description || ''];
        });
      const capContent = createTableFromArray(['Name', 'Description'], csData);
      fs.appendFileSync(csPath, '### CapabilityStatements\n\n' + capContent);
    } else {
      fs.appendFileSync(csPath, '**No capability statements are defined for this implementation guide**');
    }

    // Other Resources
    if (otherResources.length > 0) {
      const oData = otherResources
        .sort((a, b) => {
          const aDisplay = a.title || getDisplayName(a.name) || a.id || '';
          const aCompare = a.resourceType + aDisplay;
          const bDisplay = b.title || getDisplayName(b.name) || b.id || '';
          const bCompare = b.resourceType + bDisplay;
          return aCompare.localeCompare(bCompare);
        })
        .map((resource) => {
          const name = resource.title || getDisplayName(resource.name) || resource.id;
          return [resource.resourceType, `<a href="${resource.resourceType}-${resource.id}.html">${name}</a>`];
        });
      const oContent = createTableFromArray(['Type', 'Name'], oData);
      fs.appendFileSync(otherPath, '### Other Resources\n\n' + oContent);
    } else {
      fs.appendFileSync(otherPath, '**No examples are defined for this implementation guide**');
    }
  }

  /**
   * The IG Publisher template references several additional markdown files for each profile. This method
   * creates each of the additional files. They are:
   * <ID>-intro.md
   * <ID>-search.md
   * <ID>.summary.md
   * @param rootPath
   * @param resource
   */
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

  protected getPageExtension(page: ImplementationGuidePageComponent) {
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

  protected generateTableOfContents(rootPath: string, tocEntries: TableOfContentsEntry[], shouldAutoGenerate: boolean, content) {
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
        .replace(tmp.tmpdir.replace(/\\/g, path.sep), 'XXX')
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

  private isImplementationGuideReferenceExample(igResource: PackageResourceComponent | ImplementationGuideResourceComponent): boolean {
    if (!igResource) {
      return false;
    }

    if (this.fhirVersion === 'stu3') {
      const obj = <PackageResourceComponent> igResource;
      return obj.example || !!obj.exampleFor;
    } else if (this.fhirVersion === 'r4') {
      const obj = <ImplementationGuideResourceComponent> igResource;
      return obj.exampleBoolean || !!obj.exampleCanonical;
    } else {
      throw new Error('Unexpected FHIR version');
    }
  }

  private getResourceFilePath(resourcesDir: string, resource: DomainResource, isXml: boolean) {
    // ImplementationGuide must be generated as an xml file for the IG Publisher in STU3.
    if (resource === this.implementationGuide) {
      fs.ensureDirSync(path.join(resourcesDir, 'implementationguide'));
      return path.join(resourcesDir, 'implementationguide', resource.id.toLowerCase() + '.xml');
    }

    const implementationGuideResource = <ImplementationGuideResourceComponent> this.getImplementationGuideResource(resource.resourceType, resource.id);
    let resourcePath = getExtensionString(implementationGuideResource, Globals.extensionUrls['extension-ig-resource-file-path']);

    if (!resourcePath) {
      resourcePath = getDefaultImplementationGuideResourcePath({
        reference: `${resource.resourceType}/${resource.id}`
      });
    }

    if (!resourcePath) {
      this.sendSocketMessage('error', `Could not determine path for resource ${implementationGuideResource.reference.reference}`, true);
      return;
    }

    if (isXml && !resourcePath.endsWith('.xml')) {
      resourcePath = resourcePath.substring(0, resourcePath.lastIndexOf('.')) + '.xml';
    } else if (!isXml && !resourcePath.endsWith('.json')) {
      resourcePath = resourcePath.substring(0, resourcePath.lastIndexOf('.')) + '.json';
    }

    // Make sure the directory for the resource exists
    const fullResourcePath = path.join(resourcesDir, resourcePath);
    const resourceDir = fullResourcePath.substring(0, fullResourcePath.lastIndexOf(path.sep));

    this.logger.log(`Ensuring resource directory ${resourceDir} exists for ${fullResourcePath}`);
    fs.ensureDirSync(resourceDir);

    return fullResourcePath;
  }

  private writeResourceContent(resourcesDir: string, resource: DomainResource, isXml: boolean) {
    const cleanResource = BundleExporter.cleanupResource(resource);
    const resourcePath = this.getResourceFilePath(resourcesDir, resource, isXml);
    let resourceContent;

    this.logger.log(`Writing ${resource.resourceType}/${resource.id} to "${resourcePath}.`);

    if (!resourcePath) {
      return;
    }

    if (resourcePath.endsWith('.xml')) {
      resourceContent = this.fhir.objToXml(cleanResource);
      resourceContent = vkbeautify.xml(resourceContent);
    } else if (resourcePath.endsWith('.json')) {
      resourceContent = JSON.stringify(cleanResource, null, '\t');
    } else {
      throw new Error(`Unexpected resource file path extension: ${resourcePath}`);
    }

    if (resource.resourceType === 'Media') {
      const mediaReference = this.getImplementationGuideResource('Media', resource.id);

      // If the Media is not an example, don't save it to the resources folder
      if (!this.isImplementationGuideReferenceExample(mediaReference)) {
        return;
      }
    }

    fs.writeFileSync(resourcePath, resourceContent);
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

    this.implementationGuide = bundle.entry
      .find((e) => e.resource.resourceType === 'ImplementationGuide' && e.resource.id === this.implementationGuideId)
      .resource;

    // Make sure the implementation guide is in XML format... This is a requirement for the fhir ig publisher.
    this.writeResourceContent(resourcesDir, this.implementationGuide, true);

    // Go through all of the other resources and write them to the file system
    bundle.entry
      .filter((e) => this.implementationGuide !== e.resource)
      .forEach((entry) => this.writeResourceContent(resourcesDir, entry.resource, isXml));

    this.logger.log('Done writing resources to file system.');

    if (!this.implementationGuide) {
      throw new Error('The implementation guide was not found in the bundle returned by the server');
    }

    control = this.getControl(bundle);

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

    this.writePages(this.rootPath);

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
