import {Fhir as FhirModule} from 'fhir/fhir';
import {Server} from 'socket.io';
import {spawn} from 'child_process';
import {
  ContactDetail,
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
import {Formats} from '../models/export-options';
import {PageInfo} from './html.models';
import {getDefaultImplementationGuideResourcePath, getExtensionString} from '../../../../../libs/tof-lib/src/lib/fhirHelper';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {IBundle, IExtension, IImplementationGuide} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {PackageListModel} from '../../../../../libs/tof-lib/src/lib/package-list-model';
import {FhirInstances, unzip} from '../helper';
import {createTableFromArray, escapeForXml, getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';
import * as vkbeautify from 'vkbeautify';

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
   * @param template The type of template used (FHIR or CDA)
   * @param templateVersion The version of the template used
   */
  public getControl(bundle: any, format: Formats, template: string, templateVersion: string) {
    const templateVersionInfo = templateVersion ? `#${templateVersion}` : '';
    return '[IG]\n' +
      `ig = input/${this.implementationGuideId}${HtmlExporter.getExtensionFromFormat(format)}\n` +
      `template = ${template}${templateVersionInfo}\n` +
      'usage-stats-opt-out = false\n';
  }

  // noinspection JSUnusedLocalSymbols
  public async publish(format: Formats, useTerminologyServer: boolean, downloadOutput: boolean, includeIgPublisherJar: boolean, version: string) {
    if (!this.packageId) {
      throw new MethodNotAllowedException('export() must be executed before publish()');
    }

    return new Promise(async (resolve, reject) => {
      const deployDir = path.resolve(this.serverConfig.publishedIgsDirectory || __dirname, 'igs', this.fhirServerId, this.implementationGuide.id);
      fs.ensureDirSync(deployDir);

      if (!this.igPublisherLocation) {
        this.igPublisherLocation = await this.getIgPublisher(version);
      }

      if (!this.igPublisherLocation) {
        throw new Error('The HL7 IG Publisher could not be downloaded/found.');
      }

      const igPublisherVersion = 'latest';
      const process = this.serverConfig.javaLocation || 'java';
      const jarParams = ['-jar', this.igPublisherLocation, '-ig', this.controlPath];

      if (!useTerminologyServer) {
        jarParams.push('-tx', 'N/A');
      }

      this.sendSocketMessage('progress', `Running ${igPublisherVersion} IG Publisher: ${jarParams.join(' ')}`, true);

      this.logger.log(`Spawning FHIR IG Publisher Java process at ${process} with params ${jarParams}`);

      const igPublisherProcess = spawn(process, jarParams, {
        cwd: this.rootPath
      });

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

        if (this.serverConfig.publishStatusPath) {
          this.updatePublishStatuses(false);
        }

        if (message && message.trim().replace(/\./g, '') !== '') {
          this.sendSocketMessage('progress', message);
        }
      });

      igPublisherProcess.on('error', (err) => {
        const message = 'Error executing FHIR IG Publisher: ' + err;
        this.logger.error(message);
        if (this.serverConfig.publishStatusPath) {
          this.updatePublishStatuses(false);
        }
        this.sendSocketMessage('error', message);
        reject("Error publishing IG");
      });

      igPublisherProcess.on('exit', (code) => {
        this.logger.log(`IG Publisher is done executing for ${this.rootPath}`);

        this.sendSocketMessage('progress', 'IG Publisher finished with code ' + code, true);

        if (code !== 0) {
          this.sendSocketMessage('progress', 'The HL7 IG Publisher failed. The HL7 IG Publisher tool is not developed as part of Trifolia-on-FHIR; it is developed by HL7. If you are still having issues after having reviewed and addressed ToF errors reported in the log above, go to chat.fhir.org to get more information on how to proceed.', true);

          if (this.serverConfig.publishStatusPath) {
            this.updatePublishStatuses(false);
          }

          if (downloadOutput) this.sendSocketMessage('complete', 'Done. You will be prompted to download the package in a moment.');
          else this.sendSocketMessage('error', 'Done. The IG Publisher failed.');

          reject('Return code from IG Publisher is not 0');
        } else {
          this.sendSocketMessage('progress', 'Copying output to deployment path.', true);

          const generatedPath = path.resolve(this.rootPath, 'generated_output');
          const outputPath = path.resolve(this.rootPath, 'output');

          if (this.serverConfig.publishStatusPath) {
            this.updatePublishStatuses(true);
          }

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

  public updatePublishStatuses(status: boolean){
    let publishStatuses: { [implementationGuideId: string]: boolean } = {};
    if (fs.existsSync(this.serverConfig.publishStatusPath)) {
      publishStatuses = JSON.parse(fs.readFileSync(this.serverConfig.publishStatusPath));
    }
    publishStatuses[this.implementationGuide.id] = status;
    fs.writeFileSync(this.serverConfig.publishStatusPath, JSON.stringify(publishStatuses));
  }

  public async export(format: Formats, includeIgPublisherJar: boolean, version: string, templateType = 'official', template = 'hl7.fhir.template', templateVersion = 'current'): Promise<void> {
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
    fs.writeFileSync(path.join(inputDir, 'ignoreWarnings.txt'), '== Suppressed Messages ==\n\n');

    this.logger.log('Resources retrieved. Writing resources to file system.');

    const implementationGuide = <STU3ImplementationGuide | R4ImplementationGuide> this.bundle.entry
      .find((e) => e.resource.resourceType === 'ImplementationGuide' && e.resource.id === this.implementationGuideId)
      .resource;

    if (this.fhirVersion === 'r4') {
      this.implementationGuide = new R4ImplementationGuide(implementationGuide);
    } else if (this.fhirVersion === 'stu3') {
      this.implementationGuide = new STU3ImplementationGuide(implementationGuide);
    } else {
      throw new Error(`Unknown/unexpected FHIR version ${this.fhirVersion}`);
    }

    this.removeNonExampleMedia();
    this.populatePageInfos();

    const packageList = PackageListModel.getPackageList(this.implementationGuide);

    if (packageList) {
      this.logger.log('Implementation guide has a package-list.json file defined. Including it in export.');

      const packageListPath = path.join(this.rootPath, 'package-list.json');
      fs.writeFileSync(packageListPath, JSON.stringify(packageList, null, '\t'));

      PackageListModel.removePackageList(this.implementationGuide);
    }

    const igToWrite: DomainResource = this.prepareImplementationGuide();

    // updateTemplates() must be called before writeResourceContent() for the IG because updateTemplates() might make changes
    // to the ig that needs to get written.
    this.logger.log('Updating the IG publisher templates for the resources');
    this.updateTemplates(this.rootPath, this.bundle);

    this.writeResourceContent(inputDir, igToWrite, isXml);

    // Go through all of the other resources and write them to the file system
    // Don't re-write the main implementation guide
    this.bundle.entry
      .filter((e) => e.resource.resourceType !== 'ImplementationGuide' || e.resource.id !== this.implementationGuideId)
      .forEach((entry) => this.writeResourceContent(inputDir, entry.resource, isXml));

    this.logger.log('Done writing resources to file system.');

    if (!this.implementationGuide) {
      throw new Error('The implementation guide was not found in the bundle returned by the server');
    }

    let controlTemplate = template || 'hl7.fhir.template';
    let controlTemplateVersion = templateVersion || 'current';

    if (templateType === 'custom-uri') {
      try {
        const templatePathSplit = template.split('/');
        const fileNameWithoutExt = path.basename(template.substring(template.lastIndexOf('/') + 1), '.zip');
        const customTemplatePath = path.join(this.rootPath, 'custom-template');

        const retrieveTemplateResults = await this.httpService.get(template, { responseType: 'arraybuffer' }).toPromise();
        this.sendSocketMessage('progress', 'Retrieved custom template from GitHub, extracting to "custom-template" directory.');

        fs.ensureDirSync(customTemplatePath);

        if (templatePathSplit.length > 3) {
          const subDirName = templatePathSplit[templatePathSplit.length - 3] + '-' + fileNameWithoutExt;
          await unzip(retrieveTemplateResults.data, customTemplatePath, subDirName);
        } else {
          await unzip(retrieveTemplateResults.data, customTemplatePath);
        }

        controlTemplate = 'custom-template';
        controlTemplateVersion = null;
      } catch (ex) {
        this.sendSocketMessage('error', `Error retrieving custom template from GitHub: ${getErrorString(ex)}`, true);
      }
    }

    control = this.getControl(this.bundle, format, controlTemplate, controlTemplateVersion);

    this.logger.log('Saving the control file to the temp directory');

    // Write the ig.json file to the export temporary folder
    fs.writeFileSync(this.controlPath, control);

    // Make sure ROOT/input/pagecontent exists for writeFilesForResources()
    fs.ensureDirSync(path.join(inputDir, 'pagecontent'));

    // Write the intro, summary and search MD files for each resource
    (this.bundle.entry || []).forEach((entry) => this.writeFilesForResources(this.rootPath, entry.resource));

    this.logger.log('Writing pages for the implementation guide to the temp directory');

    this.writePages(this.rootPath);

    this.igPublisherLocation = includeIgPublisherJar ? await this.getIgPublisher(version) : null;

    if (includeIgPublisherJar && this.igPublisherLocation) {
      this.logger.log('Copying IG Publisher JAR to working directory.');

      const destJarPath = path.join(this.rootPath, 'org.hl7.fhir.publisher.jar');
      fs.copySync(this.igPublisherLocation, destJarPath);

      // Create .sh and .bat files for easy execution of the IG publisher jar
      // noinspection SpellCheckingInspection
      const shContent = '#!/bin/bash\n' +
        'export JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8\n' +
        'java -jar org.hl7.fhir.publisher.jar -ig ig.ini';
      fs.writeFileSync(path.join(this.rootPath, 'publisher.sh'), shContent);

      const batContent = 'java -jar org.hl7.fhir.publisher.jar -ig ig.ini';
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

  protected static getPageExtension(page: ImplementationGuidePageComponent) {
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
        return escapeForXml(extension.valueString);
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
        const title = escapeForXml(menuPages[0].title);
        const fileName = menuPages[0].fileName.substring(0, menuPages[0].fileName.lastIndexOf('.')) + '.html';
        return `  <li><a href="${fileName}">${title}</a></li>\n`;
      } else {
        const pageMenuItems = menuPages
          .map(pi => {
            const title = escapeForXml(pi.title);
            const fileName = pi.fileName.substring(0, pi.fileName.lastIndexOf('.')) + '.html';
            return `      <li><a href="${fileName}">${title}</a></li>`;   // TODO: Should not show fileName
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

  /**
   * this method is called from the getIgPublisher method. This calls the get to download the specified version of the
   * jar file for the IG Publisher
   * @param path this is the path to the file system where the jar file will be saved
   * @param url this is the url that is used to download the jar file
   */
  // tslint:disable-next-line:no-shadowed-variable
  private async downloadJarFile(path: string, url: string) {
    const pathInfo = fs.existsSync(path) ? fs.statSync(path) : null;
    const response = await this.httpService.axiosRef({
      url: url,
      method: 'GET',
      responseType: 'stream',
    });

    if (pathInfo && pathInfo.size.toString() === response.headers['content-length']) {
      this.sendSocketMessage('progress', 'Already have this version of the IG Publisher; not going to download.');
      response.data.destroy();
      return Promise.resolve();
    }

    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  /**
   * This method checks to see if the version of IG Publisher the user wants to use is already downloaded or not. If
   * we already have it downloaded just use it. If it doesn't exist in the file system then download it first then use
   * it. If an error is thrown it will also delete the empty jar file in the directory.
   * @param useLatest
   * @param versionId
   */
  private async getIgPublisher(versionId: string): Promise<string> {
    const latestPath = path.resolve(this.serverConfig.latestIgPublisherPath || 'assets/ig-publisher');
    const filePath = path.join(latestPath, versionId + '.jar');

    // if the version is 'dev', always download the latest dev version
    // check to see if the jar file is already downloaded, if so use it otherwise download it
    if (versionId === 'dev') {
      // TODO: may have write conflict with other simultaneous requests to use dev version of ig publisher
      const sonatypeData = await this.httpService.get('https://oss.sonatype.org/service/local/repositories/snapshots/index_content/?groupIdHint=org.hl7.fhir.publisher&artifactIdHint=org.hl7.fhir.publisher&', { headers: { 'Accept': 'application/json' }}).toPromise();
      const sonatypeVersions = sonatypeData.data.data.children[0].children[0].children[0].children[0].children[0].children;
      const latestSonatypeVersion = sonatypeVersions[sonatypeVersions.length - 1].version;
      const downloadUrl = `https://oss.sonatype.org/service/local/artifact/maven/redirect?r=snapshots&g=org.hl7.fhir.publisher&a=org.hl7.fhir.publisher.cli&v=${latestSonatypeVersion}`;

      this.sendSocketMessage('progress', 'Downloading dev version of IG Publisher from sonatype.');
      this.logger.log(`Downloading dev version of IG Publisher from sonatype: ${downloadUrl}`);

      fs.ensureDirSync(path.dirname(filePath));
      await this.downloadJarFile(filePath, downloadUrl);

      return filePath;
    } else if (fs.existsSync(filePath)) {
      this.sendSocketMessage('progress', 'Already have the version ' + versionId + ' of the IG publisher... Won\'t download again.', true);
      this.logger.log('The jar file ' + versionId + ' for the selected version already exists. Not downloading it again.');
      return filePath;
    } else {
      try {
        this.sendSocketMessage('progress', 'Server does not have this version of the IG publisher... Downloading.', true);
        const infoUrl = `https://api.github.com/repos/hl7/fhir-ig-publisher/releases/${versionId}`;
        this.logger.log(`Getting version info for id ${versionId} from GitHub`);

        const versionInfo = await this.httpService.get(infoUrl).toPromise();
        const downloadUrl = versionInfo.data.assets[0]['browser_download_url'];
        const version = versionInfo.data.name;

        this.logger.log(`Downloading version ${version} (id: ${versionId}) from GitHub URL ${downloadUrl}`);
        this.sendSocketMessage('progress', `Downloading IG Publisher version ${version} from GitHub releases`);

        fs.ensureDirSync(path.dirname(filePath));
        await this.downloadJarFile(filePath, downloadUrl);

        return filePath;
      } catch (ex) {
        // this check for errors and logs errors. If error is caught it also deletes the empty jar file from the directory. This returns the default file path
        this.logger.error(`Error getting version ${versionId} of FHIR IG publisher: ${ex.message}`);
        this.sendSocketMessage('error', 'Encountered error downloading IG publisher version ' + versionId + ', will use pre-loaded/default IG publisher');
        fs.unlinkSync(filePath);
        return;
      }
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
      if (resource.resourceType === 'ImplementationGuide') {
        // Override the instance of FHIR on the server to use the R4 FHIR instance since
        // the ImplementationGuide must be in R4 format for the export
        resourceContent = FhirInstances.fhirR4.objToXml(cleanResource);
      } else {
        resourceContent = this.fhir.objToXml(cleanResource);
      }
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

  protected static getIndexContent(implementationGuide: IImplementationGuide) {
    let content = '### Overview\n\n';

    if (implementationGuide.description) {
      const descriptionContent = implementationGuide.description + '\n\n';
      content += descriptionContent + '\n\n';
    } else {
      content += 'This implementation guide does not have a description, yet.\n\n';
    }

    if (implementationGuide.contact) {
      const authorsData = (<any> implementationGuide.contact || []).map((contact: ContactDetail) => {
        const foundEmail = (contact.telecom || []).find(t => t.system === 'email');
        const foundURL = (contact.telecom || []).find(t => t.system === 'url');

        let display: string;

        if (foundEmail) {
          display = `<a href="mailto:${foundEmail.value}">${foundEmail.value}</a>`;
        } else if (foundURL) {
          display = `<a href="${foundURL.value}" target="_new">${foundURL.value}</a>`;
        }

        return [contact.name, display || ''];
      });
      const authorsContent = '### Authors\n\n' + createTableFromArray(['Name', 'Email/URL'], authorsData) + '\n\n';
      content += authorsContent;
    }

    return content;
  }
}
