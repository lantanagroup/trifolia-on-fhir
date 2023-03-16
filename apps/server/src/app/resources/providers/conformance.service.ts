import { Injectable } from '@nestjs/common';
import { IBaseDataService } from '../../base/interfaces';
import { TofLogger } from '../../tof-logger';
import { ResourcesService, ProjectResourceType } from './resources.service';

@Injectable()
export class ConformanceService extends ResourcesService {

    protected readonly logger = new TofLogger(ConformanceService.name);
    
}
