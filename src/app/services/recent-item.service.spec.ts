import {inject, TestBed} from '@angular/core/testing';
import {RecentItemService} from './recent-item.service';

describe('RecentItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecentItemService]
    });
  });

  it('should be created', inject([RecentItemService], (service: RecentItemService) => {
    expect(service).toBeTruthy();
  }));
});
