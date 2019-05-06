import {Controller, HttpService} from '@nestjs/common';
import {BaseController} from './base.controller';
import {ConfigService} from './config.service';

@Controller()
export class AppController extends BaseController {
  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }
}
