import {inject, TestBed} from '@angular/core/testing';
import {PractitionerService} from './practitioner.service';
import {HttpClientModule} from '@angular/common/http';

describe('PractitionerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PractitionerService],
            imports: [HttpClientModule]
        });
    });

    it('should be created', inject([PractitionerService], (service: PractitionerService) => {
        expect(service).toBeTruthy();
    }));
});
