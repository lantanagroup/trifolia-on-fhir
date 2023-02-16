import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.schema';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}])],
  controllers: [ProjectsController],
  exports: [ProjectsService],
  providers: [ProjectsService],
})
export class ProjectsModule {}
