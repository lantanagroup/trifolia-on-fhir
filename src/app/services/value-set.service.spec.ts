import {inject, TestBed} from '@angular/core/testing';
import {ValueSetService} from './value-set.service';
import {HttpClientModule} from '@angular/common/http';

describe('ValueSetService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ValueSetService],
            imports: [HttpClientModule]
        });
    });

    it('should be created', inject([ValueSetService], (service: ValueSetService) => {
        expect(service).toBeTruthy();
    }));
});
