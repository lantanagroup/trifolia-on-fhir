import { Controller } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import { BaseDataController } from '../base/base-data.controller';
import { UserDocument } from './user.schema';
import { UsersService } from './users.service';

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
