import {IProject} from '@trifolia-fhir/models';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ProjectService {

  constructor(private http: HttpClient) {
  }

  public getProjects(page?: number, name?: string, author?:string, Id?: string): Observable<IProject[]> {
    let url = '/api/projects?';

    if (page) {
      url += `page=${page.toString()}&`;
    }

    if (name) {
      url += `name=${encodeURIComponent(name)}&`;
    }

    if (author) {
      url += `author=${encodeURIComponent(author)}&`;
    }

    if (Id) {
      url += `_id=${encodeURIComponent(Id)}&`;
    }

    url += '_sort=name';

    return this.http.get<IProject[]>(url);
  }


  public getProject(id: string): Observable<IProject> {
    const url = '/api/projects/' + encodeURIComponent(id);
    return this.http.get<IProject>(url);
  }

  public save(project: IProject): Observable<IProject> {
    if (project.id) {
      const url = '/api/projects/' + encodeURIComponent(project.id);
      return this.http.put<IProject>(url, project);
    } else {
      return this.http.post<IProject>('/api/projects', project);
    }
  }

  public deleteProject(id: string): Observable<IProject> {
    const url = '/api/projects/' + encodeURIComponent(id);
    return this.http.delete<IProject>(url);
  }

  public deleteIg(id: string): Observable<IProject> {
    const url = '/api/projects/' + encodeURIComponent(id) + '/implementationGuide';
    return this.http.delete<IProject>(url);
  }
}
