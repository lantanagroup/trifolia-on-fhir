import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import * as _ from 'underscore';
import * as SHA from 'js-sha1';

export interface RepositoryOwnerModel {
    login: string;
    id: string;
    node_id: string;
    avatar_url: string;
    url: string;
    html_url: string;
    type: string;
    site_admin: boolean;
}

export interface RepositoryModel {
    id: string;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: RepositoryOwnerModel;
    html_url: string;
    description: string;
    fork: false;
    url: string;
    size: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    license: string;
    open_issues: number;
    watchers: number;
    default_branch: string;
}

export interface ContentModel {
    type: string;
    encoding: string;
    size: number;
    name: string;
    path: string;
    content: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string;
}

export interface BranchModel {
    name: string;
    commit?: {
        sha: string;
        url: string;
    };
    protected?: boolean;
    protection_url?: string;
}

export interface UserModel {
    login: string;
    id: string;
    node_id: string;
    avatar_url: string;
    html_url: string;
    url: string;
    repos_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class GithubService {
    public token: string;
    public authChanged: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient) {

        this.token = localStorage.getItem('github-token');

        // Watch for changes to the local storage. GitHub auth is handled in a separate window, and sets the key
        // in the local storage when logged in. Retrieve the key from local storage when the storage changes.
        window.addEventListener('storage', () => {
            const newToken = localStorage.getItem('github-token');

            if (this.token !== newToken) {
                this.token = newToken;
                this.authChanged.emit();
            }
        });
    }

    private getOptions() {
        return {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'Bearer ' + this.token
            }
        };
    }

    public login(): Observable<any> {
        if (this.token) {
            return new Observable((observer) => observer.next());
        }

        const url = 'https://github.com/login/oauth/authorize?client_id=3c6a5975e04b6feb6de2&scope=user,repo&allow_signup=false';
        const activeWin = window.open(url,'loginGitHub', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=SomeSize,height=SomeSize');

        return new Observable<any>((observer) => {
            if (!activeWin) {
                observer.error('Could not open window to login to GitHub. Please ensure pop-ups are not blocked.');
                observer.complete();
                return;
            }
            activeWin.onunload = () => {
                setTimeout(() => {
                    if (this.token) {
                        observer.next();
                    } else {
                        observer.error('Not logged into GitHub.');
                    }
                    observer.complete();
                }, 1000);
            };
        });
    }

    public getUser(): Observable<UserModel> {
        return new Observable<UserModel>((observer) => {
            this.login()
                .subscribe(() => {
                    this.http.get<UserModel>('https://api.github.com/user', this.getOptions())
                        .subscribe((user) => {
                            observer.next(user);
                            observer.complete();
                        }, (err) => {
                            observer.error(err);
                            observer.complete();
                        });
                }, (err) => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    public getRepositories(): Observable<RepositoryModel[]> {
        return new Observable<RepositoryModel[]>((observer) => {
            this.login()
                .subscribe(() => {
                    this.http.get<RepositoryModel[]>('https://api.github.com/user/repos?per_page=100', this.getOptions())
                        .subscribe((repositories) => {
                            observer.next(repositories);
                            observer.complete();
                        }, (err) => {
                            observer.error(err);
                            observer.complete();
                        });
                }, (err) => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    public getBranches(ownerLogin: string, repositoryName: string): Observable<BranchModel[]> {
        return new Observable<BranchModel[]>((observer) => {
            this.login()
                .subscribe(() => {
                    const url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/branches`;

                    this.http.get<BranchModel[]>(url, this.getOptions())
                        .subscribe((branches) => {
                            observer.next(branches);
                            observer.complete();
                        }, (err) => {
                            observer.error(err);
                            observer.complete();
                        });
                }, (err) => observer.error(err));
        });
    }

    public getAllContents(ownerLogin: string, repositoryName: string, branchName: string, id: string) {
        if (id.startsWith('file|')) {
            return this.getContents(ownerLogin, repositoryName, branchName, id.substring(5));
        } else if (id.startsWith('dir|')) {
            return new Observable<ContentModel[]>((observer) => {
                this.getContents(ownerLogin, repositoryName, branchName, id.substring(4))
                    .subscribe((dirContents) => {
                        const observables = _.map(dirContents, (dirContent) => this.getAllContents(ownerLogin, repositoryName, branchName, dirContent.type + '|' + dirContent.path));

                        forkJoin(observables)
                            .subscribe((dirFilesResponses) => {
                                let files = [];

                                _.each(dirFilesResponses, (dirFiles: ContentModel[]) => {
                                    files = files.concat(dirFiles);
                                });

                                observer.next(files);
                                observer.complete();
                            }, (err) => {
                                observer.error(err);
                                observer.complete();
                            });
                    }, (err) => {
                        observer.error(err);
                        observer.complete();
                    });
            });
        }
    }

    public getContents(ownerLogin: string, repositoryName: string, branchName?: string, path?: string): Observable<ContentModel[]> {
        return new Observable<ContentModel[]>((observer) => {
            this.login()
                .subscribe(() => {
                    let url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/contents`;

                    if (path) {
                        url += `/${path}`;
                    }

                    if (branchName) {
                        url += '?ref=' + encodeURIComponent(branchName);
                    }

                    this.http.get<ContentModel[]>(url, this.getOptions())
                        .subscribe((contents) => {
                            observer.next(contents);
                            observer.complete();
                        }, (err) => {
                            observer.error(err);
                            observer.complete();
                        });
                }, (err) => observer.error(err));
        });
    }

    public updateContent(ownerLogin: string, repositoryName: string, path: string, content: string, message?: string, branchName?: string) {
        return new Observable<ContentModel[]>((observer) => {
            this.login()
                .subscribe(() => {
                    let url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/contents/${path}`;

                    const sha = SHA(content);

                    const data = {
                        content: btoa(content),
                        sha: sha
                    };

                    if (branchName) {
                        data['branch'] = branchName;
                    }

                    if (message) {
                        data['message'] = message;
                    }

                    this.http.put<any>(url, data, this.getOptions())
                        .subscribe((contents) => {
                            console.log(contents);

                            observer.next();
                            observer.complete();
                        }, (err) => {
                            observer.error(err);
                            observer.complete();
                        });
                }, (err) => observer.error(err));
        });
    }
}
