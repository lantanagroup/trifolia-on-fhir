import {Component, OnInit, ViewChild} from '@angular/core';
import {BranchModel, ContentModel, GithubService, RepositoryModel} from '../../shared/github.service';
import {
  NodeCheckedEvent,
  NodeUncheckedEvent
} from '../../ng2-tree/tree.events';
import {FhirService} from '../../shared/fhir.service';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from '../../shared/config.service';
import {Globals} from '../../../../../../libs/tof-lib/src/lib/globals';
import {TreeModel} from '../../ng2-tree/tree.types';

const createTreeItem = (value: string, directory: boolean, ...children: TreeModel[]) => {
  const item = {
    value: value,
    id: directory ? 'dir|' + value : 'file|' + value,
    settings: {
      "rightMenu": false,
      "leftMenu": false,
      "selectionAllowed": !directory
    },
    children: children
  };

  return item;
};

@Component({
  selector: 'app-import-github-panel',
  templateUrl: './import-github-panel.component.html',
  styleUrls: ['./import-github-panel.component.css']
})
export class ImportGithubPanelComponent implements OnInit {
  public repositories: RepositoryModel[];
  public repositoryId: string;
  public branches: BranchModel[];
  public branchName: string;
  public message: string;
  public tree: TreeModel;
  public introTree: TreeModel = {
    "value": "master",
    "id": "master",
    "children": [
      createTreeItem("framework", true),
      createTreeItem("resources", true, createTreeItem("structuredefinition", true, createTreeItem("my-profile.json", false))),
      createTreeItem("ig.json", false)
    ],
    "settings": {
      "cssClasses": {
        "expanded": "fa fa-caret-down",
        "collapsed": "fa fa-caret-right",
        "empty": "fa fa-caret-right disabled",
        "leaf": "fa"
      },
      "static": true
    },
    "templates": {
      "node": "<i class=\"fa fa-folder-o\"></i>",
      "leaf": "<i class=\"fa fa-file-o\"></i>"
    }
  };
  public selectedPaths: string[] = [];
  public loadingRepositories = true;
  public Globals = Globals;

  @ViewChild('treeComponent', { static: true }) treeComponent;

  constructor(
    private fhirService: FhirService,
    public configService: ConfigService,
    public githubService: GithubService) {
  }

  public handleSelected(event: NodeCheckedEvent) {
    if (this.selectedPaths.indexOf(<string>event.node.id) < 0) {
      this.selectedPaths.push(<string>event.node.id);
    }
  }

  public handleUnselected(event: NodeUncheckedEvent) {
    const index = this.selectedPaths.indexOf(<string>event.node.id);
    if (index >= 0) {
      this.selectedPaths.splice(index, 1);
    }
  }

  public get ownerLogin() {
    const foundRepository = this.repositories.find((repository) => repository.id === this.repositoryId);

    if (foundRepository) {
      return foundRepository.owner.login;
    }
  }

  public get repositoryName() {
    const foundRepository = this.repositories.find((repository) => repository.id === this.repositoryId);

    if (foundRepository) {
      return foundRepository.name;
    }
  }

  private mapContentToTreeModel(content: ContentModel): TreeModel {
    const newTreeModel: TreeModel = {
      value: content.name,
      id: content.type + '|' + content.path,
      settings: {
        rightMenu: false,
        leftMenu: false,
        selectionAllowed: content.type === 'dir' || content.name.endsWith('.xml') || content.name.endsWith('.json')
      }
    };

    if (content.type === 'dir') {
      newTreeModel.loadChildren = (callback) => {
        this.githubService.getContents(this.ownerLogin, this.repositoryName, this.branchName, content.path)
          .then((childItems) => {
            const childTreeModels = <TreeModel[]> childItems
              .filter((childItem: ContentModel) => childItem.type === 'dir' || childItem.name.endsWith('.xml') || childItem.name.endsWith('.json'))
              .sort((a: ContentModel, b: ContentModel) => {
                const aVal = a.type + a.name;
                const bVal = b.type + b.name;
                return (aVal || '').localeCompare(bVal || '');
              })
              .map((childItem: ContentModel) => {
                return this.mapContentToTreeModel(childItem);
              });
            callback(childTreeModels);
          })
          .catch((err) => {
            this.message = getErrorString(err);
          });
      };
    }

    return newTreeModel;
  }

  async branchChanged() {
    this.selectedPaths = [];
    this.tree = null;

    const contents = await this.githubService.getContents(this.ownerLogin, this.repositoryName, this.branchName);

    this.tree = {
      value: this.branchName,
      id: this.branchName,
      children: contents
        .filter((content: ContentModel) => content.type === 'dir' || content.name.endsWith('.xml') || content.name.endsWith('.json'))
        .sort((a: ContentModel, b: ContentModel) => {
          const aVal = a.type + a.name;
          const bVal = b.type + b.name;
          return (aVal || '').localeCompare(bVal || '');
        })
        .map((content: ContentModel) => {
          return this.mapContentToTreeModel(content);
        }),
      settings: {
        cssClasses: {
          expanded: 'fa fa-caret-down',
          collapsed: 'fa fa-caret-right',
          empty: 'fa fa-caret-right disabled',
          leaf: 'fa'
        },
        static: true
      },
      templates: {
        node: '<i class="fa fa-folder-o"></i>',
        leaf: '<i class="fa fa-file-o"></i>'
      }
    };
  }

  async repositoryChanged() {
    this.branches = [];
    this.branchName = null;
    this.selectedPaths = [];
    this.tree = null;

    this.branches = await this.githubService.getBranches(this.ownerLogin, this.repositoryName);

    const foundRepository = this.repositories.find((repository) => repository.id === this.repositoryId);

    if (foundRepository && foundRepository.default_branch) {
      this.branchName = foundRepository.default_branch;
      this.branchChanged();
    }
  }

  async githubLogin() {
    this.loadingRepositories = true;
    await this.githubService.login();
    this.repositories = await this.githubService.getRepositories();
    this.loadingRepositories = false;
  }

  async ngOnInit() {
    this.loadingRepositories = true;
    this.repositories = await this.githubService.getRepositories();
    this.loadingRepositories = false;
  }
}
