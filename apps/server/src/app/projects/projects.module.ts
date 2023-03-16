import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.schema';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import {ConformanceModule} from '../conformance/conformance.module';

@Module({
  imports: [ConformanceModule, MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}])],
  controllers: [ProjectsController],
  exports: [ProjectsService],
  providers: [ProjectsService],
})
export class ProjectsModule {}
