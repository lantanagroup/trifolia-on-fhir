import {inject, TestBed} from '@angular/core/testing';
import {ImportService} from './import.service';
import {HttpClientModule} from '@angular/common/http';

describe('ImportService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ImportService],
            imports: [HttpClientModule]
        });
    });

    it('should be created', inject([ImportService], (service: ImportService) => {
        expect(service).toBeTruthy();
    }));
});
