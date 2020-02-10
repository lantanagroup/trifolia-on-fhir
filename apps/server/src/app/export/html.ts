import {Fhir as FhirModule} from 'fhir/fhir';
import {Server} from 'socket.io';
import {spawn} from 'child_process';
import {
  DomainResource,
  ImplementationGuide as STU3ImplementationGuide,
  Media,
  PackageResourceComponent,
  StructureDefinition as STU3StructureDefinition
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  ImplementationGuide as R4ImplementationGuide,
  ImplementationGuidePageComponent,
  ImplementationGuideResourceComponent,
  StructureDefinition as R4StructureDefinition
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {BundleExporter} from './bundle';
import {IServerConfig} from '../models/server-config';
import {IFhirConfig} from '../models/fhir-config';
import {HttpService, Logger, MethodNotAllowedException} from '@nestjs/common';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';
import * as vkbeautify from 'vkbeautify';
import {Formats} from '../models/export-options';
import {PageInfo} from './html.models';
import {getDefaultImplementationGuideResourcePath, getExtensionString} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {IBundle, IExtension} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';

export class HtmlExporter {
  readonly homedir: string;
  public implementationGuide: STU3ImplementationGuide | R4ImplementationGuide;
  public bundle: IBundle;
  public packageId: string;
  public rootPath: string;
  public controlPath: string;
  protected igPublisherLocation: string;
  protected pageInfos: PageInfo[];

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
    return <STU3ImplementationGuide>this.implementationGuide;
  }

  protected get r4ImplementationGuide(): R4ImplementationGuide {
    return <R4ImplementationGuide>this.implementationGuide;
  }

  protected static getExtensionFromFormat(format: Formats) {
    switch (format) {
      case 'application/fhir+xml':
      case 'application/xml':
      case 'xml':
        return '.xml';
      default:
        return '.json';
    }
  }

  /**
   * Returns the contents of the control file. This is now the ig.ini file in the root
   * of the html export package.
   * Override in version-specific FHIR implementations
   * @param bundle The bundle that contains all resources in the IG
   * @param format The format that the user selected for the export
   */
  public getControl(bundle: any, format: Formats) {
    return '[IG]\n' +
      `ig = input/${this.implementationGuideId}${HtmlExporter.getExtensionFromFormat(format)}\n` +
      'template = hl7.fhir.template\n' +
      'usage-stats-opt-out = false\n';
  }

  // noinspection JSUnusedLocalSymbols
  public async publish(format: Formats, useTerminologyServer: boolean, useLatest: boolean, downloadOutput: boolean, includeIgPublisherJar: boolean) {
    if (!this.packageId) {
      throw new MethodNotAllowedException('export() must be executed before publish()');
    }

    return new Promise((resolve, reject) => {
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
          reject('Return code from IG Publisher is not 0');
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
              reject(err);
            } else {
              const finalMessage = `Done executing the FHIR IG Publisher. You may view the IG <a href="/${this.fhirServerId}/${this.implementationGuideId}/implementation-guide/view">here</a>.` + (downloadOutput ? ' You will be prompted to download the package in a moment.' : '');
              this.sendSocketMessage('complete', finalMessage, true);
              resolve();
            }

            if (!downloadOutput) {
              this.logger.log(`User indicated they don't need to download. Removing temporary directory ${this.rootPath}`);

              fs.emptyDir(this.rootPath, (emptyErr) => {
                if (err) {
                  this.logger.error(emptyErr);
                } else {
                  this.logger.log(`Done removing temporary directory ${this.rootPath}`);
                }
              });
            }
          });
        }
      });
    });
  }

  public async export(format: Formats, includeIgPublisherJar: boolean, useLatest: boolean): Promise<void> {
    if (!this.fhirConfig.servers) {
      throw new InvalidModuleConfigException('This server is not configured with FHIR servers');
    }

    const bundleExporter = new BundleExporter(this.httpService, this.logger, this.fhirServerBase, this.fhirServerId, this.fhirVersion, this.fhir, this.implementationGuideId);
    const isXml = format === 'xml' || format === 'application/xml' || format === 'application/fhir+xml';
    let control;

    this.logger.log(`Starting export of HTML package. Home directory is ${this.homedir}`);

    try {
      this.rootPath = await this.createTempDirectory();
      this.controlPath = path.join(this.rootPath, 'ig.ini');
      this.packageId = this.rootPath.substring(this.rootPath.lastIndexOf(path.sep) + 1);
    } catch (ex) {
      this.logger.error(`Error while creating temporary directory for export: ${ex.message}`, ex.stack);
      throw ex;
    }

    this.logger.log('Retrieving resources for export');

    try {
      this.bundle = await bundleExporter.getBundle();
    } catch (ex) {
      this.logger.error(`Error while retrieving bundle: ${ex.message}`, ex.stack);
      throw ex;
    }

    const inputDir = path.join(this.rootPath, 'input');
    fs.ensureDirSync(inputDir);

    // Create the empty ignoreWarnings.txt file
    fs.writeFileSync(path.join(inputDir, 'ignoreWarnings.txt'), '');

    this.logger.log('Resources retrieved. Writing resources to file system.');

    this.implementationGuide = <STU3ImplementationGuide | R4ImplementationGuide> this.bundle.entry
      .find((e) => e.resource.resourceType === 'ImplementationGuide' && e.resource.id === this.implementationGuideId)
      .resource;

    this.removeNonExampleMedia();
    this.populatePageInfos();

    const igToWrite: DomainResource = this.prepareImplementationGuide();

    // updateTemplates() must be called before writeResourceContent() for the IG because updateTemplates() might make changes
    // to the ig that needs to get written.
    this.logger.log('Updating the IG publisher templates for the resources');
    this.updateTemplates(this.rootPath, this.bundle);

    this.writeResourceContent(inputDir, igToWrite, isXml);

    // Go through all of the other resources and write them to the file system
    this.bundle.entry
      .filter((e) => this.implementationGuide !== e.resource)
      .forEach((entry) => this.writeResourceContent(inputDir, entry.resource, isXml));

    this.logger.log('Done writing resources to file system.');

    if (!this.implementationGuide) {
      throw new Error('The implementation guide was not found in the bundle returned by the server');
    }

    control = this.getControl(this.bundle, format);

    this.logger.log('Saving the control file to the temp directory');

    // Write the ig.json file to the export temporary folder
    fs.writeFileSync(this.controlPath, control);

    // Make sure ROOT/input/pagecontent exists for writeFilesForResources()
    fs.ensureDirSync(path.join(inputDir, 'pagecontent'));

    // Write the intro, summary and search MD files for each resource
    (this.bundle.entry || []).forEach((entry) => this.writeFilesForResources(this.rootPath, entry.resource));

    this.logger.log('Writing pages for the implementation guide to the temp directory');

    this.writePages(this.rootPath);

    this.igPublisherLocation = await this.getIgPublisher(useLatest);

    if (includeIgPublisherJar && this.igPublisherLocation) {
      this.logger.log('Copying IG Publisher JAR to working directory.');

      const jarFileName = this.igPublisherLocation.substring(this.igPublisherLocation.lastIndexOf(path.sep) + 1);
      const destJarPath = path.join(this.rootPath, jarFileName);
      fs.copySync(this.igPublisherLocation, destJarPath);

      // Create .sh and .bat files for easy execution of the IG publisher jar
      // noinspection SpellCheckingInspection
      const shContent = '#!/bin/bash\n' +
        'export JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8\n' +
        'java -jar org.hl7.fhir.igpublisher.jar -ig ig.ini';
      fs.writeFileSync(path.join(this.rootPath, 'publisher.sh'), shContent);

      const batContent = 'java -jar org.hl7.fhir.igpublisher.jar -ig ig.ini';
      fs.writeFileSync(path.join(this.rootPath, 'publisher.bat'), batContent);
    }

    this.logger.log(`Done creating HTML export for IG ${this.implementationGuideId}`);
  }

  public sendSocketMessage(status: 'error' | 'progress' | 'complete', message, shouldLog?: boolean) {
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

  protected getOfficialFhirVersion(): string {
    switch (this.fhirVersion) {
      case 'stu3':
        return '3.0.2';
      case 'r4':
        return '4.0.1';
      default:
        throw new Error(`Unknown FHIR version ${this.fhirVersion}`);
    }
  }

  protected populatePageInfos() {
    // DO NOTHING. Should be overridden by subclasses.
  }

  /**
   * Writes all pages to the file system for the implementation guide
   * Override in version-specific FHIR implementations
   * @param rootPath The root directory of the IG's export in the file system
   */
  // noinspection JSUnusedLocalSymbols
  protected writePages(rootPath: string) {
    // Override with version-specific class
  }

  /**
   * Finds the resource within the ImplementationGuide, which contains information
   * on how the resource is used within the implementation guide. This is separate logic
   * because the structure of ImplementationGuide is majorly different between STU3 and R4.
   * Override in version-specific FHIR implementations
   * @param resourceType {string}
   * @param id {string}
   */
  protected getImplementationGuideResource(resourceType: string, id: string): PackageResourceComponent | ImplementationGuideResourceComponent {
    // Override with version-specific class
    return;
  }

  /**
   * Removes Media resources from the implementation guide that are not an example.
   * Those Media resources are meant to be exported as images in the file
   * structure, rather than actual Media resources.
   * Override in version-specific FHIR implementations
   */
  protected removeNonExampleMedia() {
  }

  /**
   * Makes sure that parameters required by the IG publisher are populated.
   * Override in version-specific FHIR implementations
   */
  protected prepareImplementationGuide(): DomainResource {
    // Set the fhirVersion on each of the profiles
    (this.bundle.entry || [])
      .filter(entry => entry.resource && entry.resource.resourceType === 'StructureDefinition')
      .forEach(entry => {
        const structureDefinition = <STU3StructureDefinition | R4StructureDefinition> entry.resource;
        structureDefinition.fhirVersion = this.getOfficialFhirVersion();
      });

    (this.bundle.entry || [])
      .filter(entry => entry.resource && ['StructureDefinition', 'CodeSystem', 'ValueSet', 'CapabilityStatement'].indexOf(entry.resource.resourceType) >= 0)
      .forEach(entry => {
        const resource = <any> entry.resource;

        if (!resource.title && resource.name) {
          resource.title = resource.name;
        } else if (!resource.title && !resource.name) {
          resource.name = resource.title = resource.id;
        }
      });

    return this.implementationGuide;
  }

  protected getPageExtension(page: ImplementationGuidePageComponent) {
    switch (page.generation) {
      case 'html':
      case 'generated':
        return '.html';
      case 'xml':
        return '.xml';
      case 'markdown':
        return '.md';
      default:
        return '.md';
    }
  }

  /**
   * Updates the default templates for the pages "Profiles", "Terminology", "Capability Statements", etc.
   * with links to the resources in the implementation guide.
   * @param rootPath
   * @param bundle
   */
  protected updateTemplates(rootPath: string, bundle) {
    fs.ensureDirSync(path.join(rootPath, 'input/includes'));

    const allPageMenuNames = this.pageInfos
      .filter(pi => {
        const extensions = <IExtension[]>(pi.page.extension || []);
        const extension = extensions.find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
        return !!extension && extension.valueString;
      })
      .map(pi => {
        const extensions = <IExtension[]>(pi.page.extension || []);
        const extension = extensions.find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
        return extension.valueString;
      });
    const distinctPageMenuNames = allPageMenuNames.reduce((init, next) => {
      if (init.indexOf(next) < 0) init.push(next);
      return init;
    }, []);
    const pageMenuContent = distinctPageMenuNames.map(pmn => {
      const menuPages = this.pageInfos
        .filter(pi => {
          const extensions = <IExtension[]>(pi.page.extension || []);
          const extension = extensions.find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
          return extension && extension.valueString === pmn && pi.fileName;
        });

      if (menuPages.length === 1) {
        const fileName = menuPages[0].fileName.substring(0, menuPages[0].fileName.lastIndexOf('.')) + '.html';
        return `  <li><a href="${fileName}">${menuPages[0].title}</a></li>\n`;
      } else {
        const pageMenuItems = menuPages
          .map(pi => {
            const fileName = pi.fileName.substring(0, pi.fileName.lastIndexOf('.')) + '.html';
            return `      <li><a href="${fileName}">${pi.title}</a></li>`;   // TODO: Should not show fileName
          });

        return '  <li class="dropdown">\n' +
          `    <a data-toggle="dropdown" href="#" class="dropdown-toggle">${pmn}<b class="caret">\n` +
          '      </b>\n' +
          '    </a>\n' +
          '    <ul class="dropdown-menu">\n' + pageMenuItems.join('\n') +
          '    </ul>\n' +
          '  </li>';
      }
    });

    const menuContent = '<ul xmlns="http://www.w3.org/1999/xhtml" class="nav navbar-nav">\n' +
      '  <li><a href="index.html">IG Home</a></li>\n' +
      '  <li><a href="toc.html">Table of Contents</a></li>\n' + pageMenuContent.join('\n') +
      '  <li><a href="artifacts.html">Artifact Index</a></li>\n' +
      '</ul>\n';
    fs.writeFileSync(path.join(rootPath, 'input/includes/menu.xml'), menuContent);
  }

  private async getIgPublisher(useLatest: boolean): Promise<string> {
    const fileName = 'org.hl7.fhir.igpublisher.jar';
    const defaultPath = path.join(__dirname, 'assets', 'ig-publisher');
    const defaultFilePath = path.join(defaultPath, fileName);
    const latestPath = path.resolve(this.serverConfig.latestIgPublisherPath || 'assets/ig-publisher/latest/');
    const latestFilePath = path.join(latestPath, fileName);
    const localContentLengthPath = path.join(latestPath, 'size.txt');
    let contentLength;

    if (useLatest === true) {
      fs.ensureDirSync(latestPath);

      this.logger.log('Request to get latest version of FHIR IG publisher. Retrieving from: ' + this.fhirConfig.latestPublisher);

      this.sendSocketMessage('progress', 'Client requests to get the latest FHIR IG publisher. Checking latest version downloaded.');

      try {
        // Get the HEAD information for the fhir ig publisher first, and check if the date is different
        const headResults = await this.httpService.request({
          method: 'HEAD',
          url: this.fhirConfig.latestPublisher
        }).toPromise();
        contentLength = headResults.headers['content-length'];

        const localContentLengthContent = fs.existsSync(localContentLengthPath) ? fs.readFileSync(localContentLengthPath).toString() : undefined;

        if (localContentLengthContent === contentLength) {
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
        // noinspection SpellCheckingInspection
        const results = await this.httpService.get(this.fhirConfig.latestPublisher, { responseType: 'arraybuffer' }).toPromise();

        this.logger.log(`Successfully downloaded latest version of FHIR IG Publisher. Ensuring latest directory exists: ${latestFilePath}`);

        fs.writeFileSync(latestFilePath, results.data);
        fs.writeFileSync(localContentLengthPath, contentLength);

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
   * The IG Publisher template references several additional markdown files for each profile. This method
   * creates each of the additional files. They are:
   * <RESOURCE_TYPE>-<ID>-intro.md
   * <RESOURCE_TYPE>-<ID>.notes.md
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
        const imagesPath = path.join(this.rootPath, 'input/images');
        const outputPath = path.join(imagesPath, fileNameIdentifier.value);

        fs.ensureDirSync(imagesPath);

        try {
          fs.writeFileSync(outputPath, new Buffer((<Media>resource).content.data, 'base64'));
        } catch (ex) {
          this.logger.error(`Error writing media/image to export directory: ${ex.message}`);
        }
      }

      return;
    }

    if (resource.resourceType === 'StructureDefinition') {
      const intro = (resource.extension || []).find(e => e.url === Globals.extensionUrls['extension-sd-intro']);
      const notes = (resource.extension || []).find(e => e.url === Globals.extensionUrls['extension-sd-notes']);

      if (intro && intro.valueMarkdown) {
        const introPath = path.join(rootPath, `input/pagecontent/StructureDefinition-${resource.id}-intro.md`);
        fs.writeFileSync(introPath, intro.valueMarkdown);
      }

      if (notes && notes.valueMarkdown) {
        const notesPath = path.join(rootPath, `input/pagecontent/StructureDefinition-${resource.id}-notes.md`);
        fs.writeFileSync(notesPath, notes.valueMarkdown);
      }
    }
  }

  /**
   * Uses the 'tmp' module to create a temporary directory on the system to store files for the export.
   * A good amount of this code is related to windows, and resolving the short directory naming that
   * windows occasionally decides to use (ex: "C:\users\sean~1.mci" instead of "c:\users\sean.mcilvenna")
   * The windows-short-dir-name screws up the IG Publisher, so it needs to be converted to a full path
   */
  private createTempDirectory(): Promise<string> {
    return new Promise((resolve, reject) => {
      tmp.dir((tmpDirErr, rootPath) => {
        if (tmpDirErr) {
          reject(tmpDirErr);
        } else {
          if (rootPath.indexOf('~') > 0) {
            const dirSplit = rootPath.split(path.sep);
            let basePath = dirSplit[0];

            for (let i = 1; i < dirSplit.length; i++) {
              let nextPath = dirSplit[i];

              if (nextPath.indexOf('~') > 0) {
                const beforeCurly = nextPath.substring(0, nextPath.indexOf('~'));
                const files = fs.readdirSync(basePath);
                const filtered = files.filter(n => n.toLowerCase().startsWith(beforeCurly.toLowerCase()));
                // tslint:disable-next-line:radix
                const curlyCount = parseInt(nextPath.substring(nextPath.indexOf('~') + 1, nextPath.indexOf('~') + 2));
                nextPath = filtered[curlyCount - 1];
              }

              basePath = path.join(basePath, nextPath);
            }

            resolve(basePath);
            return;
          }

          resolve(rootPath);
        }
      });
    });
  }

  private isImplementationGuideReferenceExample(igResource: PackageResourceComponent | ImplementationGuideResourceComponent): boolean {
    if (!igResource) {
      return false;
    }

    if (this.fhirVersion === 'stu3') {
      const obj = <PackageResourceComponent>igResource;
      return obj.example || !!obj.exampleFor;
    } else if (this.fhirVersion === 'r4') {
      const obj = <ImplementationGuideResourceComponent>igResource;
      return obj.exampleBoolean || !!obj.exampleCanonical;
    } else {
      throw new Error('Unexpected FHIR version');
    }
  }

  private getResourceFilePath(inputDir: string, resource: DomainResource, isXml: boolean) {
    // ImplementationGuide must be generated as an xml file for the IG Publisher in STU3.
    if (resource.resourceType === 'ImplementationGuide') {
      fs.ensureDirSync(inputDir);
      return path.join(inputDir, resource.id + (isXml ? '.xml' : '.json'));
    }

    const implementationGuideResource = <ImplementationGuideResourceComponent>this.getImplementationGuideResource(resource.resourceType, resource.id);
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
    const fullResourcePath = path.join(inputDir, 'resources', resourcePath);
    const resourceDir = fullResourcePath.substring(0, fullResourcePath.lastIndexOf(path.sep));

    this.logger.log(`Ensuring resource directory ${resourceDir} exists for ${fullResourcePath}`);
    fs.ensureDirSync(resourceDir);

    return fullResourcePath;
  }

  private writeResourceContent(inputDir: string, resource: DomainResource, isXml: boolean) {
    const cleanResource = BundleExporter.cleanupResource(resource);
    const resourcePath = this.getResourceFilePath(inputDir, resource, isXml);
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
}
