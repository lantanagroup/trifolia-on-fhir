import {Request} from 'express';
import {Fhir} from 'fhir/fhir';
import * as SocketIO from 'socket.io';
import {ISocketConnection} from './socket-connection';

export interface ITofUser {
  app_metadata?: any;
  clientID: string;
  created_at?: string;
  email: string;
  email_verified?: boolean;
  identities?: [{
    connection: string;
    isSocial: boolean;
    provider: string;
    user_id: string;
  }];
  name: string;
  nickname?: string;
  picture?: string;
  sub: string;
  updated_at?: string;
  user_id?: string;
}

export interface ITofRequest extends Request {
  fhirServerId: string;
  fhirServerBase: string;
  fhirServerVersion: string;
  fhir: Fhir;
  io: SocketIO.Server;
  ioConnections: ISocketConnection[];
  user?: ITofUser;
  headers: {
    fhirserver: string;
    'admin-code'?: string;
    [key: string]: string;
  }
}
