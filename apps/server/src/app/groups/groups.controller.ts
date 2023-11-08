import {Post, Request} from '@nestjs/common';
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
import {AuditAction, AuditEntityType, type IGroup} from '@trifolia-fhir/models';
import { ObjectId } from 'mongodb';
import { AuditEntity } from '../audit/audit.decorator';


@Controller('api/groups')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Group')
@ApiOAuth2([])
export class GroupsController extends BaseDataController<GroupDocument> {

  constructor(private readonly groupsService: GroupsService, protected usersService: UsersService, @InjectConnection() private connection: Connection) {
    super(groupsService);
  }

  protected getFilterFromRequest(req?: any): any {

    const filter = {};
    
    if (!req) {
      return filter;
    }
    const query = req.query;

    if ('name' in query) {
      filter['name'] = { $regex: this.escapeRegExp(query['name']), $options: 'i' };
    }
    if ('description' in query) {
      filter['description'] = { $regex: this.escapeRegExp(query['description']), $options: 'i' };
    }
    if ('_id' in query) {
      filter['$or'] = query['_id'].split(',').map(id => { return {'_id': new ObjectId(id)} });
    }
    return filter;
  }


  @Post('managing')
  @AuditEntity(AuditAction.Create, AuditEntityType.Group)
  public async createManagingGroup(@User() userProfile: ITofUser, @Body() newGroup: IGroup) {

    // console.log(JSON.stringify(userProfile.user));

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
  @AuditEntity(AuditAction.Update, AuditEntityType.Group)
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

  @Get('info')
  public async getGroupInfo(@User() user, @Request() req?: any): Promise<IGroup[]> {
    if (!req) {
      return null;
    }
    const query = req.query;

    if (query && '_id' in query) {
      const ids = (query['_id'] || '').split(',').map(id => { return { _id: new ObjectId(id) } });
      const idFilter = { $or: ids };
      let projection = {};
      if (!user.isAdmin) {
        projection = {
          managingUser: 0,
          members: 0
        };
      }

      return this.groupsService.findAll(idFilter, null, projection);
    }
    return null;
  }


  @Get('membership')
  public async getMembership(@User() userProfile, @Request() req?: any): Promise<IGroup[]> {
    if (!userProfile || !userProfile.user) return null;
    const filter = this.getFilterFromRequest(req);
    filter['members'] = userProfile.user.id;
    return await this.groupsService.findAll(filter, ["managingUser", "members"]);;
  }

  @ApiOperation({
    summary: 'getManaging',
    description: 'Gets the groups that the currently logged-in user is an admin/manager of'
  })
  @Get('managing')
  public async getManaging(@User() userProfile): Promise<IGroup[]> {
    if (!userProfile) return null;

    return this.groupsService.findAll({ 'managingUser': userProfile.user.id }, ["managingUser", "members"]);
  }


  @ApiOperation({
    summary: 'deleteManagingGroup',
    description: 'Deletes a group that the user is an admin/manager of'
  })
  @Delete('managing/:id')
  @AuditEntity(AuditAction.Delete, AuditEntityType.Group)
  public async deleteManagingGroup(@User() userProfile: ITofUser, @Param('id') id: string) {

    // get group first
    const group = await this.groupsService.findById(id);

    if (!userProfile.isAdmin && group.managingUser.toString() !== userProfile.user.id) {
      throw new UnauthorizedException();
    }

    return await this.groupsService.delete(id);

  }

  @ApiOperation({
    summary: 'deleteMembershipGroup',
    description: 'Removes the current user as a member from the group'
  })
  @Delete('membership/:id')
  @AuditEntity(AuditAction.Delete, AuditEntityType.Group)
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
