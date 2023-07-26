import { Fhir } from 'fhir/fhir';
import { DomainResource } from '@trifolia-fhir/stu3';
import { ImplementationGuidePageComponent } from '@trifolia-fhir/r4';
import { Globals } from '@trifolia-fhir/tof-lib';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '@nestjs/common';
import type { IBundle, IExtension, IStructureDefinition } from '@trifolia-fhir/tof-lib';
import { FhirResourcesService } from '../fhirResources/fhirResources.service';

export type FormatTypes = 'json' | 'xml' | 'application/json' | 'application/fhir+json' | 'application/xml' | 'application/fhir+xml';
export type BundleTypes = 'searchset' | 'transaction';

export class BundleExporter {
  readonly httpService: HttpService;
  readonly fhirResourceService: FhirResourcesService;
  readonly logger: LoggerService;
  readonly fhir: Fhir;
  readonly implementationGuideId: string;

  public fhirVersion: 'stu3'|'r4'|'r5';

  constructor(
    fhirResourceService: FhirResourcesService,
    httpService: HttpService,
    logger: LoggerService,
    fhir: Fhir,
    implementationGuideId: string) {

    this.fhirResourceService = fhirResourceService;
    this.httpService = httpService;
    this.logger = logger;
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

      if (obj.meta && obj.meta.tag) {
        delete obj.meta.tag;
      }

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

            // Old extension used to determine if toc should be auto-generated. No longer used, but some IGs still have it and need it removed.
            const autoGenericTocExtension = (page.extension || []).find(e => e.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc');
            if (autoGenericTocExtension) {
              const index = page.extension.indexOf(autoGenericTocExtension);
              page.extension.splice(index, index >= 0 ? 1 : 0);

              if (page.extension.length === 0) {
                delete page.extension;
              }
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
      for (const key of keys) {
        const value = obj[key];

        if (key === 'extension') {
          const extensions: IExtension[] = value;
          const removeExtensions = extensions.filter((extension) => extensionUrls.indexOf(extension.url) >= 0);

          // Remove any extensions from the resource that are for Trifolia
          removeExtensions.forEach((removeExtension) => {
            const index = extensions.indexOf(removeExtension);
            extensions.splice(index, 1);
          });

          if (extensions.length === 0) {
            delete obj[key];
          }
        } else if (value instanceof Array) {
          for (const next of value) {
            this.cleanupResource(next, false);
          }
        } else if (typeof value === 'object') {
          this.cleanupResource(value, false);
        }
      }
    }

    return obj;
  }

  public async getBundle(cleanup = false, summary = false, type: BundleTypes = 'searchset'): Promise<IBundle> {

    this.logger.log(`Getting bundle of resources for implementation guide ${this.implementationGuideId}`);

    const conf = await this.fhirResourceService.getWithReferences(this.implementationGuideId);
    const bundle: IBundle = await this.fhirResourceService.getBundleFromImplementationGuide(conf);
    this.fhirVersion = conf.fhirVersion;

    bundle.total = (bundle.entry || []).length;
    bundle.type = type;

    if (bundle.entry) {
      bundle.entry.forEach(entry => {
        if (entry.resource.resourceType && entry.resource.resourceType === "StructureDefinition") {
          delete (<IStructureDefinition>entry.resource).snapshot;
        }
      });
    }

    if (bundle.type === 'transaction') {
      bundle.entry.forEach(entry => {
        entry.request = {
          method: 'PUT',
          url: `${entry.resource.resourceType}/${entry.resource.id}`
        };
        delete entry.search;
      });
    }

    if (cleanup) {
      (bundle.entry || []).forEach((entry) => BundleExporter.cleanupResource(entry.resource, false));
    }


    return bundle;
  }

  public export(format: FormatTypes = 'json', removeExtensions = false, type: BundleTypes = 'searchset') {
    return new Promise((resolve, reject) => {
      this.getBundle(removeExtensions, false, type)
        .then((results) => {
          let response: IBundle | string = results;

          if (results.entry) {
            results.entry.forEach(entry => {
              if (entry.resource.resourceType && entry.resource.resourceType === 'StructureDefinition') {
                delete (<IStructureDefinition>entry.resource).snapshot;
              }
            });
          }

          if (type === 'transaction') {
            delete response.total;
          }

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
