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

  public async getBundle(removeExtensions = false, summary = false): Promise<Bundle> {
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
    const results = await this.httpService.get<Bundle>(url).toPromise();
    const bundle = results.data;

    bundle.total = (bundle.entry || []).length;

    if (removeExtensions) {
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
