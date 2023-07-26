import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FhirResourcesModule } from '../fhirResources/fhirResources.module';
import { Project, ProjectSchema } from './project.schema';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    forwardRef(() => FhirResourcesModule),
    MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}])],
  controllers: [ProjectsController],
  exports: [ProjectsService],
  providers: [ProjectsService],
})
export class ProjectsModule {}
