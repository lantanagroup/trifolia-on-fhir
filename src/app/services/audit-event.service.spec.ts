import {inject, TestBed} from '@angular/core/testing';
import {AuditEventService} from './audit-event.service';

describe('AuditEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditEventService]
    });
  });

  it('should be created', inject([AuditEventService], (service: AuditEventService) => {
    expect(service).toBeTruthy();
  }));
});
