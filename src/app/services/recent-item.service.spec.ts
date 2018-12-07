import {inject, TestBed} from '@angular/core/testing';
import {RecentItemService} from './recent-item.service';
import {ConfigService} from './config.service';
import {CookieService} from 'angular2-cookie/core';
import {Globals} from '../globals';
import {HttpClientModule} from '@angular/common/http';

describe('RecentItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecentItemService, ConfigService, CookieService, Globals],
      imports: [HttpClientModule]
    });
  });

  it('should be created', inject([RecentItemService], (service: RecentItemService) => {
    expect(service).toBeTruthy();
  }));
});
