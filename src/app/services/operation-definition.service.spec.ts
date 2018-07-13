import { TestBed, inject } from '@angular/core/testing';

import { OperationDefinitionService } from './operation-definition.service';

describe('OperationDefinitionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationDefinitionService]
    });
  });

  it('should be created', inject([OperationDefinitionService], (service: OperationDefinitionService) => {
    expect(service).toBeTruthy();
  }));
});
