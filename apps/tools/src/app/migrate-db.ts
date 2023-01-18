import { BaseTools } from './baseTools';
import { IGroup, IProject, IUser } from '../../../server/src/db/models';
import { IContactPoint, IImplementationGuide, IPractitioner } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {MongoClient} from 'mongodb/lib';
import {Db} from 'mongodb';
import { getHumanNameDisplay, getHumanNamesDisplay } from '../../../../libs/tof-lib/src/lib/helper';

interface MigrateDbOptions {
  server: string;
  fhirVersion: 'stu3'|'r4';
  dbServer: string;
  dbName: string;
}

export class MigrateDb extends BaseTools {
  private options: MigrateDbOptions;
  private client: MongoClient;
  private db: Db;

  private users: IUser[];
  private groups: IGroup[];
  private projects: IProject[];

  constructor(options: MigrateDbOptions) {
    super();
    this.options = options;
    this.client = new MongoClient(options.dbServer);
    this.db = this.client.db(options.dbName);
  }

  public async migrate() {
    await this.migrateUsers();
    //await this.migrateImplementationGuides();
  }

  private getPhone(telecoms: IContactPoint[]) {
    if (!telecoms) return;
    const found = telecoms.find(t => t.system === 'phone');
    return found ? found.value : undefined;
  }

  private getEmail(telecoms: IContactPoint[]) {
    if (!telecoms) return;
    const found = telecoms.find(t => t.system === 'email');
    return found ? found.value : undefined;
  }

  private async migrateUsers() {
    const resources = await this.getAllResourcesByType(this.options.server, ['Practitioner']);
    const userResources = resources.filter((r: IPractitioner) => {
      return !!(r.identifier || []).find(i => i.system === 'https://trifolia-fhir.lantanagroup.com' || i.system === 'https://auth0.com');
    });

    this.users = userResources.map((r: IPractitioner) => {
      const identifier = r.identifier.find(i => i.system === 'https://trifolia-fhir.lantanagroup.com' || i.system === 'https://auth0.com');

      return <IUser> {
        name: getHumanNamesDisplay(r.name),
        authId: [identifier.value],
        phone: this.getPhone(r.telecom),
        email: this.getEmail(r.telecom)
      };
    });

    await this.db.collection('user').insertMany(this.users);
  }

  private async migrateImplementationGuides() {
    const resources = await this.getAllResourcesByType(this.options.server, ['ImplementationGuide']);

    this.projects = resources.map((r: IImplementationGuide) => {
      return <IProject> {
        name: r.name,
        fhirVersion: this.options.fhirVersion,
        permissions: [],
        ig: r
      };
    });

    await this.db.collection('project').insertMany(this.projects);
  }
}
