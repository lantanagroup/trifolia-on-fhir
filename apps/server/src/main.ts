/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {IServerConfig} from './app/models/server-config';
import {IFhirConfig} from './app/models/fhir-config';
import {buildUrl, getFhirR4Instance, getFhirStu3Instance} from '../../../libs/tof-lib/src/lib/fhirHelper';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import {Response} from 'express';
import {ITofRequest} from './app/models/tof-request';
import socketIo from 'socket.io';
import {BadRequestException, Logger} from '@nestjs/common';
import {ISocketConnection} from './app/models/socket-connection';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as config from 'config';

const serverConfig: IServerConfig = config.get('server');
const fhirConfig: IFhirConfig = config.get('fhir');

const logger = new Logger('main');
const fhirStu3 = getFhirStu3Instance();
const fhirR4 = getFhirR4Instance();
const connections: ISocketConnection[] = [];
let io;

const loadTofRequest = (req: ITofRequest, res: Response, next) => {
  if (!fhirConfig.servers || !fhirConfig.servers.length) {
    throw new InvalidModuleConfigException('This server is not configured with any FHIR servers');
  }

  req.fhirServerId = req.headers['fhirserver'] || fhirConfig.servers[0].id;
  req.fhirServerBase = fhirConfig.servers[0].uri;
  req.fhirServerVersion = fhirConfig.servers[0].version;
  req.io = io;
  req.ioConnections = connections;

  if (!fhirConfig.servers) {
    throw new InvalidModuleConfigException('FHIR servers have not been configured on the server');
  }

  if (req.fhirServerId) {
    const foundFhirServer = fhirConfig.servers.find((server) => server.id === req.fhirServerId);

    if (!foundFhirServer) {
      throw new BadRequestException('The ID of the fhir server specified by the "fhirserver" header is not valid.');
    }

    req.fhirServerBase = foundFhirServer.uri;
    req.fhirServerVersion = foundFhirServer.version;
  }

  switch (req.fhirServerVersion) {
    case 'stu3':
      req.fhir = fhirStu3;
      break;
    case 'r4':
      req.fhir = fhirR4;
      break;
    default:
      throw new Error(`Unsupported FHIR version ${req.fhirServerVersion}`);
  }

  if (!req.fhirServerBase.endsWith('/')) {
    req.fhirServerBase += '/';
  }

  req.getFhirServerUrl = function(resourceType, id, operation, params) {
    return buildUrl(req.fhirServerBase, resourceType, id, operation, params);
  };

  req.getErrorMessage = function(err) {
    if (err && err.response && err.response.body && err.response.body.resourceType === 'OperationOutcome') {
      const oo = err.response.body;

      if (oo.issue && oo.issue.length === 1 && oo.issue[0].diagnostics) {
        return oo.issue[0].diagnostics;
      } else if (oo.text && oo.text.div) {
        return oo.text.div;
      }
    } else if (err && err.message) {
      return err.message;
    } else if (typeof err === 'string') {
      return err;
    }

    logger.error(err);
    return 'Unspecified error';
  };

  next();
};

const parseFhirBody = (req: ITofRequest, res: Response, next) => {
  if (req.headers['content-type'] === 'application/xml') {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        if (req.body) {
          req.body = req.fhir.xmlToObj(data);
        }
        next();
      } catch (ex) {
        res.status(400).send('Could not parse body as XML: ' + ex.message);
      }
    });
  } else {
    next();
  }

  const originalSend = res.send;

  res.send = (data): Response => {
    if (req.headers['accept'] === 'application/xml' && data) {
      data = typeof data === 'string' ? req.fhir.jsonToXml(data) : req.fhir.objToXml(data);
      res.contentType('application/xml');
    }

    return originalSend.call(res, data);
  };
};

const initSocket = (app) => {
  io = socketIo(app.getHttpServer());

  io.on('connection', (socket) => {
    logger.log(`Client (id: ${socket.client.id}) connected to socket`);

    connections.push({
      id: socket.client.id
    });

    socket.on('disconnect', () => {
      logger.log(`Client (id: ${socket.client.id}) disconnected from socket`);

      const foundConnection = connections.find((connection) => connection.id === socket.client.id);

      if (foundConnection) {
        const index = connections.indexOf(foundConnection);
        connections.splice(index, 1);
        logger.log(`Removed connection with id ${socket.client.id} from connections list`);
      } else {
        logger.error(`Socket disconnected, but no connection found for id ${socket.client.id}.`);
      }
    });

    socket.on('authenticated', (data) => {
      logger.log(`Client socket (id: ${socket.client.id}) sent authentication information`);

      const foundConnection = connections.find((connection) => connection.id === socket.client.id);

      if (!foundConnection) {
        logger.error(`Authentication information sent by a client socket connection, but no connection could be found for socket id ${socket.client.id}`);
        return;
      }

      Object.assign(foundConnection, data);
    });

    socket.on('exporting', (packageId) => {
      logger.log(`Updating socket id to ${socket.client.id} for html exporters with package id ${packageId}`);

      /* TODO: Re-enable
      const exporters = _.filter(ExportController.htmlExports, (exporter) => exporter._packageId === packageId);

      logger.log(`Found ${exporters.length} exporters to update socket id for`);

      _.each(exporters, (exporter) => exporter._socketId = socket.client.id);
       */
    });
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  initSocket(app);

  app.use(bodyParser.json({ limit: '15mb' }));
  app.use(bodyParser.raw({ type: ['application/octet-stream', 'application/binary']}));
  app.use(bodyParser.urlencoded({ limit: '15mb', extended: false }));
  app.use(compression());
  app.use(loadTofRequest);
  app.use(parseFhirBody);

  app.useStaticAssets(path.join(__dirname, '/../client'));

  const port = process.env.port || serverConfig.port || 3333;
  await app.listen(port, () => {
    logger.log(`Listening at http://localhost:${port}/${globalPrefix}`);
  });
}

bootstrap();
