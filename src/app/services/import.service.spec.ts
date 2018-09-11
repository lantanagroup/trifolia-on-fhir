import {inject, TestBed} from '@angular/core/testing';
import {ImportService} from './import.service';

describe('ImportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportService]
    });
  });

  it('should be created', inject([ImportService], (service: ImportService) => {
    expect(service).toBeTruthy();
  }));
});
