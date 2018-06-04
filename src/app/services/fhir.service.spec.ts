import { TestBed, inject } from '@angular/core/testing';

import { FhirService } from './fhir.service';

describe('FhirService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FhirService]
    });
  });

  it('should be created', inject([FhirService], (service: FhirService) => {
    expect(service).toBeTruthy();
  }));
});
