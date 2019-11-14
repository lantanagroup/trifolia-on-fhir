import {createParamDecorator} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';

export const User = createParamDecorator((data, req: ITofRequest) => {
  return req.user;
});

export const FhirServerId = createParamDecorator((data, req: ITofRequest) => {
  return req.fhirServerId;
});

export const FhirServerBase = createParamDecorator((data, req: ITofRequest) => {
  return req.fhirServerBase;
});

export const FhirServerVersion = createParamDecorator((data, req: ITofRequest): 'stu3'|'r4' => {
  return <'stu3'|'r4'> req.fhirServerVersion;
});

export const FhirInstance = createParamDecorator((data, req: ITofRequest) => {
  return req.fhir;
});

export const RequestUrl = createParamDecorator((data, req: ITofRequest) => {
  return req.url;
});

export const RequestMethod = createParamDecorator((data, req: ITofRequest) => {
  return req.method;
});

export const RequestHeaders = createParamDecorator((data, req: ITofRequest) => {
  if (data) {
    return req.headers[data.toLowerCase()];
  } else {
    return req.headers;
  }
});
