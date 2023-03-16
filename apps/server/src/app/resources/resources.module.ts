import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conformance, ConformanceSchema } from './schemas/conformance.schema';
import { ConformanceService } from './providers/conformance.service';
import { Example, ExampleSchema } from './schemas/example.schema';
import { History, HistorySchema } from './schemas/history.schema';
import { ResourcesController } from './controllers/resources.controller';
import { ResourcesService } from './providers/resources.service';
import { ExamplesService } from './providers/examples.service';
import { HistoryService } from './providers/history.service';
import { ExamplesController } from './controllers/examples.controller';
import { ConformanceController } from './controllers/conformance.controller';
import { HistoryController } from './controllers/history.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: Conformance.name, schema: ConformanceSchema },
      { name: Example.name, schema: ExampleSchema },
      { name: History.name, schema: HistorySchema },
    ]),
  ],
  controllers: [
    ConformanceController,
    ExamplesController,
    HistoryController,
    ResourcesController
  ],
  exports: [
    ConformanceService,
    ExamplesService,
    HistoryService,
    ResourcesService
  ],
  providers: [
    ConformanceService,
    ExamplesService,
    HistoryService,
    ResourcesService
  ],
})
export class ResourcesModule {}
