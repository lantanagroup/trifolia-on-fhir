import { BaseTools } from './baseTools';
import { IAudit, IConformance, IGroup, IHistory, IProject, IPermission, IProjectResource, IUser, IProjectResourceReference } from '@trifolia-fhir/models';
import { Globals, IAuditEvent, IContactPoint, IDomainResource, IImplementationGuide, IPractitioner } from '@trifolia-fhir/tof-lib';
import { Db, MongoClient, ObjectId, ReturnDocument } from 'mongodb';
import { getHumanNamesDisplay } from '@trifolia-fhir/tof-lib';
import { AuditEvent as R4AuditEvent, Coding, Group as R4Group, ImplementationGuide as R4ImplementationGuide } from '@trifolia-fhir/r4';
import { AuditEvent as STU3AuditEvent, Group as STU3Group, ImplementationGuide as STU3ImplementationGuide } from '@trifolia-fhir/stu3';
import * as fs from 'fs';
import { Connection, createConnection } from 'mysql';
import { ungzip } from 'node-gzip';

interface MigrateDbOptions {
  mysqlHost: string;
  mysqlDb: string;
  mysqlUser: string;
  mysqlPass: string;
  fhirVersion: 'stu3' | 'r4';
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
  private implementationGuides: IConformance[];
  private userMap: { [key: string]: IUser; } = {};
  private groupMap: { [key: string]: IGroup; } = {};
  private resourceMap: { [key: string]: IConformance; } = {};

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
    } else if (results.lastErrorObject) {
      if (results.lastErrorObject.updatedExisting) {
        this.log(`Updated ${results.lastErrorObject.n}`);
      } else if (results.lastErrorObject.upserted) {
        this.log(`Inserted ${results.lastErrorObject.n}`);
      }
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

    const testColl = await this.db.collection('test');
    this.log(`Mongo collection: ${testColl.collectionName}`);
    await this.connectMysql();

    this.log(`Retrieving resources from the database`);
    const resResults: any[] = await this.queryMysql('select res_id, res_ver, res_type, forced_id from hfj_resource r left join hfj_forced_id i on i.resource_pid = r.res_id where res_deleted_at is null');

    this.log(`Retrieving history for ${resResults.length} resources from the database`);

    const allHistory = await this.queryMysql(`select res_id, res_ver, res_text, res_updated from hfj_res_ver order by res_id, res_ver`);
    this.log(`Retrieved ${allHistory.length} history items`);

    const allTags = await this.queryMysql(`select res_id, tag_code, tag_system, tag_type from hfj_res_tag rt join hfj_tag_def td on rt.tag_id=td.tag_id`);
    this.log(`Retrieved ${allTags.length} tags`);

    this.mysqlCon.destroy();

    for (let i = 0; i < resResults.length; i++) {
      const resResult = resResults[i];
      const resId = resResult['res_id'];
      const resVer = resResult['res_ver'];
      const resType = resResult['res_type'];
      const actualId = resResult['forced_id'] || resId;

      if (i % 100 === 0) {
        this.log(`Grouping ${i + 1} / ${resResults.length}`);
      }

      try {
        const headResult = allHistory.find(al => al.res_id === resId && al.res_ver === resVer);
        const history = allHistory.filter(al => al.res_id === resId && al.res_ver !== resVer);

        // tag type enum: https://github.com/hapifhir/hapi-fhir/blob/master/hapi-fhir-jpaserver-model/src/main/java/ca/uhn/fhir/jpa/model/entity/TagTypeEnum.java
        const security = allTags.filter(t => t.res_id === resId && t.tag_type === 2 && t.tag_system === Globals.securitySystem).map(s => { return { 'system': Globals.securitySystem, 'code': s.tag_code }; });
        const profile = allTags.filter(t => t.res_id === resId && t.tag_type === 1).map(s => { return s.tag_code });

        const head = await this.getJSON(headResult.res_text);

        head.id = actualId;
        head.meta = {
          lastUpdated: headResult['res_updated'].toISOString(),
          versionId: headResult['res_ver'],
          security: security
        };
        if (profile && profile.length > 0) {
          head.meta['profile'] = profile;
        }

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

    // await this.initResourceMapWithIGs();
    // console.log('resourceMap key count:', Object.keys(this.resourceMap).length);

    await this.migrateUsers();
    await this.migrateGroups();
    await this.migrateProjects();
    await this.migrateResources();
    await this.migratePractitioners();
    await this.migrateAuditEvents();

    this.log(`Done`);
    process.exit(0);
  }

  private async migrateResources() {
    const groupedResourceKeys = Object.keys(this.groupedResources);

    for (const groupedResourceKey of groupedResourceKeys) {
      const groupedResource = this.groupedResources[groupedResourceKey];
      const resource = groupedResource.head;

      if (groupedResource.projectResource) continue;
      if (['Practitioner', 'Group', 'AuditEvent'].find(r => r === resource.resourceType)) continue;
      if (resource.resourceType === 'ImplementationGuide' && this.projects.find(p => p.references[0]?.value === resource.id)) continue;

      await this.migrateConformance(groupedResource);

    }
  }


  private async migratePractitioners() {
    // Practitioner resources (likely examples in existing IGs) that were skipped over during the system user migration step

    const resources = this.getGroupedResources('Practitioner');
    this.log(`Retrieved ${resources.length} Practitioner records`);

    for (const gr of resources) {

      const r = gr.head as IPractitioner;
      const identifier = (r.identifier || []).find(i => i.system !== 'https://trifolia-fhir.lantanagroup.com' && i.system !== 'https://auth0.com');

      if (!identifier || !identifier.value) {
        continue;
      }

      await this.migrateConformance(gr);

    }

  }


  private async migrateAuditEvents() {
    const resources = this.getGroupedResources('AuditEvent');

    for (const groupedResource of resources) {
      const auditEvent = groupedResource.head;

      let audit: IAudit;

      if (this.options.fhirVersion === 'stu3') {
        const stu3AuditEvent = auditEvent as STU3AuditEvent;
        let user = this.userMap[stu3AuditEvent.agent[0].reference.reference.substring('Practitioner/'.length)];
        let what = this.resourceMap[stu3AuditEvent.entity[0].reference.reference];
        audit = {
          timestamp: new Date(stu3AuditEvent.recorded),
          who: user ? user['_id']?.toString() : null,
          action: this.convertAuditAction(stu3AuditEvent.action),
          what: what ? what['_id']?.toString() : null
        };
      } else {
        const r4AuditEvent = auditEvent as R4AuditEvent;
        let user = this.userMap[r4AuditEvent.agent[0].who.reference.substring('Practitioner/'.length)];
        let what = this.resourceMap[r4AuditEvent.entity[0].what.reference];
        audit = {
          timestamp: new Date(r4AuditEvent.recorded),
          who: user ? user['_id']?.toString() : null,
          action: this.convertAuditAction(r4AuditEvent.action),
          what: what ? what['_id']?.toString() : null
        };
      }

      this.log(`Inserting/updating audit ${auditEvent.id}`);
      const results = await this.db.collection('audit').updateOne(
        { timestamp: audit.timestamp, who: audit.who, action: audit.action, what: audit.what },
        { $set: audit }, { upsert: true }
      );
      this.reportResults(results);

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
  private async findImplementationGuides(resourceReference: string): Promise<IConformance[]> {

    let igs: IConformance[] = [];

    let igKeys = Object.keys(this.resourceMap).filter(k => this.resourceMap[k].resource.resourceType === 'ImplementationGuide');

    if (this.options.fhirVersion === 'stu3') {

      igKeys.forEach(key => {
        const stu3ImplementationGuide = <STU3ImplementationGuide>this.resourceMap[key].resource;

        const foundPackages = (stu3ImplementationGuide.package || []).filter(pack => {
          return (pack.resource || []).find(pr => pr.sourceReference && pr.sourceReference.reference && pr.sourceReference.reference === resourceReference);
        });

        if (foundPackages.length > 0) {
          let foundIg = this.resourceMap[key];
          if (!igs.find(ig => ig['_id'] === foundIg['_id'])) {
            igs.push(this.resourceMap[key]);
          }
        }
      });

    } else {

      igKeys.forEach(key => {
        const r4ImplementationGuide = <R4ImplementationGuide>this.resourceMap[key].resource;

        if (r4ImplementationGuide.definition && r4ImplementationGuide.definition.resource) {
          const foundRes = r4ImplementationGuide.definition.resource
            .find(r => r.reference &&
              r.reference.reference &&
              r.reference.reference === resourceReference);

          if (foundRes) {
            let foundIg = this.resourceMap[key];
            if (!igs.find(ig => ig['_id'] === foundIg['_id'])) {
              igs.push(this.resourceMap[key]);
            }
          }

        }

      });

    }

    return igs;

  }

  private getPermissions(metaSecurity: []): IPermission[] {

    let permissions: IPermission[] = [];

    (metaSecurity || []).forEach((s: Coding) => {
      const codeSplit = s.code.split('^');
      const type = codeSplit.length === 2 ? 'everyone' : codeSplit[0] as any;
      let targetId = undefined;

      if (codeSplit.length === 3) {
        if (type === 'user') {
          let user = this.userMap[codeSplit[1]];
          if (!user) {
            this.log(`ERROR: No user found in map for previous id: ${codeSplit[1]}`);
            return;
          }
          targetId = user['_id']?.toString();
        } else if (type === 'group') {
          let group = this.groupMap[codeSplit[1]];
          if (!group) {
            this.log(`ERROR: No group found in map for previous id: ${codeSplit[1]}`);
            return;
          }
          targetId = group['_id']?.toString();
        }
      }

      const permission: IPermission = {
        targetId: targetId,
        type: type,
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

    return permissions;
  }

  /*private getExamples(projects: IProject[], resourceReference: string) {
    const examples = [];

    projects.forEach(p => {
      if (this.options.fhirVersion === 'r4') {
        const r4ImplementationGuide = p.references[0].value as R4ImplementationGuide;

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
        const stu3ImplementationGuide = p.igs[0].resource as STU3ImplementationGuide;

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
  }*/

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
        this.log(`ERROR Unexpected audit action ${action}`);
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
    const igs = await this.findImplementationGuides(resourceReference);


    let versionId = 1;
    let lastUpdated = new Date();
    let permissions: IPermission[] = [{ type: 'everyone', grant: 'read' }, { type: 'everyone', grant: 'write' }];

    // Process meta property
    if (resource.meta) {
      permissions = this.getPermissions(resource.meta.security);
      delete resource.meta.security;

      if (resource.meta['versionId']) {
        try {
          versionId = parseInt(resource.meta['versionId']);
        } catch (error) { }
      }

      if (resource.meta['lastUpdated']) {
        try {
          lastUpdated = new Date(resource.meta['lastUpdated']);
        } catch (error) { }
      }
    }

    const conformance: IConformance = {
      migratedFrom: this.options.migratedFromLabel,
      versionId: resource.meta?.versionId,
      lastUpdated: resource.meta?.lastUpdated,
      fhirVersion: this.options.fhirVersion,
      resource: resource,
      permissions: permissions,
      igIds: igs.map(ig => { return ig['_id']; })
    };

    this.log(`Inserting/updating resource ${resource.resourceType}/${resource.id}`);
    const results = await this.db.collection('conformance').findOneAndUpdate(
      { migratedFrom: conformance.migratedFrom, 'resource.resourceType': conformance.resource.resourceType, 'resource.id': conformance.resource.id },
      { $set: conformance }, { upsert: true, returnDocument: ReturnDocument.AFTER }
    );
    groupedResource.projectResource = <IConformance><unknown>{ ...results.value };
    const newId = groupedResource.projectResource['_id'].toString();
    this.resourceMap[resourceReference] = <IConformance>groupedResource.projectResource;

    // update IG-related db references for this resource
    for (const ig of (igs || [])) {
      let ref: IProjectResourceReference = { value: groupedResource.projectResource['_id'], valueType: 'Conformance' };
      await this.db.collection('conformance').updateOne({ _id: ig['_id'] }, { $addToSet: { 'references': ref } });
    };

    this.reportResults(results);


    // import resource history
    for (const resourceHistory of (groupedResource.history || [])) {

      const meta = resourceHistory.meta;
      delete resourceHistory.meta;

      const history: IHistory = {
        content: resourceHistory,
        fhirVersion: this.options.fhirVersion,
        targetId: newId,
        lastUpdated: new Date(meta.lastUpdated),
        type: 'conformance',
        versionId: parseInt(meta.versionId)
      };

      this.log(`Inserting/updating history version ${meta.versionId} for ${resourceHistory.resourceType}/${resourceHistory.id}`);
      const results = await this.db.collection('history').updateOne({
        migratedFrom: this.options.migratedFromLabel,
        'content.resourceType': resourceHistory.resourceType,
        'content.id': resourceHistory.id,
        versionId: history.versionId
      }, { $set: history }, { upsert: true });
      this.reportResults(results);

    }

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

          return <IGroup>{
            name: r.name,
            migratedFrom: this.options.migratedFromLabel,
            originalGroupId: r.id, // for later mapping... not a real property on IGroup
            managingUser: managingUser['_id'],
            members: r.member
              .map(m => {
                const foundUser = this.findUser(m.entity.reference.substring('Practitioner/'.length));
                return foundUser
              })
              .filter(m => !!m)
              .map(m => m['_id'])
          };
        });
    } else if (this.options.fhirVersion === 'stu3') {
      this.groups = resources
        .filter(gr => {
          const r = gr.head as STU3Group;
          const managers = (r.member || []).filter(m => (m.extension || []).find(e => e.url === 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-group-manager' && e.valueBoolean === true));
          if (!managers || managers.length < 1) return false;
          const managingUser = this.findUser(managers[0].entity.reference.substring('Practitioner/'.length));
          return !!managingUser;
        })
        .map(gr => {
          const r = gr.head as STU3Group;
          const managers = (r.member || []).filter(m => (m.extension || []).find(e => e.url === 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-group-manager' && e.valueBoolean === true));
          const managingUser = this.findUser(managers[0].entity.reference.substring('Practitioner/'.length));

          return <IGroup>{
            name: r.name,
            migratedFrom: this.options.migratedFromLabel,
            originalGroupId: r.id, // for later mapping... not a real property on IGroup
            managingUser: managingUser['_id'],
            members: (r.member || [])
              .filter(m => !(m.extension || []).find(e => e.url === 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-group-manager' && e.valueBoolean === true))
              .map(m => {
                const user = this.findUser(m.entity.reference.substring('Practitioner/'.length));
                return user;
              })
              .filter(m => !!m)
              .map(m => m['_id'])
          };
        });
    }

    this.log(`Storing ${this.groups.length} groups in the database`);

    for (const group of this.groups) {
      const results = await this.db.collection('group').findOneAndUpdate(
        { migratedFrom: group.migratedFrom, name: group.name },
        { $set: group },
        { upsert: true, returnDocument: ReturnDocument.AFTER });
      this.reportResults(results);
      this.groupMap[group['originalGroupId']] = <IGroup>results.value;
    }

  }

  private async migrateUsers() {
    this.users = (await this.db.collection<IUser>('user').find({}).toArray()).map(u => u);

    const resources = this.getGroupedResources('Practitioner');
    this.log(`Retrieved ${resources.length} Practitioner records`);

    for (const gr of resources) {
      const r = gr.head as IPractitioner;

      const identifier = (r.identifier || []).find(i => i.system === 'https://trifolia-fhir.lantanagroup.com' || i.system === 'https://auth0.com');
      if (!identifier || !identifier.value) {
        this.log(`Skipping migration of user ${gr.head.id} -- missing or invalid identifier`);
        continue;
      }

      const foundUser = this.users.find(u => u.authId.indexOf(identifier.value) >= 0);
      if (foundUser) {
        this.userMap[r.id] = foundUser;
        continue;
      };

      const names = getHumanNamesDisplay(r.name).split(',');
      const newUser: IUser = <IUser>{
        firstName: names && names.length > 1 ? names[1].trim() : '',
        lastName: names && names.length > 0 ? names[0].trim() : '',
        authId: [identifier.value],
        phone: this.getPhone(r.telecom),
        email: this.getEmail(r.telecom)
      };

      this.log(`Adding user ${newUser.firstName} ${newUser.lastName} with authId ${newUser.authId[0]} to database`);
      let result = await this.db.collection<IUser>('user').insertOne(newUser);
      newUser['_id'] = result.insertedId.toString();
      newUser.id = result.insertedId.toString();
      this.users.push(newUser);
      this.userMap[r.id] = newUser;
    }

    this.log(`Done migrating users`);
  }

  /**
   * Inserts projects and implementation guide conformance objects for existing implementation guides
   */
  private async migrateProjects() {
    const resources = this.getGroupedResources('ImplementationGuide');

    this.projects = [];
    this.implementationGuides = [];

    resources.forEach((groupedResource) => {
      const ig = groupedResource.head as IImplementationGuide;
      let versionId = 1;
      let lastUpdated = new Date();
      let permissions: IPermission[] = [{ type: 'everyone', grant: 'read' }, { type: 'everyone', grant: 'write' }];

      if (ig.meta) {
        permissions = this.getPermissions(ig.meta.security);
        delete ig.meta.security;

        if (ig.meta['versionId']) {
          try {
            versionId = parseInt(ig.meta['versionId']);
          } catch (error) { }
        }

        if (ig.meta['lastUpdated']) {
          try {
            lastUpdated = new Date(ig.meta['lastUpdated']);
          } catch (error) { }
        }
      }

      let newIgConf: IConformance = {
        versionId: versionId,
        lastUpdated: lastUpdated,
        migratedFrom: this.options.migratedFromLabel,
        fhirVersion: this.options.fhirVersion,
        permissions: permissions,
        resource: ig
      };

      let newProject: IProject = <IProject>{
        name: ig.name || 'Unnamed Project',
        migratedFrom: this.options.migratedFromLabel,
        fhirVersion: this.options.fhirVersion,
        permissions: permissions
      };

      groupedResource.projectResource = newIgConf;
      this.implementationGuides.push(newIgConf);
      this.projects.push(newProject);
    });

    // shouldn't happen... but...
    if (this.implementationGuides.length !== this.projects.length) {
      throw new Error(`ImplementationGuide count of (${this.implementationGuides.length}) does not match Project count of (${this.projects.length})`);
    }

    this.log(`Storing ${this.projects.length} projects in the database`);


    for (let i = 0; i < this.projects.length; i++) {

      let newIg = this.implementationGuides[i];
      let newProject = this.projects[i];

      // Add/update IG conformance
      let igResult = await this.db.collection('conformance').findOneAndUpdate(
        { migratedFrom: newIg.migratedFrom, 'resource.resourceType': 'ImplementationGuide', 'resource.id': newIg.resource.id },
        { $set: newIg }, { upsert: true, returnDocument: ReturnDocument.AFTER }
      );

      newIg = <IConformance><unknown>{ ...igResult.value };
      let newIgId = igResult.value._id?.toString() || newIg['_id'];
      let igPath = `ImplementationGuide/${newIg.resource.id}`;

      this.resourceMap[igPath] = newIg;


      // Add/update project
      newProject.references = [newIgId];
      let projResult = await this.db.collection('project').findOneAndUpdate(
        { migratedFrom: newIg.migratedFrom, 'references': newIgId },
        { $set: newProject }, { upsert: true, returnDocument: ReturnDocument.AFTER }
      );

      newProject = <IProject><unknown>{ ...projResult.value };
      let newProjectId = projResult.value._id.toString();

      // Update IG conformance resource to include new project ID
      let results = await this.db.collection('conformance').findOneAndUpdate({ _id: new ObjectId(newIgId) }, { $set: { 'projects': [newProjectId] } });
      this.reportResults(results);


      // Add any history for the existing IG
      let historyList = resources.find(r => r.head.resourceType === 'ImplementationGuide' && r.head?.id === newIg.resource?.id)?.history;
      for (const resourceHistory of (historyList || [])) {

        const meta = resourceHistory.meta;
        delete resourceHistory.meta;

        const history: IHistory = {
          content: resourceHistory,
          fhirVersion: this.options.fhirVersion,
          targetId: newIgId,
          lastUpdated: new Date(meta.lastUpdated),
          type: 'conformance',
          versionId: parseInt(meta.versionId)
        };

        this.log(`Inserting/updating history version ${meta.versionId} for ${resourceHistory.resourceType}/${resourceHistory.id}`);
        const results = await this.db.collection('history').updateOne({ migratedFrom: this.options.migratedFromLabel, 'content.id': resourceHistory.id, versionId: history.versionId }, { $set: history }, { upsert: true });
        this.reportResults(results);

      }

    }

  }


  private async initResourceMapWithIGs() {

    if (!this.resourceMap) {
      this.resourceMap = {};
    }

    //const igConfs = this.db.collection('conformance').find<IConformance>({'migratedFrom': this.options.migratedFromLabel});
    const igConfs = this.db.collection('conformance').find<IConformance>({$and: [{migratedFrom: this.options.migratedFromLabel}, {'resource.resourceType':'ImplementationGuide'}]});
    for await (const ig of igConfs) {
      const key = ig.resource.resourceType + '/' + ig.resource.id;
      this.resourceMap[key] = ig;
    }

  }

}

