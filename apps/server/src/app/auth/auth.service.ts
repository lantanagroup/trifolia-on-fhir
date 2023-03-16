import { BadRequestException, Injectable } from '@nestjs/common';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { ObjectId } from 'mongodb';
import { ConfigService } from '../config.service';
import { GroupsService } from '../groups/groups.service';
import { ProjectsService } from '../projects/projects.service';
import { ResourcesService } from '../resources/providers/resources.service';
import { TofLogger } from '../tof-logger';

@Injectable()
export class AuthService {

    protected readonly logger = new TofLogger(AuthService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly groupsService: GroupsService,
        private readonly projectsService: ProjectsService,
        private readonly resourcesService: ResourcesService
    ) {
    }


    public async getPermissionFilterBase(user: ITofUser = undefined, grant: 'read' | 'write' = 'read', targetId: string = '') : Promise<{}> {


        if (!this.configService.server.enableSecurity || user?.isAdmin) {
            return {};
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
            { "permissions.0": { $exists: false } },

            // "everyone" assigned overrides
            {
                "permissions": {
                    $elemMatch: { type: "everyone", $or: grantClause }
                }
            }
        ];

        // check for user assignment if userId is provided
        if (userId) {
            orClauses.push({
                "permissions": {
                    $elemMatch: { targetId: userId, type: "user", $or: grantClause }
                }
            });
        }


        // check for group assignments if needed
        if (groupIds.length > 0) {
            orClauses.push({
                "permissions": {
                    $elemMatch: { targetId: { $in: groupIds }, type: "group", $or: grantClause }
                }
            });
        }


        let filter: any = {
            $or: orClauses
        }


        // Filter by any provided id
        if (targetId) {
            filter = {
                $and: [
                    {
                        _id: new ObjectId(targetId)
                    },
                    {$or: orClauses}
                ]
            };
        }

        return filter;
    }




    public async userCan(user: ITofUser, targetId: string, type: 'project' | 'resource', grant: 'read' | 'write'): Promise<boolean> {

        
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

        // TODO: uncomment after implementing generic resource service
        //const service = type === 'resource' ? this.resourceService : this.projectsService;
        const service = type === 'resource' ? this.resourcesService : this.projectsService;

        const resCount = await service.count(await this.getPermissionFilterBase(user, grant, targetId));
        //console.log(`Can ${grant} count: ${resCount}`);

        return resCount > 0;
    }


    public async userCanReadProject(user: ITofUser, projectId: string) {
        return this.userCan(user, projectId, 'project', 'read');
    }

    public async userCanWriteProject(user: ITofUser, projectId: string) {
        return this.userCan(user, projectId, 'project', 'write');
    }

    public async userCanReadResource(user: ITofUser, resourceId: string) {
        return this.userCan(user, resourceId, 'resource', 'read');
    }

    public async userCanWriteResource(user: ITofUser, resourceId: string) {
        return this.userCan(user, resourceId, 'resource', 'write');
    }


}
