import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './project.schema';
import { BaseDataService } from '../base/base-data.service';



@Injectable()
export class ProjectsService extends BaseDataService<ProjectDocument> {

    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
        ) {
        super(projectModel);
    }
    
}