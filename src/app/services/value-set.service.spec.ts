import {inject, TestBed} from '@angular/core/testing';
import {ValueSetService} from './value-set.service';

describe('ValueSetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueSetService]
    });
  });

  it('should be created', inject([ValueSetService], (service: ValueSetService) => {
    expect(service).toBeTruthy();
  }));
});
