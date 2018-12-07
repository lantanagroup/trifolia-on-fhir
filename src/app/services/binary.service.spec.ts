import {inject, TestBed} from '@angular/core/testing';
import {BinaryService} from './binary.service';
import {HttpClientModule} from '@angular/common/http';

describe('BinaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BinaryService],
      imports: [HttpClientModule]
    });
  });

  it('should be created', inject([BinaryService], (service: BinaryService) => {
    expect(service).toBeTruthy();
  }));
});
