import {Controller, Get, Param, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {PaginateOptions} from '@trifolia-fhir/tof-lib';
import {BaseDataController} from '../base/base-data.controller';
import {User} from '../server.decorators';
import {HistoryDocument} from './history.schema';
import {HistoryService} from './history.service';
import {ObjectId} from 'mongodb';

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


  @Get(':type/:id')
  public async searchHistory(@User() user, @Param('type') type: string, @Param('id') id: string, @Query() query?: any ) {
    const searchFilters = {};

    searchFilters['current.valueType'] = { $regex: `^${type}$`,  $options: 'i' };
    searchFilters['current.value'] = id;

    const baseFilter = await this.authService.getPermissionFilterBase(user, 'read');
    const filter = [{$match: searchFilters}, ...baseFilter];

    const options: PaginateOptions = {
      page: query.page,
      itemsPerPage: 10,
      pipeline: filter
    };

    options.sortBy = {};
    if ('_sort' in query) {
      options.sortBy[query['_sort']] = 'desc';
    }
    return await this.historyService.search(options);
  }

}
