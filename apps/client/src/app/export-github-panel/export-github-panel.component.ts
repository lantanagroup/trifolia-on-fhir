import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BranchModel, FileModel, GithubService, RepositoryModel} from '../shared/github.service';
import {ConfigService} from '../shared/config.service';
import {ExportService} from '../shared/export.service';
import JSZip from 'jszip';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import type {IDomainResource} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {FhirService} from '../shared/fhir.service';

@Component({
  selector: 'trifolia-fhir-export-github-panel',
  templateUrl: './export-github-panel.component.html',
  styleUrls: ['./export-github-panel.component.css']
})
export class ExportGithubPanelComponent implements OnInit {
  public message: string;
  public commitMessage: string;
  public loadingRepositories = true;
  public repositories: RepositoryModel[];
  public branches: BranchModel[];
  public repository: RepositoryModel;
  public branch: string;
  public igFiles: FileModel[];
  public igFilesPromise: Promise<void>;
  public allFiles: FileModel[];
  public Globals = Globals;
  public filter = {
    added: true,
    updated: true,
    deleted: true,
    nothing: true
  };
  @Input() responseFormat: string;
  @Output() change: EventEmitter<String> = new EventEmitter();

  constructor(
    public githubService: GithubService,
    private configService: ConfigService,
    private fhirService: FhirService,
    private exportService: ExportService) {
  }

  deleteOthers() {
    this.allFiles
      .filter(f => !f.isNew && !f.content)
      .forEach(f => f.action = 'delete');
  }

  get filteredAllFiles() {
    return this.allFiles.filter(f => {
      if (f.action === 'nothing' && this.filter.nothing) {
        return true;
      } else if (f.action === 'add' && this.filter.added) {
        return true;
      } else if (f.action === 'update' && this.filter.updated) {
        return true;
      } else if (f.action === 'delete' && this.filter.deleted) {
        return true;
      }
      return false;
    });
  }

  async repositoryChanged() {
    this.branches = [];
    this.branch = null;

    if (!this.repository) return;

    const commits = await this.githubService.getCommits(this.repository.owner.login, this.repository.name, this.repository.default_branch);
    let initialCommit;
    if(commits === 409) {
      try {
        initialCommit = await this.githubService.createContent(this.repository.owner.login, this.repository.name, 'README.md', 'README.md file', 'Initial Commit');
      } catch (err) {
        console.log(initialCommit);
        console.error(err);
      }
    }
    this.branches = await this.githubService.getBranches(this.repository.owner.login, this.repository.name);

    if (this.branches.length === 0 && this.repository.default_branch) {
      this.branches.push({name: this.repository.default_branch});
    }

    if (this.repository.default_branch) {
      this.branch = this.repository.default_branch;
    }

    this.branchChanged();
  }

  public async branchChanged() {
    if (!this.branch) return;

    this.message = "Loading files from IG to be exported...";
    await this.igFilesPromise;

    this.allFiles = await this.githubService.getFiles(this.repository.owner.login, this.repository.name, this.branch);

    this.igFiles.forEach(f => {
      const found = this.allFiles.find(n => n.path === f.path);

      if (found) {
        found.content = f.content;
        found.action = 'update';
        found.info = f.info;
        f.isNew = false;
      } else {
        f.action = 'add';
        f.isNew = true;
        this.allFiles.push(f);
      }
    });

    this.allFiles.sort((a, b) => (a.path > b.path) ? 1 : (a.path === b.path) ? 0 : -1);
    this.allFiles.forEach((file: FileModel) => {
      const mainFilePath = file.path.substring(0, file.path.lastIndexOf("."));
      const foundFiles: FileModel[] = this.allFiles.filter(f => f.path.indexOf(mainFilePath) >= 0);

      if(foundFiles.length > 1){
        foundFiles.forEach((foundFile: FileModel) => {
          if((this.responseFormat.indexOf("xml") >= 0 && foundFile.path.indexOf("json") >= 0) ||
            (this.responseFormat.indexOf("json") >= 0 && foundFile.path.indexOf("xml") >= 0)){
            foundFile.action = "delete";
          }
        });
      }
    });
    this.message = "Done loading";
    setTimeout(() => {
      this.message = "";
    }, 5000);
  }

  public async responseFormatChanged() {
    this.allFiles = [];
    this.igFiles = [];
    this.igFilesPromise = this.loadFiles();
    await this.igFilesPromise;
    await this.branchChanged();
  }

  private async loadFiles() {
    if (this.configService.igContext && this.configService.igContext.implementationGuideId) {
      let htmlPackage;
      try {
        htmlPackage = await this.exportService.exportHtml(<any>{
          implementationGuideId: this.configService.igContext.implementationGuideId,
          includeIgPublisherJar: false,
          responseFormat: this.responseFormat
        }).toPromise();
      } catch (ex) {
        this.message = getErrorString(ex);
        return;
      }

      const zip: JSZip = await JSZip.loadAsync(htmlPackage.body);
      const filePaths = Object.keys(zip.files);
      this.igFiles = [];

      for (let i = 0; i < filePaths.length; i++) {
        const content = await zip.files[filePaths[i]].async('text');

        const file: FileModel = {
          path: filePaths[i],
          content: content,
          action: 'update'
        };

        if (file.content) {
          let resource;

          if (file.path.endsWith('.json')) {
            try {
              const parsed = JSON.parse(content);

              if (parsed.hasOwnProperty('resourceType')) {
                resource = <IDomainResource> parsed;
              }
            } catch (ex) { }
          } else if (file.path.endsWith('.xml')) {
            try {
              resource = this.fhirService.deserialize(content);
            } catch (ex) { }
          }

          if (resource) {
            file.info = `${resource.resourceType}/${resource.id}`;
          }

          this.igFiles.push(file);
        }
      }
    }
  }

  async ngOnInit() {
    try {
      this.loadingRepositories = true;
      this.repositories = await this.githubService.getRepositories(true);
    } catch (ex) {
      this.message = getErrorString(ex);
    } finally {
      this.loadingRepositories = false;
    }

    this.igFilesPromise = this.loadFiles();
  }

  get canExport(): boolean {
    return !!this.repository && !!this.branch && !!this.igFiles && this.igFiles.length > 0 && !!this.commitMessage;
  }

  async export(responseFormat: string) {
    try {
      await this.githubService.updateContents(this.repository.owner.login, this.repository.name, this.commitMessage, this.allFiles, this.branch, responseFormat);
    } catch (ex) {
      this.message = getErrorString(ex);
    }
  }
}
