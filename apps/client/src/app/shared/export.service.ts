import { Injectable } from '@angular/core';
import { ExportFormats } from '../models/export-formats.enum';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { ServerValidationResult } from '../../../../../libs/tof-lib/src/lib/server-validation-result';

export class ExportOptions {
  public implementationGuideId: string;
  public exportFormat = ExportFormats.HTML;
  public responseFormat?: 'application/json' | 'application/xml' | 'application/msword';
  public useTerminologyServer? = true;
  public useLatest? = true;
  public version: string;
  public downloadOutput = false;       // Only applies to HTML exports
  public includeIgPublisherJar? = false;
  public templateType: 'official'|'custom-uri' = 'official';
  public template = 'hl7.fhir.template';
  public templateVersion = "current";
  public removeExtensions = false;
  public bundleType: 'searchset'|'transaction' = 'searchset';
}

@Injectable()
export class ExportService {

  constructor(
    private socketService: SocketService,
    private http: HttpClient) {
  }

  public validate(implementationGuideId: string) {
    const url = `/api/export/${encodeURIComponent(implementationGuideId)}/$validate`;
    return this.http.get<ServerValidationResult[]>(url);
  }

  public exportBundle(options: ExportOptions) {
    let url = `/api/export/${encodeURIComponent(options.implementationGuideId)}/bundle?`;

    if (options.responseFormat) {
      url += '_format=' + encodeURIComponent(options.responseFormat) + '&';
    }

    if (options.removeExtensions === true || options.removeExtensions === false) {
      url += `removeExtensions=${options.removeExtensions}&`;
    }

    if (options.bundleType) {
      url += `bundleType=${options.bundleType}&`;
    }

    url += 'template=' + encodeURIComponent(options.template) + '&';
    url += 'templateVersion=' + encodeURIComponent(options.templateVersion);

    return this.http.post(url, null, {observe: 'response', responseType: 'blob'});
  }

  public exportMsWord(options: ExportOptions) {
    const url = `/api/export/${encodeURIComponent(options.implementationGuideId)}/msword?`;
    return this.http.post(url, null, {observe: 'response', responseType: 'blob'});
  }

  public exportHtml(options: ExportOptions) {
    let url = `/api/export/${encodeURIComponent(options.implementationGuideId)}/html?`;

    if (options.responseFormat) {
      url += '_format=' + encodeURIComponent(options.responseFormat) + '&';
    }

    if (options.includeIgPublisherJar === true) {
      url += 'includeIgPublisherJar=true&';
    }

    if (options.version) {
      url += 'version=' + options.version + '&';
    }

    url += 'templateType=' + encodeURIComponent(options.templateType) + '&';
    url += 'template=' + encodeURIComponent(options.template) + '&';
    url += 'templateVersion=' + encodeURIComponent(options.templateVersion);

    return this.http.post(url, null, {observe: 'response', responseType: 'blob'});
  }

  public publish(options: ExportOptions) {
    let url = `/api/export/${encodeURIComponent(options.implementationGuideId)}/publish?`;

    if (!this.socketService.socketId) {
      throw new Error('Your browser could not connect to the server via a socket to export the package');
    }

    if (options.responseFormat) {
      url += '_format=' + encodeURIComponent(options.responseFormat) + '&';
    }

    if (options.useTerminologyServer === true || options.useTerminologyServer === false) {
      url += 'useTerminologyServer=' + options.useTerminologyServer.toString() + '&';
    }

    if (options.version) {
      url += 'version=' + options.version + '&';
    }

    if (options.includeIgPublisherJar === true) {
      url += 'includeIgPublisherJar=true&';
    }

    url += 'downloadOutput=' + options.downloadOutput.toString() + '&';
    url += 'socketId=' + encodeURIComponent(this.socketService.socketId) + '&';
    url += 'template=' + encodeURIComponent(options.template) + '&';
    url += 'templateVersion=' + encodeURIComponent(options.templateVersion);
    return this.http.get(url, {responseType: 'text'});
  }

  public cancel(packageId: string){
    const url = `/api/export/${packageId}/cancel`;
    return this.http.post(url, null);
  }

  public getPackage(packageId: string) {
    const url = '/api/export/' + packageId;
    return this.http.get(url, {observe: 'response', responseType: 'blob'});
  }
}
