import { BaseController } from './base.controller';
import { Controller, Get, HttpService, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { BundleExporter } from './export/bundle';
import { ITofRequest } from './models/tof-request';
import { Bundle, DomainResource, OperationOutcome } from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import { buildUrl } from '../../../../libs/tof-lib/src/lib/fhirHelper';
import { ServerValidationResult } from '../../../../libs/tof-lib/src/lib/server-validation-result';
import { emptydir, rmdir, zip } from './helper';
import { ExportOptions } from './models/export-options';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { TofLogger } from './tof-logger';
import { ApiOAuth2Auth, ApiUseTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { AxiosRequestConfig } from 'axios';
import { createHtmlExporter } from './export/html.factory';


import * as path from 'path';
import * as tmp from 'tmp';
import { MSWordExporter } from './export/msword';
import { ExportService } from './export.service';
import { FhirServerVersion } from './server.decorators';
import {HtmlExporter} from './export/html';

@Controller('api/export')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Export')
@ApiOAuth2Auth()
export class ExportController extends BaseController {
  private readonly logger = new TofLogger(ExportController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService, private exportService: ExportService) {
    super(configService, httpService);
  }

  @Get(':implementationGuideId/([$])validate')
  public validate(@Req() request: ITofRequest, @Param('implementationGuideId') implementationGuideId: string) {
    return new Promise((resolve, reject) => {
      const bundleExporter = new BundleExporter(this.httpService, this.logger, request.fhirServerBase, request.fhirServerId, request.fhirServerVersion, request.fhir, implementationGuideId);
      let validationRequests = [];

      const validateResource = (resource: DomainResource) => {
        return new Promise((resolve, reject) => {
          const options: AxiosRequestConfig = {
            url: buildUrl(request.fhirServerBase, resource.resourceType, null, '$validate'),
            method: 'POST',
            data: resource
          };

          this.httpService.request(options).toPromise()
            .then((results) => resolve(results.data))
            .catch((err) => {
              if (err.response) {
                resolve(err.response.data);
              }
            });
        });
      };

      bundleExporter.getBundle(true)
        .then((results: Bundle) => {
          validationRequests = (results.entry || []).map((entry) => {
            const options = {
              url: buildUrl(request.fhirServerBase, entry.resource.resourceType, null, '$validate'),
              method: 'POST',
              data: entry.resource
            };
            return {
              resourceReference: `${entry.resource.resourceType}/${entry.resource.id}`,
              promise: validateResource(entry.resource)
            };
          });

          const promises = validationRequests.map((validationRequest) => validationRequest.promise);
          return Promise.all(promises);
        })
        .then((resultSets: OperationOutcome[]) => {
          let validationResults: ServerValidationResult[] = [];

          resultSets.forEach((resultSet: any, index) => {
            if (resultSet && resultSet.resourceType === 'OperationOutcome') {
              const oo = <OperationOutcome>resultSet;

              if (oo.issue) {
                const next = oo.issue.map((issue) => {
                  return <ServerValidationResult>{
                    resourceReference: validationRequests[index].resourceReference,
                    severity: issue.severity,
                    details: issue.diagnostics
                  };
                });

                validationResults = validationResults.concat(next);
              }
            }
          });

          validationResults = validationResults.sort((a, b) => a.severity.localeCompare(b.severity));

          resolve(validationResults);
        })
        .catch((err) => {
          if (err.response && err.response.status === 412) {
            resolve(err.response.data);
          } else {
            reject(err);
          }
        });
    });
  }

  @Post(':implementationGuideId/bundle')
  public async exportImplementationGuide(
    @Req() request: ITofRequest,
    @Res() response: Response,
    @Param('implementationGuideId') implementationGuideId: string,
    @Query('removeExtensions') removeExtensions: string,
    @Query('bundleType') bundleType: 'searchset' | 'transaction') {

    const options = new ExportOptions(request.query);
    const exporter = new BundleExporter(
      this.httpService,
      this.logger,
      request.fhirServerBase,
      request.fhirServerId,
      request.fhirServerVersion,
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

  @Post(':implementationGuideId/msword')
  public async exportMSWordDocument(@Req() req: ITofRequest, @Res() res, @Param('implementationGuideId') implementationGuideId: string, @FhirServerVersion() fhirServerVersion: 'stu3' | 'r4') {
    const bundleExporter = new BundleExporter(this.httpService, this.logger, req.fhirServerBase, req.fhirServerId, req.fhirServerVersion, req.fhir, implementationGuideId);
    const bundle = await bundleExporter.getBundle(false);

    const msWordExporter = new MSWordExporter();
    const results = await msWordExporter.export(bundle, fhirServerVersion);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=ig.docx');
    res.send(Buffer.from(results));
  }

  @Post(':implementationGuideId/html')
  public async exportHtmlPackage(
    @Req() request: ITofRequest,
    @Res() response: Response,
    @Param('implementationGuideId') implementationGuideId: string) {

    const options = new ExportOptions(request.query);
    const exporter = createHtmlExporter(
      this.configService.server,
      this.configService.fhir,
      this.httpService,
      this.logger,
      request.fhirServerBase,
      request.fhirServerId,
      request.fhirServerVersion,
      request.fhir,
      request.io,
      options.socketId,
      implementationGuideId);

    try {
      await exporter.export(options.format, options.includeIgPublisherJar, options.version, options.templateType, options.template, options.templateVersion);

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
  public async publishImplementationGuide(@Req() request: ITofRequest, @Param('implementationGuideId') implementationGuideId) {
    const options = new ExportOptions(request.query);
    const exporter: HtmlExporter = createHtmlExporter(
      this.configService.server,
      this.configService.fhir,
      this.httpService,
      this.logger,
      request.fhirServerBase,
      request.fhirServerId,
      request.fhirServerVersion,
      request.fhir,
      request.io,
      options.socketId,
      implementationGuideId);

    this.exportService.exports.push(exporter);

    const runPublish = async () => {
      const exportIndex = this.exportService.exports.indexOf(exporter);

      if (exportIndex === -1) {
        return;
      }

      if (exportIndex >= this.configService.publish.queueLimit) {
        exporter.sendSocketMessage('progress', `You are ${exportIndex + 1} in line.`, false);
        setTimeout(() => {
          runPublish();
        }, this.configService.publish.timeOut);
        return;
      }

      try {
        await exporter.publish(options.format, options.useTerminologyServer, options.downloadOutput, options.includeIgPublisherJar, options.version)
      } catch (ex) {
        this.logger.error(`Error while executing HtmlExporter.publish: ${ex.message}`);
      } finally {
        const index = this.exportService.exports.indexOf(exporter);
        this.exportService.exports.splice(index, 1);
      }
    };


    try {
      await exporter.export(options.format, options.includeIgPublisherJar, options.version, options.templateType, options.template, options.templateVersion);

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

    const exporter = this.exportService.exports.find(e => e.packageId === packageId);
    const index = this.exportService.exports.indexOf(exporter);

    if (index >= 0) {
      this.exportService.exports.splice(index, 1);
      exporter.sendSocketMessage('progress', 'You have been removed from the queue');
      this.logger.log(`Exporter with package id ${packageId} has been removed from the queue`);
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
