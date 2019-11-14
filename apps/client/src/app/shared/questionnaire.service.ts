import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Bundle, OperationOutcome, Questionnaire} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

    constructor(
        private http: HttpClient) {

    }

    public save(questionnaire: Questionnaire): Observable<Questionnaire> {
        if (questionnaire.id) {
            const url = '/api/questionnaire/' + encodeURIComponent(questionnaire.id);
            return this.http.put<Questionnaire>(url, questionnaire);
        } else {
            return this.http.post<Questionnaire>('/api/questionnaire', questionnaire);
        }
    }

    public search(page = 1, name?: string, implementationGuideId?: string) {
        let url = '/api/questionnaire?page=' + encodeURIComponent(page.toString()) + '&';

        if (name) {
            url += 'name=' + encodeURIComponent(name) + '&';
        }

      if (implementationGuideId) {
        url += `implementationGuideId=${encodeURIComponent(implementationGuideId)}&`;
      }

        return this.http.get<Bundle>(url);
    }

    public get(id: string) {
        let url = '/api/questionnaire/' + encodeURIComponent(id);
        url += "?_sort=name";
        return this.http.get<Questionnaire|OperationOutcome>(url);
    }

    public expand(id: string) {
        const url = '/api/questionnaire/' + encodeURIComponent(id) + '/expand';
        return this.http.get<Questionnaire>(url);
    }

    public delete(id: string) {
        const url = '/api/questionnaire/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
