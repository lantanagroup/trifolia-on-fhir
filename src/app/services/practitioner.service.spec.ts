import {inject, TestBed} from '@angular/core/testing';
import {PractitionerService} from './practitioner.service';

describe('PractitionerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PractitionerService]
    });
  });

  it('should be created', inject([PractitionerService], (service: PractitionerService) => {
    expect(service).toBeTruthy();
  }));
});
