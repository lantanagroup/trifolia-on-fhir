import {Request} from 'express';
import {Fhir} from 'fhir/fhir';
import * as SocketIO from 'socket.io';
import {ISocketConnection} from './socket-connection';

export interface ITofRequest extends Request {
  fhirServerId: string;
  fhirServerBase: string;
  fhirServerVersion: string;
  fhir: Fhir;
  io: SocketIO.Server;
  ioConnections: ISocketConnection[];
  user?: {
    sub: string;
  };
  headers: {
    fhirserver: string;
    'admin-code'?: string;
    [key: string]: string;
  }

  getFhirServerUrl(resourceType: string, id?: string, operation?: string, params?: { [key: string]: any }): string;
  getErrorMessage(err): string;
}
