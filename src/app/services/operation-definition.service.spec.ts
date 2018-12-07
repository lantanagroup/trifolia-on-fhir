import {inject, TestBed} from '@angular/core/testing';
import {OperationDefinitionService} from './operation-definition.service';
import {HttpClientModule} from '@angular/common/http';

describe('OperationDefinitionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [OperationDefinitionService],
            imports: [HttpClientModule]
        });
    });

    it('should be created', inject([OperationDefinitionService], (service: OperationDefinitionService) => {
        expect(service).toBeTruthy();
    }));
});
