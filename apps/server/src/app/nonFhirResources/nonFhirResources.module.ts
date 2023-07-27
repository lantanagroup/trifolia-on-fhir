import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NonFhirResource, NonFhirResourceSchema } from './nonFhirResource.schema';
import { NonFhirResourcesController } from './nonFhirResources.controller';
import { NonFhirResourcesService } from './nonFhirResources.service';
import { HistoryModule } from '../history/history.module';
import { FhirResourcesModule } from '../fhirResources/fhirResources.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: NonFhirResource.name, schema: NonFhirResourceSchema }
        ]),
        FhirResourcesModule,
        HistoryModule
    ],
    controllers: [NonFhirResourcesController],
    exports: [NonFhirResourcesService],
    providers: [NonFhirResourcesService]
})
export class NonFhirResourcesModule { }
