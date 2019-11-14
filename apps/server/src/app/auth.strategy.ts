import {Strategy} from 'passport-http-bearer';
import {PassportStrategy} from '@nestjs/passport';
import {HttpService, Injectable, UnauthorizedException} from '@nestjs/common';
import {ITofUser} from './models/tof-request';
import {TofLogger} from './tof-logger';
import {ConfigService} from './config.service';
import {AxiosRequestConfig} from 'axios';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  static authorizationCodes: {[token: string]: ITofUser} = {};

  private readonly logger = new TofLogger(HttpStrategy.name);

  constructor(private httpService: HttpService, private configService: ConfigService) {
    super();
  }

  async validate(token: string) {
    if (HttpStrategy.authorizationCodes[token]) {
      return HttpStrategy.authorizationCodes[token];
    } else {
      this.logger.log(`Authorization code not found in cache. Requesting from identity provider. Code: ${token}`);

      const options: AxiosRequestConfig = {
        method: 'GET',
        url: this.configService.auth.userInfoUrl,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };

      try {
        const results = await this.httpService.request<ITofUser>(options).toPromise();

        this.logger.log(`Successfully retrieved user info for code ${token}`);

        HttpStrategy.authorizationCodes[token] = results.data;

        return results.data;
      } catch (ex) {
        throw new UnauthorizedException();
      }
    }
  }
}
