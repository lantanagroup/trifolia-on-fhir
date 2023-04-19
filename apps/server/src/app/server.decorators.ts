import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type {ITofRequest} from './models/tof-request';

export const User = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as ITofRequest;
  return req.user;
});

export const FhirServerVersion = createParamDecorator((data, ctx: ExecutionContext): 'stu3'|'r4' => {
  const req = ctx.switchToHttp().getRequest() as ITofRequest;
  return <'stu3'|'r4'> req.fhirServerVersion;
});

export const FhirInstance = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as ITofRequest;
  return req.fhir;
});

export const RequestUrl = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as ITofRequest;
  return req.url;
});

export const RequestMethod = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as ITofRequest;
  return req.method;
});

export const RequestHeaders = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as ITofRequest;

  if (data) {
    return req.headers[data.toLowerCase()];
  } else {
    return req.headers;
  }
});
