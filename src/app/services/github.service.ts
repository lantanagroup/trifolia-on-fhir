import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import * as _ from 'underscore';
import {ConfigService} from './config.service';

export interface FileModel {
    path: string;
    content: string;
    sha?: string;
}

interface CommitCreatedResponseModel {
    sha: string;
    node_id: string;
    url: string;
    author: {
        date: string;
        name: string;
        email: string;
    };
    committer: {
        date: string;
        name: string;
        email: string;
    };
    message: string;
    tree: {
        url: string;
        sha: string;
    };
    parents: [{
        url: string;
        sha: string;
    }];
    verification: {
        verified: boolean;
        reason: string;
        signature: string;
        payload: string;
    };
}

interface BlobCreatedResponseModel {
    url: string;
    sha: string;
}

interface ReferenceUpdatedModel {
    ref: string;
    node_id: string;
    url: string;
    object: {
        type: string;
        sha: string;
        url: string;
    };
}

interface RepositoryReferenceModel {
    ref: string;
    node_id: string;
    url: string;
    object: {
        type: string;
        sha: string;
        url: string;
    };
}

interface RepositoryTreeModel {
    sha: string;
    url: string;
    tree: [{
        path: string;
        mode: string;
        type: string;
        size: number;
        sha: string;
        url: string;
    }];
}

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

    private readonly tokenKey = 'github-token';

    constructor(
        private configService: ConfigService,
        private http: HttpClient) {

        this.token = localStorage.getItem(this.tokenKey);

        // Watch for changes to the local storage. GitHub auth is handled in a separate window, and sets the key
        // in the local storage when logged in. Retrieve the key from local storage when the storage changes.
        window.addEventListener('storage', () => {
            const newToken = localStorage.getItem(this.tokenKey);

            if (this.token !== newToken) {
                this.token = newToken;
                this.authChanged.emit();
            }
        });
    }

    private handleError(err, observer?) {
        if (err.status === 401) {
            this.logout();
        }

        if (observer) {
            observer.error(err);
            observer.complete();
        }
    }

    private getOptions() {
        return {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'Bearer ' + this.token
            }
        };
    }

    public logout() {
        this.token = null;
        localStorage.removeItem(this.tokenKey);
    }

    public login(): Observable<any> {
        if (this.token) {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        }

        const redirectUri = location.origin + '/github/callback';
        const url = 'https://github.com/login/oauth/authorize?client_id=' + this.configService.config.github.clientId + '&scope=user,repo&allow_signup=false&redirect_uri=' + redirectUri;
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
                        }, (err) => this.handleError(err, observer));
                }, (err) => this.handleError(err, observer));
        });
    }

    public getRepositories(): Observable<RepositoryModel[]> {
        return new Observable<RepositoryModel[]>((observer) => {
            this.login()
                .subscribe(() => {
                    let repositories = [];

                    const getNextRepositories = (page = 1) => {
                        this.http.get<RepositoryModel[]>('https://api.github.com/user/repos?per_page=100&page=' + page, this.getOptions())
                            .subscribe((next) => {
                                repositories = repositories.concat(next);
                                if (next.length === 100) {
                                    getNextRepositories(page + 1);
                                } else {
                                    observer.next(repositories);
                                    observer.complete();
                                }
                            }, (err) => this.handleError(err, observer));
                    };

                    getNextRepositories();
                }, (err) => this.handleError(err, observer));
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
                        }, (err) => this.handleError(err, observer));
                }, (err) => this.handleError(err, observer));
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
                            }, (err) => this.handleError(err, observer));
                    }, (err) => this.handleError(err, observer));
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
                        }, (err) => this.handleError(err, observer));
                }, (err) => this.handleError(err, observer));
        });
    }

    public fetchHead(ownerLogin: string, repositoryName: string, branch = 'master') {
        const url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/git/refs/heads/${branch}`;
        return this.http.get<RepositoryReferenceModel>(url, this.getOptions());
    }

    public fetchTree(ownerLogin: string, repositoryName: string, branch = 'master'): Observable<RepositoryTreeModel> {
        return new Observable((observer) => {
            this.fetchHead(ownerLogin, repositoryName, branch)
                .subscribe((reference) => {
                    const url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/git/trees/${reference.object.sha}`;
                    this.http.get<RepositoryTreeModel>(url, this.getOptions())
                        .subscribe((tree) => {
                            observer.next(tree);
                            observer.complete();
                        }, (err) => {
                            observer.error(err);
                            observer.complete();
                        })
                }, (err) => {
                    observer.error(err);
                    observer.complete();
                })
        });
    }

    public createTree(ownerLogin: string, repositoryName: string, baseTreeSha: string, files: FileModel[]) {
        const body = {
            base_tree: baseTreeSha,
            tree: _.map(files, (file) => {
                return {
                    path: file.path,
                    mode: '100644',
                    type: 'blob',
                    sha: file.sha
                };
            })
        };
        const url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/git/trees`;
        return this.http.post<RepositoryTreeModel>(url, body, this.getOptions());
    }

    public createCommit(ownerLogin: string, repositoryName: string, message: string, treeSha: string, parentSha: string) {
        const body = {
            message: message,
            tree: treeSha,
            parents: [parentSha]
        };
        const url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/git/commits`;
        return this.http.post<CommitCreatedResponseModel>(url, body, this.getOptions());
    }

    public updateHead(ownerLogin: string, repositoryName: string, sha: string, branch = 'master') {
        const url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/git/refs/heads/${branch}`;
        const body = {
            sha: sha,
            force: true
        };
        return this.http.patch<ReferenceUpdatedModel>(url, body, this.getOptions());
    }

    public updateContents(ownerLogin: string, repositoryName: string, message: string, files: FileModel[], branchName = 'master') {
        return new Observable<any>((observer) => {
            // Create a blob for each of the files
            const blobPromises = _.map(files, (file) => {
                const url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/git/blobs`;
                const body = {
                    content: file.content,
                    encoding: 'utf-8'
                };
                return this.http.post<BlobCreatedResponseModel>(url, body, this.getOptions()).toPromise();
            });

            let blobs;
            let baseTree;

            Promise.all(blobPromises)
                .then((results) => {
                    blobs = results;
                    return this.fetchTree(ownerLogin, repositoryName, branchName).toPromise();
                })
                .then((results) => {
                    baseTree = results;
                    const filesWithSha = _.map(files, (file, index) => {
                        return <FileModel> {
                            path: file.path,
                            sha: blobs[index].sha
                        };
                    });

                    return this.createTree(ownerLogin, repositoryName, results.sha, filesWithSha).toPromise();
                })
                .then((newTree) => {
                    return this.createCommit(ownerLogin, repositoryName, message, newTree.sha, baseTree.sha).toPromise();
                })
                .then((newCommit) => {
                    return this.updateHead(ownerLogin, repositoryName, newCommit.sha, branchName).toPromise();
                })
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch((err) => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    public updateContent(ownerLogin: string, repositoryName: string, path: string, content: string, message?: string, branchName?: string) {
        return new Observable<ContentModel[]>((observer) => {
            const url = `https://api.github.com/repos/${ownerLogin}/${repositoryName}/contents/${path}`;
            const encoded = btoa(content);
            const options = this.getOptions();
            const update = (lastSha?: string) => {
                const data = {
                    content: encoded
                };

                if (lastSha) {
                    data['sha'] = lastSha;
                }

                if (branchName) {
                    data['branch'] = branchName;
                }

                if (message) {
                    data['message'] = message;
                }

                this.http.put<any>(url, data, this.getOptions())
                    .subscribe(() => {
                        observer.next();
                        observer.complete();
                    }, (err) => this.handleError(err, observer));
            };

            this.login()
                .subscribe(() => {
                    this.http.get<any>(url, options)
                        .subscribe((res) => {
                            const cleanedResponseContent = res.content.replace(/\r/g, '').replace(/\n/g, '');
                            if (cleanedResponseContent === encoded) {      // If the content hasn't changed, don't update in GitHub
                                observer.next();
                                observer.complete();
                            } else {
                                update(res.sha);
                            }
                        }, (err) => {
                            if (err.status === 404) {
                                update();
                            } else {
                                this.handleError(err, observer);
                            }
                        });
                }, (err) => this.handleError(err, observer));
        });
    }
}
