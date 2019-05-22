import {All, Controller, HttpService, Query, Response} from '@nestjs/common';
import {BaseController} from './base.controller';
import {ConfigService} from './config.service';
import {TofLogger} from './tof-logger';
import {Response as ExpressResponse} from 'express';

import * as fs from 'fs';

@Controller('github')
export class GithubController extends BaseController {
  readonly logger = new TofLogger();

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(configService, httpService);
  }

  @All('callback')
  public async authenticate(@Query('code') code: string, @Response() res: ExpressResponse) {
    const clientId = this.configService.github.clientId;
    const secret = this.configService.github.secret;

    if (!code) {
      this.logger.error('No code specified for GitHub callback');
      return res.send('No code specified in GitHub callback');
    }

    this.logger.log(`Github callback initiated with code ${code}. Requesting token from GitHub with client id ${clientId}.`);

    const url = 'https://github.com/login/oauth/access_token?client_id=' + encodeURIComponent(clientId) + '&client_secret=' + encodeURIComponent(secret) + '&code=' + encodeURIComponent(code);
    let templateContent = fs.readFileSync('assets/github-callback.html').toString();

    res.contentType('text/html');

    try {
      const results = await this.httpService.post(url, null, { headers: { 'Accept': 'application/json' } }).toPromise();

      this.logger.log(`Token received from GitHub, sending to client: ${results.data['access_token']}`);

      templateContent = templateContent.replace('%ACCESS_TOKEN%', results.data['access_token']);
      res.send(templateContent);
    } catch (ex) {
      this.logger.error(`Error received from GitHub when requesting token: ${ex}`);

      templateContent = templateContent.replace('%ACCESS_TOKEN%', '');
      res.send(templateContent);
    }
  }
}
