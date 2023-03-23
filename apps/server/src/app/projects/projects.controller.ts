import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {ProjectsService} from './projects.service';
import {BaseDataController} from '../base/base-data.controller';
import {ProjectDocument} from './project.schema';
import type {IConformance, IProject} from '@trifolia-fhir/models';
import {User} from '../server.decorators';
import {Conformance} from '../conformance/conformance.schema';
import {ConformanceService} from '../conformance/conformance.service';

@Controller('api/project')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Project')
@ApiOAuth2([])
export class ProjectsController extends BaseDataController<ProjectDocument>{

  constructor(private readonly projectService: ProjectsService, protected conformanceService: ConformanceService) {
    super(projectService);
  }

  protected getFilterFromQuery(query?: any) : any {
    let filter = super.getFilterFromQuery(query);

    if (!query) {
      return filter;
    }
    if ('name' in query) {
      filter['name'] = { $regex: query['name'], $options: 'i' };
    }
    if ('author' in query) {
      filter['author'] = { $regex: query['author'], $options: 'i' };
    }
    return filter;
  }

  @Post()
  public async createProject(@User() userProfile, @Body() project: IProject) {
    if (!userProfile) return null;

    project.author = userProfile.user.name;
    project.contributors =  project.contributors || [];
    let contributor = {user: userProfile.user.name}
    project.contributors.push(contributor);

    const createdProject = await super.create(project);

    for (const id of createdProject.igs) {
      const confResource: IConformance = <IConformance>(await this.conformanceService.findById(id.toString()));
      confResource.projects = [];
      confResource.projects.push(createdProject);
      await this.conformanceService.updateOne(id.toString(), confResource);
    }
    return createdProject;
  }

  @Put(':id')
  public async updateProject(@User() userProfile, @Body() updatedProject: IProject, @Param('id') id: string) {
    if (!userProfile) return null;

    super.assertIdMatch(id, updatedProject);

    const project = await this.projectService.findById(id);
    if (!project) {
      return null;
    }
    project.name = updatedProject.name;
    project.contributors = [...updatedProject.contributors];
    project.igs = [];
    for (const m of updatedProject.igs) {
      const confResource: IConformance = <IConformance>(await this.conformanceService.findById(m.id));
      project.igs.push(confResource);
    }
    return await super.update(id, project);

  }


  @Get(':id')
  public async getProject(@User() userProfile,  @Param('id') id: string) {
    if (!userProfile) return null;
    return await this.projectService.getProject(id);
  }

  @Delete('/:id/implementationGuide')
  public async removeImplementationGuideFromProjects(@User() userProfile, @Param('id') id: string) {

    if (!userProfile) return null;

    let conformanceDoc = <Conformance>await this.conformanceService.findById(id);
    if(!conformanceDoc ){
      throw new NotFoundException("No resource found with that Id.");
    }
    // remove it from every project
    for (const projectId of conformanceDoc.projects) {
      let project =  await this.projectService.findById(projectId.toString());
      project.igs.splice(project.igs.indexOf(conformanceDoc),1);
      if (project.igs.length != 0) {
        await this.projectService.updateOne(project.id, project);
      } else {
        await this.projectService.delete(project.id);
      }
    }
  }


}
