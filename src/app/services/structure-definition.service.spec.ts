import {inject, TestBed} from '@angular/core/testing';
import {StructureDefinitionService} from './structure-definition.service';

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
