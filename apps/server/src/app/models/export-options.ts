import {ExportFormats} from './export-formats';


export class ExportOptions {
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
