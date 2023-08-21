import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NonFhirResourceSchema } from './non-fhir-resource.schema';
import { NonFhirResourcesController } from './non-fhir-resources.controller';
import { NonFhirResourcesService } from './non-fhir-resources.service';
import { HistoryModule } from '../history/history.module';
import { FhirResourcesModule } from '../fhirResources/fhirResources.module';
import { CdaExampleSchema, OtherNonFhirResourceSchema , PageSchema, StructureDefinitionIntroSchema, StructureDefinitionNotesSchema} from './types';
import { NonFhirResource, NonFhirResourceType } from '@trifolia-fhir/models';
//import {PageSchema} from './types/page.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: NonFhirResource.name,
                schema: NonFhirResourceSchema,
                discriminators: [
                    { name: NonFhirResourceType.CdaExample, schema: CdaExampleSchema },
                    { name: NonFhirResourceType.StructureDefinitionIntro, schema: StructureDefinitionIntroSchema },
                    { name: NonFhirResourceType.StructureDefinitionNotes, schema: StructureDefinitionNotesSchema },
                    { name: NonFhirResourceType.Page, schema: PageSchema },
                    { name: NonFhirResourceType.OtherNonFhirResource, schema: OtherNonFhirResourceSchema }
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
