import {Request} from 'express';
import {Fhir} from 'fhir/fhir';
import * as SocketIO from 'socket.io';
import {ISocketConnection} from './socket-connection';
import type {ITofUser} from '../../../../../libs/tof-lib/src/lib/tof-user';

export interface ITofRequest extends Request {
  //fhirServerId: string;
  //fhirServerBase: string;
  fhirServerVersion: string;
  fhir: Fhir;
  io: SocketIO.Server;
  ioConnections: ISocketConnection[];
  user?: ITofUser;
  headers: {
    //fhirserver: string;
    'admin-code'?: string;
    [key: string]: string;
  }
}
