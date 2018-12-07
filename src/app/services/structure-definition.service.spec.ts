import {inject, TestBed} from '@angular/core/testing';
import {StructureDefinitionService} from './structure-definition.service';
import {HttpClientModule} from '@angular/common/http';
import {FhirService} from './fhir.service';
import {FileService} from './file.service';
import {Globals} from '../globals';
import {ConfigService} from './config.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('StructureDefinitionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StructureDefinitionService, FhirService, FileService, Globals, ConfigService],
            imports: [HttpClientModule, RouterTestingModule]
        });
    });

    it('should be created', inject([StructureDefinitionService], (service: StructureDefinitionService) => {
        expect(service).toBeTruthy();
    }));
});
