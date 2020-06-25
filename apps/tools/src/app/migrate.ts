import {identifyRelease} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {BaseTools} from './baseTools';
import {Versions} from 'fhir/fhir';
import {Binary as R4Binary, ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {Binary as STU3Binary} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as STU3ImplementationGuide, PageComponent} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {IDomainResource} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import * as fs from 'fs';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';

interface MigrateOptions {
  server: string;
  output: string;
}

export class Migrate extends BaseTools {
  private options: MigrateOptions;
  private fhirVersion: Versions;
  private changedResources: IDomainResource[] = [];

  constructor(options: MigrateOptions) {
    super();
    this.options = options;
  }

  public async init() {
    const caps = await this.getConformance(this.options.server);
    this.fhirVersion = identifyRelease(caps.fhirVersion);
  }

  public async migrate() {
    if (!this.fhirVersion) throw new Error('init() has not been called or the server doesn\'t supported /metadata');
    const igs = await this.getAllResources(this.options.server, 'ImplementationGuide');

    switch (this.fhirVersion) {
      case Versions.R4:
        igs.forEach((ig: any) => this.migrateR4ImplementationGuide(new R4ImplementationGuide(ig)));
        break;
      case Versions.STU3:
        igs.forEach((ig: any) => this.migrateSTU3ImplementationGuide(new STU3ImplementationGuide(ig)));
    }

    if (!this.changedResources.length) {
      console.log('No resources to migrate/change.');
    } else {
      const bundle = {
        resourceType: 'Bundle',
        type: 'transaction',
        entry: this.changedResources.map(r => {
          return {
            request: {
              method: 'PUT',
              url: `${r.resourceType}/${r.id}`
            },
            resource: r
          };
        })
      };

      fs.writeFileSync(this.options.output, JSON.stringify(bundle));
      console.log(`Writing ${this.changedResources.length} resources to transaction bundle in ${this.options.output}`);
    }
  }

  private migrateR4ImplementationGuide(ig: R4ImplementationGuide) {
    if (!ig.definition) return;
    let changed = false;

    const migratePage = (page: ImplementationGuidePageComponent) => {
      if (!page) return;

      if (!page.fileName && page.nameUrl) {
        page.fileName = page.nameUrl;
        changed = true;
      }

      if (!page.fileName && page.title) {
        page.fileName = page.title.toLowerCase().replace(/\s/g, '_') + '.html';
        changed = true;
      }

      if (page.nameReference && page.nameReference.reference && page.nameReference.reference.startsWith('#')) {
        const foundContained = (ig.contained || []).find(c => c.id === page.nameReference.reference.substring(1));

        if (foundContained) {
          if (foundContained.resourceType === 'DomainResource') {
            delete page.nameReference;
            const containedIndex = ig.contained.indexOf(foundContained);
            ig.contained.splice(containedIndex, 1);
            if (!ig.contained.length) delete ig.contained;
            delete page.nameReference;
            changed = true;
          } else if (foundContained.resourceType === 'Binary') {
            const foundBinary = <R4Binary>foundContained;

            if (foundBinary.contentType === 'text/markdown') {
              if (foundBinary.data) {
                page.contentMarkdown = Buffer.from(foundBinary.data, 'base64').toString('ascii');
              }

              const containedIndex = ig.contained.indexOf(foundContained);
              ig.contained.splice(containedIndex, 1);
              if (!ig.contained.length) delete ig.contained;
              delete page.nameReference;
              changed = true;
            }
          }
        }
      }

      if (page.fileName === 'index.md') {
        page.fileName = 'index.html';
        changed = true;
      }

      if (!page.reuseDescription && page.fileName === 'index.html' && !page.contentMarkdown) {
        page.reuseDescription = true;
        changed = true;
      }

      if (!page.nameReference && !page.nameUrl && page.fileName) {
        page.nameUrl = page.fileName;
      }

      (page.page || []).forEach(childPage => migratePage(childPage));
    };

    migratePage(ig.definition.page);

    if (changed) {
      delete ig.meta;
      this.changedResources.push(ig);
    }
  }

  private migrateSTU3ImplementationGuide(ig: STU3ImplementationGuide) {
    if (!ig.page) return;
    let changed = false;

    const migratePage = (page: PageComponent) => {
      const contentExt = (page.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-content']);

      if (page.source === 'index.md') {
        page.source = 'index.html';
        changed = true;
      }

      if (page.source === 'index.html' && !page.contentMarkdown) {
        page.reuseDescription = true;
        changed = true;
      }

      if (contentExt && contentExt.valueReference && contentExt.valueReference.reference && contentExt.valueReference.reference.startsWith('#')) {
        const foundContained = (ig.contained || []).find(c => c.id === contentExt.valueReference.reference.substring(1));

        const deleteContentExt = () => {
          const contentExtIndex = page.extension.indexOf(contentExt);
          page.extension.splice(contentExtIndex, 1);
          if (!page.extension.length) delete page.extension;
        }

        if (foundContained) {
          if (foundContained.resourceType === 'DomainResource') {
            const containedIndex = ig.contained.indexOf(foundContained);
            ig.contained.splice(containedIndex, 1);
            if (!ig.contained.length) delete ig.contained;
            deleteContentExt();
            changed = true;
          } else if (foundContained.resourceType === 'Binary') {
            const foundBinary = <STU3Binary>foundContained;

            deleteContentExt();

            if (foundBinary.content) {
              page.contentMarkdown = Buffer.from(foundBinary.content, 'base64').toString('ascii');
            }

            const containedIndex = ig.contained.indexOf(foundContained);
            ig.contained.splice(containedIndex, 1);
            if (!ig.contained.length) delete ig.contained;
            changed = true;
          }
        }
      }

      (page.page || []).forEach(p => migratePage(p));
    };

    migratePage(ig.page);

    if (changed) {
      delete ig.meta;
      this.changedResources.push(ig);
    }
  }
}
