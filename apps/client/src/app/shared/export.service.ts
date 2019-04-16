import {Injectable} from '@angular/core';
import {ExportFormats} from '../models/export-formats.enum';
import {HttpClient} from '@angular/common/http';
import {SocketService} from './socket.service';
import {ServerValidationResult} from '../../../../../libs/tof-lib/src/lib/server-validation-result';

export class ExportOptions {
  public implementationGuideId: string;
  public exportFormat = ExportFormats.HTML;
  public responseFormat?: 'application/json' | 'application/xml' = 'application/json';
  public useTerminologyServer? = true;
  public executeIgPublisher? = true;
  public useLatest? = false;
  public downloadOutput? = true;       // Only applies to HTML exports
  public includeIgPublisherJar? = false;
}

@Injectable()
export class ExportService {

  constructor(
    private socketService: SocketService,
    private http: HttpClient) {
  }

  public validate(implementationGuideId: string) {
    const url = `/api/export/${implementationGuideId}/$validate`;
    return this.http.get<ServerValidationResult[]>(url);
  }

  public export(options: ExportOptions) {
    let url = '/api/export/' + options.implementationGuideId + '?exportFormat=' + options.exportFormat + '&';

    if (!this.socketService.socketId) {
      throw new Error('Your browser could not connect to the server via a socket to export the package');
    }

    if (options.responseFormat) {
      url += '_format=' + encodeURIComponent(options.responseFormat) + '&';
    }

    if (options.useTerminologyServer === true || options.useTerminologyServer === false) {
      url += 'useTerminologyServer=' + options.useTerminologyServer.toString() + '&';
    }

    if (options.executeIgPublisher === true || options.executeIgPublisher === false) {
      url += 'executeIgPublisher=' + options.executeIgPublisher.toString() + '&';
    }

    if (options.useLatest === true) {
      url += 'useLatest=true&';
    }

    if (options.includeIgPublisherJar === true) {
      url += 'includeIgPublisherJar=true&';
    }

    // Only allow preventing downloads when executing the IG publisher
    if (options.exportFormat === ExportFormats.HTML && !options.executeIgPublisher && options.downloadOutput === false) {
      url += 'downloadOutput=false&';
    }

    url += 'socketId=' + encodeURIComponent(this.socketService.socketId);

    return this.http.post(url, null, {observe: 'response', responseType: 'blob'});
  }

  public getPackage(packageId: string) {
    const url = '/api/export/' + packageId;
    return this.http.get(url, {observe: 'response', responseType: 'blob'});
  }
}
