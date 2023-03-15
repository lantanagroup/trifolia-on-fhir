import {Body, Controller, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {ProjectsService} from './projects.service';
import {BaseDataController} from '../base/base-data.controller';
import {ProjectDocument} from './project.schema';
import {IProject} from '@trifolia-fhir/models';
import {User} from '../server.decorators';
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
  public async createProject(@User() user, @Body() project: IProject) {

    project.author = user.user.name;
    project.contributors =  project.contributors || [];
    let contributor = {user: user.user.name}
    project.contributors.push(contributor);

    return await super.create(project);

  }

  @Put(':id')
  public async updateProject(@User() user, @Body() updatedProject: IProject, @Param('id') id: string) {

    super.assertIdMatch(id, updatedProject);

    const project = await this.projectService.findById(id);
    if (!project) {
      return null;
    }
    project.name = updatedProject.name;
    project.contributors = [...updatedProject.contributors];
    project.igs = [];
    for (const m of updatedProject.igs) {
      const confResource = await this.conformanceService.findById(m.id);
      project.igs.push(confResource);
    }
    return await super.update(id, project);

  }


  @Get(':id')
  public async getProject(@User() userProfile,  @Param('id') id: string) {
    if (!userProfile) return null;

    return await this.projectService.getProject(id);
  }
}
