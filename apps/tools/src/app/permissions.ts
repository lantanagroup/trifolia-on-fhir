import {BaseTools} from './baseTools';
import {DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {addPermission} from '../../../../libs/tof-lib/src/lib/helper';
import * as rp from 'request-promise';

export interface PermissionOptions {
  server: string;
  type: 'everyone'|'group'|'user';
  permission: 'read'|'write';
  id?: string;
  allResources?: boolean;
  resourceType?: string;
  resourceId?: string;
}

export class BasePermissions extends BaseTools {
  protected options: PermissionOptions;

  constructor(options: PermissionOptions) {
    super();

    this.options = options;

    if (!options.allResources && !options.resourceType && !options.resourceId) {
      throw new Error('You must specify either "allResources" or "resourceType" and "resourceId"');
    }
  }

  protected getResources(): Promise<DomainResource[]> {
    if (this.options.allResources) {
      return this.getAllResources(this.options.server);
    } else if (this.options.resourceType && this.options.resourceId) {
      return new Promise((resolve, reject) => {
        this.getResource(this.options.server, this.options.resourceType, this.options.resourceId)
          .then((results) => resolve([results]))
          .catch((err) => reject(err));
      });
    } else if (this.options.resourceType) {
      return this.getAllResources(this.options.server, this.options.resourceType);
    }
  }
}

export class RemovePermission extends BasePermissions {
  private readonly maxConcurrent = 5;
  private queue: DomainResource[];

  private removePermission(resource: DomainResource) {
    const delim = Globals.securityDelim;
    const securityTag = this.options.type === 'everyone' ?
      `${this.options.type}${delim}${this.options.permission}` :
      `${this.options.type}${delim}${this.options.id}${delim}${this.options.permission}`;
    const options = {
      method: 'POST',
      url: this.options.server + (this.options.server.endsWith('/') ? '' : '/') + resource.resourceType + '/' + resource.id + '/$meta-delete',
      json: true,
      body: {
        resourceType: 'Parameters',
        parameter: [{
          name: 'meta',
          valueMeta: {
            security: {
              system: Globals.securitySystem,
              code: securityTag
            }
          }
        }]
      }
    };

    return rp(options)
      .then(() => {
        const queueIndex = this.queue.indexOf(resource);
        this.queue.splice(queueIndex, 1);
      });
  }

  private async processQueue() {
    const next = this.queue.slice(0, 5);
    const promises = next.map((resource) => this.removePermission(resource));

    console.log(`Processing ${promises.length} more resources. ${this.queue.length} left.`);

    await Promise.all(promises);

    if (this.queue.length > 0) {
      await this.processQueue();
    }
  }

  public execute() {
    this.getResources()
      .then((resources: DomainResource[]) => {
        this.queue = resources;
        return this.processQueue();
      })
      .then(() => {
        console.log('Done removing permission from resources');
        process.exit(0);
      })
      .catch((err) => {
        this.printError(err);
        process.exit(1);
      });
  }
}

export class AddPermission extends BasePermissions {
  private queue: DomainResource[];

  private addPermission(resource: DomainResource) {
    const delim = Globals.securityDelim;
    const securityTag = this.options.type === 'everyone' ?
      `${this.options.type}${delim}${this.options.permission}` :
      `${this.options.type}${delim}${this.options.id}${delim}${this.options.permission}`;
    const options = {
      method: 'POST',
      url: this.options.server + (this.options.server.endsWith('/') ? '' : '/') + resource.resourceType + '/' + resource.id + '/$meta-add',
      json: true,
      body: {
        resourceType: 'Parameters',
        parameter: [{
          name: 'meta',
          valueMeta: {
            security: {
              system: Globals.securitySystem,
              code: securityTag
            }
          }
        }]
      }
    };

    return rp(options)
      .then(() => {
        const queueIndex = this.queue.indexOf(resource);
        this.queue.splice(queueIndex, 1);
      });
  }

  private async processQueue() {
    const next = this.queue.slice(0, 5);
    const promises = next.map((resource) => this.addPermission(resource));

    console.log(`Processing ${promises.length} more resources. ${this.queue.length} left.`);

    await Promise.all(promises);

    if (this.queue.length > 0) {
      await this.processQueue();
    }
  }

  public execute() {
    this.getResources()
      .then((resources: DomainResource[]) => {
        this.queue = resources;

        console.log(`Queueing ${resources.length} resources to modify permissions`);
        return this.processQueue();
      })
      .then(() => {
        console.log('Done adding permissions to resources');
        process.exit(0);
      })
      .catch((err) => {
        this.printError(err);
        process.exit(1);
      });
  }
}
