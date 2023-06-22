import {HttpService} from '@nestjs/axios';
import {Controller, Get, Param, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import {BundleExporter} from './export/bundle';
import type {ITofRequest} from './models/tof-request';
import type {IBundle, IStructureDefinition, ITofUser} from '@trifolia-fhir/tof-lib';
import {findReferences, joinUrl} from '@trifolia-fhir/tof-lib';
import {emptydir, rmdir, zip} from './helper';
import {ExportOptions} from './models/export-options';
import {AuthGuard} from '@nestjs/passport';
import {Response} from 'express';
import {TofLogger} from './tof-logger';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';
import {createHtmlExporter} from './export/html.factory';
import * as path from 'path';
import * as tmp from 'tmp';
import {MSWordExporter} from './export/msword';
import {ExportService} from './export.service';
import {User} from './server.decorators';
import {HtmlExporter} from './export/html';
import nodemailer from 'nodemailer';
import JSZip from 'jszip';
import {ConformanceController} from './conformance/conformance.controller';
import {ConformanceService} from './conformance/conformance.service';
import {doc} from 'prettier';

@Controller('api/export')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Export')
@ApiOAuth2([])
export class ExportController extends ConformanceController {//BaseController {
  protected logger = new TofLogger(ExportController.name);
  public jsZipObj = new JSZip();

  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    protected conformanceService: ConformanceService,
    private exportService: ExportService) {
    super(conformanceService);
  }


  @Post(':implementationGuideId/bundle')
  public async exportImplementationGuide(
    @User() user: ITofUser,
    @Req() request: ITofRequest,
    @Res() response: Response,
    @Param('implementationGuideId') implementationGuideId: string,
    @Query('removeExtensions') removeExtensions: string,
    @Query('bundleType') bundleType: 'searchset' | 'transaction') {

    await this.assertCanReadById(user, implementationGuideId);

    const options = new ExportOptions(request.query);
    const exporter = new BundleExporter(
      this.conformanceService,
      this.httpService,
      this.logger,
      request.fhir,
      implementationGuideId);

    try {
      const results = await exporter.export(options.format, removeExtensions === 'true', bundleType);
      const fileExt = options.isXml ? '.xml' : '.json';

      response.contentType('application/octet-stream');
      response.setHeader('Content-Disposition', 'attachment; filename=ig-bundle' + fileExt);
      response.send(results);
    } catch (ex) {
      this.logger.error(`Error during bundle export: ${ex.message}`, ex.stack);
      throw ex;
    }
  }

  @Post(':implementationGuideId/:compositionId/document')
  public async exportCompositionDocument(@User() user: ITofUser, @Req() req: ITofRequest, @Res() res, @Param('implementationGuideId') implementationGuideId: string, @Param('compositionId') compositionId: string) {
    await this.assertCanReadById(user, implementationGuideId);

    const bundleExporter = new BundleExporter(this.conformanceService, this.httpService, this.logger, req.fhir, implementationGuideId);
    const bundle = await bundleExporter.getBundle(false);

    if (!bundle || !bundle.entry) {
      res.status(404).send();
      return;
    }

    const compositionEntry = bundle.entry.find(e => e.resource.resourceType === 'Composition' && e.resource.id === compositionId);
    const composition = compositionEntry ? compositionEntry.resource : null;

    if (!composition) {
      res.status(404).send(`Composition id ${compositionId} not found`);
      return;
    }

    const references = findReferences(composition).map(r => r.reference);
    const checked = [];     // Keep a list of resources we've already looked at so-as not to get in an endless loop of circular references

    const next = (reference: string) => {
      if (checked.indexOf(reference) >= 0) {
        return;
      }

      const referenceSplit = reference.split('/');
      const found = bundle.entry.find(e => e.resource.resourceType === referenceSplit[0] && e.resource.id === referenceSplit[1]);

      checked.push(reference);

      if (!found) {
        this.logger.warn(`Did not find resource for reference ${reference} in implementation guide ${implementationGuideId} bundle`);
        return;
      }

      const nextReferences = findReferences(found).map(r => r.reference);
      references.push(...nextReferences);
      nextReferences.forEach(next);
    };

    references.map(r => r).forEach(next);

    const uniqueReferences = references.reduce((list: string[], nextRef: string) => {
      if (list.indexOf(nextRef) < 0) {
        list.push(nextRef);
      }
      return list;
    }, []);

    const docBundle: IBundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [{
        resource: composition
      }]
    };

    uniqueReferences.forEach(ref => {
      if (ref === 'Composition/' + compositionId) {
        return;
      }

      const refSplit = ref.split('/');
      const foundEntry = bundle.entry.find(entry => entry.resource.resourceType === refSplit[0] && entry.resource.id === refSplit[1]);

      docBundle.entry.push({
        resource: foundEntry.resource
      });
    });

    return res.send(docBundle);
  }

  @Post(':implementationGuideId/msword')
  public async exportMSWordDocument(@User() user: ITofUser, @Req() req: ITofRequest, @Res() res, @Param('implementationGuideId') implementationGuideId: string) {

    await this.assertCanReadById(user, implementationGuideId);

    const bundleExporter = new BundleExporter(this.conformanceService, this.httpService, this.logger, req.fhir, implementationGuideId);
    const bundle = await bundleExporter.getBundle(false);

    const msWordExporter = new MSWordExporter();
    const results = await msWordExporter.export(bundle, bundleExporter.fhirVersion);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=ig.docx');
    res.send(Buffer.from(results));
  }

  @Post(':implementationGuideId/html')
  public async exportHtmlPackage(
    @Req() request: ITofRequest,
    @Res() response: Response,
    @User() user: ITofUser,
    @Param('implementationGuideId') implementationGuideId: string) {

      await this.assertCanReadById(user, implementationGuideId);

    const options = new ExportOptions(request.query);
    const exporter = await createHtmlExporter(
      this.conformanceService,
      this.configService,
      this.httpService,
      this.logger,
      request.fhir,
      request.io,
      options.socketId,
      user,
      implementationGuideId);

    try {

      await exporter.export(options.format, options.includeIgPublisherJar, options.version, options.templateType,
        options.template, options.templateVersion, this.jsZipObj, options.useTerminologyServer);

      if (exporter.bundle && exporter.bundle.entry) {
        exporter.bundle.entry.forEach(e => {
          if (e.resource.resourceType && e.resource.resourceType === 'StructureDefinition') {
            delete (<IStructureDefinition>e.resource).snapshot;
          }
        });
      }

      // Zip up the dir, send it to client, and then delete the directory
      await this.sendPackageResponse(exporter.packageId, response);
    } catch (ex) {
      this.logger.error(`Error during HTML export: ${ex.message}`, ex.stack);
      throw ex;
    }
  }

  /**
   * The publisherVersion() returns an array of publisher versions from the sonatype.org endpoint defined below.
   */
  @Get(':publisher-version')
  public async getPublisherVersions(): Promise<any> {
    const url = 'https://api.github.com/repos/hl7/fhir-ig-publisher/releases';

    const results = await this.httpService.get(url).toPromise();
    return results.data.map(r => {
      return {
        id: r.id,
        name: r.name
      };
    });
  }

  @Get(':implementationGuideId/publish')
  public async publishImplementationGuide(@Req() request: ITofRequest, @User() user: ITofUser,  @Param('implementationGuideId') implementationGuideId) {
    const options = new ExportOptions(request.query);

    let bundle: IBundle;
    let fhirVersion: 'stu3' | 'r4' | 'r5';

    const exporter: HtmlExporter = await createHtmlExporter(
      this.conformanceService,
      this.configService,
      this.httpService,
      this.logger,
      request.fhir,
      request.io,
      options.socketId,
      user,
      implementationGuideId);

    this.exportService.exports.push(exporter);

    const runPublish = async () => {
      const exportIndex = this.exportService.exports.indexOf(exporter);

      if (exportIndex === -1) {
        return;
      }

      if (exportIndex >= this.configService.publish.queueLimit) {
        exporter.publishLog('progress', `You are ${exportIndex + 1} in line.`, false);
        setTimeout(() => {
          runPublish();
        }, this.configService.publish.timeOut);
        return;
      }

      try {
        await exporter.publish(options.format, options.useTerminologyServer, options.downloadOutput, options.includeIgPublisherJar, options.version);
        this.sendNotification(options.notifyMe, user, true, implementationGuideId);
      } catch (ex) {
        this.logger.error(`Error while executing HtmlExporter.publish: ${ex.message}`);
        this.sendNotification(options.notifyMe, user, false, implementationGuideId, exporter.logs);
      } finally {
        const index = this.exportService.exports.indexOf(exporter);
        if (index >= 0) this.exportService.exports.splice(index, 1);
      }
    };

    try {
      await exporter.export(options.format, options.includeIgPublisherJar, options.version,
        options.templateType, options.template, options.templateVersion, this.jsZipObj, null);

      runPublish();

      return exporter.packageId;
    } catch (ex) {
      const index = this.exportService.exports.indexOf(exporter);
      this.exportService.exports.splice(index, 1);

      this.logger.error(`Error while publishing implementation guide: ${ex.message}`, ex.stack);
      throw ex;
    }
  }

  @Post(':packageId/cancel')
  public cancel(@Param('packageId') packageId: string) {
    this.logger.log(`User has requested that package id ${packageId} be removed from the queue`);
    const res = this.exportService.cancel(packageId);
    if (res) this.logger.log(`Exporter with package id ${packageId} has been removed from the queue`);
  }

  private async sendNotification(shouldNotify = false, user: ITofUser, success: boolean, implementationGuideId: string,  logs?: string) {
    // If the user does not have an email...
    if (!shouldNotify || !user || !user.email) return;

    // If the server is not configured to support mail transport...
    if (!this.configService.server.mailTransport) return;

    // If the server is not configured with required mail options...
    if (!this.configService.server.mailOptions || !this.configService.server.mailOptions.from) return;

    try {
      const transporter = nodemailer.createTransport(this.configService.server.mailTransport);
      const link = joinUrl(this.configService.server.mailOptions.hostUrl, implementationGuideId, 'implementation-guide', 'view');

      this.logger.log(`Attempting to send email to ${user.email} indicating the publish of ${implementationGuideId} has completed.`);

      await transporter.sendMail({
        from: this.configService.server.mailOptions.from,
        to: user.email,
        subject: `${this.configService.server.mailOptions.subjectPrefix || 'Trifolia-on-FHIR'}: ${success ? 'Successfully published' : 'Failed to publish'} implementation guide with ID ${implementationGuideId}`,
        text: success ?
          `Your implementation guide has successfully published. You can view it here: ${link}.` :
          `Your implementation guide encountered errors when publishing:\r\n\r\n${logs}`,
        html: success ?
          `Your implementation guide has successfully published. You can view it <a href="${link}">here</a>.` :
          `<p>Your implementation guide encountered errors when publishing:</p><p>${logs.replace(/\r\n/g, '\r\n<br/>')}</p>`
      });

      this.logger.log(`Successfully sent email.`);
    } catch (ex) {
      this.logger.error(`Encountered errors when trying to send notification email: ${ex.message}`);
    }
  }

  private async sendPackageResponse(packageId: string, res: Response) {
    this.logger.log(`Packaging export with id ${packageId}`);

    const rootPath = path.join((<any>tmp).tmpdir, packageId);

    const buffer = await zip(rootPath);

    this.logger.log(`Sending export with id ${packageId} to caller`);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=ig-package.zip');
    res.send(buffer);

    this.logger.log(`Removing the export directory for package id ${packageId}`);

    try {
      await emptydir(rootPath);
      await rmdir(rootPath);
    } catch (ex) {
      this.logger.error(`Error emptying and/or removing ${rootPath}`, ex);
    }
  }

  @Get(':packageId')
  public async getPublishedPackage(@Param('packageId') packageId: string, @Res() res: Response) {
    await this.sendPackageResponse(packageId, res);
  }
}
