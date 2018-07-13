import { TestBed, inject } from '@angular/core/testing';

import { CodeSystemService } from './code-system.service';

describe('CodeSystemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeSystemService]
    });
  });

  it('should be created', inject([CodeSystemService], (service: CodeSystemService) => {
    expect(service).toBeTruthy();
  }));
});
