import {Fhir} from 'fhir/fhir';
import {Bundle, DomainResource, Extension} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuidePageComponent} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {HttpService, Logger} from '@nestjs/common';
import {buildUrl} from '../../../../../libs/tof-lib/src/lib/fhirHelper';

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
    this.implementationGuideId = implementationGuideId;
  }

  /**
   * Performs any fixes to the resources that are being exported, such as removing ToF-specific extensions from the resource
   * and converting ImplementationGuide.definition.page.nameReference to nameUrl
   * @param obj The resource to cleanup
   * @param clone
   */
  public static cleanupResource(obj: any, clone = true) {
    if (obj) {
      if (clone) {
        obj = JSON.parse(JSON.stringify(obj));
      }

      const extensionUrlKeys = Object.keys(Globals.extensionUrls);
      const extensionUrls = extensionUrlKeys.map((key) => Globals.extensionUrls[key]);
      const keys = Object.keys(obj);

      if (obj.meta && obj.meta.security) {
        delete obj.meta.security;
      }

      // Convert page.nameReference to page.nameTitle
      if (obj.resourceType === 'ImplementationGuide' && obj.definition) {
        if (obj.definition.page) {
          const fixPage = (page: ImplementationGuidePageComponent) => {
            if (page.nameReference && page.title) {
              delete page.nameReference;
              page.nameUrl = Globals.getCleanFileName(page.title) + '.html';
            }

            (page.page || []).forEach((next) => fixPage(next));
          };

          fixPage(obj.definition.page);

          // Remove any contained binary resources. The IG publisher produces errors when there is a contained binary resource on the IG.
          const containedBinaries = (obj.contained || []).filter((contained: DomainResource) => contained.resourceType === 'Binary');
          containedBinaries.forEach((contained) => {
            const index = obj.contained.indexOf(contained);
            obj.contained.splice(index, 1);
          });
        }

        // Remove Media resources from the IG. Media should only be left if it is an example
        if (obj.definition.resource) { // R4
          for (let i = obj.definition.resource.length - 1; i >= 0; i--) {
            const resource = obj.definition.resource[i];
            const isExample = resource.exampleBoolean === true || !!resource.exampleCanonical;
            const isMedia = resource.reference && resource.reference.reference && resource.reference.reference.startsWith('Media/');

            if (isMedia && !isExample) {
              obj.definition.resource.splice(i, 1);
            }
          }
        } else if (obj.package) {      // STU3
          obj.package.forEach((pkg) => {
            if (!pkg.resource) {
              return;
            }

            for (let i = pkg.resource.length - 1; i >= 0; i++) {
              const resource = pkg.resource[i];
              const isMedia = resource.sourceReference && resource.sourceReference.reference && resource.sourceReference.reference.startsWith('Media/');

              if (resource.sourceReference && resource.sourceReference.reference && resource.sourceReference.reference.startsWith('Media/')) {
                if (isMedia && resource.example === false) {
                  pkg.resource.splice(i, 1);
                }
              }
            }
          });
        }
      }

      // Remove ToF-specific extensions recursively in the object
      keys.forEach((key) => {
        if (key === 'extension') {
          const extensions: Extension[] = obj[key];
          const removeExtensions = extensions.filter((extension) => extensionUrls.indexOf(extension.url) >= 0);

          // Remove any extensions from the resource that are for Trifolia
          removeExtensions.forEach((removeExtension) => {
            const index = extensions.indexOf(removeExtension);
            extensions.splice(index, 1);
          });
        } else if (typeof obj[key] === 'object') {
          this.cleanupResource(obj[key], false);
        }
      });
    }

    return obj;
  }

  public async getBundle(cleanup = false, summary = false): Promise<Bundle> {
    const params = {
      _id: this.implementationGuideId,
      _include: [
        'ImplementationGuide:resource',
        'ImplementationGuide:global'
      ]
    };

    if (summary) {
      params['_summary'] = true;
    }

    const url = buildUrl(this.fhirServerBase, 'ImplementationGuide', null, null, params, true);

    this.logger.log(`Getting bundle of resources for implementation guide ${this.implementationGuideId} using URL ${url}`);

    const results = await this.httpService.get<Bundle>(url).toPromise();
    const bundle = results.data;

    bundle.total = (bundle.entry || []).length;

    if (cleanup) {
      (bundle.entry || []).forEach((entry) => BundleExporter.cleanupResource(entry.resource));
    }

    return bundle;
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
