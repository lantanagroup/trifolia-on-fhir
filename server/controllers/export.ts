import * as express from 'express';
import * as tmp from 'tmp';
import * as path from 'path';
import {HtmlExporter} from '../export/html';
import {ExtendedRequest} from './models';
import {BaseController, GenericResponse} from './controller';
import {Fhir} from 'fhir/fhir';
import {Server} from 'socket.io';
import {BundleExporter} from '../export/bundle';
import {emptydir, rmdir, zip} from '../promiseHelper';

interface ExportImplementationGuideRequest extends ExtendedRequest {
    params: {
        implementationGuideId: string;
    };
    query: {
        _format?: string;
    };
}

interface GetExportedPackageRequest extends ExtendedRequest {
    params: {
        packageId: string;
    };
    query: {
        socketId?: string;
    };
}

enum ExportFormats {
    Bundle = '1',
    Html = '2'
}

class ExportOptions {
    public socketId?: string;
    public executeIgPublisher = true;
    public useTerminologyServer = false;
    public useLatest = false;
    public downloadOutput = true;
    public format: 'json'|'xml'|'application/json'|'application/fhir+json'|'application/xml'|'application/fhir+xml' = 'json';
    public exportFormat = ExportFormats.Bundle;
    public includeIgPublisherJar = false;

    constructor(query?: any) {
        if (query) {
            if (query.socketId) {
                this.socketId = query.socketId;
            }

            if (query.hasOwnProperty('executeIgPublisher')) {
                this.executeIgPublisher = query.executeIgPublisher.toLowerCase() === 'true';
            }

            if (query.hasOwnProperty('useTerminologyServer')) {
                this.useTerminologyServer = query.useTerminologyServer.toLowerCase() === 'true';
            }

            if (query.hasOwnProperty('useLatest')) {
                this.useLatest = query.useLatest.toLowerCase() === 'true';
            }

            if (query.hasOwnProperty('downloadOutput')) {
                this.downloadOutput = query.downloadOutput.toLowerCase === 'true';
            }

            if (query.hasOwnProperty('_format')) {
                this.format = query._format;
            }

            if (query.hasOwnProperty('exportFormat')) {
                this.exportFormat = query.exportFormat;
            }

            if (query.hasOwnProperty('includeIgPublisherJar')) {
                this.includeIgPublisherJar = query.includeIgPublisherJar.toLowerCase() === 'true';
            }
        }
    }
}

export class ExportController extends BaseController {
    static htmlExports = [];

    readonly baseUrl: string;
    readonly fhirServerId: string;
    readonly fhir: Fhir;
    readonly io: Server;

    constructor(baseUrl: string, fhirServerId: string, fhir: Fhir, io: Server) {
        super();
        this.baseUrl = baseUrl;
        this.fhirServerId = fhirServerId;
        this.fhir = fhir;
        this.io = io;
    }

    public static initRoutes() {
        const router = express.Router();

        router.post('/:implementationGuideId', <RequestHandler> (req: ExportImplementationGuideRequest, res) => {
            const controller = new ExportController(req.fhirServerBase, req.headers.fhirserver, req.fhir, req.io);
            controller.exportImplementationGuide(req.params.implementationGuideId, new ExportOptions(req.query))
                .then((results: GenericResponse) => this.handleResponse(res, results))
                .catch((err) => ExportController.handleError(err, null, res));
        });

        router.get('/:packageId', <RequestHandler> (req: GetExportedPackageRequest, res) => {
            const controller = new ExportController(req.fhirServerBase, req.headers.fhirserver, req.fhir, req.io);
            controller.getExportedPackage(req.params.packageId)
                .then((results: GenericResponse) => this.handleResponse(res, results))
                .catch((err) => ExportController.handleError(err, null, res));
        });

        return router;
    }

    private exportBundle(implementationGuideId: string, format: 'json'|'xml'|'application/json'|'application/fhir+json'|'application/xml'|'application/fhir+xml' = 'json') {
        return new Promise<GenericResponse>((resolve, reject) => {
            const exporter = new BundleExporter(this.baseUrl, this.fhirServerId, this.fhir, implementationGuideId);
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

    private exportHtml(implementationGuideId: string, options: ExportOptions) {
        return new Promise<GenericResponse>((resolve, reject) => {
            const exporter = new HtmlExporter(this.baseUrl, this.fhirServerId, this.fhir, this.io, options.socketId, implementationGuideId);

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

    public exportImplementationGuide(implementationGuideId: string, options: ExportOptions): Promise<GenericResponse> {
        switch (options.exportFormat) {
            case ExportFormats.Bundle:
                return this.exportBundle(implementationGuideId, options.format);
                break;
            case ExportFormats.Html:
                return this.exportHtml(implementationGuideId, options);
                break;
            default:
                return Promise.reject('Unexpected export format selected: ' + options.exportFormat);
        }
    }

    public getExportedPackage(packageId: string): Promise<GenericResponse> {
        return new Promise((resolve, reject) => {
            const rootPath = path.join(tmp.tmpdir, packageId);

            zip(rootPath)
                .then((buffer) => {
                    resolve({
                        contentType: 'application/octet-stream',
                        contentDisposition: 'attachment; filename=ig-package.zip',
                        content: buffer
                    });

                    return emptydir(rootPath);
                })
                .then(() => {
                    return rmdir(rootPath);
                })
                .catch((err) => {
                    ExportController.log.error(err);
                    reject(err);
                });
        });
    }
}