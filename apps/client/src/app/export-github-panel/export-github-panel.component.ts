import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Bundle, DomainResource, EntryComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {BranchModel, ContentModel, GithubService, RepositoryModel} from '../shared/github.service';
import {NodeMenuItemAction, NodeSelectedEvent, TreeModel, TreeModelSettings} from 'ng2-tree';
import {ImportService} from '../shared/import.service';
import {FhirService} from '../shared/fhir.service';
import {Content} from '@angular/compiler/src/render3/r3_ast';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';

@Component({
  selector: 'app-export-github-panel',
  templateUrl: './export-github-panel.component.html',
  styleUrls: ['./export-github-panel.component.css']
})
export class ExportGithubPanelComponent implements OnChanges {
  @Input() resourcesBundle: Bundle;
  @ViewChild('treeComponent', { static: true }) treeComponent;
  public message: string;
  public checkedIds: string[] = [];
  public isChanging: boolean;
  public newPath: string;
  public newType: 'json' | 'xml' = 'json';
  public repositories: RepositoryModel[];
  public branches: BranchModel[];
  public tree: TreeModel;
  public resourceTypeDir = true;
  public newFolderName: string;
  public repository: RepositoryModel;
  public branch: string;

  constructor(
    public githubService: GithubService,
    private importService: ImportService,
    private fhirService: FhirService) {
  }

  public get isAllChecked(): boolean {
    return this.checkedIds.length === this.resourcesBundle.entry.length;
  }

  public set isAllChecked(checked: boolean) {
    if (checked) {
      this.checkedIds = (this.resourcesBundle.entry || []).map((entry) => entry.resource.id);
    } else {
      this.checkedIds = [];
    }
  }

  public isChecked(entry: EntryComponent) {
    return this.checkedIds.indexOf(entry.resource.id) >= 0;
  }

  public setChecked(entry: EntryComponent, checked: boolean) {
    const index = this.checkedIds.indexOf(entry.resource.id);

    if (!checked && index >= 0) {
      this.checkedIds.splice(index, 1);
    } else if (checked && index < 0) {
      this.checkedIds.push(entry.resource.id);
    }
  }

  public addNewFolder() {
    const nodeController = this.treeComponent.getControllerByNodeId(this.newPath);
    const selectedNodeModel = nodeController.toTreeModel();
    const newNodeModel: TreeModel = {
      id: (selectedNodeModel.id === '/' ? '' : selectedNodeModel.id) + '/' + this.newFolderName,
      value: this.newFolderName,
      children: []
    };

    nodeController.addChild(newNodeModel);

    setTimeout(() => {
      const newNodeController = this.treeComponent.getControllerByNodeId(newNodeModel.id);
      newNodeController.select();
      this.newFolderName = null;
    }, 500);
  }

  public changeSelected() {
    this.isChanging = true;

    this.message = null;
    this.newPath = '';
    this.newType = 'json';
    this.tree = null;

    const settings: TreeModelSettings = {
      cssClasses: {
        expanded: 'fa fa-caret-down',
        collapsed: 'fa fa-caret-right',
        empty: 'fa fa-caret-right disabled',
        leaf: 'fa'
      },
      menuItems: [{name: 'New folder', action: NodeMenuItemAction.Custom}],
      static: true
    };
    const templates = {
      node: '<i class="fa fa-folder-o"></i>',
      leaf: '<i class="fa fa-file-o"></i>'
    };

    this.githubService.getContents(this.repository.owner.login, this.repository.name, this.branch)
      .subscribe((contents) => {
        this.tree = {
          value: this.branch,
          id: '/',
          children: contents
            .filter((content: ContentModel) => content.type === 'dir')
            .sort((a: ContentModel, b: ContentModel) => (a.type + a.name).localeCompare(b.type + b.name))
            .map((content: ContentModel) => {
              return this.mapContentToTreeModel(content);
            }),
          settings: settings,
          templates: templates
        };
      }, (err) => {
        if (err && err.error && err.error.message === 'This repository is empty.') {
          this.tree = {
            value: this.branch || 'master',
            id: '/',
            children: [],
            settings: settings,
            templates: templates
          };
        } else {
          this.message = getErrorString(err);
        }
      });
  }

  public getPathFromResource(resource: DomainResource): string {
    return this.fhirService.getResourceGithubDetails(resource).path;
  }

  private mapContentToTreeModel(content: ContentModel): TreeModel {
    const newTreeModel: TreeModel = {
      value: content.name,
      id: '/' + content.path
    };

    newTreeModel.loadChildren = (callback) => {
      this.githubService.getContents(this.repository.owner.login, this.repository.name, this.branch, content.path)
        .subscribe((childItems) => {
          const childTreeModels = <TreeModel[]> childItems
            .filter((next: ContentModel) => next.type === 'dir')
            .sort((a: ContentModel, b: ContentModel) => (a.type + a.name).localeCompare(b.type + b.name))
            .map((childItem: ContentModel) => {
              return this.mapContentToTreeModel(childItem);
            });
          callback(childTreeModels);
        }, (err) => {
          this.message = getErrorString(err);
        });
    };

    return newTreeModel;
  }

  private updateImplementationGuideDetails() {
    const implementationGuideEntry = (this.resourcesBundle.entry || []).find((entry) => entry.resource.resourceType === 'ImplementationGuide');

    if (implementationGuideEntry) {
      let shouldSave = false;

      const implementationGuideDetails = this.fhirService.getResourceGithubDetails(implementationGuideEntry.resource);
      if (this.repository.name !== implementationGuideDetails.repository) {
        implementationGuideDetails.repository = this.repository.name;
        shouldSave = true;
      }
      if (this.repository.owner.login !== implementationGuideDetails.owner) {
        implementationGuideDetails.owner = this.repository.owner.login;
        shouldSave = true;
      }
      if (this.branch !== implementationGuideDetails.branch) {
        implementationGuideDetails.branch = this.branch;
        shouldSave = true;
      }

      this.fhirService.setResourceGithubDetails(implementationGuideEntry.resource, implementationGuideDetails);

      if (shouldSave) {
        this.saveResources([implementationGuideEntry.resource])
          .subscribe(() => {
            this.message = 'Updated implementation guide\'s repository and branch';
          }, (err) => {
            this.message = getErrorString(err);
          });
      }
    }
  }

  repositoryChanged() {
    this.branches = [];
    this.branch = null;

    this.githubService.getBranches(this.repository.owner.login, this.repository.name)
      .subscribe((branches: BranchModel[]) => {
        this.branches = branches;

        if (this.branches.length === 0 && this.repository.default_branch) {
          this.branches.push({name: this.repository.default_branch});
        }

        if (this.repository.default_branch) {
          this.branch = this.repository.default_branch;
        }

        this.branchChanged();
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  branchChanged() {
    this.tree = null;
    this.updateImplementationGuideDetails();
  }

  public nodeSelected(event: NodeSelectedEvent) {
    this.newPath = <string>event.node.id;
  }

  private saveResources(resources: DomainResource[]) {
    const updateBundle = new Bundle();
    updateBundle.type = 'transaction';
    updateBundle.entry = resources.map((resource) => {
      return <EntryComponent>{
        request: {
          method: 'PUT',
          url: resource.resourceType + '/' + resource.id
        },
        resource: resource
      };
    });

    return this.fhirService.batch(JSON.stringify(updateBundle), 'application/json');
  }

  public okChanging() {
    const resources = this.checkedIds.map((checkedId) => {
      return (this.resourcesBundle.entry || []).find((entry) => entry.resource.id === checkedId).resource;
    });

    resources.forEach((resource: DomainResource) => {
      let path = this.newPath;

      if (this.resourceTypeDir) {
        path += (!path.endsWith('/') ? '/' : '') + resource.resourceType.toLowerCase() + '/';
      }

      path += (!path.endsWith('/') ? '/' : '') + resource.id + '.' + this.newType;

      this.fhirService.setResourceGithubDetails(resource, {
        owner: this.repository.owner.login,
        repository: this.repository.name,
        branch: this.branch,
        path: path
      });
    });

    this.saveResources(resources)
      .subscribe(() => {
        this.message = 'Updated resources with GitHub repository and path.';
        this.isChanging = false;
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const implementationGuideEntry = (this.resourcesBundle.entry || []).find((entry) => entry.resource && entry.resource.resourceType === 'ImplementationGuide');
    const implementationGuide = implementationGuideEntry ? implementationGuideEntry.resource : null;

    if (implementationGuide) {
      const implementationGuideDetails = this.fhirService.getResourceGithubDetails(implementationGuide);

      this.githubService.getRepositories()
        .subscribe((repositories) => {
          this.repositories = repositories;
          this.repository = repositories.find((repo) => repo.full_name === implementationGuideDetails.owner + '/' + implementationGuideDetails.repository);
          this.repositoryChanged();
        }, (err) => {
          this.message = getErrorString(err);
        });
    }

    this.checkedIds = (this.resourcesBundle.entry || []).map((entry) => entry.resource.id);
  }
}
