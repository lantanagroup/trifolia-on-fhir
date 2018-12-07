import {TestBed} from '@angular/core/testing';
import {QuestionnaireService} from './questionnaire.service';
import {HttpClientModule} from '@angular/common/http';

describe('QuestionnaireService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [QuestionnaireService],
        imports: [HttpClientModule]
    }));

    it('should be created', () => {
        const service: QuestionnaireService = TestBed.get(QuestionnaireService);
        expect(service).toBeTruthy();
    });
});
