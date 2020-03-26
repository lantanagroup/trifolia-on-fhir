import { Injectable } from '@nestjs/common';
import {IServerConfig} from './models/server-config';
import {IFhirConfig} from './models/fhir-config';

import * as config from 'config';
import {IAuthConfig} from './models/auth-config';
import {IGithubConfig} from './models/github-config';
import { IPublishConfig } from './models/publish-config';
import {AnnouncementServiceConfig} from './models/announcement-service-config';

@Injectable()
export class ConfigService {
  public server: IServerConfig = {
    adminCode: 'default',
    supportUrl: 'http://test.com/support',
    enableSecurity: false,
    maxRequestSizeMegabytes: 50,
    maxAsyncQueueRequests: 4
  };
  public fhir: IFhirConfig = {
    nonEditableResources: {},
    publishedGuides: '',
    latestPublisher: '',
    servers: [{
      id: 'test',
      name: 'test',
      uri: 'http://test.com',
      version: 'stu3'
    }]
  };
  public auth: IAuthConfig = {
    clientId: 'test',
    domain: 'test.auth0.com',
    secret: 'secr3t',
    issuer: 'http://trifolia-on-fhir',
    jwksUri: ''
  };
  public github: IGithubConfig = {
    clientId:  'gh-clientid',
    secret: 'secr3t'
  };
  public publish: IPublishConfig = {
    queueLimit: 2,
    timeOut: 5000
  };
  public announcementService?: AnnouncementServiceConfig;
  public headerPropagation: string[];

  constructor() {
    // If this is not a unit test, load configs using the config module.
    if (!process.env.JEST_WORKER_ID) {
      this.server = config.get('server');
      this.fhir = config.get('fhir');
      this.auth = config.get('auth');
      this.github = config.get('github');
      this.publish = config.get('publish');
      this.headerPropagation = config.get('headerPropagation');
      this.announcementService = config.has('announcementService') ? config.get('announcementService') : undefined;
    }
  }
}
