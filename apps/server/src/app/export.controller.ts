import {BaseController, GenericResponse} from './base.controller';
import {Controller, Get, Header, HttpService, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import {BundleExporter} from './export/bundle';
import {HtmlExporter} from './export/html';
import {ITofRequest} from './models/tof-request';
import {Bundle, DomainResource, OperationOutcome} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {ServerValidationResult} from '../../../../libs/tof-lib/src/lib/server-validation-result';
import {emptydir, rmdir, zip} from './helper';
import {ExportOptions} from './models/export-options';
import {AuthGuard} from '@nestjs/passport';
import {Response} from 'express';
import {TofLogger} from './tof-logger';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {ConfigService} from './config.service';

import * as path from "path";
import * as tmp from 'tmp';

@Controller('api/export')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Export')
@ApiOAuth2Auth()
export class ExportController extends BaseController {
  static htmlExports = [];

  private readonly logger = new TofLogger(ExportController.name);

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  @Get(':implementationGuideId/([$])validate')
  public validate(@Req() request: ITofRequest, @Param('implementationGuideId') implementationGuideId: string) {
    return new Promise((resolve, reject) => {
      const bundleExporter = new BundleExporter(this.httpService, this.logger, request.fhirServerBase, request.fhirServerId, request.fhirServerVersion, request.fhir, implementationGuideId);
      let validationRequests = [];

      const validateResource = (resource: DomainResource) => {
        return new Promise((resolve, reject) => {
          const options = {
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
            })
        });
      }

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
              const oo = <OperationOutcome> resultSet;

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
    @Param('implementationGuideId') implementationGuideId: string) {

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
      const results = await exporter.export(options.format);
      const fileExt = options.isXml ? '.xml' : '.json';

      response.contentType('application/octet-stream');
      response.setHeader('Content-Disposition', 'attachment; filename=ig-bundle' + fileExt);
      response.send(results);
    } catch (ex) {
      this.logger.error(`Error during bundle export: ${ex.message}`, ex.stack);
      throw ex;
    }
  }

  @Post(':implementationGuideId/html')
  public async exportHtmlPackage(
    @Req() request: ITofRequest,
    @Res() response: Response,
    @Param('implementationGuideId') implementationGuideId: string) {

    const options = new ExportOptions(request.query);
    const exporter = new HtmlExporter(
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
      await exporter.export(options.format, options.includeIgPublisherJar, options.useLatest);

      // Zip up the dir, send it to client, and then delete the directory
      await this.sendPackageResponse(exporter.packageId, response);
    } catch (ex) {
      this.logger.error(`Error during HTML export: ${ex.message}`, ex.stack);
      throw ex;
    }
  }

  @Get(':implementationGuideId/publish')
  public async publishImplementationGuide(@Req() request: ITofRequest, @Param('implementationGuideId') implementationGuideId) {
    const options = new ExportOptions(request.query);
    const exporter = new HtmlExporter(
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

    ExportController.htmlExports.push(exporter);

    try {
      await exporter.export(options.format, options.includeIgPublisherJar, options.useLatest);

      // Ignore the promise... The publish process should keep going.
      exporter.publish(options.format, options.useTerminologyServer, options.useLatest, options.downloadOutput, options.includeIgPublisherJar);

      return exporter.packageId;
    } catch (ex) {
      this.logger.error(`Error while publishing implementation guide: ${ex.message}`, ex.stack);
      throw ex;
    } finally {
      const index = ExportController.htmlExports.indexOf(exporter);
      ExportController.htmlExports.splice(index);
    }
  }

  private async sendPackageResponse(packageId: string, res: Response) {
    this.logger.log(`Packaging export with id ${packageId}`);

    const rootPath = path.join(tmp.tmpdir, packageId);

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
