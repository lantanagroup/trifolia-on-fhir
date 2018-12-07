import {inject, TestBed} from '@angular/core/testing';
import {CapabilityStatementService} from './capability-statement.service';
import {HttpClientModule} from '@angular/common/http';

describe('CapabilityStatementService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CapabilityStatementService],
            imports: [HttpClientModule]
        });
    });

    it('should be created', inject([CapabilityStatementService], (service: CapabilityStatementService) => {
        expect(service).toBeTruthy();
    }));
});
