import {inject, TestBed} from '@angular/core/testing';
import {ExportService} from './export.service';
import {SocketService} from './socket.service';
import {HttpClientModule} from '@angular/common/http';

describe('ExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ExportService, SocketService]
    });
  });

  it('should be created', inject([ExportService], (service: ExportService) => {
    expect(service).toBeTruthy();
  }));
});
