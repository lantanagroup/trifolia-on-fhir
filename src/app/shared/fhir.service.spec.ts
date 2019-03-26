import {inject, TestBed} from '@angular/core/testing';
import {FhirService} from './fhir.service';
import {HttpClientModule} from '@angular/common/http';
import {ConfigService} from './config.service';

describe('FhirService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FhirService, ConfigService],
      imports: [HttpClientModule]
    });
  });

  it('should be created', inject([FhirService], (service: FhirService) => {
    expect(service).toBeTruthy();
  }));
});
