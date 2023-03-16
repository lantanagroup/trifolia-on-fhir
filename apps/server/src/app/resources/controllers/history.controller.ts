import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IHistory } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../server.decorators';
import { HistoryService } from '../providers/history.service';
import type { ProjectResourceType } from '../providers/resources.service';
import { ResourcesController } from './resources.controller';

@Controller('api/resources/history')
@UseGuards(AuthGuard('bearer'))
@ApiTags('History')
@ApiOAuth2([])
export class HistoryController extends ResourcesController {

    private resourceType: ProjectResourceType = 'history';

    constructor(
        protected readonly historyService: HistoryService,
        protected readonly authService: AuthService
        ) {
        super(historyService, authService);
    }

    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<IHistory> {
        return await this.getResourceById<IHistory>(user, id, this.resourceType);
    }

}
