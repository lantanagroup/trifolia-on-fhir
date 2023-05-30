import { Body, Controller, Header, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { IDomainResource } from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { fhirToFsh } from 'gofsh/dist/api';
import { fshToFhir } from 'fsh-sushi/dist/run';
import { FromFSHModel, ToFSHModel } from '../../../../libs/tof-lib/src/lib/fsh';
import { FhirServerVersion } from './server.decorators';
import { getFhirVersion } from '../../../../libs/tof-lib/src/lib/helper';

@Controller('api/fsh')
@UseGuards(AuthGuard('bearer'))
@ApiTags('FSH')
@ApiOAuth2([])
export class FshController {
  constructor() {
  }

  @Post('([\$])to-fsh')
  @ApiOperation({ summary: 'to-fsh', description: 'Converts a JSON resource to FSH', operationId: 'convertToFSH' })
  public async convertToFSH(@Body() resource: IDomainResource, @FhirServerVersion() fhirServerVersion) {
    const addFhirVersion = resource ? !resource.hasOwnProperty('fhirVersion') : false;

    if (addFhirVersion) {
      resource['fhirVersion'] = getFhirVersion(fhirServerVersion);
    }

    const converted = await fhirToFsh([resource]);
    return converted as ToFSHModel;
  }

  @Post('([\$])from-fsh')
  @ApiOperation({ summary: 'from-fsh', description: 'Converts FSH to a JSON resource', operationId: 'convertFromFSH' })
  public async convertFromFSH(@Body() fsh: string, @FhirServerVersion() fhirServerVersion) {
    const converted = await fshToFhir(fsh, {
      fhirVersion: getFhirVersion(fhirServerVersion)
    });
    return converted as FromFSHModel;
  }
}
