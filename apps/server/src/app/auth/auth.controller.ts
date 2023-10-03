import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import type { ITofUser } from '@trifolia-fhir/tof-lib';
import { BaseController } from '../base/base.controller';
import { User } from '../server.decorators';
import { TofLogger } from '../tof-logger';
import { AuthService } from './auth.service';

@Controller('api/auth')
@UseGuards(AuthGuard('bearer'))
@ApiTags('User')
@ApiOAuth2([])
export class AuthController extends BaseController {

    protected readonly logger = new TofLogger(AuthController.name);

    constructor(
        private readonly authService: AuthService
        ) {
        super();
    }


    @Get('project/:projectId/can-read')
    public async userCanReadProject(@User() user: ITofUser, @Param('projectId') projectId: string): Promise<boolean> {
        return this.authService.userCanReadProject(user, projectId);
    }

    @Get('project/:projectId/can-write')
    public async userCanWriteProject(@User() user: ITofUser, @Param('projectId') projectId: string) : Promise<boolean> {
        return this.authService.userCanWriteProject(user, projectId);
    }

    @Get('fhirResource/:resourceId/can-read')
    public async userCanReadFhirResource(@User() user: ITofUser, @Param('resourceId') resourceId: string): Promise<boolean> {
        return this.authService.userCanReadFhirResource(user, resourceId);
    }

    @Get('fhirResource/:resourceId/can-write')
    public async userCanWriteFhirResource(@User() user: ITofUser, @Param('resourceId') resourceId: string) : Promise<boolean> {
        return this.authService.userCanWriteFhirResource(user, resourceId);
    }

    @Get('nonFhirResource/:resourceId/can-read')
    public async userCanReadNonFhirResource(@User() user: ITofUser, @Param('resourceId') resourceId: string): Promise<boolean> {
        return this.authService.userCanReadNonFhirResource(user, resourceId);
    }

    @Get('nonFhirResource/:resourceId/can-write')
    public async userCanWriteNonFhirResource(@User() user: ITofUser, @Param('resourceId') resourceId: string) : Promise<boolean> {
        return this.authService.userCanWriteNonFhirResource(user, resourceId);
    }


}
