import {inject, TestBed} from '@angular/core/testing';
import {FileService} from './file.service';
import {RouterTestingModule} from '@angular/router/testing';
import {FhirService} from './fhir.service';
import {ConfigService} from './config.service';
import {HttpClientModule} from '@angular/common/http';

describe('FileService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FileService, FhirService, ConfigService],
            imports: [RouterTestingModule, HttpClientModule]
        });
    });

    it('should be created', inject([FileService], (service: FileService) => {
        expect(service).toBeTruthy();
    }));
});
