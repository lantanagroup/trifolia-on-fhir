import { BaseTools } from './baseTools';
import { IBundle, IImplementationGuide, IDocumentReference } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import * as fs from 'fs';
import { PublishingRequestModel } from '../../../../libs/tof-lib/src/lib/publishing-request-model';
import { PackageListModel } from '../../../../libs/tof-lib/src/lib/package-list-model';
import { Versions } from 'fhir/fhir';

export interface ReplacePackageListOptions {
  server: string;
  fhirVersion: Versions;
}

export class ReplacePackageList extends BaseTools {
  private options: ReplacePackageListOptions;

  constructor(options: ReplacePackageListOptions) {
    super();
    this.options = options;
  }

  private fixIds(implementationGuide: IImplementationGuide) {
    (implementationGuide.extension || []).forEach(e => {
      if (e.valueReference && e.valueReference.reference === '#publishing-request') {
        e.valueReference.reference = '#publication-request';

        if (!e.url) {
          e.url = 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-publication-request';
        }
      }
    });

    const extensions = (implementationGuide.extension || []).filter(e => e.url === 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-publication-request');

    if (extensions.length > 1) {
      for (let i = 1; i < extensions.length; i++) {
        const index = implementationGuide.extension.indexOf(extensions[i]);
        implementationGuide.extension.splice(index, 1);
      }
    }

    (implementationGuide.contained || [])
      .filter(c => c.id === 'publishing-request')
      .forEach(c => {
        const docRef = c as IDocumentReference;

        docRef.id = 'publication-request';

        if (docRef.type && docRef.type.coding && docRef.type.coding.length > 0 && docRef.type.coding[0].code === 'publishing-request') {
          docRef.type.coding[0].code = 'publication-request';
        }
      });
  }

  public async execute() {
    const allResources = await this.getAllResourcesByType(this.options.server, ['ImplementationGuide']);
    const changedImplementationGuides = [];

    for (const implementationGuide of allResources) {
      this.fixIds(implementationGuide as IImplementationGuide);

      const packageList = PackageListModel.getPackageList(implementationGuide as IImplementationGuide);

      if (packageList) {
        console.log(`Package list found for ${implementationGuide.id}`);

        let publishingRequest = PublishingRequestModel.getPublishingRequest(implementationGuide as IImplementationGuide);

        if (!publishingRequest) {
          console.log(`No publication-request found for ${implementationGuide.id}. Creating...`);

          publishingRequest = new PublishingRequestModel();

          publishingRequest['package-id'] = packageList['package-id'];
          publishingRequest.title = packageList.title;
          publishingRequest.introduction = packageList.introduction;
          publishingRequest.category = packageList.category;
          if (packageList.list[0]) {
            publishingRequest.version = packageList.list[0].version;
            publishingRequest.desc = packageList.list[0].desc;
            publishingRequest.path = packageList.list[0].path;
            if (packageList.list[0].status === 'ci-build') {
              publishingRequest.status = 'draft';
            } else {
              publishingRequest.status = packageList.list[0].status;
            }
            publishingRequest.sequence = packageList.list[0].sequence;
          }

          PublishingRequestModel.setPublishingRequest(implementationGuide as IImplementationGuide, publishingRequest, this.options.fhirVersion);
        }

        console.log(`Removing package list for ${implementationGuide.id}`);
        PackageListModel.removePackageList(implementationGuide as IImplementationGuide);
        changedImplementationGuides.push(implementationGuide);
      }
    }

    const bundle: IBundle = {
      resourceType: 'Bundle',
      type: 'batch',
      entry: changedImplementationGuides.map(r => {
        return {
          request: {
            method: 'PUT',
            url: `${r.resourceType}/${r.id}`
          },
          resource: r
        };
      })
    };

    if (bundle.entry.length === 0) {
      console.log('No changes to apply.');
      return;
    }

    fs.writeFileSync('change-implementation-guides.json', JSON.stringify(bundle));

    try {
      console.log(`Submitting bundle of ${bundle.entry.length} changes`);

      const response = await this.httpService.post<IBundle>(this.options.server, bundle).toPromise();

      console.log('Done posting bundle of changes to FHIR server');

      response.data.entry.forEach((e, index) => {
        if (e.response && e.response.status) {
          console.log(`${index}: ${e.response.status}`);
        }
      });
    } catch (ex) {
      console.error(`Error executing update on FHIR server: ${ex}`);
    }
  }

}
