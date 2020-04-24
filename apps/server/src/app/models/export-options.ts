import {ExportFormats} from './export-formats';

export type Formats = 'xml'|'json'|'application/xml'|'application/fhir+xml'|'application/json'|'application/fhir+json';

export class ExportOptions {
  public socketId?: string;
  public executeIgPublisher = true;
  public useTerminologyServer = false;
  public useLatest = false;
  public downloadOutput = true;
  public format: Formats;
  public exportFormat = ExportFormats.Bundle;
  public includeIgPublisherJar = false;
  public templateType: 'official'|'custom-uri' = 'official';
  public template = 'hl7.fhir.template';
  public templateVersion = 'current';

  public get isXml() {
    return this.format === 'application/xml' ||
      this.format === 'application/fhir+xml' ||
      this.format === 'xml';
  }

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
        this.downloadOutput = query.downloadOutput.toLowerCase() === 'true';
      }

      if (query.hasOwnProperty('_format')) {
        this.format = query['_format'];
      }

      if (query.hasOwnProperty('exportFormat')) {
        this.exportFormat = query.exportFormat;
      }

      if (query.hasOwnProperty('includeIgPublisherJar')) {
        this.includeIgPublisherJar = query.includeIgPublisherJar.toLowerCase() === 'true';
      }

      if (query.hasOwnProperty('templateType')) {
        this.templateType = query.templateType;
      }

      if (query.hasOwnProperty('template')) {
        this.template = query.template;
      }

      if (query.hasOwnProperty('templateVersion')) {
        this.templateVersion = query.templateVersion;
      }
    }
  }
}
