import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from '../history/history.module';
import { FhirResourcesController } from './fhirResources.controller';
import { FhirResource, FhirResourceSchema } from './fhirResource.schema';
import { FhirResourcesService } from './fhirResources.service';
import { Example, ExampleSchema } from '../examples/example.schema';

@Module({
  imports:[
    HistoryModule,
    MongooseModule.forFeature([
      { name: FhirResource.name, schema: FhirResourceSchema },
      { name: Example.name, schema: ExampleSchema }
    ])
  ],
  controllers: [FhirResourcesController],
  exports: [FhirResourcesService],
  providers: [FhirResourcesService]
})
export class FhirResourcesModule {}
