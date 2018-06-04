import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class FhirService {

    constructor(
        private http: HttpClient) {
    }

    public get(resourceType: string) {
        // TODO
    }
}
