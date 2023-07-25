import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from '../history/history.module';
import { ConformanceController } from './conformance.controller';
import { FhirResource, FhirResourceSchema } from './fhirResource.schema';
import { ConformanceService } from './conformance.service';
import { Example, ExampleSchema } from '../examples/example.schema';

@Module({
  imports:[
    HistoryModule,
    MongooseModule.forFeature([
      { name: FhirResource.name, schema: FhirResourceSchema },
      { name: Example.name, schema: ExampleSchema }
    ])
  ],
  controllers: [ConformanceController],
  exports: [ConformanceService],
  providers: [ConformanceService]
})
export class ConformanceModule {}
