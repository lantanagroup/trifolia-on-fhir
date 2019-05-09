import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Param, Post, Put, Query, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TofLogger} from './tof-logger';
import {ApiOAuth2Auth, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {FhirServerBase, FhirServerVersion, User} from './server.decorators';
import {ConfigService} from './config.service';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';
import {Bundle, Group as STU3Group} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Group} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {ITofUser} from './models/tof-request';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';

@Controller('group')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('Group')
@ApiOAuth2Auth()
export class GroupController extends BaseFhirController {
  resourceType = 'Group';
  
  protected readonly logger = new TofLogger(GroupController.name);
  
  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  @Get()
  public search(@User() user, @FhirServerBase() fhirServerBase, @Query() query?: any): Promise<any> {
    return super.baseSearch(user, fhirServerBase, query);
  }

  @ApiOperation({
    title: 'createManagingGroup',
    description: 'Creates a group where the currently logged-in user is the admin/manager'
  })
  @Post('managing')
  public async createManagingGroup(@User() user: ITofUser, @FhirServerBase() fhirServerBase, @Body() body: Group, @FhirServerVersion() fhirServerVersion) {
    const userPractitioner = await this.getMyPractitioner(user, fhirServerBase);

    // Make sure user is a member in the group
    body.member = body.member || [];

    const foundMember = (body.member || []).find((member) => member.entity && member.entity.reference === 'Practitioner/' + userPractitioner.id);

    if (!foundMember) {
      body.member.push({
        entity: {
          reference: 'Practitioner/' + userPractitioner.id
        }
      });
    }

    // Make sure user is admin of the group
    if (fhirServerVersion === 'stu3') {
      foundMember.extension = foundMember.extension || [];

      let foundAdmin = foundMember.extension.find((ext) => ext.url === Globals.extensionUrls['extension-group-manager']);

      if (!foundAdmin) {
        foundAdmin = {
          url: Globals.extensionUrls['extension-group-manager']
        };
        foundMember.extension.push(foundAdmin);
      }

      foundAdmin.valueBoolean = true;
    } else if (fhirServerVersion === 'r4') {
      body.managingEntity = {
        reference: 'Practitioner/' + userPractitioner.id
      };
    }

    // Create the group on the FHIR server
    const url = buildUrl(fhirServerBase, 'Group');
    return (await this.httpService.post<Group>(url, body).toPromise()).data;
  }

  @ApiOperation({
    title: 'updateManagingGroup',
    description: 'Updates the specified group if the user is the admin/manager of the group'
  })
  @Put('managing/:id')
  public async updateManagingGroup(@User() user: ITofUser, @FhirServerBase() fhirServerBase, @Body() body: Group, @Param('id') id: string, @FhirServerVersion() fhirServerVersion) {
    const userPractitioner = await this.getMyPractitioner(user, fhirServerBase);

    body.member = body.member || [];

    // Get group first
    const url = buildUrl(fhirServerBase, 'Group', id);
    const persistedGroup = (await this.httpService.get<Group>(url).toPromise()).data;

    // Check that user is admin of the group
    if (fhirServerVersion === 'stu3') {
      const foundPersistedMember = (persistedGroup.member || []).find((member) => member.entity && member.entity.reference === 'Practitioner/' + userPractitioner.id);
      const foundPersistedAdmin = (foundPersistedMember ? foundPersistedMember.extension : []).find((ext) => ext.url === Globals.extensionUrls['extension-group-manager'] && ext.valueBoolean);

      if (!foundPersistedAdmin) {
        throw new UnauthorizedException();
      }
    } else if (fhirServerVersion === 'r4') {
      if (!persistedGroup.managingEntity || persistedGroup.managingEntity.reference !== 'Practitioner/' + userPractitioner.id) {
        throw new UnauthorizedException();
      }
    }

    // Make sure user is a member in the group
    let foundMember = body.member.find((member) => member.entity && member.entity.reference === 'Practitioner/' + userPractitioner.id);

    if (!foundMember) {
      foundMember = {
        entity: {
          reference: 'Practitioner/' + userPractitioner.id
        }
      };
      body.member.push(foundMember);
    }

    // Make sure user is admin of the group
    if (fhirServerVersion === 'stu3') {
      foundMember.extension = foundMember.extension || [];
      let foundAdmin = foundMember.extension.find((ext) => ext.url === Globals.extensionUrls['extension-group-manager']);

      if (!foundAdmin) {
        foundAdmin = {
          url: Globals.extensionUrls['extension-group-manager']
        };
        foundMember.extension.push(foundAdmin);
      }

      foundAdmin.valueBoolean = true;
    } else if (fhirServerVersion === 'r4') {
      body.managingEntity = {
        reference: 'Practitioner/' + userPractitioner.id
      };
    }

    // Update Group in the FHIR server
    return (await this.httpService.put<Group>(url, body).toPromise()).data;
  }

  @ApiOperation({
    title: 'deleteManagingGroup',
    description: 'Deletes a group that the user is an admin/manager of'
  })
  @Delete('managing/:id')
  public async deleteManagingGroup(@User() user: ITofUser, @FhirServerBase() fhirServerBase, @Param('id') id: string, @FhirServerVersion() fhirServerVersion: string) {
    const userPractitioner = await this.getMyPractitioner(user, fhirServerBase);

    // Get group first
    const url = buildUrl(fhirServerBase, 'Group', id);
    const persistedGroup = (await this.httpService.get<Group>(url).toPromise()).data;

    // Check that user is admin of the group
    if (fhirServerVersion === 'stu3') {
      const foundPersistedMember = (persistedGroup.member || []).find((member) => member.entity && member.entity.reference === 'Practitioner/' + userPractitioner.id);
      const foundPersistedAdmin = (foundPersistedMember ? foundPersistedMember.extension : []).find((ext) => ext.url === Globals.extensionUrls['extension-group-manager'] && ext.valueBoolean);

      if (!foundPersistedAdmin) {
        throw new UnauthorizedException();
      }
    } else if (fhirServerVersion === 'r4') {
      if (!persistedGroup.managingEntity || persistedGroup.managingEntity.reference !== 'Practitioner/' + userPractitioner.id) {
        throw new UnauthorizedException();
      }
    }

    return (await this.httpService.delete(url).toPromise()).data;
  }

  @ApiOperation({
    title: 'deleteMembershipGroup',
    description: 'Removes the current user as a member from the group'
  })
  @Delete('membership/:id')
  public async deleteMembershipGroup(@User() user: ITofUser, @FhirServerBase() fhirServerBase, @Param('id') id: string) {
    const userPractitioner = await this.getMyPractitioner(user, fhirServerBase);

    // Get group first
    const url = buildUrl(fhirServerBase, 'Group', id);
    const persistedGroup = (await this.httpService.get<Group>(url).toPromise()).data;
    const foundMember = (persistedGroup.member || []).find((member) => member.entity && member.entity.reference === 'Practitioner/' + userPractitioner.id);

    if (foundMember) {
      const index = persistedGroup.member.indexOf(foundMember);
      persistedGroup.member.splice(index, 1);

      await this.httpService.put<Group>(url, persistedGroup).toPromise();
    }
  }

  @ApiOperation({
    title: 'getMembership',
    description: 'Gets the groups that the currently logged-in user is a member of. This operation assumes that the user is not belonging to more than 50 groups.'
  })
  @Get('membership')
  public async getMembership(@User() user, @FhirServerBase() fhirServerBase, @Query('name') name?: string, @Query('_id') id?: string) {
    const userPractitioner = await this.getMyPractitioner(user, fhirServerBase);

    // TODO: Assumes that the user is not going to belong to more than 50 groups
    const groupsUrl = buildUrl(fhirServerBase, 'Group', null, null, { member: userPractitioner.id, _summary: true, _count: 50 });
    const response = await this.httpService.get<Bundle>(groupsUrl).toPromise();
    const bundle: Bundle = response.data;

    // Filter by name
    if (name) {
      bundle.entry = (bundle.entry || []).filter((entry) => {
        const group: Group = <Group> entry.resource;
        return JSON.stringify(group).toLowerCase().indexOf(name.toLowerCase()) >= 0;
      });
    }

    // Filter by id
    if (id) {
      const idSplit = id.split(',');

      bundle.entry = (bundle.entry || []).filter((entry) => {
        const group: Group = <Group> entry.resource;
        return idSplit.indexOf(group.id) >= 0;
      });
    }

    bundle.total = (bundle.entry || []).length;

    return bundle;
  }

  @ApiOperation({
    title: 'getManaging',
    description: 'Gets the groups that the currently logged-in user is an admin/manager of'
  })
  @Get('managing')
  public async getManaging(@User() user, @FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion) {
    const userPractitioner = await this.getMyPractitioner(user, fhirServerBase);

    if (fhirServerVersion === 'stu3') {
      // TODO: Aren't expecting a user to belong to more than 50 groups...
      const groupsUrl = buildUrl(fhirServerBase, 'Group', null, null, { member: 'Practitioner/' + userPractitioner.id, _count: 50 });
      const response = await this.httpService.get<Bundle>(groupsUrl).toPromise();
      const memberGroups = response.data;

      memberGroups.entry = (memberGroups.entry || []).filter((entry: STU3Group) => {
        // we know for sure the practitioner is a member of every group
        // find their member entry so we can check if it has the manager extension
        const foundMember = entry.member.find((member) => member.entity.reference === 'Practitioner/' + userPractitioner.id);
        const foundManager = (foundMember.extension || []).find((ext) => ext.url === Globals.extensionUrls['extension-group-manager'] && ext.valueBoolean);
        return !!foundManager;
      });

      return memberGroups;
    } else {
      // TODO: Aren't expecting a user to belong to more than 50 groups...
      const groupsUrl = buildUrl(fhirServerBase, 'Group', null, null, { 'managing-entity': 'Practitioner/' + userPractitioner.id, _count: 50 });
      const response = await this.httpService.get<Bundle>(groupsUrl).toPromise();
      return response.data;
    }
  }

  @Get(':id')
  public get(@FhirServerBase() fhirServerBase, @Query() query, @User() user, @Param('id') id: string) {
    return super.baseGet(fhirServerBase, id, query, user);
  }

  @Post()
  public create(@FhirServerBase() fhirServerBase, @User() user, @Body() body) {
    return super.baseCreate(fhirServerBase, body, user);
  }

  @Put(':id')
  public update(@FhirServerBase() fhirServerBase, @Param('id') id: string, @Body() body, @User() user) {
    return super.baseUpdate(fhirServerBase, id, body, user);
  }

  @Delete(':id')
  public delete(@FhirServerBase() fhirServerBase, @Param('id') id: string, @User() user) {
    return super.baseDelete(fhirServerBase, id, user);
  }
}
