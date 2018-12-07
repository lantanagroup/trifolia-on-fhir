import {inject, TestBed} from '@angular/core/testing';
import {ConfigService} from './config.service';
import {Globals} from '../globals';
import {HttpClientModule} from '@angular/common/http';

describe('ConfigService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [ConfigService, Globals]
        });
    });

    it('should be created', inject([ConfigService], (service: ConfigService) => {
        expect(service).toBeTruthy();
    }));
});
