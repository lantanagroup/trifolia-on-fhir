import {Component, OnInit, ViewChild} from '@angular/core';
import {BranchModel, ContentModel, GithubService, RepositoryModel} from '../../services/github.service';
import * as _ from 'underscore';
import {
    NodeCheckedEvent,
    NodeUncheckedEvent,
    TreeModel
} from 'ng2-tree';

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
    public selectedPaths: string[] = [];
    public loadingRepositories = true;

    @ViewChild('treeComponent') treeComponent;

    public handleSelected(event: NodeCheckedEvent) {
        if (this.selectedPaths.indexOf(<string> event.node.id) < 0) {
            this.selectedPaths.push(<string> event.node.id);
        }
    }

    public handleUnselected(event: NodeUncheckedEvent) {
        const index = this.selectedPaths.indexOf(<string> event.node.id);
        if (index >= 0) {
            this.selectedPaths.splice(index, 1);
        }
    }

    public get ownerLogin() {
        const foundRepository = _.find(this.repositories, (repository) => repository.id === this.repositoryId);

        if (foundRepository) {
            return foundRepository.owner.login;
        }
    }

    public get repositoryName() {
        const foundRepository = _.find(this.repositories, (repository) => repository.id === this.repositoryId);

        if (foundRepository) {
            return foundRepository.name;
        }
    }

    constructor(public githubService: GithubService) {
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
                    .subscribe((childItems) => {
                        const childTreeModels = <TreeModel[]> _.chain(childItems)
                            .filter((childItem: ContentModel) => childItem.type === 'dir' || childItem.name.endsWith('.xml') || childItem.name.endsWith('.json'))
                            .sortBy((childItem: ContentModel) => childItem.type + childItem.name)
                            .map((childItem: ContentModel) => {
                                return this.mapContentToTreeModel(childItem);
                            })
                            .value();
                        callback(childTreeModels);
                    }, (err) => {
                        this.message = err;
                    });
            };
        }

        return newTreeModel;
    }

    branchChanged() {
        this.selectedPaths = [];
        this.tree = null;

        this.githubService.getContents(this.ownerLogin, this.repositoryName, this.branchName)
            .subscribe((contents) => {
                this.tree = {
                    value: this.branchName,
                    id: this.branchName,
                    children: _.chain(contents)
                        .filter((content: ContentModel) => content.type === 'dir' || content.name.endsWith('.xml') || content.name.endsWith('.json'))
                        .sortBy((content: ContentModel) => content.type + content.name)
                        .map((content: ContentModel) => {
                            return this.mapContentToTreeModel(content);
                        })
                        .value(),
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
            }, (err) => {
                this.message = err;
            });
    }

    repositoryChanged() {
        this.branches = [];
        this.branchName = null;
        this.selectedPaths = [];
        this.tree = null;

        this.githubService.getBranches(this.ownerLogin, this.repositoryName)
            .subscribe((branches) => {
                this.branches = branches;

                const foundRepository = _.find(this.repositories, (repository) => repository.id === this.repositoryId);

                if (foundRepository && foundRepository.default_branch) {
                    this.branchName = foundRepository.default_branch;
                    this.branchChanged();
                }
            }, (err) => {
                this.message = err;
            });
    }

    githubLogin() {
        this.loadingRepositories = true;
        this.githubService.login()
            .subscribe(() => {
                this.githubService.getRepositories()
                    .subscribe((repositories) => {
                        this.repositories = repositories;
                        this.loadingRepositories = false;
                    }, (err) => {
                        this.message = err.message || err.data || err;
                    });
            }, (err) => {
                this.message = err.message || err.data || err;
            });
    }

    ngOnInit() {
        this.githubService.getRepositories()
            .subscribe((repositories) => {
                this.repositories = repositories;
                this.loadingRepositories = false;
            }, (err) => {
                this.message = err.message || err.data || err;
            });
    }
}
