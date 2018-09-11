import {inject, TestBed} from '@angular/core/testing';
import {BinaryService} from './binary.service';

describe('BinaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BinaryService]
    });
  });

  it('should be created', inject([BinaryService], (service: BinaryService) => {
    expect(service).toBeTruthy();
  }));
});
