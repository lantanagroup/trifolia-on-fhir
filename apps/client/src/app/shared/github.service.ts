import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {FhirService} from './fhir.service';
import {joinUrl} from '../../../../../libs/tof-lib/src/lib/fhirHelper';

export interface FileModel {
  path: string;
  content: string;
  sha?: string;
  info?: string;
  action: 'nothing'|'add'|'update'|'delete';
  isNew?: boolean;
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
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
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

export interface CommitsModel {
  sha: string;
  node_id: string;
  commit: {
    author: any;
    committer: any;
    message?: string;
    tree: {
      url: string;
      sha: string;
    };
    verification: {
      verified: boolean;
      reason: string;
      signature: any;
      payload: any;
    };
  };
  parents: {
    url: string;
    sha: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  public token: string;
  public authChanged: EventEmitter<any> = new EventEmitter();
  private loginWin: Window;

  private readonly tokenKey = 'github-token';

  constructor(
    private configService: ConfigService,
    public fhirService: FhirService,
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

  private getOptions() {
    return {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'Bearer ' + this.token
      }
    };
  }

  public async logout() {
    try {
      const url = joinUrl(this.configService.config.github.apiBase, `/authorizations/${this.token}`);
      await this.http.delete(url, this.getOptions()).toPromise();
    } catch (ex) {
      console.error('Failed to notify GitHub of logout (still going to forget GitHub token):' + getErrorString(ex));
    } finally {
      this.token = null;
      localStorage.removeItem(this.tokenKey);
    }
  }

  public async login() {
    if (this.token) return;

    if (this.loginWin && !this.loginWin.closed) {
      this.loginWin.close();
    }

    const redirectUri = location.origin + '/github/callback';
    const url = joinUrl(this.configService.config.github.authBase, '/login/oauth/authorize') +
      '?client_id=' + this.configService.config.github.clientId + '&scope=user,repo&allow_signup=false&redirect_uri=' + redirectUri;
    this.loginWin = window.open(url, 'loginGitHub', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=SomeSize,height=SomeSize');

    if (!this.loginWin) {
      throw new Error('Could not open window to login to GitHub. Please ensure pop-ups are not blocked.');
    }

    return new Promise<void>((resolve, error) => {
      const checkWin = () => {
        if (this.loginWin.closed) {
          if (this.token) {
            resolve();
          } else {
            error('Not logged into GitHub.');
          }
        } else {
          setTimeout(checkWin, 500);
        }
      };

      checkWin();
    });
  }

  public async getUser(): Promise<UserModel> {
    await this.login();
    return await this.http.get<UserModel>(joinUrl(this.configService.config.github.apiBase, '/user'), this.getOptions()).toPromise();
  }

  public async getRepositories(requirePush = false): Promise<RepositoryModel[]> {
    const repositories: RepositoryModel[] = [];

    try {
      await this.login();

      const getNextRepositories = async (page = 1) => {
        const next = await this.http.get<RepositoryModel[]>(joinUrl(this.configService.config.github.apiBase, '/user/repos') +
          '?per_page=100&page=' + page, this.getOptions()).toPromise();

        if (next) {
          repositories.push(...next);

          if (next.length === 100) {
            await getNextRepositories(page + 1);
          }
        }
      };

      await getNextRepositories();
    } catch (ex) {
      console.error('Error retrieving list of repositories from GitHub: ' + ex.stack);
    }

    return repositories
      .filter(r => {
        if (!requirePush) return true;
        return !!r.permissions && r.permissions.push;
      });
  }

  /**
   * this method checks the commits history of the repo. If it returns 409 status with Git Repository is empty error then we know the repo is empty. Github doesn't provie an
   * endpoint to directly see if the repo is empty or not.
   * @param ownerLogin user login
   * @param repositoryName repo name
   * @param branchName branch name to look for commits
   */
  public async getCommits(ownerLogin: string, repositoryName: string, branchName?: string): Promise<any> {
    await this.login();
    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/commits/${branchName}`);
    try {
      return await this.http.get<any>(url, this.getOptions()).toPromise();
    } catch (ex) {
      if (ex.status === 409 && ex.error['message'] === 'Git Repository is empty.') {
        return ex.status;
      }
    }
  }

  public async getBranches(ownerLogin: string, repositoryName: string): Promise<BranchModel[]> {
    await this.login();

    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/branches`);
    return await this.http.get<BranchModel[]>(url, this.getOptions()).toPromise();
  }

  public async getAllContents(ownerLogin: string, repositoryName: string, branchName: string, id: string) {
    if (id.startsWith('file|')) {
      return this.getContents(ownerLogin, repositoryName, branchName, id.substring(5));
    } else if (id.startsWith('dir|')) {
      const dirContents = await this.getContents(ownerLogin, repositoryName, branchName, id.substring(4));
      const promises = dirContents.map((dirContent) => this.getAllContents(ownerLogin, repositoryName, branchName, dirContent.type + '|' + dirContent.path));
      const dirFilesResponses = await Promise.all(promises);
      let files = [];

      dirFilesResponses.forEach((dirFiles: ContentModel[]) => {
        files = files.concat(dirFiles);
      });

      return files;
    } else {
      throw new Error('Unexpected github import selected: ' + id);
    }
  }

  public async getFiles(ownerLogin: string, repositoryName: string, branchName: string) {
    await this.login();

    const commitsUrl = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/commits/${branchName}`);
    const commitsResults = await this.http.get<CommitsModel>(commitsUrl, this.getOptions()).toPromise();

    const treesUrl = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/git/trees/${commitsResults.commit.tree.sha}?recursive=true`);
    const treesResponse = await this.http.get<RepositoryTreeModel>(treesUrl, this.getOptions()).toPromise();

    return treesResponse.tree
      .filter(t => t.mode !== '040000')
      .map(t => {
        return <FileModel> {
          path: t.path,
          action: 'nothing',
          isNew: false
        };
      });
  }

  public async getContents(ownerLogin: string, repositoryName: string, branchName?: string, path?: string): Promise<ContentModel[]> {
    await this.login();

    let url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/contents`);

    if (path) {
      url += `/${path}`;
    }

    if (branchName) {
      url += '?ref=' + encodeURIComponent(branchName);
    }

    return await this.http.get<ContentModel[]>(url, this.getOptions()).toPromise();
  }

  public async fetchHead(ownerLogin: string, repositoryName: string, branch = 'master') {
    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/git/refs/heads/${branch}`);
    return this.http.get<RepositoryReferenceModel>(url, this.getOptions()).toPromise();
  }

  public async fetchTree(ownerLogin: string, repositoryName: string, branch = 'master'): Promise<RepositoryTreeModel> {
    const reference = await this.fetchHead(ownerLogin, repositoryName, branch)
    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/git/trees/${reference.object.sha}`);
    return await this.http.get<RepositoryTreeModel>(url, this.getOptions()).toPromise();
  }

  public async createTree(ownerLogin: string, repositoryName: string, baseTreeSha: string, files: FileModel[]) {
    const body = {
      base_tree: baseTreeSha,
      tree: files.map((file) => {
        return {
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: file.sha
        };
      })
    };
    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/git/trees`);
    return this.http.post<RepositoryTreeModel>(url, body, this.getOptions()).toPromise();
  }

  public async createCommit(ownerLogin: string, repositoryName: string, message: string, treeSha: string, parentSha: string) {
    const body = {
      message: message,
      tree: treeSha,
      parents: [parentSha]
    };
    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/git/commits`);
    return this.http.post<CommitCreatedResponseModel>(url, body, this.getOptions()).toPromise();
  }

  public async updateHead(ownerLogin: string, repositoryName: string, sha: string, branch = 'master') {
    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/git/refs/heads/${branch}`);
    const body = {
      sha: sha,
      force: true
    };
    return this.http.patch<ReferenceUpdatedModel>(url, body, this.getOptions()).toPromise();
  }

  public async updateContents(ownerLogin: string, repositoryName: string, message: string, files: FileModel[], branchName = 'master', responseFormat: string) {
    // Create a blob for each of the files
    const filesRequiringBlob = files.filter(f => f.action !== 'nothing' && f.action !== 'delete' && f.content);
    const blobPromises = filesRequiringBlob
      .map((file) => {
        const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/git/blobs`);
        const body = {
          content: file.content,
          encoding: 'utf-8'
        };
        return this.http.post<BlobCreatedResponseModel>(url, body, this.getOptions()).toPromise();
      });
    const deletedFiles = files.filter(f => f.action === 'delete');

    const blobs = await Promise.all(blobPromises);
    const baseTree = await this.fetchTree(ownerLogin, repositoryName, branchName);

    // Add files being updated/deleted via a blob to the tree
    const filesWithSha = filesRequiringBlob.map((file, index) => {
      return <FileModel>{
        path: file.path,
        sha: blobs[index].sha
      };
    });

    // Add files being deleted to the tree
    filesWithSha.push(... deletedFiles.map(f => {
      return <FileModel> {
        path: f.path,
        sha: null
      };
    }));

    const newTree = await this.createTree(ownerLogin, repositoryName, baseTree.sha, filesWithSha);
    const newCommit = await this.createCommit(ownerLogin, repositoryName, message, newTree.sha, baseTree.sha);
    await this.updateHead(ownerLogin, repositoryName, newCommit.sha, branchName);
  }

  /**
   * this method creates a new README.md file for repos that are empty. This fixes an issue we were seeing when exporting to a github repo that is blank
   * @param ownerLogin owner login id
   * @param repositoryName repo name
   * @param path filename
   * @param content file contents
   * @param message commit message
   */
  public async createContent(ownerLogin: string, repositoryName: string, path: string, content: string, message?: string) {
    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/contents/${path}`);
    const encoded = btoa(content);
    const options = this.getOptions();
    const data = {
      content: encoded
    };
    if (message) {
      data['message'] = message;
    }
    await this.http.put<any>(url, data, options).toPromise();
  }

  public async updateContent(ownerLogin: string, repositoryName: string, path: string, content: string, message?: string, branchName?: string) {
    const url = joinUrl(this.configService.config.github.apiBase, `/repos/${ownerLogin}/${repositoryName}/contents/${path}`);
    const encoded = btoa(content);
    const options = this.getOptions();
    const update = async (lastSha?: string) => {
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
      await this.http.put<any>(url, data, this.getOptions()).toPromise();
    };

    await this.login();

    const res = await this.http.get<any>(url, options).toPromise();
    const cleanedResponseContent = res.content.replace(/\r/g, '').replace(/\n/g, '');

    if (cleanedResponseContent === encoded) {      // If the content hasn't changed, don't update in GitHub
      return;
    }

    await update(res.sha);
  }
}
