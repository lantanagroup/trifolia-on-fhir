import { Fhir as FhirModule } from "fhir/fhir";
import { Server } from "socket.io";
import { ChildProcess, spawn } from "child_process";
import {ImplementationGuide as R5ImplementationGuide} from '@trifolia-fhir/r5';
import {
  DomainResource,
  ImplementationGuide as STU3ImplementationGuide,
  Media,
  PackageResourceComponent,
  StructureDefinition as STU3StructureDefinition,
  LinkComponent
} from "@trifolia-fhir/stu3";
import {
  ImplementationGuide as R4ImplementationGuide,
  ImplementationGuidePageComponent,
  ImplementationGuideResourceComponent,
  StructureDefinition as R4StructureDefinition
} from "@trifolia-fhir/r4";
import { BundleExporter } from "./bundle";
import { HttpService } from '@nestjs/axios';
import { MethodNotAllowedException } from "@nestjs/common";
import { Formats } from "../models/export-options";
import { IgPageHelper, PageInfo } from "@trifolia-fhir/tof-lib";
import {
  getCustomMenu,
  getDefaultImplementationGuideResourcePath,
  getIgnoreWarningsValue,
  setIgnoreWarningsValue,
  setJiraSpecValue
} from "@trifolia-fhir/tof-lib";
import { getErrorString, Globals, PublishingRequestModel } from "@trifolia-fhir/tof-lib";
import type { IBundle, IBundleEntry, IImplementationGuide, ITofUser } from "@trifolia-fhir/tof-lib";
import { FhirInstances, unzip } from "../helper";
import * as path from "path";
import * as fs from "fs-extra";
import * as tmp from "tmp";
import * as vkbeautify from "vkbeautify";
import { ConfigService } from "../config.service";
import JSZip from "jszip";
import { FhirResourcesService } from "../fhirResources/fhirResources.service";
import { TofLogger } from "../tof-logger";

export class HtmlExporter {
  public queuedAt: Date;
  public publishStartedAt: Date;
  public user: ITofUser;

  private initPromise: Promise<void>;

  readonly homedir: string;
  public implementationGuide: IImplementationGuide;
  public bundle: IBundle;
  public fhirVersion: 'stu3' | 'r4' | 'r5';
  public packageId: string;
  public rootPath: string;
  public controlPath: string;
  public igPublisherProcess: ChildProcess;
  public publishing: Promise<void>;
  public logs: string;
  protected igPublisherLocation: string;
  protected pageInfos: PageInfo[];

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

  // TODO: Refactor so that there aren't so many constructor params
  constructor(
    protected conformanceService: FhirResourcesService,
    protected configService: ConfigService,
    protected httpService: HttpService,
    protected logger: TofLogger,
    protected fhir: FhirModule,
    protected io: Server,
    protected socketId: string,
    protected implementationGuideId: string) {

    this.homedir = require('os').homedir();
  }

  public async init() {
    this.queuedAt = new Date();

    this.initPromise = new Promise<void>(async (resolve, reject) => {
      try {
        this.rootPath = await this.createTempDirectory();

        this.controlPath = path.join(this.rootPath, 'ig.ini');
        this.packageId = this.rootPath.substring(this.rootPath.lastIndexOf(path.sep) + 1);

        this.logger.log(`Starting export of HTML package. Home directory is ${this.homedir}. Retrieving resources for export.`);

        const bundleExporter = new BundleExporter(this.conformanceService, this.httpService, this.logger, this.fhir, this.implementationGuideId);
        this.bundle = await bundleExporter.getBundle();
        this.fhirVersion = bundleExporter.fhirVersion;

        const implementationGuide = <STU3ImplementationGuide | R4ImplementationGuide>this.bundle.entry
          .find((e: IBundleEntry) => e.resource.resourceType === 'ImplementationGuide')// && e.resource.id === this.implementationGuideId)
          .resource;

        if (!implementationGuide) {
          throw new Error('Bundle export did not include the ImplementationGuide!');
        }

        if (this.fhirVersion === 'r5') {
          this.implementationGuide = new R5ImplementationGuide(implementationGuide);
        } else if (this.fhirVersion === 'r4') {
          this.implementationGuide = new R4ImplementationGuide(implementationGuide);
        } else if (this.fhirVersion === 'stu3') {
          this.implementationGuide = new STU3ImplementationGuide(implementationGuide);
        } else {
          throw new Error(`Unknown/unexpected FHIR version ${this.fhirVersion}`);
        }

        resolve();
      } catch (ex) {
        this.logger.error(`Error while initializing export: ${ex.message}`, ex.stack);
        reject(ex);
      }
    });

    return this.initPromise;
  }

  protected get stu3ImplementationGuide(): STU3ImplementationGuide {
    return <STU3ImplementationGuide>this.implementationGuide;
  }

  protected get r4ImplementationGuide(): R4ImplementationGuide {
    return <R4ImplementationGuide>this.implementationGuide;
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
      `ig = input/${this.implementationGuide.id}${HtmlExporter.getExtensionFromFormat(format)}\n` +
      `template = ${template}${templateVersionInfo}\n` +
      'usage-stats-opt-out = false\n';
  }

  // noinspection JSUnusedLocalSymbols
  public async publish(format: Formats, useTerminologyServer: boolean, downloadOutput: boolean, includeIgPublisherJar: boolean, version: string) {
    await this.initPromise;

    if (!this.packageId) {
      throw new MethodNotAllowedException('export() must be executed before publish()');
    }

    this.logs = '';

    this.publishing = new Promise(async (resolve, reject) => {
      this.publishStartedAt = new Date();

      const deployDir = path.resolve(this.configService.server.publishedIgsDirectory || __dirname, 'igs', this.implementationGuideId);
      fs.ensureDirSync(deployDir);

      if (!this.igPublisherLocation) {
        this.igPublisherLocation = await this.configService.getIgPublisher(version);
      }

      if (!this.igPublisherLocation) {
        throw new Error('The HL7 IG Publisher could not be downloaded/found.');
      }

      const igPublisherVersion = 'latest';
      const process = this.configService.server.javaLocation || 'java';
      const jarParams = ['-jar', this.igPublisherLocation, '-ig', this.controlPath];

      if (!useTerminologyServer) {
        jarParams.push('-tx', 'N/A');
      }

      this.publishLog('progress', `Running ${igPublisherVersion} IG Publisher: ${jarParams.join(' ')}`, true);

      this.logger.log(`Spawning FHIR IG Publisher Java process at ${process} with params ${jarParams}`);

      this.igPublisherProcess = spawn(process, jarParams, {
        cwd: this.rootPath
      });

      this.igPublisherProcess.stdout.on('data', (data) => {
        const message = data.toString()
          .replace(tmp.tmpdir, 'XXX')
          .replace(tmp.tmpdir.replace(/\\/g, path.sep), 'XXX')
          .replace(this.homedir, 'XXX');

        if (message && message.trim().replace(/\./g, '') !== '') {
          this.publishLog('progress', message);
        }
      });

      this.igPublisherProcess.stderr.on('data', (data) => {
        const message = data.toString().replace(tmp.tmpdir, 'XXX').replace(this.homedir, 'XXX');

        if (this.configService.server.publishStatusPath) {
          this.updatePublishStatuses(false);
        }

        if (message && message.trim().replace(/\./g, '') !== '') {
          this.publishLog('progress', message);
        }
      });

      this.igPublisherProcess.on('error', (err) => {
        const message = 'Error executing FHIR IG Publisher: ' + err;
        this.logger.error(message);
        if (this.configService.server.publishStatusPath) {
          this.updatePublishStatuses(false);
        }
        this.publishLog('error', message);
        reject('Error publishing IG');
      });

      this.igPublisherProcess.on('exit', (code) => {
        this.logger.log(`IG Publisher is done executing for ${this.rootPath}`);

        this.publishLog('progress', 'IG Publisher finished with code ' + code, true);

        if (code !== 0) {
          this.publishLog('progress', 'The HL7 IG Publisher failed. The HL7 IG Publisher tool is not developed as part of Trifolia-on-FHIR; it is developed by HL7. If you are still having issues after having reviewed and addressed ToF errors reported in the log above, go to chat.fhir.org to get more information on how to proceed.', true);

          if (this.configService.server.publishStatusPath) {
            this.updatePublishStatuses(false);
          }

          if (downloadOutput) this.publishLog('complete', 'Done. You will be prompted to download the package in a moment.');
          else this.publishLog('error', 'Done. The IG Publisher failed.');

          reject('Return code from IG Publisher is not 0');
        } else {
          this.publishLog('progress', 'Copying output to deployment path.', true);

          const generatedPath = path.resolve(this.rootPath, 'generated_output');
          const outputPath = path.resolve(this.rootPath, 'output');

          if (this.configService.server.publishStatusPath) {
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
              this.publishLog('error', 'Error copying contents to deployment path.');
              reject(err);
            } else {
              const finalMessage = `Done executing the FHIR IG Publisher. You may view the IG <a href="/projects/${this.implementationGuideId}/implementation-guide/view">here</a>.` + (downloadOutput ? ' You will be prompted to download the package in a moment.' : '');
              this.publishLog('complete', finalMessage, true);
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

    return this.publishing;
  }

  public updatePublishStatuses(status: boolean) {
    let publishStatuses: { [implementationGuideId: string]: boolean } = {};
    if (fs.existsSync(this.configService.server.publishStatusPath)) {
      publishStatuses = JSON.parse(fs.readFileSync(this.configService.server.publishStatusPath));
    }
    publishStatuses[this.implementationGuide.id] = status;
    fs.writeFileSync(this.configService.server.publishStatusPath, JSON.stringify(publishStatuses));
  }

  public async export(format: Formats, includeIgPublisherJar: boolean,
    version: string, templateType = 'official', template = 'hl7.fhir.template',
    templateVersion = 'current', zipper: JSZip, useTerminologyServer?: boolean): Promise<void> {

    const isXml = format === 'xml' || format === 'application/xml' || format === 'application/fhir+xml';
    let control;

    const inputDir = path.join(this.rootPath, 'input');
    fs.ensureDirSync(inputDir);

    this.logger.log('Resources retrieved. Writing resources to file system.');

    // Write the ignoreWarnings.txt file
    let ignoreWarningsValue = getIgnoreWarningsValue(this.implementationGuide);

    if (!ignoreWarningsValue) {
      ignoreWarningsValue = '== Suppressed Messages ==\r\n';
    } else if (!ignoreWarningsValue.startsWith('== Suppressed Messages ==')) {
      ignoreWarningsValue = "== Suppressed Messages ==\r\n" + ignoreWarningsValue;
    }

    fs.writeFileSync(path.join(inputDir, "ignoreWarnings.txt"), ignoreWarningsValue);

    this.removeNonExampleMedia();
    this.populatePageInfos();

    const publishingRequest = PublishingRequestModel.getPublishingRequest(this.implementationGuide);

    if (publishingRequest) {
      this.logger.log("Implementation guide has a publishing-request.json file defined. Including it in export.");

      const publishingRequestPath = path.join(this.rootPath, "publication-request.json");

      fs.writeFileSync(publishingRequestPath, JSON.stringify(publishingRequest, null, "\t"));
      PublishingRequestModel.removePublishingRequest(this.implementationGuide);
    }

    const igToWrite: IImplementationGuide = this.prepareImplementationGuide();

    // Remove contained DocumentReferences and extensions that will make the IG Publisher complain
    setIgnoreWarningsValue(igToWrite, null);
    setJiraSpecValue(igToWrite, null);

    // createMenu() must be called before writeResourceContent() for the IG because createMenu() might make changes
    // to the ig that needs to get written.
    this.logger.log('Updating the IG publisher templates for the resources');
    const customMenu = getCustomMenu(this.implementationGuide);
    this.createMenu(this.rootPath, this.bundle, customMenu);

    this.writeResourceContent(inputDir, igToWrite, isXml);

    // Go through all of the other resources and write them to the file system
    // Don't re-write the main implementation guide
    this.bundle.entry
      .filter((e) => e.resource.resourceType !== 'ImplementationGuide') // || e.resource.id !== this.implementationGuideId)
      .forEach((entry) => {

        // CDA example
        if ((entry['link'] || []).find((l: LinkComponent) => { return l.relation === 'example-cda' })) {
          this.writeResourceContent(inputDir, entry.resource, isXml, `${entry.resource.id}.xml`, entry.resource['data'] || entry.resource['content']);
        } else {
          // every other resource/example
          this.writeResourceContent(inputDir, entry.resource, isXml);
        }
      });

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
        this.publishLog('progress', 'Retrieved custom template from GitHub, extracting to "custom-template" directory.');

        fs.ensureDirSync(customTemplatePath);

        // Expects github template URLs to be formatted like so:
        // XXX/ig-template-carequality/archive/refs/heads/master.zip
        if (templatePathSplit.length > 5 && template.toLowerCase().indexOf('/archive/refs/heads/') > 0) {
          const subDirName = templatePathSplit[templatePathSplit.length - 5] + '-' + fileNameWithoutExt;
          await unzip(retrieveTemplateResults.data, customTemplatePath, subDirName);
        } else {
          await unzip(retrieveTemplateResults.data, customTemplatePath);
        }

        controlTemplate = 'custom-template';
        controlTemplateVersion = null;
      } catch (ex) {
        this.publishLog('error', `Error retrieving custom template from GitHub: ${getErrorString(ex)}`, true);
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

    this.igPublisherLocation = includeIgPublisherJar ? await this.configService.getIgPublisher(version) : null;

    if (includeIgPublisherJar && this.igPublisherLocation) {
      this.logger.log('Copying IG Publisher JAR to working directory.');

      const destJarPath = path.join(this.rootPath, 'org.hl7.fhir.publisher.jar');
      fs.copySync(this.igPublisherLocation, destJarPath);

      // Create .sh and .bat files for easy execution of the IG publisher jar
      // noinspection SpellCheckingInspection
      const shContent = '#!/bin/bash\n' +
        'export JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8\n' +
        'java -jar org.hl7.fhir.publisher.jar -ig ig.ini' + (useTerminologyServer !== undefined && !useTerminologyServer ? ' -tx N/A' : '');
      fs.writeFileSync(path.join(this.rootPath, 'publisher.sh'), shContent);

      const batContent = 'java -jar org.hl7.fhir.publisher.jar -ig ig.ini' + (useTerminologyServer !== undefined && !useTerminologyServer ? ' -tx N/A' : '');
      fs.writeFileSync(path.join(this.rootPath, 'publisher.bat'), batContent);
    }

    this.logger.log(`Done creating HTML export for IG ${this.implementationGuideId}`);
  }

  public publishLog(status: 'error' | 'progress' | 'complete', message, shouldLog?: boolean) {
    this.logs += message + '\r\n';

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
      case 'r5':
        return '5.0.0';
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
  protected prepareImplementationGuide(): IImplementationGuide {
    // Set the fhirVersion on each of the profiles
    (this.bundle.entry || [])
      .filter(entry => entry.resource && entry.resource.resourceType === 'StructureDefinition')
      .forEach(entry => {
        const structureDefinition = <STU3StructureDefinition | R4StructureDefinition>entry.resource;
        structureDefinition.fhirVersion = this.getOfficialFhirVersion();
      });

    (this.bundle.entry || [])
      .filter(entry => entry.resource && ['StructureDefinition', 'CodeSystem', 'ValueSet', 'CapabilityStatement'].indexOf(entry.resource.resourceType) >= 0)
      .forEach(entry => {
        const resource = <any>entry.resource;

        if (!resource.title && resource.name) {
          resource.title = resource.name;
        } else if (!resource.title && !resource.name) {
          resource.name = resource.title = resource.id;
        }
      });

    return this.implementationGuide;
  }

  /**
   * Updates the default templates for the pages "Profiles", "Terminology", "Capability Statements", etc.
   * with links to the resources in the implementation guide.
   * @param rootPath
   * @param bundle
   * @param customMenu
   */
  protected createMenu(rootPath: string, bundle, customMenu?: string) {
    fs.ensureDirSync(path.join(rootPath, 'input/includes'));

    if (customMenu) {
      fs.writeFileSync(path.join(rootPath, 'input/includes/menu.xml'), customMenu);
      return;
    }

    const menuContent = IgPageHelper.getMenuContent(this.pageInfos);
    fs.writeFileSync(path.join(rootPath, 'input/includes/menu.xml'), menuContent);
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

  private getResourceFilePath(inputDir: string, resource: DomainResource, isXml: boolean, exampleFileName?: string) {
    // ImplementationGuide must be generated as an xml file for the IG Publisher in STU3.
    if (resource.resourceType === 'ImplementationGuide') {
      fs.ensureDirSync(inputDir);
      return path.join(inputDir, resource.id + (isXml ? '.xml' : '.json'));
    }

    if (exampleFileName) {
      const fullResourcePath = path.join(inputDir, 'examples', exampleFileName);
      const resourceDir = fullResourcePath.substring(0, fullResourcePath.lastIndexOf(path.sep));
      this.logger.debug(`Ensuring resource directory ${resourceDir} exists for ${fullResourcePath}`);
      fs.ensureDirSync(resourceDir);
      return fullResourcePath;
    }

    const implementationGuideResource = <ImplementationGuideResourceComponent>this.getImplementationGuideResource(resource.resourceType, resource.id);
    let resourcePath = getDefaultImplementationGuideResourcePath({
      reference: `${resource.resourceType}/${resource.id}`
    })

    if (!resourcePath) {
      this.publishLog('error', `Could not determine path for resource ${implementationGuideResource.reference.reference}`, true);
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

    this.logger.debug(`Ensuring resource directory ${resourceDir} exists for ${fullResourcePath}`);
    fs.ensureDirSync(resourceDir);

    return fullResourcePath;
  }


  private writeResourceContent(inputDir: string, resource: DomainResource, isXml: boolean, exampleFileName?: string, exampleContent?: string) {
    const cleanResource = BundleExporter.cleanupResource(resource);
    const resourcePath = this.getResourceFilePath(inputDir, resource, isXml, exampleFileName);

    if (exampleContent) {
      fs.writeFileSync(resourcePath, exampleContent);
      return;
    }

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
}
