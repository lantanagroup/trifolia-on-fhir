import {ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException} from '@nestjs/common';
import {Response} from 'express';
import {ITofRequest} from './app/models/tof-request';
import * as path from "path";
import * as fs from "fs";
import {TofNotFoundException} from './not-found-exception';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if ((<TofNotFoundException> exception).bypassFilter) {
      return;
    }

    const ctx = host.switchToHttp();
    const request = <ITofRequest> ctx.getRequest();
    const response = <Response> ctx.getResponse();

    console.log(request.originalUrl);

    const indexPath = path.join(__dirname, '/../client/index.html');
    const stat = fs.statSync(indexPath);
    const rs = fs.createReadStream(indexPath);

    response.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': stat.size
    });

    rs.pipe(response);
  }
}
