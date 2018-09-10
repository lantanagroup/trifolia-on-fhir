import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Bundle, Questionnaire} from '../models/stu3/fhir';
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

    public search() {
        return this.http.get<Bundle>('/api/questionnaire?_summary=true');
    }

    public get(id: string) {
        const url = '/api/questionnaire/' + encodeURIComponent(id);
        return this.http.get<Questionnaire>(url);
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
