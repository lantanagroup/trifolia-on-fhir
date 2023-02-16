import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { Paginated, PaginateOptions } from '@trifolia-fhir/tof-lib/paginate';
import { ObjectId } from 'mongodb';
import { Connection } from 'mongoose';
import { User, UserDocument, UserSchema } from '../../schemas/user.schema';
import { UsersService } from '../../services/users/users.service';
import { BaseDataController } from '../base-data.controller';

@Controller('api/user')
//@UseGuards(AuthGuard('bearer'))
@ApiTags('User')
@ApiOAuth2([])
export class UsersController extends BaseDataController<UserDocument> {

    constructor(private readonly usersService: UsersService,
        @InjectConnection() private connection: Connection
        ) {
        super(usersService);
    }

}
