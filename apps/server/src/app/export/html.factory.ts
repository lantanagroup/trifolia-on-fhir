import {STU3HtmlExporter} from './html.stu3';
import {R4HtmlExporter} from './html.r4';
import {HttpService} from '@nestjs/axios';
import {Fhir as FhirModule} from 'fhir/fhir';
import {Server} from 'socket.io';
import type {ITofUser} from '@trifolia-fhir/tof-lib';
import {ConfigService} from '../config.service';
import {TofLogger} from '../tof-logger';
import { ConformanceService } from '../conformance/conformance.service';

export async function createHtmlExporter(
  conformanceService: ConformanceService,
  configService: ConfigService,
  httpService: HttpService,
  logger: TofLogger,
  fhir: FhirModule,
  io: Server,
  socketId: string,
  user: ITofUser,
  implementationGuideId: string): Promise<STU3HtmlExporter|R4HtmlExporter> {

  //const fhirServerConfig = configService.fhir.servers.find((server: IFhirConfigServer) => server.id === fhirServerId);
  let fhirVersion = (await conformanceService.findById(implementationGuideId)).fhirVersion;

  let exporter: STU3HtmlExporter|R4HtmlExporter;
  switch (fhirVersion) {
    case 'stu3':
      exporter = new STU3HtmlExporter(conformanceService, configService, httpService, logger, fhir, io, socketId, implementationGuideId);
      break;
    case 'r4':
      exporter = new R4HtmlExporter(conformanceService, configService, httpService, logger, fhir, io, socketId, implementationGuideId);
      break;
  }

  exporter.user = user;
  await exporter.init();
  return exporter;
}
