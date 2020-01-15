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

      if (object.meta && object.meta.security) {
        delete object.meta.security;
      }

      // Convert page.nameReference to page.nameTitle
      if (object.resourceType === 'ImplementationGuide' && object.definition) {
        if (object.definition.page) {
          const fixPage = (page: ImplementationGuidePageComponent) => {
            if (page.nameReference && page.title) {
              delete page.nameReference;
              page.nameUrl = page.title
                .replace(/[/\\—,() ]/g, '') +
                '.html';
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

        // Remove Media resources from the IG. Media should only be left if it is an example
        if (object.definition.resource) { // R4
          for (let i = object.definition.resource.length - 1; i >= 0; i--) {
            const resource = object.definition.resource[i];
            const isExample = resource.exampleBoolean === true || !!resource.exampleCanonical;
            const isMedia = resource.reference && resource.reference.reference && resource.reference.reference.startsWith('Media/');

            if (isMedia && !isExample) {
              object.definition.resource.splice(i, 1);
            }
          }
        } else if (object.package) {      // STU3
          object.package.forEach((pkg) => {
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
