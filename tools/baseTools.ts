import * as request from 'request';
import * as _ from 'underscore';
import {Fhir} from '../server/controllers/models';
import CapabilityStatement = Fhir.CapabilityStatement;
import DomainResource = Fhir.DomainResource;
import Bundle = Fhir.Bundle;

export class BaseTools {
  protected getConformance(server: string): Promise<CapabilityStatement> {
    return new Promise((resolve, reject) => {
      const conformanceUrl = server + (server.endsWith('/') ? '' : '/') + 'metadata';
      request({url: conformanceUrl, json: true}, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }

  private getNextResources(url: string, resourceType: string): Promise<DomainResource[]> {
    console.log(`Getting next page of resources of type ${resourceType}`);

    return new Promise((resolve, reject) => {
      request({url: url, json: true}, (err, response, body: Bundle) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`Found ${body.total} more resources for ${resourceType}`);

        let resources = (body.entry || []).map((entry) => entry.resource);
        const foundNextLink = (body.link || []).find((link) => link.relation === 'next');

        if (foundNextLink) {
          this.getNextResources(foundNextLink.url, resourceType)
            .then((nextResources) => {
              resources = resources.concat(nextResources);
              resolve(resources);
            })
            .catch((nextErr) => reject(nextErr));
        } else {
          resolve(resources);
        }
      });
    });
  }

  private getAllResourcesByType(server: string, resourceTypes: string[]): Promise<DomainResource[]> {
    return new Promise((resolve, reject) => {
      const nextResourceType = resourceTypes.pop();
      const url = server + (server.endsWith('/') ? '' : '/') + nextResourceType;

      console.log(`Getting all resources of type ${nextResourceType}`);

      this.getNextResources(url, nextResourceType)
        .then((resources) => {
          if (resourceTypes.length > 0) {
            this.getAllResourcesByType(server, resourceTypes)
              .then((nextResources) => {
                resources = resources.concat(nextResources);
                resolve(resources);
              })
              .catch((err) => reject(err));
          } else {
            resolve(resources);
          }
        })
        .catch((err) => reject(err));
    });
  }

  protected getAllResources(server: string): Promise<DomainResource[]> {
    return new Promise((resolve, reject) => {
      this.getConformance(server)
        .then((conformance) => {
          let promises = [];
          const resourceTypes = [];

          (conformance.rest || []).forEach((rest) => {
            (rest.resource || []).forEach((resource) => resourceTypes.push(resource.type));
          });

          return this.getAllResourcesByType(server, resourceTypes);
        })
        .then((allResources) => allResources)
        .catch((err) => reject(err));
    });
  }

  protected saveResource(server: string, resource: DomainResource) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
