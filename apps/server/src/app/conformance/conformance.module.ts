import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from '../history/history.module';
import { ConformanceController } from './conformance.controller';
import { Conformance, ConformanceSchema } from './conformance.schema';
import { ConformanceService } from './conformance.service';
import { ExamplesModule } from '../examples/examples.module';
import { Example, ExampleSchema } from '../examples/example.schema';

@Module({
  imports:[
    HistoryModule,
    MongooseModule.forFeature([
      { name: Conformance.name, schema: ConformanceSchema },
      { name: Example.name, schema: ExampleSchema }
    ])
  ],
  controllers: [ConformanceController],
  exports: [ConformanceService],
  providers: [ConformanceService]
})
export class ConformanceModule {}
