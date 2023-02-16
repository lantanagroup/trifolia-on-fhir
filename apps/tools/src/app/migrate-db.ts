import {BaseTools} from './baseTools';
import {IAudit, IConformance, IExample, IGroup, IHistory, IProject, IProjectPermission, IProjectResource, IUser} from '@trifolia-fhir/models';
import {IAuditEvent, IContactPoint, IDomainResource, IImplementationGuide, IPractitioner} from '@trifolia-fhir/tof-lib/fhirInterfaces';
import {Db, MongoClient} from 'mongodb';
import {getHumanNamesDisplay} from '@trifolia-fhir/tof-lib/helper';
import {AuditEvent as R4AuditEvent, Coding, Group as R4Group, ImplementationGuide as R4ImplementationGuide} from '@trifolia-fhir/r4';
import {AuditEvent as STU3AuditEvent, Group as STU3Group, ImplementationGuide as STU3ImplementationGuide} from '@trifolia-fhir/stu3';
import * as fs from 'fs';
import {Connection, createConnection} from 'mysql';
import {ungzip} from 'node-gzip';

interface MigrateDbOptions {
  mysqlHost: string;
  mysqlDb: string;
  mysqlUser: string;
  mysqlPass: string;
  fhirVersion: 'stu3'|'r4';
  dbServer: string;
  dbName: string;
  migratedFromLabel: string;
  out?: string;
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
  'Questionnaire',
  'ValueSet',
  'CodeSystem'
];

interface GroupedResource {
  head: IDomainResource;
  projectResource?: IProjectResource;
  history: IDomainResource[];
}

export class MigrateDb extends BaseTools {
  private options: MigrateDbOptions;
  private client: MongoClient;
  private db: Db;
  private mysqlCon: Connection;

  private groupedResources: { [reference: string]: GroupedResource } = {};
  private users: IUser[];
  private groups: IGroup[];
  private projects: IProject[];

  constructor(options: MigrateDbOptions) {
    super();
    this.options = options;
    this.client = new MongoClient(options.dbServer);
    this.db = this.client.db(options.dbName);
  }

  private async connectMysql() {
    this.mysqlCon = createConnection({
      host: this.options.mysqlHost,
      user: this.options.mysqlUser,
      password: this.options.mysqlPass,
      database: this.options.mysqlDb
    });

    return new Promise<void>((resolve, reject) => {
      this.mysqlCon.connect((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private reportResults(results: any) {
    if (results.modifiedCount) {
      this.log(`Updated ${results.modifiedCount}`);
    } else if (results.upsertedCount) {
      this.log(`Inserted ${results.upsertedCount}`);
    }
  }

  private async queryMysql(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.mysqlCon.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private async getJSON(val: Buffer): Promise<any> {
    let ungzipped;
    try {
      ungzipped = await ungzip(val);
    } catch (ex) {
      throw ex;
    }

    const valString = ungzipped.toString();

    try {
      return JSON.parse(valString);
    } catch (ex) {
      throw ex;
    }
  }

  private async getAndGroup(): Promise<any> {
    this.log('Parsing input data');

    await this.connectMysql();

    this.log(`Retrieving resources from the database`);
    const resResults: any[] = await this.queryMysql('select res_id, res_ver, res_type, forced_id from hfj_resource r join hfj_forced_id i on i.resource_pid = r.res_id where res_deleted_at is null');

    this.log(`Retrieving history for ${resResults.length} resources from the database`);

    const allHistory = await this.queryMysql(`select res_id, res_ver, res_text, res_updated from hfj_res_ver order by res_id, res_ver`);
    this.log(`Done retrieve ${allHistory.length} history items`);

    for (let i = 0; i < resResults.length; i++) {
      const resResult = resResults[i];
      const resId = resResult['res_id'];
      const resVer = resResult['res_ver'];
      const resType = resResult['res_type'];
      const actualId = resResult['forced_id'] || resId;

      if (i % 100 === 0) {
        this.log(`Grouping ${i+1} / ${resResults.length}`);
      }

      try {
        const headResult = allHistory.find(al => al.res_id === resId && al.res_ver === resVer);
        const history = allHistory.filter(al => al.res_id === resId && al.res_ver !== resVer);
        const head = await this.getJSON(headResult.res_text);
        head.id = actualId;
        head.meta = {
          lastUpdated: headResult['res_updated'].toISOString(),
          versionId: headResult['res_ver']
        };

        this.groupedResources[resType + '/' + actualId] = {
          head: head,
          history: []
        };

        for (let j = 0; j < history.length; j++) {
          const hist = history[j];
          if (!hist.res_text) {
            continue;
          }

          const histObj = await this.getJSON(hist.res_text);
          histObj.id = actualId;
          histObj.meta = {
            lastUpdated: hist['res_updated'].toISOString(),
            versionId: hist['res_ver']
          };
          this.groupedResources[resType + '/' + actualId].history.push(histObj);
        }
      } catch (ex) {
        this.log(`ERROR while grouping resource ${resType}/${resId}: ${ex}`);
      }
    }

    this.log('Done retrieving and grouping resources from database');
  }

  public getGroupedResources(resourceType: string) {
    const groupedResourceKeys = Object.keys(this.groupedResources);
    return groupedResourceKeys
      .filter(key => key.startsWith(resourceType + '/'))
      .map(key => this.groupedResources[key]);
  }

  public async migrate() {
    await this.getAndGroup();

    if (this.options.out && fs.existsSync(this.options.out)) {
      fs.unlinkSync(this.options.out);
    }

    await this.migrateUsers();
    await this.migrateGroups();
    await this.migrateProjects();
    await this.migrateResources();

    this.log(`Done`);
    process.exit(0);
  }

  private async migrateResources() {
    const groupedResourceKeys = Object.keys(this.groupedResources);

    for (const groupedResourceKey of groupedResourceKeys) {
      const groupedResource = this.groupedResources[groupedResourceKey];
      const resource = groupedResource.head;

      if (groupedResource.projectResource) continue;
      if (resource.resourceType === 'ImplementationGuide' && this.projects.find(p => p.ig.id === resource.id)) continue;

      // Remove security tags from the resources because those were only needed in the FHIR server data layer
      if (resource.meta) {
        delete resource.meta.security;
      }

      const resourceReference = `${resource.resourceType}/${resource.id}`;
      const projects = this.findImplementationGuides(resourceReference);
      const examples = this.getExamples(projects, resourceReference);
      let type: 'conformance'|'example';

      if (conformanceResourceTypes.indexOf(resource.resourceType) >= 0) {
        type = 'conformance';
        await this.migrateConformance(groupedResource);
      } else if (resource.resourceType === 'AuditEvent' && examples.length === 0) {
        await this.migrateAudit(resource as any);
      } else {
        type = 'example';
        await this.migrateExample(groupedResource);
      }

      for (const resourceHistory of groupedResource.history) {
        const meta = resourceHistory.meta;
        delete resourceHistory.meta;

        const history: IHistory = {
          content: resourceHistory,
          targetId: groupedResource.projectResource._id,
          timestamp: new Date(meta.lastUpdated),
          type: type,
          versionId: parseInt(meta.versionId)
        };

        this.log(`Inserting/updating history version ${meta.versionId} for ${resource.resourceType}/${resource.id}`);
        const results = await this.db.collection('history').updateOne({ migratedFrom: this.options.migratedFromLabel, 'content.id': resourceHistory.id, versionId: history.versionId }, { $set: history }, { upsert: true });
        this.reportResults(results);
      }
    }
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
        const stu3ImplementationGuide = p.ig as STU3ImplementationGuide;

        const foundPackages = (stu3ImplementationGuide.package || []).filter(pack => {
          return pack.resource.find(pr => pr.sourceReference && pr.sourceReference.reference && pr.sourceReference.reference === resourceReference);
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
        const stu3ImplementationGuide = p.ig as STU3ImplementationGuide;

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

  private log(message: string) {
    const msg = `${new Date().toISOString()} - ${message}`;

    if (this.options.out) {
      fs.appendFileSync(this.options.out, msg + '\n');
    }

    console.log(msg);
  }

  private async migrateConformance(groupedResource: GroupedResource) {
    const resource = groupedResource.head;
    const resourceReference = `${resource.resourceType}/${resource.id}`;
    const projects = this.findImplementationGuides(resourceReference);

    const conformance: IConformance = {
      migratedFrom: this.options.migratedFromLabel,
      fhirVersion: this.options.fhirVersion,
      resource: resource,
      projectId: projects.map(ig => ig._id)
    };
    groupedResource.projectResource = conformance;

    this.log(`Inserting/updating conformance resource ${resource.resourceType}/${resource.id}`);
    const results = await this.db.collection('conformance').updateOne({ migratedFrom: conformance.migratedFrom, 'resource.id': conformance.resource.id }, { $set: conformance }, { upsert: true });
    this.reportResults(results);
  }

  private async migrateExample(groupedResource: GroupedResource) {
    const resource = groupedResource.head;
    const resourceReference = `${resource.resourceType}/${resource.id}`;
    const projects = this.findImplementationGuides(resourceReference);
    const examples = this.getExamples(projects, resourceReference);

    const example: IExample = {
      migratedFrom: this.options.migratedFromLabel,
      fhirVersion: this.options.fhirVersion,
      content: resource,
      projectId: projects.map(ig => ig._id)
    };
    groupedResource.projectResource = example;

    examples.forEach(e => {
      if (e !== true) {
        example.exampleFor = e;
      }
    });

    this.log(`Inserting/updating example ${resource.resourceType}/${resource.id}`);
    const results = await this.db.collection('example').updateOne({ migratedFrom: example.migratedFrom, 'content.id': example.content.id }, { $set: example }, { upsert: true });
    this.reportResults(results);
  }

  private async migrateAudit(auditEvent: IAuditEvent) {
    let audit: IAudit;

    if (this.options.fhirVersion === 'r4') {
      const r4AuditEvent = auditEvent as R4AuditEvent;
      audit = {
        _id: this.options.migratedFromLabel + '_' + auditEvent.id,
        timestamp: new Date(r4AuditEvent.recorded),
        who: r4AuditEvent.agent[0].who.reference.substring('Practitioner/'.length),
        action: this.convertAuditAction(r4AuditEvent.action),
        what: r4AuditEvent.entity[0].what.reference
      };
    } else if (this.options.fhirVersion === 'stu3') {
      const stu3AuditEvent = auditEvent as STU3AuditEvent;
      audit = {
        _id: this.options.migratedFromLabel + '_' + auditEvent.id,
        timestamp: new Date(stu3AuditEvent.recorded),
        who: stu3AuditEvent.agent[0].reference.reference.substring('Practitioner/'.length),
        action: this.convertAuditAction(stu3AuditEvent.action),
        what: stu3AuditEvent.entity[0].reference.reference
      };
    } else {
      throw new Error(`Unexpected fhir version ${this.options.fhirVersion}`);
    }

    this.log(`Inserting/updating audit ${auditEvent.id}`);
    const results = await this.db.collection('audit').updateOne({ _id: audit._id }, { $set: audit }, { upsert: true });
    this.reportResults(results);
  }

  private findUser(id: string) {
    const foundGroupedResource = this.groupedResources['Practitioner/' + id];
    if (!foundGroupedResource) {
      this.log(`ERROR - Did not find practitioner user with id ${id}`);
      return;
    }
    const practitioner = foundGroupedResource.head as IPractitioner;
    const identifier = (practitioner.identifier || []).find(i => i.system === 'https://trifolia-fhir.lantanagroup.com' || i.system === 'https://auth0.com');
    if (!identifier) {
      this.log(`ERROR - Did not find an identifier for practitioner user with id ${id}`);
      return;
    }

    const user = this.users.find(u => u.authId && u.authId.indexOf(identifier.value) >= 0);

    if (!user) {
      this.log(`ERROR - Did not find user with auth id ${identifier.value}`);
    }

    return user;
  }

  private async migrateGroups() {
    const resources = this.getGroupedResources('Group');

    if (this.options.fhirVersion === 'r4') {
      this.groups = resources
        .filter((gr) => {
          const r = gr.head as R4Group;
          if (!r.managingEntity) return false;
          const user = this.findUser(r.managingEntity.reference.substring('Practitioner/'.length));
          return !!user;
        })
        .map((gr) => {
          const r = gr.head as R4Group;
          const managingUser = this.findUser(r.managingEntity.reference.substring('Practitioner/'.length));

          return <IGroup> {
            name: r.name,
            migratedFrom: this.options.migratedFromLabel,
            managingUserId: managingUser._id,
            member: r.member
              .map(m => {
                const foundUser = this.findUser(m.entity.reference.substring('Practitioner/'.length));
                return foundUser._id
              })
              .filter(m => !!m)
          };
        });
    } else if (this.options.fhirVersion === 'stu3') {
      this.groups = resources
        .filter(gr => {
          const r = gr.head as STU3Group;
          const managers = r.member.filter(m => (m.extension || []).find(e => e.url === 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-group-manager' && e.valueBoolean === true));
          const managingUser = this.findUser(managers[0].entity.reference.substring('Practitioner/'.length));
          return !!managingUser;
        })
        .map(gr => {
          const r = gr.head as STU3Group;
          const managers = r.member.filter(m => (m.extension || []).find(e => e.url === 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-group-manager' && e.valueBoolean === true));
          const managingUser = this.findUser(managers[0].entity.reference.substring('Practitioner/'.length));

          return <IGroup> {
            name: r.name,
            migratedFrom: this.options.migratedFromLabel,
            managingUserId: managingUser._id,
            member: r.member
              .filter(m => !(m.extension || []).find(e => e.url === 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-group-manager' && e.valueBoolean === true))
              .map(m => {
                const user = this.findUser(m.entity.reference.substring('Practitioner/'.length));
                return user._id;
              })
              .filter(m => !!m)
          };
        });
    }

    this.log(`Storing ${this.groups.length} groups in the database`);

    for (const group of this.groups) {
      const results = await this.db.collection('group').updateOne({ migratedFrom: group.migratedFrom, name: group.name }, { $set: group }, { upsert: true });
      this.reportResults(results);
    }
  }

  private async migrateUsers() {
    this.users = (await this.db.collection<IUser>('user').find({}).toArray()).map(u => u);

    const resources = this.getGroupedResources('Practitioner');

    for (const gr of resources) {
      const r = gr.head as IPractitioner;

      const identifier = (r.identifier || []).find(i => i.system === 'https://trifolia-fhir.lantanagroup.com' || i.system === 'https://auth0.com');
      if (!identifier) continue;

      const foundUser = this.users.find(u => u.authId.indexOf(identifier.value) >= 0);
      if (foundUser) continue;

      const newUser: IUser = {
        name: getHumanNamesDisplay(r.name),
        authId: [identifier.value],
        phone: this.getPhone(r.telecom),
        email: this.getEmail(r.telecom)
      };

      this.log(`Adding user ${newUser.name} with authId ${newUser.authId[0]} to database`);
      await this.db.collection<IUser>('user').insertOne(newUser);
      this.users.push(newUser);
    }

    this.log(`Done migrating users`);
  }

  private async migrateProjects() {
    const resources = this.getGroupedResources('ImplementationGuide');

    this.projects = resources.map((groupedResource) => {
      const r = groupedResource.head as IImplementationGuide;
      const permissions: IProjectPermission[] = [];

      if (r.meta) {
        (r.meta.security || []).forEach((s: Coding) => {
          const codeSplit = s.code.split('^');
          const permission: IProjectPermission = {
            targetId: codeSplit.length === 2 ? undefined : codeSplit[1],
            type: codeSplit.length === 2 ? 'everyone' : codeSplit[0] as any,
            grant: 'read'
          };

          let found = permissions.find(p => p.type === permission.type && p.targetId === permission.targetId);

          if (!found) {
            found = permission;
            permissions.push(found);
          }

          const isWrite = (codeSplit.length === 2 && codeSplit[1] === 'write') ||
            (codeSplit.length === 3 && codeSplit[2] === 'write');

          if (isWrite && found.grant !== 'write') {
            found.grant = 'write';
          }
        });
        delete r.meta.security;
      }

      return <IProject> {
        name: r.name,
        migratedFrom: this.options.migratedFromLabel,
        fhirVersion: this.options.fhirVersion,
        permissions,
        ig: r
      };
    });

    this.log(`Storing ${this.projects.length} projects in the database`);

    for (const project of this.projects) {
      const results = await this.db.collection('project').updateOne({ migratedFrom: project.migratedFrom, 'ig.id': project.ig.id }, { $set: project }, { upsert: true });
      this.reportResults(results);
    }
  }
}
