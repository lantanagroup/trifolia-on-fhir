import {Fhir} from 'fhir/fhir';
import {
  Bundle,
  DomainResource,
  Extension,
  ImplementationGuide as STU3ImplementationGuide,
  OperationOutcome
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {HttpService, Logger} from '@nestjs/common';
import * as config from 'config';
import {IFhirConfig} from '../models/fhir-config';
import {InvalidModuleConfigException} from '@nestjs/common/decorators/modules/exceptions/invalid-module-config.exception';
import {buildUrl, joinUrl, parseUrl} from '../../../../../libs/tof-lib/src/lib/fhirHelper';

const fhirConfig: IFhirConfig = config.get('fhir');

export class BundleExporter {
  readonly httpService: HttpService;
  readonly fhirServerBase: string;
  readonly fhirServerId: string;
  readonly fhirVersion: string;
  readonly fhir: Fhir;
  readonly implementationGuideId: string;
  readonly logger: Logger;

  constructor(httpService: HttpService, logger: Logger, fhirServerBase: string, fhirServerId: string, fhirVersion: string, fhir: Fhir, implementationGuideId: string) {
    this.httpService = httpService;
    this.logger = logger;
    this.fhirServerBase = fhirServerBase;
    this.fhirServerId = fhirServerId;
    this.fhirVersion = fhirVersion;
    this.fhir = fhir;
    this.implementationGuideId = implementationGuideId
  }

  /**
   * Performs any fixes to the resources that are being exported, such as removing ToF-specific extensions from the resource
   * and converting ImplementationGuide.definition.page.nameReference to nameUrl
   * @param object The resource to cleanup
   * @param clone
   */
  public static cleanupResource(object: any, clone = true) {
    if (object) {
      if (clone) {
        object = JSON.parse(JSON.stringify(object));
      }

      const extensionUrlKeys = Object.keys(Globals.extensionUrls);
      const extensionUrls = extensionUrlKeys.map((key) => Globals.extensionUrls[key]);
      const keys = Object.keys(object);

      // Convert page.nameReference to page.nameTitle
      if (object.resourceType === 'ImplementationGuide' && object.definition && object.definition.page) {
        const fixPage = (page: ImplementationGuidePageComponent) => {
          if (page.nameReference && page.title) {
            delete page.nameReference;
            page.nameUrl = page.title.replace(/ /g, '_') + '.html';
          }

          (page.page || []).forEach((next) => fixPage(next));
        };

        fixPage(object.definition.page);

        // Remove any contained binary resources. The IG publisher produces errors when there is a contained binary resource on the IG.
        const containedBinaries = (object.contained || []).filter((contained: DomainResource) => contained.resourceType === 'Binary');
        containedBinaries.forEach((contained) => {
          const index = object.contained.indexOf(contained);
          object.contained.splice(index, 1);
        });
      }

      // Remove ToF-specific extensions
      keys.forEach((key) => {
        if (key === 'extension') {
          const extensions: Extension[] = object[key];
          const removeExtensions = extensions.filter((extension) => extensionUrls.indexOf(extension.url) >= 0);

          // Remove any extensions from the resource that are for Trifolia
          removeExtensions.forEach((removeExtension) => {
            const index = extensions.indexOf(removeExtension);
            extensions.splice(index, 1);
          });
        } else if (typeof object[key] === 'object') {
          this.cleanupResource(object[key], false);
        }
      });
    }

    return object;
  }

  private _getStu3Resources(implementationGuide: STU3ImplementationGuide) {
    const promises = [];

    (implementationGuide.package || []).forEach((igPackage) => {
      const references = (igPackage.resource || [])
        .filter((resource) => !!resource.sourceReference && !!resource.sourceReference.reference)
        .map((resource) => resource.sourceReference.reference);

      references.forEach((reference) => {
        const parsed = parseUrl(reference);
        const resourceUrl = buildUrl(this.fhirServerBase, parsed.resourceType, parsed.id);
        const resourcePromise = this.httpService.get(resourceUrl).toPromise();
        promises.push(resourcePromise);
      });
    });

    return Promise.all(promises);
  }

  private _getR4Resources(implementationGuide: R4ImplementationGuide) {
    if (!implementationGuide.definition) {
      return Promise.resolve([]);
    }

    const promises = (implementationGuide.definition.resource || [])
      .filter((resource) => !!resource.reference && !!resource.reference.reference)
      .map((resource) => {
        const reference = resource.reference.reference;
        const parsed = parseUrl(reference);
        const resourceUrl = buildUrl(this.fhirServerBase, parsed.resourceType, parsed.id);
        return this.httpService.get(resourceUrl).toPromise();
      });

    return Promise.all(promises);
  }

  public async getBundle(removeExtensions = false): Promise<Bundle> {
    if (!fhirConfig.servers) {
      throw new InvalidModuleConfigException('This server has not been configured with FHIR servers');
    }

    return new Promise((resolve, reject) => {
      const igUrl = buildUrl(this.fhirServerBase, 'ImplementationGuide', this.implementationGuideId);
      const fhirServerConfig = fhirConfig.servers.find((serverConfig) => {
        return serverConfig.id === this.fhirServerId;
      });
      let implementationGuide;
      let implementationGuideFullUrl;

      this.httpService.get(igUrl).toPromise()
        .then((response) => {
          implementationGuide = response.data;
          implementationGuideFullUrl = response.headers['content-location'];

          if (fhirServerConfig.version === 'stu3') {
            return this._getStu3Resources(implementationGuide);
          }

          return this._getR4Resources(implementationGuide);
        })
        .then((responses) => {
          const resourceEntries = responses
            .filter((response) => {
              return !!response.data && !!response.data.resourceType;
            })
            .map((response) => {
              let fullUrl = response.headers['content-location'];

              if (!fullUrl) {
                fullUrl = joinUrl(this.fhirServerBase, response.data.resourceType, response.data.id);

                if (response.data.meta && response.data.meta.versionId) {
                  fullUrl = joinUrl(fullUrl, '_history', response.data.meta.versionId);
                }
              }

              return {
                fullUrl: fullUrl,
                resource: response.data
              };
            });

          if (responses.length !== resourceEntries.length) {
            this.logger.error(`Expected ${responses.length} entries in the export bundle, but only returning ${resourceEntries.length}. Some resources could not be returned in the bundle due to the response from the server.`);
          }

          const bundle = <Bundle>{
            resourceType: 'Bundle',
            type: 'collection',
            total: resourceEntries.length + 1,
            entry: [{fullUrl: implementationGuideFullUrl, resource: implementationGuide}].concat(resourceEntries)
          };

          if (removeExtensions) {
            BundleExporter.cleanupResource(bundle, false);
          }

          resolve(bundle);
        })
        .catch((err) => {
          if (err && err.response && err.response.data) {
            const errBody = <OperationOutcome> err.response.data;
            const issueTexts = (errBody.issue || []).map((issue) => issue.diagnostics);

            if (issueTexts.length > 0) {
              reject(issueTexts.join(' & '));
            } else if (errBody.text && errBody.text.div) {
              reject(errBody.text.div);
            } else {
              this.logger.error(errBody);
              reject('Unknown error returned by FHIR server when getting resources for implementation guide');
            }
          } else {
            this.logger.error(err);
            reject(err);
          }
        });
    });
  }

  public export(format: 'json' | 'xml' | 'application/json' | 'application/fhir+json' | 'application/xml' | 'application/fhir+xml' = 'json', removeExtensions = false) {
    return new Promise((resolve, reject) => {
      this.getBundle(removeExtensions)
        .then((results) => {
          let response: Bundle | string = results;

          if (format === 'xml' || format === 'application/xml') {
            response = this.fhir.objToXml(results);
          }

          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
