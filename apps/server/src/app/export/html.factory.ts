import {STU3HtmlExporter} from './html.stu3';
import {R4HtmlExporter} from './html.r4';
import {IFhirConfigServer} from '../models/fhir-config';
import {HttpService, Logger} from '@nestjs/common';
import {Fhir as FhirModule} from 'fhir/fhir';
import {Server} from 'socket.io';
import {ITofUser} from '../../../../../libs/tof-lib/src/lib/tof-user';
import {ConfigService} from '../config.service';

export async function createHtmlExporter(
  configService: ConfigService,
  httpService: HttpService,
  logger: Logger,
  fhirServerBase: string,
  fhirServerId: string,
  fhirVersion: string,
  fhir: FhirModule,
  io: Server,
  socketId: string,
  user: ITofUser,
  implementationGuideId: string) {

  const fhirServerConfig = configService.fhir.servers.find((server: IFhirConfigServer) => server.id === fhirServerId);

  let theClass;
  switch (fhirServerConfig.version) {
    case 'stu3':
      theClass = STU3HtmlExporter;
      break;
    case 'r4':
      theClass = R4HtmlExporter;
      break;
  }

  const exporter = new theClass(configService, httpService, httpService, logger, fhirServerBase, fhirServerId, fhirVersion, fhir, io, socketId, implementationGuideId);
  exporter.user = user;
  await exporter.init();
  return exporter;
}
