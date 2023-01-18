import { BaseTools } from './baseTools';
import { IGroup, IProject, IUser } from '../../../server/src/db/models';
import { IContactPoint, IImplementationGuide, IPractitioner } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {MongoClient} from 'mongodb/lib';
import {Db} from 'mongodb';
import { getHumanNamesDisplay } from '../../../../libs/tof-lib/src/lib/helper';
import { Group } from '../../../../libs/tof-lib/src/lib/r4/fhir';

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
    await this.migrateGroups();
    await this.migrateImplementationGuides();
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

  private async migrateGroups() {
    const resources = await this.getAllResourcesByType(this.options.server, ['Group']);

    if (this.options.fhirVersion === 'r4') {
      this.groups = resources
        .filter((r: Group) => {
          const userId = r.managingEntity.reference.substring(r.managingEntity.reference.lastIndexOf('/') + 1);
          const user = this.users.find(u => u._id === userId);
          return !!user;
        })
        .map((r: Group) => {
          return <IGroup> {
            _id: r.id,
            name: r.name,
            managingUserId: r.managingEntity.reference.substring(r.managingEntity.reference.lastIndexOf('/') + 1),
            member: r.member.map(m => {
              return m.entity.reference.substring(m.entity.reference.lastIndexOf('/') + 1)
            })
          };
        });
    } else if (this.options.fhirVersion === 'stu3') {
      throw new Error('STU3 groups not yet supported');
    }

    console.log(`Storing ${this.groups.length} groups in the database`);

    for (const group of this.groups) {
      await this.db.collection('group').updateOne({ _id: group._id }, { $set: group }, { upsert: true });
    }
  }

  private async migrateUsers() {
    const resources = await this.getAllResourcesByType(this.options.server, ['Practitioner']);
    const userResources = resources.filter((r: IPractitioner) => {
      return !!(r.identifier || []).find(i => i.system === 'https://trifolia-fhir.lantanagroup.com' || i.system === 'https://auth0.com');
    });

    this.users = userResources.map((r: IPractitioner) => {
      const identifier = r.identifier.find(i => i.system === 'https://trifolia-fhir.lantanagroup.com' || i.system === 'https://auth0.com');

      return <IUser> {
        _id: r.id,
        name: getHumanNamesDisplay(r.name),
        authId: [identifier.value],
        phone: this.getPhone(r.telecom),
        email: this.getEmail(r.telecom)
      };
    });

    console.log(`Storing ${this.users.length} users in the database`);

    for (const user of this.users) {
      await this.db.collection('user').updateOne({ _id: user._id }, { $set: user }, { upsert: true });
    }
  }

  private async migrateImplementationGuides() {
    const resources = await this.getAllResourcesByType(this.options.server, ['ImplementationGuide']);

    this.projects = resources.map((r: IImplementationGuide) => {
      return <IProject> {
        _id: r.id,
        name: r.name,
        fhirVersion: this.options.fhirVersion,
        permissions: [],
        ig: r
      };
    });

    console.log(`Storing ${this.projects.length} projects in the database`);

    for (const project of this.projects) {
      await this.db.collection('project').updateOne({ _id: project._id }, { $set: project }, { upsert: true });
    }
  }
}
