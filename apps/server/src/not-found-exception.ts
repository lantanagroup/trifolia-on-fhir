import {HttpException} from '@nestjs/common';

export class TofNotFoundException extends HttpException {
  bypassFilter = true;

  constructor(message?: string | object | any, error?: string) {
    super(message || 'Not found', 404);
  }
}
