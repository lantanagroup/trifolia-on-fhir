import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Bundle, OperationOutcome, Questionnaire} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import {IConformance} from '@trifolia-fhir/models';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

    constructor(
        private http: HttpClient) {

    }

    public save(questionnaireId: string, questionnaire: IConformance): Observable<IConformance> {
        if (questionnaireId) {
            const url = '/api/questionnaire/' + encodeURIComponent(questionnaireId);
            return this.http.put<IConformance>(url, questionnaire);
        } else {
            return this.http.post<IConformance>('/api/questionnaire', questionnaire);
        }
    }

    public search(page = 1, name?: string, implementationGuideId?: string) {
        let url = '/api/questionnaire?resourcetype=Questionnaire' + '&page=' + encodeURIComponent(page.toString()) + '&';

        if (name) {
            url += 'name=' + encodeURIComponent(name) + '&';
        }

      if (implementationGuideId) {
        url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
      }

        return this.http.get<IConformance>(url);
    }

    public get(id: string) {
        let url = '/api/questionnaire/' + encodeURIComponent(id);
        url += "?_sort=name";
        return this.http.get<IConformance>(url);
    }

    public expand(id: string) {
        const url = '/api/questionnaire/' + encodeURIComponent(id) + '/expand';
        return this.http.get<IConformance>(url);
    }

    public delete(id: string) {
        const url = '/api/questionnaire/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
