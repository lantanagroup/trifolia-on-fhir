import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IUser } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { BaseDataController } from '../base/base-data.controller';
import { User } from '../server.decorators';
import { TofLogger } from '../tof-logger';
import { UserDocument } from './user.schema';
import { UsersService } from './users.service';
import { ObjectId } from 'mongodb';
import { TofNotFoundException } from '../../not-found-exception';

@Controller('api/users')
@UseGuards(AuthGuard('bearer'))
@ApiTags('User')
@ApiOAuth2([])
export class UsersController extends BaseDataController<UserDocument> {

    protected readonly logger = new TofLogger(UsersController.name);

    constructor(private readonly usersService: UsersService) {
        super(usersService);
    }

    protected getFilterFromRequest(req?: any) : any {
        let filter = super.getFilterFromRequest(req);

        if (!req || !req.query) {
            return filter;
        }
        let query = req.query;

        if ('name' in query) {
          filter = {
            $or: [
              { firstName: { $regex: query['name'], $options: 'i' } },
              { lastName: { $regex: query['name'], $options: 'i' } }
            ]
          };
        }
        if ('email' in query) {
          filter['email'] = { $regex: query['email'], $options: 'i' };
        }
        if ('_id' in query && query['_id']) {
            filter['$or'] = query['_id'].split(',').map(id => { return {'_id': new ObjectId(id)} });
        }
        
        return filter;
    }


    @Get('me')
    public async getMe(@User() user: ITofUser) : Promise<IUser> {
        
        if (!user || !user.sub) {
            throw new BadRequestException("No authenticated user provided.");
        }

        let authId = this.getAuthIdFromSubject(user.sub);

        if (!authId) {
            return null;
        }

        this.logger.debug(`Getting user with identifier ${authId}`);

        let res = await this.usersService.findOne({authId: authId});

        if (!res) {
            throw new TofNotFoundException("No user found with the provided credentials.");
        }

        return res;
    }


    @Post()
    public async createUser(@User() user: ITofUser, @Body() newUser: IUser) : Promise<IUser> {

        if (!newUser || !newUser.authId || newUser.authId.length < 1 || !newUser.firstName || !newUser.lastName) {
            throw new BadRequestException();
        }

        // admins can create any new user but regular users will have any provided authId ignored and be forced to use their current auth
        if (!user.isAdmin) {
            newUser.authId[0] = this.getAuthIdFromSubject(user.sub);
        }

        // check for existing user with the given authId
        let existing = await this.usersService.findOne({authId: newUser.authId[0]});
        if (existing) {
            throw new ConflictException();
        }

        return super.create(newUser);
    }


    @Put(':id')
    public async updateUser(@Param('id') id: string, @User() user: ITofUser, @Body() updatedUser: IUser) : Promise<IUser> {

        super.assertIdMatch(id, updatedUser);

        let me = await this.getMe(user);
        if (!(user.isAdmin || (me && me.id === id))) {
            throw new UnauthorizedException();
        }

        return super.update(id, updatedUser);
    }

}
