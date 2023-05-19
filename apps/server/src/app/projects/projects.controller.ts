import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { BaseDataController } from '../base/base-data.controller';
import { ProjectDocument } from './project.schema';
import type { IConformance, IProject } from '@trifolia-fhir/models';
import { User } from '../server.decorators';
import { Conformance } from '../conformance/conformance.schema';
import { ConformanceService } from '../conformance/conformance.service';
import { Paginated } from '@trifolia-fhir/tof-lib';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { TofNotFoundException } from '../../not-found-exception';


@Controller('api/project')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Project')
@ApiOAuth2([])
export class ProjectsController extends BaseDataController<ProjectDocument>{

  constructor(private readonly projectService: ProjectsService, protected conformanceService: ConformanceService) {
    super(projectService);
  }

  protected getFilterFromRequest(req?: any): any {
    let filter = super.getFilterFromRequest(req);

    if (!req || !req.query) {
      return filter;
    }
    let query = req.query;

    if ('name' in query) {
      filter['name'] = { $regex: query['name'], $options: 'i' };
    }
    if ('author' in query) {
      filter['author'] = { $regex: query['author'], $options: 'i' };
    }
    return filter;
  }


  @Get()
  public async searchProject(@User() user: ITofUser, @Query() query?: any, @Request() req?: any): Promise<Paginated<IProject>> {

    let options = this.getPaginateOptionsFromRequest(req);
    const baseFilter = await this.authService.getPermissionFilterBase(user, 'read');

    const filter = {
      $and: [baseFilter, this.getFilterFromRequest(req)]
    };
    options.filter = filter;

    const res = await this.projectService.search(options);
    return res;
  }

  @Post()
  public async createProject(@User() userProfile, @Body() project: IProject) {
    if (!userProfile) return null;

    project.author = userProfile.user.name;
    project.contributors = project.contributors || [];
    let contributor = { user: userProfile.user.name }
    project.contributors.push(contributor);

    const confResource = await this.conformanceService.getModel().findById(project.igs[0].id);
    project.igs[0] = confResource.id;
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
      const confResource: Conformance = <Conformance>(await this.conformanceService.findById(m.id));
      project.igs.push(confResource);
    }
    return await super.update(id, project);

  }


  @Get(':id')
  public async getProject(@User() userProfile, @Param('id') id: string) {
    if (!userProfile) return null;
    await this.assertCanReadById(userProfile, id);
    let proj = await this.projectService.getProject(id);
    if(!proj) {
      throw new TofNotFoundException();
    }
    return proj;
  }

  @Delete('/:id/implementationGuide')
  public async removeImplementationGuideFromProjects(@User() userProfile, @Param('id') id: string) {

    if (!userProfile) return null;

    let conformanceDoc = <Conformance>await this.conformanceService.findById(id);
    if (!conformanceDoc) {
      throw new TofNotFoundException("No resource found with that Id.");
    }
    // remove it from every project
    for (const projectId of conformanceDoc.projects) {
      let project = await this.projectService.findById(projectId.toString());
      project.igs.splice(project.igs.indexOf(conformanceDoc), 1);
      if (project.igs.length != 0) {
        await this.projectService.updateOne(project.id, project);
      } else {
        await this.projectService.delete(project.id);
      }
    }
  }


}
