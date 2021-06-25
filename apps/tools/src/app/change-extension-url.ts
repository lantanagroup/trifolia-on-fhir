import { BaseTools } from './baseTools';
import { IBundle } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';

export interface ChangeExtensionUrlOptions {
  server: string;
  currentUrl: string;
  newUrl: string;
  resourceType?: string;
}

export class ChangeExtensionUrl extends BaseTools {
  private options: ChangeExtensionUrlOptions;

  constructor(options: ChangeExtensionUrlOptions) {
    super();
    this.options = options;
  }

  public async execute() {
    const conformance = await this.getConformance(this.options.server);

    if (!conformance || !conformance.rest || !conformance.rest.length || !conformance.rest[0].resource || !conformance.rest[0].resource.length) {
      console.error('Conformance/metadata from server not found or does not specify resource types');
      return;
    }

    let resourceTypes = conformance.rest[0].resource.map(r => r.type);

    if (this.options.resourceType) {
      resourceTypes = [this.options.resourceType];
    }

    const allResources = await this.getAllResourcesByType(this.options.server, resourceTypes.map(rt => rt));
    const changedResources = [];

    console.log(`Searching for ${allResources.length} resource type`);

    allResources.forEach(r => {
      const changed = this.findAndRemoveExtension(r, `${r.resourceType}[id=${r.id}]`);

      if (changed) {
        changedResources.push(r);
      }
    });

    const bundle: IBundle = {
      resourceType: 'Bundle',
      type: 'transaction',
      entry: changedResources.map(r => {
        return {
          request: {
            method: 'PUT',
            url: `${r.resourceType}/${r.id}`
          },
          resource: r
        };
      })
    };

    const response = await this.httpService.post<IBundle>(this.options.server, bundle).toPromise();

    console.log('Done posting bundle of changes to FHIR server');

    response.data.entry.forEach((e, index) => {
      if (e.response && e.response.status) {
        console.log(`${index}: ${e.response.status}`);
      }
    });
  }

  private findAndRemoveExtension(parentObj: any, path: string) {
    if (!parentObj) return false;

    let changed = false;

    Object.keys(parentObj).forEach(key => {
      const value = parentObj[key];

      if (key === 'extension' && value instanceof Array) {
        const extensions = value.filter(e => e.url === this.options.currentUrl);

        if (extensions.length > 0) {
          extensions.forEach(ext => {
            ext.url = this.options.newUrl;
          });
          changed = true;
          console.log(`Found extension at ${path}`);
        }
      } else if (value instanceof Array) {
        value.forEach((next, index) => {
          if (this.findAndRemoveExtension(next, path + (path ? '.' : '') + `${key}[${index}]`)) {
            changed = true;
          }
        });
      } else if (typeof value === 'object' && this.findAndRemoveExtension(value, path + (path ? '.' : '') + key)) {
        changed = true;
      }
    });

    return changed;
  }
}
