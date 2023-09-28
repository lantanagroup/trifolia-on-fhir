import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from '../history/history.module';
import { FhirResourcesController } from './fhir-resources.controller';
import { FhirResource, FhirResourceSchema } from './fhir-resource.schema';
import { FhirResourcesService } from './fhir-resources.service';
import { NonFhirResourceSchema } from '../non-fhir-resources/non-fhir-resource.schema';
import { NonFhirResource } from '@trifolia-fhir/models';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports:[
    forwardRef(() => HistoryModule),
    forwardRef(() => ProjectsModule),
    MongooseModule.forFeature([
      { name: FhirResource.name, schema: FhirResourceSchema },
      { name: NonFhirResource.name, schema: NonFhirResourceSchema }
    ])
  ],
  controllers: [FhirResourcesController],
  exports: [FhirResourcesService],
  providers: [FhirResourcesService]
})
export class FhirResourcesModule {}
