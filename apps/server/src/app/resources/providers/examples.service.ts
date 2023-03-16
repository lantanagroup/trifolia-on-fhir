import { Injectable } from '@nestjs/common';
import { TofLogger } from '../../tof-logger';
import { ResourcesService } from './resources.service';

@Injectable()
export class ExamplesService extends ResourcesService {

    protected readonly logger = new TofLogger(ExamplesService.name);
    
}
