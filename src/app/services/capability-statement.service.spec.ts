import {inject, TestBed} from '@angular/core/testing';
import {CapabilityStatementService} from './capability-statement.service';

describe('CapabilityStatementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapabilityStatementService]
    });
  });

  it('should be created', inject([CapabilityStatementService], (service: CapabilityStatementService) => {
    expect(service).toBeTruthy();
  }));
});
