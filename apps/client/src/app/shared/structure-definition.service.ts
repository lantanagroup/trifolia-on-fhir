import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Bundle, StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirService} from './fhir.service';
import {FileService} from './file.service';
import {StructureDefinition as R4StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';

@Injectable()
export class StructureDefinitionService {

  constructor(
    private http: HttpClient,
    private fhirService: FhirService,
    private fileService: FileService) {
  }

  public getBaseStructureDefinitions(type: string) {
    const url = `/api/structureDefinition/base/${type}`;
    return this.http.get<string[]>(url);
  }

  public getStructureDefinitions(page?: number, nameText?: string, urlText?: string, implementationGuideId?: string, titleText?: string): Observable<Bundle> {
    let url = '/api/structureDefinition?';

    if (page) {
      url += `page=${page.toString()}&`;
    }

    if (nameText) {
      url += `name=${encodeURIComponent(nameText)}&`;
    }

    if (urlText) {
      url += `urlText=${encodeURIComponent(urlText)}&`;
    }

    if (implementationGuideId) {
      url += `implementationGuideId=${encodeURIComponent(implementationGuideId)}&`;
    }

    if (titleText) {
      url += `title=${encodeURIComponent(titleText)}&`;
    }

    url += '_sort=name';

    return this.http.get<Bundle>(url);
  }

  public getStructureDefinition(id: string): Observable<STU3StructureDefinition | R4StructureDefinition> {
    if (id === 'from-file') {
      if (this.fileService.file) {
        return new Observable<STU3StructureDefinition | R4StructureDefinition>((observer) => {
          observer.next(<STU3StructureDefinition | R4StructureDefinition> this.fileService.file.resource);
        });
      }
    }

    const url = '/api/structureDefinition/' + encodeURIComponent(id);
    return this.http.get<STU3StructureDefinition | R4StructureDefinition>(url);
  }

  public getBaseStructureDefinition(baseDefinition: string, type?: string): Observable<STU3StructureDefinition | R4StructureDefinition> {
    let url = `/api/structureDefinition/base?url=${encodeURIComponent(baseDefinition)}&`;

    if (type) {
      url += `type=${encodeURIComponent(type)}&`;
    }

    return this.http.get<STU3StructureDefinition | R4StructureDefinition>(url);
  }

  public save(structureDefinition: STU3StructureDefinition | R4StructureDefinition): Observable<STU3StructureDefinition | R4StructureDefinition> {
    let url = '/api/structureDefinition';

    if (structureDefinition.id) {
      url += '/' + encodeURIComponent(structureDefinition.id);
      return this.http.put<STU3StructureDefinition | R4StructureDefinition>(url, structureDefinition);
    } else {
      return this.http.post<STU3StructureDefinition | R4StructureDefinition>(url, structureDefinition);
    }
  }

  public delete(id: string) {
    return this.http.delete('/api/structureDefinition/' + encodeURIComponent(id));
  }
}
