import {Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { INonFhirResource } from '@trifolia-fhir/models';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { BaseDataController } from '../base/base-data.controller';
import { NonFhirResourcesService } from './non-fhir-resources.service';
import { User } from '../server.decorators';
import {FhirResourcesService} from '../fhirResources/fhirResources.service';
import { CdaExample, OtherNonFhirResource } from './types';

@Controller('api/nonFhirResources')
@UseGuards(AuthGuard('bearer'))
@ApiTags('NonFhirResources')
@ApiOAuth2([])
export class NonFhirResourcesController extends BaseDataController<INonFhirResource> {

    constructor(
        protected readonly nonFhirResourcesService: NonFhirResourcesService, 
        protected readonly fhirResourceService: FhirResourcesService
        ) {
        super(nonFhirResourcesService);
    }


    @Get('test') 
    public async test() {
      this.logger.log('hitting non-fhir test');
      let newRes; 

      const ids = [];
      let id: string;
      const res = []; 
      
      
      newRes = new OtherNonFhirResource();
      newRes.content = `test other content: ${new Date().toISOString()}`;
      newRes.cdaProperty = 'bad cda property here';
      ids.push((await this.nonFhirResourcesService.createNonFhirResource(newRes)).id);

      newRes = new CdaExample();
      newRes.content = `test CDA content: ${new Date().toISOString()}`;
      newRes.cdaProperty = `cdaProperty: ${new Date().toISOString()}`;
      ids.push((await this.nonFhirResourcesService.createNonFhirResource(newRes)).id);

      
      console.log('ids:', ids);      

      // id = ids[0]; //'64cc05431a04a1954824c499';
      // res.push(await this.nonFhirResourcesService.findById(id));

      // id = ids[1]; //'64cc05431a04a1954824c49c';
      // res.push(await this.nonFhirResourcesService.findById(id));

      id = '64cc095a4fa3f2a8f130e2d3';
      res.push(await this.nonFhirResourcesService.findById(id));

      
      res.push(await this.nonFhirResourcesService.getModel(new CdaExample()).findById(id));
      res.push(await this.nonFhirResourcesService.getModel(new OtherNonFhirResource()).findById(id));


      return res;

    }



    @Get(':id')
    public async getById(@User() user: ITofUser, @Param('id') id: string): Promise<INonFhirResource> {
        return await this.nonFhirResourcesService.findById(id);
    }

    @Post()
    public async createNonFhirResource(@User() user: ITofUser, @Body() nonFhirResource: INonFhirResource, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
        console.log('POST -- checking perms on IG:', implementationGuideId);
        if (implementationGuideId) {
          if (! await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
            throw new UnauthorizedException();
          }
           // await this.assertCanWriteById(user, implementationGuideId);
        }
        return await this.nonFhirResourcesService.createNonFhirResource(nonFhirResource, implementationGuideId);
    }

    @Put(':id')
    public async updateNonFhirResource(@User() user: ITofUser, @Param('id') id: string, @Body() nonFhirResource: INonFhirResource, @Query('implementationguideid') implementationGuideId?: string): Promise<INonFhirResource> {
        console.log('PUT -- checking perms on IG:', implementationGuideId);
        await this.assertIdMatch(id, nonFhirResource);
        await this.assertCanWriteById(user, id);
        if (implementationGuideId) {
          if (! await this.authService.userCanWriteFhirResource(user, implementationGuideId)) {
            throw new UnauthorizedException();
          }
         // await this.assertCanWriteById(user, implementationGuideId);
        }
        return await this.nonFhirResourcesService.updateNonFhirResource(id, nonFhirResource, implementationGuideId);
    }

    @Delete(':id')
    public async deleteNonFhirResource(@User() user: ITofUser, @Param('id') id: string) {
        await this.nonFhirResourcesService.deleteNonFhirResource(id);
    }

}
