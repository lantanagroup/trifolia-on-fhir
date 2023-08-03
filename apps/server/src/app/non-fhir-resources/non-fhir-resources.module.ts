import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NonFhirResource, NonFhirResourceSchema } from './non-fhir-resource.schema';
import { NonFhirResourcesController } from './non-fhir-resources.controller';
import { NonFhirResourcesService } from './non-fhir-resources.service';
import { HistoryModule } from '../history/history.module';
import { FhirResourcesModule } from '../fhirResources/fhirResources.module';
import { CdaExampleSchema, OtherNonFhirResourceSchema } from './types';
import { NonFhirResourceType } from '@trifolia-fhir/models';

@Module({
    imports: [
        MongooseModule.forFeature([
            { 
                name: NonFhirResource.name, 
                schema: NonFhirResourceSchema,
                discriminators: [
                    { name: NonFhirResourceType.CdaExample, schema: CdaExampleSchema },
                    { name: NonFhirResourceType.Other, schema: OtherNonFhirResourceSchema }
                ]
            }
        ]),
        FhirResourcesModule,
        HistoryModule
    ],
    controllers: [NonFhirResourcesController],
    exports: [NonFhirResourcesService],
    providers: [NonFhirResourcesService]
})
export class NonFhirResourcesModule { }
