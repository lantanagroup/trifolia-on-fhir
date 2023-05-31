import {Strategy} from 'passport-http-bearer';
import {PassportStrategy} from '@nestjs/passport';
import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import {TofLogger} from './tof-logger';
import {ConfigService} from './config.service';
import jwksClient from 'jwks-rsa';
import {UsersService} from './users/users.service';
import {ITofUser} from '@trifolia-fhir/tof-lib';

const jwt = require('jsonwebtoken');

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new TofLogger(HttpStrategy.name);
  private readonly jwksClient: jwksClient.JwksClient;

  constructor(private httpService: HttpService, private configService: ConfigService, private userService: UsersService) {
    super();

    this.jwksClient = jwksClient({
      jwksUri: this.configService.auth.jwksUri
    });
  }

  async verify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const getKey = (header, callback) => {
        this.jwksClient.getSigningKey(header.kid, (err, key: any) => {
          if (err) {
            callback(err);
            return;
          }

          const signingKey = key.publicKey || key.rsaPublicKey;
          callback(null, signingKey);
        });
      }

      jwt.verify(token, getKey, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  async validate(token: string) {
    this.logger.trace('Validating user token');

    try {
      const profile = <ITofUser> await this.verify(token);
      if (profile.roles) {
        // For auth0 and keycloak, roles is a top-level property
        // For auth0, it is assigned by the "Auth0 Authorization" extension in the auth0 dashboard
        // For keycloak, configuration must be changed for "Client Scopes" > roles > Mappers > "client roles" to have the "token claim name" be assigned to the top-level "roles" property
        profile.isAdmin = profile.roles.indexOf('admin') >= 0;
      }  else {
        profile.isAdmin = false;
      }

      const user = await this.userService.findOne({'authId' : profile.sub.startsWith('auth0|')? profile.sub.substring(6): profile.sub});
      if (user) {
        profile.user = user.$clone();
      }

      //profile.isAdmin = true;
      return profile;
    } catch (ex) {
      this.logger.error('Token validation failed: ' + ex.message);
      throw ex;
    }
  }
}
