import { BaseTools } from './baseTools';
import { IAudit, IConformance, IExample, IGroup, IProject, IUser } from '../../../server/src/db/models';
import { IAuditEvent, IContactPoint, IDomainResource, IImplementationGuide, IPractitioner } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {MongoClient} from 'mongodb/lib';
import {Db} from 'mongodb';
import { getHumanNamesDisplay } from '../../../../libs/tof-lib/src/lib/helper';
import { R4AuditEvent, Group, ImplementationGuide as R4ImplementationGuide } from '../../../../libs/tof-lib/src/lib/r4/fhir';
import { ImplementationGuide as STU3ImplementationGuide, AuditEvent as STU3AuditEvent } from '../../../../libs/tof-lib/src/lib/stu3/fhir';

interface MigrateDbOptions {
  server: string;
  fhirVersion: 'stu3'|'r4';
  dbServer: string;
  dbName: string;
  idPrefix: string;
}

const conformanceResourceTypes = [
  'CapabilityStatement',
  'StructureDefinition',
  'ImplementationGuide',
  'SearchParameter',
  'MessageDefinition',
  'OperationDefinition',
  'CompartmentDefinition',
  'StructureMap',
  'GraphDefinition',
  'ExampleScenario',
  'Questionnaire'
];

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
    await this.migrateResources();
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

  /**
   * Find implementation guides that reference this resource
   * @param resourceReference
   * @private
   */
  private findImplementationGuides(resourceReference: string) {
    return this.projects.filter(p => {
      if (this.options.fhirVersion === 'r4') {
        const r4ImplementationGuide = p.ig as R4ImplementationGuide;

        if (r4ImplementationGuide.definition && r4ImplementationGuide.definition.resource) {
          const foundRes = r4ImplementationGuide.definition.resource
            .find(r => r.reference &&
              r.reference.reference &&
              r.reference.reference === resourceReference);
          return !!foundRes;
        }
      } else if (this.options.fhirVersion === 'stu3') {
        const stu3ImplementationGuide = ig as STU3ImplementationGuide;

        const foundPackages = (stu3ImplementationGuide.package || []).filter(p => {
          return p.resource.find(pr => pr.sourceReference && pr.sourceReference.reference && pr.sourceReference.reference === resourceReference);
        });

        return foundPackages.length > 0;
      }
    });
  }

  private getExamples(projects: IProject[], resourceReference: string) {
    const examples = [];

    projects.forEach(p => {
      if (this.options.fhirVersion === 'r4') {
        const r4ImplementationGuide = p.ig as R4ImplementationGuide;

        if (r4ImplementationGuide.definition && r4ImplementationGuide.definition.resource) {
          const foundRes = r4ImplementationGuide.definition.resource
            .find(r => r.reference &&
              r.reference.reference &&
              r.reference.reference === resourceReference);

          if (foundRes.exampleBoolean) {
            examples.push(true);
          } else if (foundRes.exampleCanonical) {
            examples.push(foundRes.exampleCanonical);
          }
        }
      } else if (this.options.fhirVersion === 'stu3') {
        const stu3ImplementationGuide = ig as STU3ImplementationGuide;

        const foundPackages = (stu3ImplementationGuide.package || []).filter(p => {
          const foundRes = p.resource
            .find(pr => pr.sourceReference &&
              pr.sourceReference.reference &&
              pr.sourceReference.reference === resourceReference);

          if (foundRes.example) {
            examples.push(true);
          } else if (foundRes.exampleFor && foundRes.exampleFor.reference) {
            examples.push(foundRes.exampleFor.reference);
          }
        });

        return foundPackages.length > 0;
      }
    });

    return examples;
  }

  private convertAuditAction(action: string) {
    switch (action) {
      case 'R':
        return 'read';
      case 'C':
        return 'create';
      case 'U':
        return 'update';
      case 'D':
        return 'delete';
      default:
        throw new Error(`Unexpected audit action ${action}`);
    }
  }

  private async migrateResourceType(resources: IDomainResource[]) {

  }

  private async migrateResources() {
    const resourceTypes = await this.getAllResourceTypes(this.options.server);

    for (const resourceType of resourceTypes) {
      const allResources = await this.getAllResourcesByType(this.options.server, [resourceType]);

      if (!allResources.length) continue;

      for (const resource of allResources) {
        if (resource.resourceType === 'ImplementationGuide') return;
        if (resource.resourceType === 'Practitioner' && this.users.find(u => u._id === resource.id)) return;
        if (resource.resourceType === 'Group' && this.groups.find(g => g._id === resource.id)) return;

        const resourceReference = `${resource.resourceType}/${resource.id}`;
        const projects = this.findImplementationGuides(resourceReference);
        const examples = this.getExamples(projects, resourceReference);

        if (conformanceResourceTypes.indexOf(resource.resourceType) >= 0) {
          const conformance: IConformance = {
            _id: this.options.idPrefix + '_' + resource.id,
            resource: resource,
            projectId: projects.map(ig => ig._id)
          };

          console.log(`Inserting/updating conformance resource ${resource.resourceType}/${resource.id}`);
          await this.db.collection('conformance').updateOne({ _id: conformance._id }, { $set: conformance }, { upsert: true });
        } else if (resource.resourceType === 'AuditEvent' && examples.length === 0) {
          let audit: IAudit;

          if (this.options.fhirVersion === 'r4') {
            const r4AuditEvent = resource as R4AuditEvent;
            audit = {
              _id: this.options.idPrefix + '_' + resource.id,
              timestamp: new Date(r4AuditEvent.recorded),
              who: r4AuditEvent.agent[0].who.reference.substring('Practitioner/'.length),
              action: this.convertAuditAction(r4AuditEvent.action),
              what: r4AuditEvent.entity[0].what.reference
            };
          } else if (this.options.fhirVersion === 'stu3') {
            const stu3AuditEvent = resource as STU3AuditEvent;
            audit = {
              _id: this.options.idPrefix + '_' + resource.id,
              timestamp: new Date(stu3AuditEvent.recorded),
              who: stu3AuditEvent.agent[0].reference.reference.substring('Practitioner/'.length),
              action: this.convertAuditAction(stu3AuditEvent.action),
              what: stu3AuditEvent.entity[0].reference.reference
            };
          } else {
            throw new Error(`Unexpected fhir version ${this.options.fhirVersion}`);
          }

          console.log(`Inserting/updating audit ${resource.id}`);
          await this.db.collection('audit').updateOne({ _id: audit._id }, { $set: audit }, { upsert: true });
        } else {
          const example: IExample = {
            _id: this.options.idPrefix + '_' + resource.id,
            content: resource,
            projectId: projects.map(ig => ig._id)
          };

          examples.forEach(e => {
            if (e !== true) {
              example.exampleFor = e;
            }
          });

          console.log(`Inserting/updating example ${resource.resourceType}/${resource.id}`);
          await this.db.collection('example').updateOne({ _id: example._id }, { $set: example }, { upsert: true });
        }
      }
    }
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
            _id: this.options.idPrefix + '_' + r.id,
            name: r.name,
            managingUserId: r.managingEntity.reference.substring(r.managingEntity.reference.lastIndexOf('/') + 1),
            member: r.member.map(m => {
              return m.entity.reference.substring(m.entity.reference.lastIndexOf('/') + 1)
            })
          };
        });
    } else if (this.options.fhirVersion === 'stu3') {
      throw new Error('STU3 groups not yet supported');   // TODO
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
        _id: this.options.idPrefix + '_' + r.id,
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
        _id: this.options.idPrefix + '_' + r.id,
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
