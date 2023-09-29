import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FhirResourcesModule } from '../fhir-resources/fhir-resources.module';
import { Project, ProjectSchema } from './project.schema';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { NonFhirResourcesModule } from '../non-fhir-resources/non-fhir-resources.module';

@Module({
  imports: [
    forwardRef(() => FhirResourcesModule),
    forwardRef(() => NonFhirResourcesModule),
    MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}])],
  controllers: [ProjectsController],
  exports: [ProjectsService],
  providers: [ProjectsService],
})
export class ProjectsModule {}
