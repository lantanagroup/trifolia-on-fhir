import {resolve} from 'path';
import * as fs from 'fs';
import {readdirSync, statSync} from 'fs';

export interface RemoveExtrasOptions {
  directory: string;
}

export class RemoveExtras {
  private readonly options: RemoveExtrasOptions;

  constructor(options: RemoveExtrasOptions) {
    this.options = options;
  }

  private getFiles(dir) {
    const subdirs = readdirSync(dir);
    const files = subdirs.map((subdir) => {
      const res = resolve(dir, subdir);
      return (statSync(res)).isDirectory() ? this.getFiles(res) : res;
    });
    return Array.prototype.concat(...files);
  }

  private cleanResource(resource) {
    if (!resource) {
      return;
    }

    console.log(`Found resource ${resource.resourceType} with url '${resource.url}`);

    delete resource.extension;
    delete resource.meta;
    delete resource.text;
    delete resource.publisher;
    delete resource.differential;
    delete resource.experimental;
    delete resource.contact;
    delete resource.fhirVersion;

    if (resource.resourceType === 'StructureDefinition') {
      delete resource.mapping;
      delete resource._baseDefinition;

      for (let i = 0; i < resource.snapshot.element.length; i++) {
        const element = resource.snapshot.element[i];

        delete element.comment;
        delete element.constraint;
        delete element.mapping;
        delete element.alias;
        delete element.extension;
        delete element.base;

        if (element.binding) {
          delete element.binding.extension;
        }
      }
    } else if (resource.resourceType === 'CodeSystem') {
      delete resource.copyright;
      delete resource.caseSensitive;
      delete resource.versionNeeded;
      delete resource.status;
      delete resource.jurisdiction;
      delete resource.date;
      delete resource.description;

      if (resource.concept) {
        for (let i = 0; i < resource.concept.length; i++) {
          delete resource.concept[i].definition;
        }
      }
    } else if (resource.resourceType === 'ValueSet') {
      delete resource.copyright;
      delete resource.description;
    }
  }

  public async execute() {
    const files = await this.getFiles(this.options.directory);

    files
      .filter((filePath) => filePath.endsWith('.json'))
      .forEach((filePath) => {
        let fileContent = fs.readFileSync(filePath).toString();
        const resource = JSON.parse(fileContent);

        if (resource.resourceType === 'StructureDefinition' && resource.type === 'Extension' && resource.url.startsWith('https://trifolia')) {
          return;
        }

        console.log(`Processing ${filePath}`);

        if (resource.resourceType === 'Bundle') {
          for (let i = resource.entry.length - 1; i >= 0; i--) {
            const entry = resource.entry[i];

            if (['CapabilityStatement', 'CompartmentDefinition', 'OperationDefinition'].indexOf(entry.resource.resourceType) >= 0) {
              console.log(`Removing ${entry.resource.resourceType}/${entry.resource.id}`);
              resource.entry.splice(i, 1);
            } else {
              this.cleanResource(entry.resource);
            }
          }
        } else if (resource.resourceType) {
          this.cleanResource(resource);
        }

        // save
        fileContent = JSON.stringify(resource);
        fs.writeFileSync(filePath, fileContent);
      });

    console.log('Done');
  }
}
