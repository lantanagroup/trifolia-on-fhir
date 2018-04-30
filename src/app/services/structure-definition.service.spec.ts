import { TestBed, inject } from '@angular/core/testing';

import { StructureDefinitionService } from './profile.service';

describe('StructureDefinitionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StructureDefinitionService]
    });
  });

  it('should be created', inject([StructureDefinitionService], (service: StructureDefinitionService) => {
    expect(service).toBeTruthy();
  }));
});
