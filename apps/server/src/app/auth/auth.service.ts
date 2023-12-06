import { BadRequestException, Injectable } from '@nestjs/common';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { ObjectId } from 'mongodb';
import { IBaseDataService } from '../base/interfaces';
import { ConfigService } from '../config.service';
import { FhirResourcesService } from '../fhir-resources/fhir-resources.service';
import { GroupsService } from '../groups/groups.service';
import { ProjectsService } from '../projects/projects.service';
import { TofLogger } from '../tof-logger';
import { NonFhirResourcesService } from '../non-fhir-resources/non-fhir-resources.service';
import { Project } from '../projects/project.schema';
import { PipelineStage } from 'mongoose';

@Injectable()
export class AuthService {

    protected readonly logger = new TofLogger(AuthService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly groupsService: GroupsService,
        private readonly projectsService: ProjectsService,
        private readonly fhirResourceService: FhirResourcesService,
        private readonly nonFhirResourceService: NonFhirResourcesService
    ) {
    }


    public async getPermissionFilterBase(user: ITofUser = undefined, grant: 'read' | 'write' = 'read', targetId: string = '', isProject: boolean = false) : Promise<PipelineStage[]> {


        if (!this.configService.server.enableSecurity || user?.isAdmin) {
            return [];
        }

        let userId = user?.user?.id;


        // TODO: further investigate most efficient way to use aggregation pipeline to include group membership in single filter instead of separate group ids list
        let groupIds = userId ? (await this.groupsService.getForUser(userId)).map(g => g.id) : [];
        //console.log(`Group count: ${groupIds.length}`);
        //groupIds.forEach(g => console.log(`Group: ${g}`));


        // granting write implies read permission
        const grantClause = [{ grant: 'write' }];
        if (grant === 'read') {
            grantClause.push({ grant: 'read' });
        }


        // form all the "or" checks based on provided parameters

        let orClauses: any[] = [
            // no permissions assigned -- everybody gets write
            isProject ? 
                { "permissions.0": { $exists: false } } : 
                { "projects.permissions.0": { $exists: false } },

            // "everyone" assigned overrides
            isProject ? 
                { "permissions": { $elemMatch: { type: "everyone", $or: grantClause } } } : 
                { "projects.permissions": { $elemMatch: { type: "everyone", $or: grantClause } } }
        ];

        // check for user assignment if userId is provided
        if (userId) {
            orClauses.push(
                isProject ? 
                    { "permissions": { $elemMatch: { target: new ObjectId(userId), type: "User", $or: grantClause } } } :
                    { "projects.permissions": { $elemMatch: { target: new ObjectId(userId), type: "User", $or: grantClause } } }
            );
        }


        // check for group assignments if needed
        if (groupIds.length > 0) {
            orClauses.push(
                isProject ?
                    { "permissions": { $elemMatch: { target: { $in: groupIds.map(g => new ObjectId(g)) }, type: "Group", $or: grantClause } } } :
                    { "projects.permissions": { $elemMatch: { target: { $in: groupIds.map(g => new ObjectId(g)) }, type: "Group", $or: grantClause } } }
                );
        }


        // base filter checks for deleted flag and the above calculated "or" clauses
        let filter: any = {
            $and: [
                {
                    $or: [{ "isDeleted": { $exists: false } }, { "isDeleted" : false }]
                },
                {$or: orClauses}
            ]
        }

        // if this is not a project being checked, also need to check that at least one associated project is not deleted
        if (!isProject) {
          filter['$and'].splice(1, 0, {
            $or: [
              {
                'projects.0': { $exists: false },
              },
              {
                projects: {
                  $elemMatch: {
                    $or: [
                      { isDeleted: { $exists: false } },
                      { isDeleted: false },
                    ],
                  },
                },
              },
            ],
          });
        }


        // Filter by any provided id
        if (targetId) {
            filter['$and'].unshift({_id: new ObjectId(targetId)})
        }

        let pipeline = [];

        if (!isProject) {
            pipeline.push(
                {
                    $lookup: {
                        from: "project",
                        localField: "projects",
                        foreignField: "_id",
                        as: "projects",
                    }
                }
            );
        }
    
        pipeline.push({$match: filter});
        
        // console.log('pipeline:', JSON.stringify(pipeline));

        return pipeline;
    }




    public async userCanByType(user: ITofUser, targetId: string, type: 'project' | 'nonFhirResource' | 'fhirResource', grant: 'read' | 'write'): Promise<boolean> {

        const service = 
            type === 'project' ? this.projectsService : 
            type === 'nonFhirResource' ? this.nonFhirResourceService : 
                this.fhirResourceService;

        return this.userCanByService(user, targetId, service, grant);
    }

    public async userCanByService(user: ITofUser, targetId: string, dataService: IBaseDataService<unknown>, grant: 'read' | 'write'): Promise<boolean> {

        // ProjectService is special case and doesn't need the additional lookup to join related permissions
        const isProjectService = dataService.getModel().modelName === Project.name;

        if (!this.configService.server.enableSecurity || user?.isAdmin) {
            return true;
        }

        let userId = user?.user?.id;

        if (!userId || userId.length < 24) {
            throw new BadRequestException("Invalid user provided");
        }
        if (!targetId || targetId.length < 24) {
            throw new BadRequestException("Invalid target provided");
        }

        const pipeline = await this.getPermissionFilterBase(user, grant, targetId, isProjectService);
        // console.log('pipeline:', JSON.stringify(pipeline));
        const res = await dataService.getModel().aggregate(pipeline).count("count");
        const resCount: number = res && res.length > 0 ? res[0]['count'] : 0;
        // console.log(`${dataService.getModel().modelName} :: Can ${grant} for user ${userId} count: ${resCount} -- ${targetId}`);

        return resCount > 0;
    }


    public async userCanReadProject(user: ITofUser, projectId: string) {
        return this.userCanByType(user, projectId, 'project', 'read');
    }

    public async userCanWriteProject(user: ITofUser, projectId: string) {
        return this.userCanByType(user, projectId, 'project', 'write');
    }

    public async userCanReadFhirResource(user: ITofUser, fhirResourceId: string) {
        return this.userCanByType(user, fhirResourceId, 'fhirResource', 'read');
    }

    public async userCanWriteFhirResource(user: ITofUser, fhirResourceId: string) {
        return this.userCanByType(user, fhirResourceId, 'fhirResource', 'write');
    }

    public async userCanReadNonFhirResource(user: ITofUser, nonFhirResourceId: string) {
        return this.userCanByType(user, nonFhirResourceId, 'nonFhirResource', 'read');
    }

    public async userCanWriteNonFhirResource(user: ITofUser, nonFhirResourceId: string) {
        return this.userCanByType(user, nonFhirResourceId, 'nonFhirResource', 'write');
    }


}
