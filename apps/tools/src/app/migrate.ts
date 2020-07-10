import {identifyRelease} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {BaseTools} from './baseTools';
import {Versions} from 'fhir/fhir';
import {Binary as R4Binary, ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {Binary as STU3Binary, ImplementationGuide as STU3ImplementationGuide, PageComponent} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {IBundle, IDomainResource, IImplementationGuide} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import * as fs from 'fs';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';

interface MigrateOptions {
  server: string;
  output: string;
  backup?: string;
}

export class Migrate extends BaseTools {
  private options: MigrateOptions;
  private fhirVersion: Versions;
  private changedResources: IDomainResource[] = [];
  private backupBundle: IBundle;

  constructor(options: MigrateOptions) {
    super();
    this.options = options;
  }

  public async init() {
    if (!this.options.server) {
      throw new Error('server must be specified!');
    }

    const caps = await this.getConformance(this.options.server);
    this.fhirVersion = identifyRelease(caps.fhirVersion);
  }

  public async migrate() {
    if (!this.fhirVersion) throw new Error('init() has not been called or the server doesn\'t supported /metadata');
    const igs = await this.getAllResources(this.options.server, 'ImplementationGuide');

    if (this.options.backup) {
      this.backupBundle = {
        resourceType: 'Bundle',
        type: 'transaction',
        entry: igs.map(ig => {
          let cleanIg: IImplementationGuide;

          if (this.fhirVersion === Versions.R4) {
            cleanIg = new R4ImplementationGuide(ig);
          } else if (this.fhirVersion === Versions.STU3) {
            cleanIg = new STU3ImplementationGuide(ig);
          }

          delete cleanIg.meta;

          return {
            request: {
              method: 'PUT',
              url: `ImplementationGuide/${ig.id}`
            },
            resource: cleanIg
          }
        })
      };
    }

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

      console.log(`Migrated ${this.changedResources.length} IGs, and storing them in a transaction bundle in ${this.options.output}`);
      fs.writeFileSync(this.options.output, JSON.stringify(bundle));
      console.log(`Writing ${this.changedResources.length} resources to transaction bundle in ${this.options.output}`);
    }

    if (this.options.backup) {
      this.backupBundle.entry = this.backupBundle.entry.filter(e => {
        return !!this.changedResources.find(cr => cr.id === e.resource.id);
      });

      console.log(`Creating a backup of the IGs at ${this.options.backup}`);
      fs.writeFileSync(this.options.backup, JSON.stringify(this.backupBundle, null, '\t'));
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
        page.fileName = page.title.toLowerCase().replace(/\s/g, '_') + page.getExtension();
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

            if (foundBinary.contentType === 'text/markdown' && foundBinary.data) {
              page.contentMarkdown = Buffer.from(foundBinary.data, 'base64').toString('ascii');
              changed = true;
            }

            const containedIndex = ig.contained.indexOf(foundContained);
            ig.contained.splice(containedIndex, 1);
            if (!ig.contained.length) delete ig.contained;
            delete page.nameReference;
          }
        }
      }

      if (!page.reuseDescription && page.fileName === 'index.html' && !page.contentMarkdown) {
        page.reuseDescription = true;
        changed = true;
      }

      if (!page.nameReference && !page.nameUrl && page.fileName) {
        page.nameUrl = page.fileName;
        changed = true;
      }

      if (page.fileName && !page.fileName.endsWith(page.getExtension())) {
        page.fileName = page.fileName.substring(0, page.fileName.lastIndexOf('.')) + page.getExtension();
        changed = true;
      }

      if (page.nameUrl && page.nameUrl.indexOf('.') > 0 && !page.nameUrl.endsWith('.html')) {
        page.nameUrl = page.nameUrl.substring(0, page.nameUrl.lastIndexOf('.')) + '.html';
        changed = true;
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

      if (page.source === 'index.html') {
        page.source = 'index.md';
        changed = true;
      }

      if (page.source === 'index.md' && !page.contentMarkdown) {
        page.reuseDescription = true;
        changed = true;
      }

      if (page.format === 'markdown' && page.source && page.source.indexOf('.') && !page.source.endsWith('.md')) {
        page.source = page.source.substring(0, page.source.lastIndexOf('.')) + '.md';
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
