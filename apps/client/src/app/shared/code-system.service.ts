import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IFhirResource} from '@trifolia-fhir/models';
import { FhirResourceService } from './fhir-resource.service';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class CodeSystemService extends FhirResourceService {

  constructor(
      protected http: HttpClient) {
      super(http);
  }

    public save(codeSystemId:string, codeSystem: IFhirResource): Observable<IFhirResource> {
        if (codeSystemId) {
            const url = '/api/codeSystems/' + encodeURIComponent(codeSystemId);
            return this.http.put<IFhirResource>(url, codeSystem);
        } else {
            return this.http.post<IFhirResource>('/api/codeSystems', codeSystem);
        }
    }

    public searchCodeSystem(page = 1, name?: string, implementationGuideId?: string) :  Observable<Paginated<IFhirResource>> {
        let url = '/api/codeSystems?resourcetype=CodeSystem&page=' + page + '&';

        if (name) {
            url += `name=${encodeURIComponent(name)}&`;
        }

        if (implementationGuideId) {
          url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
        }

        url += '_sort=name';

        return this.http.get<Paginated<IFhirResource>>(url);
    }

    public getCodeSystem(id: string): Observable<IFhirResource> {
        const url = '/api/codeSystems/' + encodeURIComponent(id);
        return this.http.get<IFhirResource>(url);
    }

    public delete(id: string) {
        const url = '/api/codeSystems/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
