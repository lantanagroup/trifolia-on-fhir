import {BaseTools} from './baseTools';
import {DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';

export interface RemoveExtensionsOptions {
  server: string;
  extension: string | string[];
  excludeResourceType: string | string[];
}

export class RemoveExtensions extends BaseTools {
  readonly options: RemoveExtensionsOptions;

  constructor(options: RemoveExtensionsOptions) {
    super();

    this.options = options;

    if (typeof this.options.extension === 'string') {
      this.options.extension = [this.options.extension];
    } else if (!this.options.extension) {
      this.options.extension = [];
    }

    if (typeof this.options.excludeResourceType === 'string') {
      this.options.excludeResourceType = [this.options.excludeResourceType];
    } else if (!this.options.excludeResourceType) {
      this.options.excludeResourceType = [];
    }
  }

  private removeExtensions(allResources: DomainResource[]): DomainResource[] {
    const changedResources = [];

    allResources.forEach((resource) => {
      let resourceChanged = false;

      if (this.options.excludeResourceType.indexOf(resource.resourceType) >= 0) {
        return;
      }

      const foundExtensions = (resource.extension || []).filter((extension) => {
        return this.options.extension.indexOf(extension.url) >= 0;
      });

      foundExtensions.forEach((foundExtension) => {
        const index = resource.extension.indexOf(foundExtension);
        resource.extension.splice(index, 1);
        resourceChanged = true;
      });

      if (resourceChanged) {
        changedResources.push(resource);
      }
    });

    return changedResources;
  }

  public execute() {
    this.getAllResources(this.options.server)
      .then((allResources) => {
        const changedResources = this.removeExtensions(allResources);

        console.log(`Changes are being saved for ${changedResources.length} resources`);

        const savePromises = changedResources.map((changedResource) => this.saveResource(this.options.server, changedResource));
        return Promise.all(savePromises);
      })
      .then(() => {
        console.log('All changes have been saved');
        process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  }
}
