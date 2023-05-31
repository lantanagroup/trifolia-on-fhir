import { Controller, Get, Header, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { IUser } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { Paginated, PaginateOptions } from '@trifolia-fhir/tof-lib';
import { BaseController } from '../base/base.controller';
import { User } from '../server.decorators';
import { TofLogger } from '../tof-logger';
import { UsersService } from '../users/users.service';



@Controller('api/manage')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Manage')
@ApiOAuth2([])
export class ManageController extends BaseController {

    protected readonly logger = new TofLogger(ManageController.name);

    constructor(private userService: UsersService) {
        super();
    }


    @Get('user/download')
    @Header('Content-Type', 'text/plain')
    @Header('Content-Disposition', 'attachment; filename="users.csv"')
    async downloadUsers(@User() user: ITofUser): Promise<string> {
        this.assertAdmin(user);

        let response = 'Identifier,Name,Email\n';

        let users = await this.userService.findAll();

        users.forEach((user: IUser) => {
            const cells = [
                user.authId[0]?.replace(/,/g, ' '),
                user.name.replace(/, /g, ' '),
                user.email?.replace('mailto:', '')
            ];

            response += `${cells.join(',')}\n`;
        });

        return response;
    }


    @Get('user')
    public async searchUsers(@User() user: ITofUser,
        @Query('name') searchName,
        @Query('count', ParseIntPipe) count = 10,
        @Query('page') page = 1): Promise<Paginated<IUser>> {


        this.assertAdmin(user);

        let filter = {};
        if (searchName) {
            filter = {
                $or: [
                    { firstName: { $regex: searchName, $options: 'i' } },
                    { lastName: { $regex: searchName, $options: 'i' } },
                    { email: { $regex: searchName, $options: 'i' } }
                ]
            };
        }

        let options: PaginateOptions = {
            page: page,
            itemsPerPage: count,
            filter: filter
        };
        let res = await this.userService.search(options);

        return res;

    }

    @Post('user/:sourceUserId/([\$])merge/:targetUserId')
    async mergeUser(@Param('sourceUserId') sourceUserId: string, @Param('targetUserId') targetUserId: string, @User() user: ITofUser) {
        this.assertAdmin(user);

        const sourceUser = await this.userService.findById(sourceUserId);
        const targetUser = await this.userService.findById(targetUserId);

        // TODO: update all references of source user ID to destination user ID: audit, group, project contributor, project permissions
        // TODO: delete source user after everything is updated:  this.userService.delete(sourceUserId);

        this.logger.log(`Successfully merged user ${sourceUserId} into ${targetUserId}`);
    }





}
