import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { IHistory } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { BaseDataController } from '../base/base-data.controller';
import { User } from '../server.decorators';
import { HistoryDocument } from './history.schema';
import { HistoryService } from './history.service';

@Controller('api/history')
@UseGuards(AuthGuard('bearer'))
@ApiTags('History')
@ApiOAuth2([])
export class HistoryController extends BaseDataController<HistoryDocument> {

    constructor(
        protected readonly historyService: HistoryService
        ) {
        super(historyService);
    }

    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<IHistory> {
        return await this.historyService.findById(id);
    }

}
