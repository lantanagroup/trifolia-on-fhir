import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NonFhirResourceSchema } from './non-fhir-resource.schema';
import { NonFhirResourcesController } from './non-fhir-resources.controller';
import { NonFhirResourcesService } from './non-fhir-resources.service';
import { HistoryModule } from '../history/history.module';
import { FhirResourcesModule } from '../fhir-resources/fhir-resources.module';
import { CdaExampleSchema, OtherNonFhirResourceSchema , PageSchema, CustomMenuSchema, StructureDefinitionIntroSchema, StructureDefinitionNotesSchema, IgnoreWarningsSchema} from './types';
import { NonFhirResource, NonFhirResourceType } from '@trifolia-fhir/models';
import { ProjectsModule } from '../projects/projects.module';

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
                    { name: NonFhirResourceType.CustomMenu, schema: CustomMenuSchema },
                    { name: NonFhirResourceType.IgnoreWarnings, schema: IgnoreWarningsSchema},
                    { name: NonFhirResourceType.Page, schema: PageSchema },
                    { name: NonFhirResourceType.OtherNonFhirResource, schema: OtherNonFhirResourceSchema }
                ]
            }
        ]),
        forwardRef(() => FhirResourcesModule),
        forwardRef(() => HistoryModule),
        forwardRef(() => ProjectsModule)
    ],
    controllers: [NonFhirResourcesController],
    exports: [NonFhirResourcesService],
    providers: [NonFhirResourcesService]
})
export class NonFhirResourcesModule { }
