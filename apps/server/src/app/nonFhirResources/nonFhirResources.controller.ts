import {Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { INonFhirResource } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { BaseDataController } from '../base/base-data.controller';
import { NonFhirResourcesService } from './nonFhirResources.service';
import { NonFhirResourceDocument } from './nonFhirResource.schema';
import { User } from '../server.decorators';
import {FhirResourcesService} from '../fhirResources/fhirResources.service';

@Controller('api/nonFhirResources')
@UseGuards(AuthGuard('bearer'))
@ApiTags('NonFhirResources')
@ApiOAuth2([])
export class NonFhirResourcesController extends BaseDataController<NonFhirResourceDocument> {

    constructor(
        protected readonly nonFhirResourcesService: NonFhirResourcesService, protected readonly fhirResourceService: FhirResourcesService
        ) {
        super(nonFhirResourcesService);
    }


    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<INonFhirResource> {
        return await this.nonFhirResourcesService.findById(id);
    }

    @Post()
    public async createExample(@User() user: ITofUser, @Body() example: INonFhirResource, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
        console.log('POST -- checking perms on IG:', implementationGuideId);
        if (implementationGuideId) {
          if (! await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
            throw new UnauthorizedException();
          }
           // await this.assertCanWriteById(user, implementationGuideId);
        }
        return await this.nonFhirResourcesService.createExample(example, implementationGuideId);
    }

    @Put(':id')
    public async updateExample(@User() user: ITofUser, @Param('id') id: string, @Body() example: INonFhirResource, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
        console.log('PUT -- checking perms on IG:', implementationGuideId);
        await this.assertIdMatch(id, example);
        await this.assertCanWriteById(user, id);
        if (implementationGuideId) {
          if (! await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
            throw new UnauthorizedException();
          }
         // await this.assertCanWriteById(user, implementationGuideId);
        }
        return await this.nonFhirResourcesService.updateExample(id, example, implementationGuideId);
    }

    @Delete(':id')
    public async deleteExample(@User() user: ITofUser, @Param('id') id: string) {
        this.nonFhirResourcesService.delete(id);
    }

}
