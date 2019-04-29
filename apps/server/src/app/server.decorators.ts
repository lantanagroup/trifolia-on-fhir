import {createParamDecorator} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';

export const FhirServerId = createParamDecorator((data, req: ITofRequest) => {
  return req.fhirServerId;
});

export const FhirServerBase = createParamDecorator((data, req: ITofRequest) => {
  return req.fhirServerBase;
});

export const FhirServerVersion = createParamDecorator((data, req: ITofRequest) => {
  return req.fhirServerVersion;
});

export const FhirInstance = createParamDecorator((data, req: ITofRequest) => {
  return req.fhir;
});

export const IoInstance = createParamDecorator((data, req: ITofRequest) => {
  return req.io;
});

export const IoConnections = createParamDecorator((data, req: ITofRequest) => {
  return req.ioConnections;
});

export const RequestUrl = createParamDecorator((data, req: ITofRequest) => {
  return req.url;
});

export const RequestMethod = createParamDecorator((data, req: ITofRequest) => {
  return req.method;
});
