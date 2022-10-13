import {HttpService, Injectable, Logger} from '@nestjs/common';
import {IServerConfig} from './models/server-config';
import {IFhirConfig} from './models/fhir-config';
import {IAuthConfig} from './models/auth-config';
import {IGithubConfig} from './models/github-config';
import {IPublishConfig} from './models/publish-config';
import {AnnouncementServiceConfig} from './models/announcement-service-config';
import path from 'path';
import * as config from 'config';
import * as fs from 'fs-extra';
import * as semver from 'semver';

@Injectable()
export class ConfigService {
  public server: IServerConfig = {
    supportUrl: 'http://test.com/support',
    enableSecurity: false,
    maxRequestSizeMegabytes: 50,
    maxAsyncQueueRequests: 4,
    publishStatusPath: ""
  };
  public fhir: IFhirConfig = {
    nonEditableResources: {},
    publishedGuides: '',
    servers: [{
      id: 'test',
      name: 'test',
      uri: 'http://test.com',
      version: 'stu3',
      supportedLogicalTypes: []
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
    clientId: 'gh-clientid',
    secret: 'secr3t',
    apiBase: 'https://api.github.com',
    authBase: 'https://github.com'
  };
  public publish: IPublishConfig = {
    queueLimit: 2,
    timeOut: 5000
  };
  public privacyPolicy: string;
  public termsOfUse: string;
  public announcementService?: AnnouncementServiceConfig;
  public headerPropagation: string[];
  private logger = new Logger('ConfigService');

  constructor(
    private httpService: HttpService) {

    // If this is not a unit test, load configs using the config module.
    if (!process.env.JEST_WORKER_ID) {
      this.server = config.get('server');
      this.fhir = config.get('fhir');
      this.auth = config.get('auth');
      this.github = config.get('github');
      this.publish = config.get('publish');
      this.headerPropagation = config.get('headerPropagation');
      this.announcementService = config.has('announcementService') ? config.get('announcementService') : undefined;
      this.privacyPolicy = config.get('privacyPolicy');
      this.termsOfUse = config.get('termsOfUse');
    }
  }

  static create() {
    return new ConfigService(new HttpService());
  }

  /**
   * this method is called from the getIgPublisher method. This calls the get to download the specified version of the
   * jar file for the IG Publisher
   * @param destPath this is the path to the file system where the jar file will be saved
   * @param url this is the url that is used to download the jar file
   */
  async downloadJarFile(destPath: string, url: string) {
    const pathInfo = fs.existsSync(destPath) ? fs.statSync(destPath) : null;
    const response = await this.httpService.axiosRef({
      url: url,
      method: 'GET',
      responseType: 'stream',
    });

    if (pathInfo && pathInfo.size.toString() === response.headers['content-length']) {
      response.data.destroy();
      return Promise.resolve();
    }

    const writer = fs.createWriteStream(destPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  async getIgPublisherForDependencies() {
    const url = 'https://api.github.com/repos/hl7/fhir-ig-publisher/releases';
    const allVersions = await this.httpService.get<{ id: string, name: string }[]>(url).toPromise();

    const igPublisherDir = path.resolve(this.server.latestIgPublisherPath || 'assets/ig-publisher');

    // Make sure the directory exists before we try to read from it
    fs.ensureDirSync(igPublisherDir);

    // List any JARs that already exist in the directory
    const jars = fs.readdirSync(igPublisherDir);

    for (const nextJar of jars) {
      if (!nextJar.toLowerCase().endsWith('.jar')) continue;

      // Find the ID of the JAR in the list of versions indicated by GitHub
      const nextJarId = nextJar.substring(0, nextJar.lastIndexOf('.'));
      const nextJarVersion = allVersions.data.find(f => f.id.toString() === nextJarId);

      // Determine if this version name matches what we need based on semver
      if (nextJarVersion && semver.satisfies(nextJarVersion.name, '>=1.1.35')) {
        return path.join(igPublisherDir, nextJar);
      }
    }

    // If we got here, we don't have an adequate version of the IG Publisher and
    // we should get the latest version from GitHub.
    return await this.getIgPublisher(allVersions.data[0].id);
  }

  /**
   * This method checks to see if the version of IG Publisher the user wants to use is already downloaded or not. If
   * we already have it downloaded just use it. If it doesn't exist in the file system then download it first then use
   * it. If an error is thrown it will also delete the empty jar file in the directory.
   * @param versionId
   * @param publisherPath
   * @param httpService
   */
  async getIgPublisher(versionId: string): Promise<string> {
    const igPublisherDir = path.resolve(this.server.latestIgPublisherPath || 'assets/ig-publisher');
    const filePath = path.join(igPublisherDir, versionId + '.jar');

    // if the version is 'dev', always download the latest dev version
    // check to see if the jar file is already downloaded, if so use it otherwise download it
    if (versionId === 'dev') {
      // TODO: may have write conflict with other simultaneous requests to use dev version of ig publisher
      const sonatypeData = await this.httpService.get('https://oss.sonatype.org/service/local/repositories/snapshots/index_content/?groupIdHint=org.hl7.fhir.publisher&artifactIdHint=org.hl7.fhir.publisher&', { headers: { 'Accept': 'application/json' }}).toPromise();
      const sonatypeVersions = sonatypeData.data.data.children[0].children[0].children[0].children[0].children[0].children;
      const latestSonatypeVersion = sonatypeVersions[sonatypeVersions.length - 1].version;
      const downloadUrl = `https://oss.sonatype.org/service/local/artifact/maven/redirect?r=snapshots&g=org.hl7.fhir.publisher&a=org.hl7.fhir.publisher.cli&v=${latestSonatypeVersion}`;

      this.logger.log(`Downloading dev version of IG Publisher from sonatype: ${downloadUrl}`);

      fs.ensureDirSync(path.dirname(filePath));
      await this.downloadJarFile(filePath, downloadUrl);

      return filePath;
    } else if (fs.existsSync(filePath)) {
      this.logger.log('The jar file ' + versionId + ' for the selected version already exists. Not downloading it again.');
      return filePath;
    } else {
      try {
        const infoUrl = `https://api.github.com/repos/hl7/fhir-ig-publisher/releases/${versionId}`;
        this.logger.log(`Getting version info for id ${versionId} from GitHub`);

        const versionInfo = await this.httpService.get(infoUrl).toPromise();
        const downloadUrl = versionInfo.data.assets[0]['browser_download_url'];
        const version = versionInfo.data.name;

        this.logger.log(`Downloading version ${version} (id: ${versionId}) from GitHub URL ${downloadUrl}`);

        fs.ensureDirSync(path.dirname(filePath));
        await this.downloadJarFile(filePath, downloadUrl);

        return filePath;
      } catch (ex) {
        // this check for errors and logs errors. If error is caught it also deletes the empty jar file from the directory. This returns the default file path
        this.logger.error(`Error getting version ${versionId} of FHIR IG publisher: ${ex.message}`);

        fs.unlinkSync(filePath);
        return;
      }
    }
  }
}
