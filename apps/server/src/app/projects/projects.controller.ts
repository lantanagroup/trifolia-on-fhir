import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiOAuth2, ApiTags} from '@nestjs/swagger';
import {ProjectsService} from './projects.service';
import {BaseDataController} from '../base/base-data.controller';
import {ProjectDocument} from './project.schema';
import type {IBaseEntity, IFhirResource, IProject} from '@trifolia-fhir/models';
import {User} from '../server.decorators';
import {FhirResourcesService} from '../fhir-resources/fhir-resources.service';
import {Paginated} from '@trifolia-fhir/tof-lib';
import type {ITofUser} from '@trifolia-fhir/tof-lib';
import {TofNotFoundException} from '../../not-found-exception';
import { NonFhirResourcesService } from '../non-fhir-resources/non-fhir-resources.service';
import { AuditEntity } from '../audit/audit.decorator';


@Controller('api/projects')
@UseGuards(AuthGuard('bearer'))
@ApiTags('Project')
@ApiOAuth2([])
export class ProjectsController extends BaseDataController<ProjectDocument> {

  constructor(private readonly projectService: ProjectsService, protected fhirResourceService: FhirResourcesService, protected nonFhirResourceService: NonFhirResourcesService) {
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
    const filter = await this.authService.getPermissionFilterBase(user, 'read', null, true);

    filter.push({$match: this.getFilterFromRequest(req)});
    
    options.pipeline = filter;

    const res = await this.projectService.search(options);
    return res;
  }

  @Post()
  @AuditEntity('create', 'Project')
  public async createProject(@User() userProfile, @Body() project: IProject) {
    let createdProject: IProject = null;

    if (!userProfile) return null;

    project.author = userProfile.user.name;
    project.contributors = project.contributors || [];
    let contributor = { user: userProfile.user.name };
    project.contributors.push(contributor);

    const igResource = await this.fhirResourceService.getModel().findById(project.references[0].value['id']);
    if (igResource != null) {
      project.references[0].value = igResource.id;
      project.references[0].valueType = 'FhirResource';
      createdProject = await this.projectService.create(project);
      igResource.projects = [];
      for (const ref of (createdProject.references || []).filter(r => r.valueType === 'FhirResource')) {
        const refRes: IFhirResource = <IFhirResource>(await this.fhirResourceService.findById(ref.value.toString()));
        refRes.projects.push(createdProject);
        if (!refRes.referencedBy) {
          refRes.referencedBy = [];
        }
        refRes.referencedBy.push({value: createdProject.id, valueType: 'Project'});
        await this.fhirResourceService.updateOne(ref.value.toString(), refRes);
      }
    }
    return createdProject;
  }

  @Put(':id')
  @AuditEntity('update', 'Project')
  public async updateProject(@User() userProfile, @Body() updatedProject: IProject, @Param('id') id: string) {
    if (!userProfile) return null;

    await this.assertIdMatch(id, updatedProject);
    await this.assertCanWriteById(userProfile, id);

    const project: IProject = await this.projectService.findById(id);
    if (!project) {
      return null;
    }
    project.name = updatedProject.name;
    project.contributors = [...updatedProject.contributors];
    project.permissions = [...updatedProject.permissions];
    project.references = [];
    for (const upRef of updatedProject.references) {
      const service = upRef.valueType === 'NonFhirResource' ? this.nonFhirResourceService : this.fhirResourceService;
      const refRes = await service.findById(typeof upRef.value === 'string' ? upRef.value : upRef.value.id);
      let refResUpdated = false;
      project.references.push({ 'value': refRes, 'valueType': upRef.valueType });
      
      // ensure referenced resources have a reference to this project
      if (!refRes.projects) {
        refRes.projects = [];
      }
      if (!refRes.projects.some(r => 
        (typeof r === typeof {} && 'id' in r && r.id === project.id) || (r.toString() === project.id)
        )) {
          refRes.projects.push(project);
          refResUpdated = true;
      }

      // ensure referencedBy set for direct children
      if (!refRes.referencedBy) {
        refRes.referencedBy = [];
      }
      if (!refRes.referencedBy.filter(r => r.valueType === 'Project').some(r => 
        (typeof r.value === typeof {} && 'id' in <IBaseEntity>r.value && (<IBaseEntity>r.value).id === project.id) || (r.value.toString() === project.id)
        )) {
          refRes.referencedBy.push({value: project.id, valueType: 'Project'});
          refResUpdated = true;
      }

      if (refResUpdated) {
        await service.getModel().updateOne({_id: refRes.id}, refRes);
      }
    }
    return await super.update(id, project);

  }


  @Get(':id')
  public async getProject(@User() userProfile, @Param('id') id: string) {
    if (!userProfile) return null;
    await this.assertCanReadById(userProfile, id);
    let proj = await this.projectService.getProject(id);
    if (!proj) {
      throw new TofNotFoundException();
    }
    return proj;
  }

  @Delete('/:id/implementationGuide')
  @AuditEntity('delete', 'Project')
  public async removeImplementationGuideFromProjects(@User() userProfile, @Param('id') id: string) {

    if (!userProfile) return null;

    let fhirResourceDoc = await this.fhirResourceService.getModel().findById(id);
    if (!fhirResourceDoc) {
      throw new TofNotFoundException('No resource found with that Id.');
    }
    // remove it from every project
    for (const projectId of fhirResourceDoc.projects) {
      let project = await this.projectService.findById(projectId.toString());
      project.references.splice(project.references.indexOf(fhirResourceDoc.id), 1);
      if (project.references.length != 0) {
        await this.projectService.updateOne(project.id, project);
      } else {
        await this.projectService.delete(project.id);
      }
    }
  }

}
