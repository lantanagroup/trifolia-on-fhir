import {Strategy} from 'passport-http-bearer';
import {PassportStrategy} from '@nestjs/passport';
import {HttpService, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {IAuthConfig} from './models/auth-config';
import * as config from 'config';
import {ITofUser} from './models/tof-request';

const authConfig: IAuthConfig = config.get('auth');

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  static authorizationCodes: {[token: string]: ITofUser} = {};

  private readonly logger = new Logger(HttpStrategy.name);

  constructor(private httpService: HttpService) {
    super();
  }

  async validate(token: string) {
    if (HttpStrategy.authorizationCodes[token]) {
      return HttpStrategy.authorizationCodes[token];
    } else {
      this.logger.log(`Authorization code not found in cache. Requesting from identity provider. Code: ${token}`);

      const options = {
        method: 'GET',
        url: authConfig.userInfoUrl,
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
