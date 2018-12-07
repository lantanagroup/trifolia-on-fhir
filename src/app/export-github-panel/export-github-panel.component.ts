import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Bundle, DomainResource, EntryComponent} from '../models/stu3/fhir';
import {BranchModel, ContentModel, GithubService, RepositoryModel} from '../services/github.service';
import * as _ from 'underscore';
import {NodeMenuItemAction, NodeSelectedEvent, TreeModel, TreeModelSettings} from 'ng2-tree';
import {ImportService} from '../services/import.service';
import {FhirService} from '../services/fhir.service';

@Component({
    selector: 'app-export-github-panel',
    templateUrl: './export-github-panel.component.html',
    styleUrls: ['./export-github-panel.component.css']
})
export class ExportGithubPanelComponent implements OnInit {
    @Input() resourcesBundle: Bundle;
    @ViewChild('treeComponent') treeComponent;
    public message: string;
    public checkedIds: string[] = [];
    public isChanging: boolean;
    public newRepository: RepositoryModel;
    public newBranchName: string;
    public newPath: string;
    public newType: 'json' | 'xml' = 'json';
    public repositories: RepositoryModel[];
    public branches: BranchModel[];
    public tree: TreeModel;
    public resourceTypeDir = true;
    public newFolderName: string;

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
            this.checkedIds = _.map(this.resourcesBundle.entry, (entry) => entry.resource.id);
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

        this.newRepository = null;
        this.newBranchName = '';
        this.newPath = '';
        this.newType = 'json';
        this.tree = null;
    }

    public getBranchFromResource(resource: DomainResource): string {
        return this.fhirService.getResourceGithubDetails(resource).branch;
    }

    public getRepositoryFromResource(resource: DomainResource): string {
        const details = this.fhirService.getResourceGithubDetails(resource);

        if (details.owner && details.repository) {
            return details.owner + '/' + details.repository;
        }
    }

    public getPathFromResource(resource: DomainResource): string {
        return this.fhirService.getResourceGithubDetails(resource).path;
    }

    repositoryChanged() {
        this.branches = [];
        this.newBranchName = null;

        this.githubService.getBranches(this.newRepository.owner.login, this.newRepository.name)
            .subscribe((branches: BranchModel[]) => {
                this.branches = branches;

                if (this.branches.length === 0 && this.newRepository.default_branch) {
                    this.branches.push({ name: this.newRepository.default_branch });
                }

                if (this.newRepository.default_branch) {
                    this.newBranchName = this.newRepository.default_branch;
                    this.branchChanged();
                }
            }, (err) => {
                this.message = err;
            });
    }

    private mapContentToTreeModel(content: ContentModel): TreeModel {
        const newTreeModel: TreeModel = {
            value: content.name,
            id: '/' + content.path
        };

        newTreeModel.loadChildren = (callback) => {
            this.githubService.getContents(this.newRepository.owner.login, this.newRepository.name, this.newBranchName, content.path)
                .subscribe((childItems) => {
                    const childTreeModels = <TreeModel[]> _.chain(childItems)
                        .filter((next: ContentModel) => next.type === 'dir')
                        .sortBy((next: ContentModel) => next.type + next.name)
                        .map((childItem: ContentModel) => {
                            return this.mapContentToTreeModel(childItem);
                        })
                        .value();
                    callback(childTreeModels);
                }, (err) => {
                    this.message = err;
                });
        };

        return newTreeModel;
    }

    branchChanged() {
        this.tree = null;

        const settings: TreeModelSettings = {
            cssClasses: {
                expanded: 'fa fa-caret-down',
                collapsed: 'fa fa-caret-right',
                empty: 'fa fa-caret-right disabled',
                leaf: 'fa'
            },
            menuItems: [{ name: 'New folder', action: NodeMenuItemAction.Custom }],
            static: true
        };
        const templates = {
            node: '<i class="fa fa-folder-o"></i>',
            leaf: '<i class="fa fa-file-o"></i>'
        };

        this.githubService.getContents(this.newRepository.owner.login, this.newRepository.name, this.newBranchName)
            .subscribe((contents) => {
                this.tree = {
                    value: this.newBranchName,
                    id: '/',
                    children: _.chain(contents)
                        .filter((content: ContentModel) => content.type === 'dir')
                        .sortBy((content: ContentModel) => content.type + content.name)
                        .map((content: ContentModel) => {
                            return this.mapContentToTreeModel(content);
                        })
                        .value(),
                    settings: settings,
                    templates: templates
                };
            }, (err) => {
                if (err && err.error && err.error.message === 'This repository is empty.') {
                    this.tree = {
                        value: this.newBranchName || 'master',
                        id: '/',
                        children: [],
                        settings: settings,
                        templates: templates
                    };
                } else {
                    this.message = err.message || err.data || err;
                }
            });
    }

    public nodeSelected(event: NodeSelectedEvent) {
        this.newPath = <string> event.node.id;
    }

    public okChanging() {
        const resources = _.map(this.checkedIds, (checkedId) => {
            return _.find(this.resourcesBundle.entry, (entry) => entry.resource.id === checkedId).resource;
        });

        _.each(resources, (resource: DomainResource) => {
            let path = this.newPath;

            if (this.resourceTypeDir) {
                path += (!path.endsWith('/') ? '/' : '') + resource.resourceType.toLowerCase() + '/';
            }

            path += (!path.endsWith('/') ? '/' : '') + resource.id + '.' + this.newType;

            this.fhirService.setResourceGithubDetails(resource, {
                owner: this.newRepository.owner.login,
                repository: this.newRepository.name,
                branch: this.newBranchName,
                path: path
            });
        });

        const updateBundle = new Bundle();
        updateBundle.type = 'transaction';
        updateBundle.entry = _.map(resources, (resource) => {
            return <EntryComponent> {
                request: {
                    method: 'PUT',
                    url: resource.resourceType + '/' + resource.id
                },
                resource: resource
            };
        });

        this.importService.import('json', JSON.stringify(updateBundle))
            .subscribe(() => {
                this.message = 'Updated resources with GitHub repository and path.';
                this.isChanging = false;
            }, (err) => {
                this.message = err.message || err.data || err;
            });
    }

    ngOnInit() {
        this.githubService.getRepositories()
            .subscribe((repositories) => {
                this.repositories = repositories;
            }, (err) => {
                this.message = err.message || err.data || err;
            });
    }
}
