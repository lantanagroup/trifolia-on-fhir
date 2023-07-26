import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Example, ExampleSchema } from './example.schema';
import { ExamplesController } from './examples.controller';
import { ExamplesService } from './examples.service';
import { HistoryModule } from '../history/history.module';
import { FhirResourcesModule } from '../fhirResources/fhirResources.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Example.name, schema: ExampleSchema }
        ]),
        FhirResourcesModule,
        HistoryModule
    ],
    controllers: [ExamplesController],
    exports: [ExamplesService],
    providers: [ExamplesService]
})
export class ExamplesModule { }
