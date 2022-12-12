import { BaseTools } from './baseTools';
import { IBundle, IImplementationGuide } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
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

  public async execute() {
    const allResources = await this.getAllResourcesByType(this.options.server, ['ImplementationGuide']);
    const changedImplementationGuides = [];

    for (const implementationGuide of allResources) {

      const packageList = PackageListModel.getPackageList(implementationGuide as IImplementationGuide);

      if (packageList) {
        const publishingRequest = new PublishingRequestModel();


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

    fs.writeFileSync('change-implementation-guides.json', JSON.stringify(bundle));

    try {
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
