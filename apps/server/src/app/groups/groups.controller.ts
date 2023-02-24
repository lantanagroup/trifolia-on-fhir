import {Post} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {ApiTags, ApiOAuth2, ApiOperation} from '@nestjs/swagger';
import {Connection, HydratedDocument} from 'mongoose';
import { BaseDataController } from '../base/base-data.controller';
import {Group, GroupDocument} from './group.schema';
import {GroupsService} from './groups.service';
import {FhirServerBase, FhirServerVersion, RequestHeaders, User} from '../server.decorators';
import {ITofUser} from '@trifolia-fhir/tof-lib';
import {UsersService} from '../users/users.service';
import {AuthGuard} from '@nestjs/passport';
import {Body, Controller, Delete, Get, Param, Put, Query, UnauthorizedException, UseGuards} from '@nestjs/common';
import {PaginateOptions} from '@trifolia-fhir/tof-lib';
import {UserDocument} from '../users/user.schema';
import {IGroup} from '@trifolia-fhir/models';


@Controller('api/group')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Group')
@ApiOAuth2([])
export class GroupsController extends BaseDataController<GroupDocument> {

    constructor(private readonly groupsService: GroupsService, protected usersService: UsersService, @InjectConnection() private connection: Connection) {
      super(groupsService);
    }

    protected getFilterFromQuery(query?: any) : any {

      const filter = {};

      if ('name' in query) {
        filter['name'] = { $regex: query['name'], $options: 'i' };
      }
      if ('description' in query) {
        filter['description'] = { $regex: query['description'], $options: 'i' };
      }
      if ('_id' in query) {
        filter['_id'] = { $regex: query['_id'], $options: 'i' };
      }
      return filter;
    }

  @Post('managing')
  public async createManagingGroup(@User() user: ITofUser, @Body() body: IGroup) {

    let myuser = await this.getMe(user);

    console.log(JSON.stringify(myuser));

    // move data from dto to entity
    const group = new Group();
    body.members = body.members || [];
    group.members = [];
    group.members.push(...body.members);
    group.managingUserId = myuser._id;
    group.name = body.name;
    // be sure myuser is member of the group
    const foundMember = (group.members).find((member) => member = myuser._id);

    if (!foundMember) {
      group.members.push(myuser._id);
    }

    await this.groupsService.create(group);
  }


  @Put('managing/:id')
  public async updateManagingGroup(@User() user: ITofUser, @Body() body: IGroup, @Param('id') id: string) {

    let myuser = await this.getMe(user);
    console.log(JSON.stringify(myuser));

    const group  = await this.groupsService.findById(id);
    if (group) {
      group.members.forEach(m => console.log(m));
    }
    group.name = body.name;
    body.members = body.members || [];
    group.members =  [];
    group.members.push(...body.members);

    console.log("Group is: " + JSON.stringify(group));
  /*  if (group.managingUserId.toString() != myuser._id.toString()) {
      throw new UnauthorizedException();
    }*/
    // be sure myuser is member of the group
    const foundMember = (group.members).find((member) => member = myuser._id);

    if (!foundMember) {
      group.members.push(myuser._id);
    }

    await this.groupsService.updateOne(id, group);
  }


  @Get('membership')
  public async getMembership(@User() user, @Query('name') name?: string, @Query('_id') id?: string) {
    if (!user) return null;

    const myuser = await this.getMe(user);

    console.log(JSON.stringify(myuser));
    const filter = {};

    filter['members'] = myuser._id;

    const options: PaginateOptions = {
      page: 1,
      itemsPerPage: 10,
      filter: filter
    };
    options.sortBy = {};

    const results = await this.groupsService.search(options);
    if (results && results.results) {
      results.results.forEach(result => console.log(result));
    }
    return results.results;

  }

  @ApiOperation({
    summary: 'getManaging',
    description: 'Gets the groups that the currently logged-in user is an admin/manager of'
  })
  @Get('managing')
  public async getManaging(@User() user, @FhirServerBase() fhirServerBase, @FhirServerVersion() fhirServerVersion) {

    const myuser = await this.getMe(user);

   // console.log(JSON.stringify(myuser));
    const filter = {};

    filter['managingUserId'] = myuser._id;

    const options: PaginateOptions = {
      page: 1,
      itemsPerPage: 10,
      filter: filter
    };
    options.sortBy = {};

    const results = await this.groupsService.search(options);
    if (results && results.results) {
      results.results.forEach(result => console.log(result));
    }
    return results.results;

  }


  protected async getMe(user: ITofUser): Promise<UserDocument> {
    if (!user) return null;

    let identifier = user.sub;

    const filter = {};

    filter['authId'] = { $regex: identifier, $options: 'i' };

    const options: PaginateOptions = {
      page: 1,
      itemsPerPage: 10,
      filter: filter
    };

    options.sortBy = {};

    const results = await this.usersService.search(options);
    if (results && results.results) {
      results.results.forEach(result => console.log(result));
    }
    return results.results[0];
  }

  @ApiOperation({
    summary: 'deleteManagingGroup',
    description: 'Deletes a group that the user is an admin/manager of'
  })
  @Delete('managing/:id')
  public async deleteManagingGroup(@User() user: ITofUser, @Param('id') id: string) {

    const myuser = await this.getMe(user);
    console.log(JSON.stringify(myuser));
    // get group first
    const group  = await this.groupsService.findById(id);
    console.log(JSON.stringify(group));

    if (group.managingUserId.toString() != myuser.id.toString()) {
      throw new UnauthorizedException();
    }

    return await this.groupsService.delete(id);

  }

  @ApiOperation({
    summary: 'deleteMembershipGroup',
    description: 'Removes the current user as a member from the group'
  })
  @Delete('membership/:id')
  public async deleteMembershipGroup(@User() user: ITofUser, @Param('id') id: string) {

    const myuser = await this.getMe(user);

    // get group first
    const persistedGroup  = await this.groupsService.findById(id);
    const foundMember = (persistedGroup.members || []).find((member) => member = myuser.id);

    if (foundMember) {
      const index = persistedGroup.members.indexOf(foundMember);
      persistedGroup.members.splice(index, 1);
      await this.groupsService.delete(id);
    }
  }
}
