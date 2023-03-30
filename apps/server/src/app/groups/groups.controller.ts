import {Post} from '@nestjs/common';
import {InjectConnection} from '@nestjs/mongoose';
import {ApiTags, ApiOAuth2, ApiOperation} from '@nestjs/swagger';
import {Connection} from 'mongoose';
import {BaseDataController} from '../base/base-data.controller';
import {Group, GroupDocument} from './group.schema';
import {GroupsService} from './groups.service';
import {User} from '../server.decorators';
import type {ITofUser} from '@trifolia-fhir/tof-lib';
import {UsersService} from '../users/users.service';
import {AuthGuard} from '@nestjs/passport';
import {Body, Controller, Delete, Get, Param, Put, UnauthorizedException, UseGuards} from '@nestjs/common';
import type {IGroup} from '@trifolia-fhir/models';
import { ObjectId } from 'mongodb';


@Controller('api/group')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Group')
@ApiOAuth2([])
export class GroupsController extends BaseDataController<GroupDocument> {

  constructor(private readonly groupsService: GroupsService, protected usersService: UsersService, @InjectConnection() private connection: Connection) {
    super(groupsService);
  }

  protected getFilterFromQuery(query?: any): any {

    const filter = {};

    if ('name' in query) {
      filter['name'] = { $regex: query['name'], $options: 'i' };
    }
    if ('description' in query) {
      filter['description'] = { $regex: query['description'], $options: 'i' };
    }
    if ('_id' in query) {
      filter['$or'] = query['_id'].split(',').map(id => { return {'_id': new ObjectId(id)} });
    }
    return filter;
  }


  @Post('managing')
  public async createManagingGroup(@User() userProfile: ITofUser, @Body() newGroup: IGroup) {

    console.log(JSON.stringify(userProfile.user));

    // move data from dto to entity
    const persistedGroup = new Group();
    newGroup.members = newGroup.members || [];
    persistedGroup.members = [];

    for (const m of newGroup.members) {
      const persistedUser = await this.usersService.findById(m.id);
      persistedGroup.members.push(persistedUser);
    }

    persistedGroup.managingUser = userProfile.user;
    persistedGroup.name = newGroup.name;
    // be sure myuser is member of the group

    const foundMember = (persistedGroup.members).find((member) => member.id == userProfile.user.id);

    if (!foundMember) {
      persistedGroup.members.push(userProfile.user);
    }

    return super.create(persistedGroup);
  }


  @Put('managing/:id')
  public async updateManagingGroup(@User() userProfile: ITofUser, @Body() updatedGroup: IGroup, @Param('id') id: string) {

    if (!userProfile) return null;

    super.assertIdMatch(id, updatedGroup);

    if (updatedGroup.managingUser.id !== userProfile.user.id) {
      throw new UnauthorizedException();
    }

    updatedGroup.members = updatedGroup.members || [];

    const persistedGroup = await this.groupsService.findById(id);
    persistedGroup.name = updatedGroup.name;
    persistedGroup.members = [];

    for (const m of updatedGroup.members) {
      const persistedUser = await this.usersService.findById(m.id);
      persistedGroup.members.push(persistedUser);
    }

    // be sure myuser is member of the group
    const foundMember = (persistedGroup.members).find((member) => member.id == userProfile.user.id);

    if (!foundMember) {
      persistedGroup.members.push(userProfile.user);
    }

    return super.update(id, persistedGroup);
  }


  @Get('membership')
  public async getMembership(@User() userProfile) {
    if (!userProfile) return null;

    const results = await this.groupsService.findAll({ 'members': userProfile.user.id }, ["managingUser", "members"]);
    if (results) {
      //results.forEach(result => console.log(result));
    }
    return results;

  }

  @ApiOperation({
    summary: 'getManaging',
    description: 'Gets the groups that the currently logged-in user is an admin/manager of'
  })
  @Get('managing')
  public async getManaging(@User() userProfile) {
    if (!userProfile) return null;

    const results = await this.groupsService.findAll({ 'managingUser': userProfile.user.id }, ["managingUser", "members"]);
    if (results) {
      results.forEach(result => console.log(result));
    }

    return results;

  }


  @ApiOperation({
    summary: 'deleteManagingGroup',
    description: 'Deletes a group that the user is an admin/manager of'
  })
  @Delete('managing/:id')
  public async deleteManagingGroup(@User() userProfile: ITofUser, @Param('id') id: string) {

    console.log(JSON.stringify(userProfile));
    // get group first
    const group = await this.groupsService.findById(id);
    console.log(JSON.stringify(group));

    if (group.managingUser.toString() !== userProfile.user.id) {
      throw new UnauthorizedException();
    }

    return await this.groupsService.delete(id);

  }

  @ApiOperation({
    summary: 'deleteMembershipGroup',
    description: 'Removes the current user as a member from the group'
  })
  @Delete('membership/:id')
  public async deleteMembershipGroup(@User() userProfile: ITofUser, @Param('id') id: string) {

    // get group first
    const persistedGroup = await this.groupsService.findById(id);
    const foundMember = (persistedGroup.members || []).find((member) => member.id = userProfile.user.id);

    if (foundMember) {
      const index = persistedGroup.members.indexOf(foundMember);
      persistedGroup.members.splice(index, 1);
      await this.groupsService.delete(id);
    }
  }
}
