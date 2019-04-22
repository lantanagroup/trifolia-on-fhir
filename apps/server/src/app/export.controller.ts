import {BaseController, GenericResponse} from './base.controller';
import {Controller, Get, HttpService, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import {BundleExporter} from './export/bundle';
import {HtmlExporter} from './export/html';
import {ITofRequest} from './models/tof-request';
import {Bundle, DomainResource, OperationOutcome} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {ServerValidationResult} from '../../../../libs/tof-lib/src/lib/server-validation-result';
import {Fhir} from 'fhir/fhir';
import {emptydir, rmdir, zip} from './helper';
import {ExportFormats} from './models/export-formats';
import {ExportOptions} from './models/export-options';
import {AuthGuard} from '@nestjs/passport';
import {Response} from 'express';
import {TofLogger} from './tof-logger';
import * as path from "path";
import * as tmp from 'tmp';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';

@Controller('export')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Export')
@ApiOAuth2Auth()
export class ExportController extends BaseController {
  static htmlExports = [];

  private readonly logger = new TofLogger(ExportController.name);

  constructor(private httpService: HttpService) {
    super();
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

  private exportBundle(baseFhirServer: string, fhirServerId: string, fhirVersion: string, fhir: Fhir, implementationGuideId: string, format: 'json'|'xml'|'application/json'|'application/fhir+json'|'application/xml'|'application/fhir+xml' = 'json') {
    return new Promise<GenericResponse>((resolve, reject) => {
      const exporter = new BundleExporter(this.httpService, this.logger, baseFhirServer, fhirServerId, fhirVersion, fhir, implementationGuideId);
      exporter.export(format)
        .then((response) => {
          let fileExt = '.json';

          if (format && format === 'application/xml') {
            fileExt = '.xml';
          }

          resolve({
            contentType: 'application/octet-stream',
            contentDisposition: 'attachment; filename=ig-bundle' + fileExt,      // TODO: Determine file name
            content: response
          });
        })
        .catch((err) => reject(err));
    });
  }

  private exportHtml(baseFhirServer: string, fhirServerId: string, fhirVersion: string, fhir: Fhir, io: SocketIO.Server, implementationGuideId: string, options: ExportOptions) {
    return new Promise<GenericResponse>((resolve, reject) => {
      const exporter = new HtmlExporter(this.httpService, this.logger, baseFhirServer, fhirServerId, fhirVersion, fhir, io, options.socketId, implementationGuideId);

      ExportController.htmlExports.push(exporter);

      exporter.export(options.format, options.executeIgPublisher, options.useTerminologyServer, options.useLatest, options.downloadOutput, options.includeIgPublisherJar)
        .then((response) => {
          resolve({
            content: response
          });

          // Should be moved to a .finally() block when moving to ES2018
          const index = ExportController.htmlExports.indexOf(exporter);
          ExportController.htmlExports.splice(index);
        })
        .catch((err) => {
          reject(err);

          // Should be moved to a .finally() block when moving to ES2018
          const index = ExportController.htmlExports.indexOf(exporter);
          ExportController.htmlExports.splice(index);
        });
    });
  }

  @Post(':implementationGuideId')
  public exportImplementationGuide(@Req() request: ITofRequest, @Param('implementationGuideId') implementationGuideId: string) {
    const options = new ExportOptions(request.query);

    switch (options.exportFormat) {
      case ExportFormats.Bundle:
        return this.exportBundle(request.fhirServerBase, request.fhirServerId, request.fhirServerId, request.fhir, implementationGuideId, options.format);
        break;
      case ExportFormats.Html:
        return this.exportHtml(request.fhirServerBase, request.fhirServerId, request.fhirServerVersion, request.fhir, request.io, implementationGuideId, options);
        break;
      default:
        return Promise.reject('Unexpected export format selected: ' + options.exportFormat);
    }
  }

  @Get(':packageId')
  public async getExportedPackage(@Param('packageId') packageId: string, @Res() res: Response) {
    const rootPath = path.join(tmp.tmpdir, packageId);

    const buffer = await zip(rootPath);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=ig-package.zip');
    res.send(buffer);

    try {
      await emptydir(rootPath);
      await rmdir(rootPath);
    } catch (ex) {
      this.logger.error(`Error emptying and/or removing ${rootPath}`, ex);
    }
  }
}
