import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IFhirResource} from '@trifolia-fhir/models';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

    constructor(
        private http: HttpClient) {

    }

    public save(questionnaireId: string, questionnaire: IFhirResource): Observable<IFhirResource> {
        if (questionnaireId) {
            const url = '/api/questionnaires/' + encodeURIComponent(questionnaireId);
            return this.http.put<IFhirResource>(url, questionnaire);
        } else {
            return this.http.post<IFhirResource>('/api/questionnaires', questionnaire);
        }
    }

    public search(page = 1, name?: string, implementationGuideId?: string) {
        let url = '/api/questionnaires?resourcetype=Questionnaire' + '&page=' + encodeURIComponent(page.toString()) + '&';

        if (name) {
            url += 'name=' + encodeURIComponent(name) + '&';
        }

      if (implementationGuideId) {
        url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
      }

        return this.http.get<IFhirResource>(url);
    }

    public get(id: string) {
        let url = '/api/questionnaires/' + encodeURIComponent(id);
        url += "?_sort=name";
        return this.http.get<IFhirResource>(url);
    }

    public expand(id: string) {
        const url = '/api/questionnaires/' + encodeURIComponent(id) + '/expand';
        return this.http.get<IFhirResource>(url);
    }

    public delete(id: string) {
        const url = '/api/questionnaires/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
