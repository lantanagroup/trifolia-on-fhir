import {inject, TestBed} from '@angular/core/testing';
import {CodeSystemService} from './code-system.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';

describe('CodeSystemService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CodeSystemService],
            imports: [RouterTestingModule, HttpClientModule]
        });
    });

    it('should be created', inject([CodeSystemService], (service: CodeSystemService) => {
        expect(service).toBeTruthy();
    }));
});
