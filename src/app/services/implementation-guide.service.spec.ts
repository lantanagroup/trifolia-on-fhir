import {inject, TestBed} from '@angular/core/testing';
import {ImplementationGuideService} from './implementation-guide.service';

describe('ImplementationGuideService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImplementationGuideService]
    });
  });

  it('should be created', inject([ImplementationGuideService], (service: ImplementationGuideService) => {
    expect(service).toBeTruthy();
  }));
});
