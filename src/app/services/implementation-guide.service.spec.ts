import {inject, TestBed} from '@angular/core/testing';
import {ImplementationGuideService} from './implementation-guide.service';
import {HttpClientModule} from '@angular/common/http';

describe('ImplementationGuideService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ImplementationGuideService],
            imports: [HttpClientModule]
        });
    });

    it('should be created', inject([ImplementationGuideService], (service: ImplementationGuideService) => {
        expect(service).toBeTruthy();
    }));
});
