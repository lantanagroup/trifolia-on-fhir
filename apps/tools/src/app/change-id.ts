import {Fhir, Versions} from 'fhir/fhir';
import {BaseTools} from './baseTools';
import {IBundle, IDomainResource} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

export class ChangeIdOptions {
  directory: string;
  resourceType: string;
  oldId: string;
  newId: string;
  version: 'stu3'|'r4' = 'r4';
  silent = false;
}

export class ChangeId extends BaseTools {
  private readonly options: ChangeIdOptions;
  private readonly fhir: Fhir;

  constructor(options: ChangeIdOptions) {
    super();
    this.options = options;

    if (!this.options.version) {
      this.options.version = 'r4';
    }

    this.fhir = this.getFhirInstance(this.convertVersion(this.options.version));
  }

  private convertVersion(version: 'stu3'|'r4') {
    switch (version) {
      case 'stu3':
        return Versions.R4;
      case 'r4':
        return Versions.STU3;
      default:
        throw new Error(`FHIR Version ${version} not yet supported by this tool!`);
    }
  }

  private processResource(resource: IDomainResource) {
    let changed = false;

    if (resource.resourceType === this.options.resourceType && resource.id === this.options.oldId) {
      resource.id = this.options.newId;
      changed = true;
    }

    const processObj = (obj: any) => {
      const keys = Object.keys(obj);

      for (const key of keys) {
        if (key === 'reference' && typeof obj[key] === 'string') {
          if (obj[key] === `${this.options.resourceType}/${this.options.oldId}`) {
            console.log(`Found reference to ${this.options.resourceType}/${this.options.oldId}. Updating...`)
            obj[key] = `${this.options.resourceType}/${this.options.newId}`;
            changed = true;
          }
        } else if (typeof obj[key] === 'object') {
          processObj(obj[key]);
        }
      }
    };

    processObj(resource);

    return changed;
  }

  private processFile(fileName: string) {
    if (!fileName.toLowerCase().endsWith('.xml') && !fileName.toLowerCase().endsWith('.json')) {
      return;
    }

    let fileContent = fs.readFileSync(fileName).toString();
    let changed = false;
    let resource: IDomainResource;

    console.log(`Checking ${fileName}`);

    if (fileName.toLowerCase().endsWith('.xml')) {
      resource = this.fhir.xmlToObj(fileContent);
    } else if (fileName.toLowerCase().endsWith('.json')) {
      resource = JSON.parse(fileContent);
    }

    if (resource.resourceType === 'Bundle') {
      const bundle = <IBundle> resource;
      (bundle.entry || []).forEach(e => {
        if (this.processResource(e.resource)) {
          changed = true;
        }
      });
    } else {
      changed = this.processResource(resource);
    }

    if (changed) {
      if (fileName.toLowerCase().endsWith('.xml')) {
        fileContent = this.fhir.objToXml(resource);
      } else {
        fileContent = JSON.stringify(resource, null, '\t');
      }

      console.log(`Made changes to ${fileName}. Saving the changes.`);
      fs.writeFileSync(fileName, fileContent);
    }
  }

  public execute() {
    const files = fs.readdirSync(this.options.directory);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const processFiles = () => {
      files
        .filter(fileName => fileName.toLowerCase().endsWith('.xml') || fileName.toLowerCase().endsWith('.json'))
        .forEach(fileName => this.processFile(path.join(this.options.directory, fileName)));

      process.exit(0);
    };

    if (!this.options.silent) {
      rl.question('This process will change the files in the directory specified.\r\nConsider backing up these files.\r\nAre you sure you want to continue?\r\nPress ENTER to continue, or CTRL-C to cancel.', () => {
        processFiles();
        rl.close();
      });
    } else {
      processFiles();
    }
  }
}
