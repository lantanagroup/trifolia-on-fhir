import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Binary} from '../models/fhir';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BinaryService {

    constructor(private http: HttpClient) {
    }

    public save(binary: Binary): Observable<Binary> {
        if (binary.id) {
            const url = '/api/binary/' + encodeURIComponent(binary.id);
            return this.http.put<Binary>(url, binary);
        } else {
            return this.http.post<Binary>('/api/binary', binary);
        }
    }

    public search() {
        return this.http.get<Binary[]>('/api/binary');
    }

    public get(id: string) {
        const url = '/api/binary/' + encodeURIComponent(id);
        return this.http.get<Binary>(url);
    }

    public delete(id: string) {
        const url = '/api/binary/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
