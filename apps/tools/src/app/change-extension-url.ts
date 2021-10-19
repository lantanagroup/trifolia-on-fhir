import {BaseTools} from './baseTools';
import {IBundle} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import * as fs from 'fs';

export interface ChangeExtensionUrlOptions {
  server: string;
  currentUrl?: string;
  newUrl?: string;
  file?: string;
  resourceType?: string;
}

interface ExtensionChange {
  currentUrl: string;
  newUrl: string;
}

export class ChangeExtensionUrl extends BaseTools {
  private options: ChangeExtensionUrlOptions;
  private changes: ExtensionChange[] = [];

  constructor(options: ChangeExtensionUrlOptions) {
    super();
    this.options = options;
  }

  public async execute() {
    if (!this.options.currentUrl && !this.options.newUrl && !this.options.file) {
      console.error('You must specify either currentUrl and newUrl parameters together, or the file parameter.');
      return;
    } else if ((this.options.currentUrl && !this.options.newUrl) || (!this.options.currentUrl && this.options.newUrl)) {
      console.error('The parameters currentUrl and newUrl must be specified together');
      return;
    }

    if (this.options.file) {
      const fileContent = fs.readFileSync(this.options.file).toString();
      const lines: string[] = fileContent.replace(/\r/g, '').split('\n');
      this.changes = lines
        .filter(line => line.split(',').length === 2)
        .map(line => {
          const parts = line.split(',');
          return {
            currentUrl: parts[0].trim(),
            newUrl: parts[1].trim()
          } as ExtensionChange;
        });
    } else {    // assume currentUrl/newUrl explicitly provided
      this.changes.push({
        currentUrl: this.options.currentUrl,
        newUrl: this.options.newUrl
      });
    }

    const conformance = await this.getConformance(this.options.server);

    if (!conformance || !conformance.rest || !conformance.rest.length || !conformance.rest[0].resource || !conformance.rest[0].resource.length) {
      console.error('Conformance/metadata from server not found or does not specify resource types');
      return;
    }

    let resourceTypes = conformance.rest[0].resource.map(r => r.type);

    if (this.options.resourceType) {
      resourceTypes = [this.options.resourceType];
    }

    resourceTypes = resourceTypes.filter(rt => rt !== 'AuditEvent');

    const allResources = await this.getAllResourcesByType(this.options.server, resourceTypes.map(rt => rt));
    const changedResources = [];

    console.log(`Searching for ${allResources.length} resource type`);

    allResources.forEach(r => {
      const changed = this.findAndUpdateExtension(r, `${r.resourceType}[id=${r.id}]`);

      if (changed) {
        changedResources.push(r);
      }
    });

    const bundle: IBundle = {
      resourceType: 'Bundle',
      type: 'batch',
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

    fs.writeFileSync('change-ext-urls.json', JSON.stringify(bundle));

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

  private findAndUpdateExtension(parentObj: any, path: string) {
    if (!parentObj) return false;

    let changed = false;

    Object.keys(parentObj).forEach(key => {
      const value = parentObj[key];

      if (key === 'extension' && value instanceof Array) {
        const extensions = value.filter(e => !!this.changes.find(c => c.currentUrl === e.url));

        if (extensions.length > 0) {
          extensions.forEach(ext => {
            const foundChange = this.changes.find(c => c.currentUrl === ext.url);
            ext.url = foundChange.newUrl;
            console.log(`Found extension at ${path}. Changing ${foundChange.currentUrl} to ${foundChange.newUrl}.`);
          });
          changed = true;
        }
      } else if (value instanceof Array) {
        value.forEach((next, index) => {
          if (this.findAndUpdateExtension(next, path + (path ? '.' : '') + `${key}[${index}]`)) {
            changed = true;
          }
        });
      } else if (typeof value === 'object' && this.findAndUpdateExtension(value, path + (path ? '.' : '') + key)) {
        changed = true;
      }
    });

    return changed;
  }
}
