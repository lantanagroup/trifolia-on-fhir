import {Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { INonFhirResource } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { BaseDataController } from '../base/base-data.controller';
import { NonFhirResourcesService } from './non-fhir-resources.service';
import { User } from '../server.decorators';
import {FhirResourcesService} from '../fhirResources/fhirResources.service';
import { type NonFhirResourceDocument } from './non-fhir-resource.schema';

@Controller('api/nonFhirResources')
@UseGuards(AuthGuard('bearer'))
@ApiTags('NonFhirResources')
@ApiOAuth2([])
export class NonFhirResourcesController extends BaseDataController<NonFhirResourceDocument> {

    constructor(
        protected readonly nonFhirResourcesService: NonFhirResourcesService, 
        protected readonly fhirResourceService: FhirResourcesService
        ) {
        super(nonFhirResourcesService);
    }

    @Post()
    public async createNonFhirResource(@User() user: ITofUser, @Body() nonFhirResource: NonFhirResourceDocument, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
        console.log('POST -- checking perms on IG:', implementationGuideId);
        if (implementationGuideId) {
          if (! await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
            throw new UnauthorizedException();
          }
           // await this.assertCanWriteById(user, implementationGuideId);
        }
        return await this.nonFhirResourcesService.create(nonFhirResource, implementationGuideId);
    }

    @Put(':id')
    public async updateNonFhirResource(@User() user: ITofUser, @Param('id') id: string, @Body() nonFhirResource: NonFhirResourceDocument, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
        console.log('PUT -- checking perms on IG:', implementationGuideId);
        await this.assertIdMatch(id, nonFhirResource);
        await this.assertCanWriteById(user, id);
        if (implementationGuideId) {
          if (! await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
            throw new UnauthorizedException();
          }
         // await this.assertCanWriteById(user, implementationGuideId);
        }
        return await this.nonFhirResourcesService.updateOne(id, nonFhirResource, implementationGuideId);
    }

    @Delete(':id')
    public async deleteNonFhirResource(@User() user: ITofUser, @Param('id') id: string) {
        await this.nonFhirResourcesService.delete(id);
    }

}