import {Response} from 'express';
import {getErrorString} from '../../../../libs/tof-lib/src/lib/helper';
import {UnauthorizedException} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import * as config from 'config';
import {IServerConfig} from './models/server-config';
import {TofLogger} from './tof-logger';

const serverConfig: IServerConfig = config.get('server');

export interface GenericResponse {
  status?: number;
  contentType?: string;
  contentDisposition?: string;
  content: any;
}

export class BaseController {
  private static logger = new TofLogger(BaseController.name);

  constructor() {}

  protected static handleResponse(res: Response, actual: GenericResponse) {
    if (actual.contentType) {
      res.contentType(actual.contentType);
    }

    if (actual.contentDisposition) {
      res.setHeader('Content-Disposition', actual.contentDisposition);
    }

    res.status(actual.status || 200).send(actual.content);
  }

  protected static handleError(err, body?, res?, defaultMessage = 'An unknown error occurred') {
    const msg = getErrorString(err, body, defaultMessage);

    BaseController.logger.error(msg);

    if (res) {
      if (err && err.statusCode) {
        res.status(err.statusCode);
      } else {
        res.status(500);
      }

      res.send(msg);
    }
  }

  protected assertAdmin(request: ITofRequest) {
    if (request.headers['admin-code'] !== serverConfig.adminCode) {
      throw new UnauthorizedException('You are not authenticated as an admin');
    }
  }
}
