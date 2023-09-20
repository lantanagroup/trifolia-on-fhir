import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './project.schema';
import { BaseDataService } from '../base/base-data.service';
import {IProject} from '@trifolia-fhir/models';
import { TofLogger } from '../tof-logger';



@Injectable()
export class ProjectsService extends BaseDataService<ProjectDocument> {

    protected readonly logger = new TofLogger(ProjectsService.name);

    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
        ) {
        super(projectModel);
    }

    public async getProject(projectId: string) : Promise<IProject> {
      return this.projectModel.findById(projectId).populate(["references.value"]).exec();
    }

}
