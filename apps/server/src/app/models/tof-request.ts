import {Request} from 'express';
import {Fhir} from 'fhir/fhir';
import * as SocketIO from 'socket.io';
import {ISocketConnection} from './socket-connection';

export interface ITofUser {
  sub: string;
  email?: string;
  name?: string;
  isAdmin: boolean;   // set by ToF
}

/*
For auth0.com:

{
  "email": "XXXXX",
  "picture": "XXXXX",
  "nickname": "XXXXX",
  "name": "XXXXX",
  "app_metadata": {},
  "roles": [
    "admin"
  ],
  "email_verified": true,
  "clientID": "XXXXX",
  "user_id": "auth0|XXXXX",
  "identities": [
    {
      "user_id": "XXXXX",
      "provider": "auth0",
      "connection": "Username-Password-Authentication",
      "isSocial": false
    }
  ],
  "updated_at": "2019-12-03T21:58:24.287Z",
  "created_at": "2016-09-27T15:42:52.173Z",
  "iss": "https://XXXXX.auth0.com/",
  "sub": "auth0|XXXXX",
  "aud": "XXXXX",
  "iat": 1575410305,
  "exp": 1575446305,
  "at_hash": "XXXXX",
  "nonce": "XXXXX"
}
 */

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
