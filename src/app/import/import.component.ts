import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ImportService, VSACImportCriteria} from '../services/import.service';
import {
    Bundle,
    DomainResource,
    EntryComponent,
    OperationOutcome,
    RequestComponent
} from '../models/stu3/fhir';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {FileSystemFileEntry, UploadEvent} from 'ngx-file-drop';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'underscore';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';
import {ContentModel, GithubService} from '../services/github.service';
import {ImportGithubPanelComponent} from './import-github-panel/import-github-panel.component';
import {forkJoin} from 'rxjs';

enum ContentTypes {
    Json = 0,
    Xml = 1,
    Xlsx = 2
}

class ImportFileModel {
    public name: string;
    public contentType: ContentTypes = ContentTypes.Json;
    public content: string | Uint8Array;
    public resource?: DomainResource;
    public vsBundle?: Bundle;
    public message: string;
}

@Component({
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
    public textContentType = ContentTypes.Json;
    public textContent: string;
    public files: ImportFileModel[] = [];
    public outcome: OperationOutcome;
    public importBundle: Bundle;
    public resultsBundle: Bundle;
    public message: string;
    public activeTab = 'file';
    public vsacCriteria = new VSACImportCriteria();
    public rememberVsacCredentials: boolean;
    private readonly vsacUsernameCookieKey = 'vsac_username';
    private readonly vsacPasswordCookieKey = 'vsac_password';

    @ViewChild('importGithubPanel')
    private importGithubPanel: ImportGithubPanelComponent;

    constructor(
        public fhirService: FhirService,
        private importService: ImportService,
        private cdr: ChangeDetectorRef,
        private cookieService: CookieService,
        public githubService: GithubService) {

        const vsacUsername = this.cookieService.get(this.vsacUsernameCookieKey);
        const vsacPassword = this.cookieService.get(this.vsacPasswordCookieKey);

        if (vsacUsername && vsacPassword) {
            this.vsacCriteria.username = vsacUsername;
            this.vsacCriteria.password = atob(vsacPassword);
            this.rememberVsacCredentials = true;
        }
    }

    private populateFile(file) {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        const reader = new FileReader();

        if (extension !== '.json' && extension !== '.xml' && extension !== '.xlsx') {
            alert('Expected either JSON, XML or XLSX file');
            return;
        }

        reader.onload = (e: any) => {
            const result = e.target.result;
            const importFileModel = new ImportFileModel();
            importFileModel.name = file.name;
            importFileModel.content = result;

            if (extension === '.json') {
                importFileModel.contentType = ContentTypes.Json;
            } else if (extension === '.xml') {
                importFileModel.contentType = ContentTypes.Xml;
            } else if (extension === '.xlsx') {
                importFileModel.contentType = ContentTypes.Xlsx;
            }

            try {
                if (importFileModel.contentType === ContentTypes.Xml) {
                    importFileModel.resource = this.fhirService.deserialize(result);
                } else if (importFileModel.contentType === ContentTypes.Json) {
                    importFileModel.resource = JSON.parse(result);
                } else if (importFileModel.contentType === ContentTypes.Xlsx) {
                    const convertResults = this.importService.convertExcelToValueSetBundle(result);

                    if (!convertResults.success) {
                        throw new Error(convertResults.message);
                    }

                    importFileModel.vsBundle = convertResults.bundle;
                }
            } catch (ex) {
                importFileModel.message = ex.message;
            }

            const foundImportFile = _.find(this.files, (importFile: ImportFileModel) => importFile.name === file.name);

            if (foundImportFile) {
                const index = this.files.indexOf(foundImportFile);
                this.files.splice(index, 1);
            }

            this.files.push(importFileModel);
            this.importBundle = this.getFileBundle();

            this.cdr.detectChanges();
        };

        if (extension === '.json' || extension === '.xml') {
            reader.readAsText(file);
        } else if (extension === '.xlsx') {
            reader.readAsArrayBuffer(file);
        }
    }

    public filesChanged(event) {
        const files = event.target.files;
        if (files.length === 1) {
            try {
                this.populateFile(files[0]);
            } catch (ex) {
                this.message = ex.message;
            }
        }
    }

    public removeImportFile(index: number) {
        this.files.splice(index, 1);
        this.importBundle = this.getFileBundle();
    }

    public dropped(event: UploadEvent) {
        for (const droppedFile of event.files) {
            if (droppedFile.fileEntry.isFile) {
                try {
                    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                    fileEntry.file((file: File) => {
                        this.populateFile(file);
                    });
                } catch (ex) {
                    this.message = ex.message;
                }
            }
        }
    }

    public getBundleEntryOutcome(entry: EntryComponent): OperationOutcome {
        if (entry && entry.response && entry.response.outcome && entry.response.outcome.resourceType === 'OperationOutcome') {
            return <OperationOutcome>entry.response.outcome;
        }
    }

    private getFileBundle(): Bundle {
        const bundle = new Bundle();
        bundle.type = 'transaction';
        bundle.entry = _.chain(this.files)
            .filter((importFile: ImportFileModel) => importFile.contentType === ContentTypes.Json || importFile.contentType === ContentTypes.Xml)
            .map((importFile: ImportFileModel) => {
                const entry = new EntryComponent();
                entry.request = new RequestComponent();
                entry.request.method = importFile.resource.id ? 'PUT' : 'POST';
                entry.request.url = importFile.resource.resourceType + (importFile.resource.id ? '/' + importFile.resource.id : '');
                entry.resource = importFile.resource;

                return entry;
            })
            .value();

        _.chain(this.files)
            .filter((importFile: ImportFileModel) => importFile.contentType === ContentTypes.Xlsx)
            .each((importFile: ImportFileModel) => {
                bundle.entry = bundle.entry.concat(importFile.vsBundle.entry);
            });

        return bundle;
    }

    public getDisplayImportBundle(): Bundle {
        if (!this.importBundle) {
            return;
        }

        const clone = JSON.parse(JSON.stringify(this.importBundle));

        _.each(clone.entry, (entry: EntryComponent) => {
            entry.resource = {
                resourceType: entry.resource.resourceType,
                id: entry.resource.id
            };
        });

        return clone;
    }

    private importText(tabSet: NgbTabset) {
        const contentType = this.textContentType === ContentTypes.Json ? 'json' : 'xml';
        this.importService.import(contentType, this.textContent)
            .subscribe((results: OperationOutcome|Bundle) => {
                if (results.resourceType === 'OperationOutcome') {
                    this.outcome = <OperationOutcome>results;
                } else if (results.resourceType === 'Bundle') {
                    this.resultsBundle = <Bundle>results;
                }

                this.message = 'Done importing';
                setTimeout(() => {
                    tabSet.select('results');
                });
            }, (err) => {
                this.outcome = {
                    resourceType: 'OperationOutcome',
                    text: {
                        status: 'generated',
                        div: 'An error occurred while importing the resource(s): ' + err
                    },
                    issue: []
                };
                setTimeout(() => {
                    tabSet.select('results');
                });
            });
    }

    private importFiles(tabSet: NgbTabset) {
        const json = JSON.stringify(this.importBundle, null, '\t');
        this.importService.import('json', json)
            .subscribe((results: OperationOutcome|Bundle) => {
                if (results.resourceType === 'OperationOutcome') {
                    this.outcome = <OperationOutcome>results;
                } else if (results.resourceType === 'Bundle') {
                    this.resultsBundle = <Bundle>results;
                }

                this.files = [];
                this.message = 'Done importing';
                setTimeout(() => {
                    tabSet.select('results');
                });
            }, (err) => {
                if (err && err.message) {
                    this.message = 'Error while importing: ' + err.message;
                } else {
                    this.message = err;
                }
            });
    }

    private importVsac(tabSet: NgbTabset) {
        if (this.rememberVsacCredentials) {
            this.cookieService.put(this.vsacUsernameCookieKey, this.vsacCriteria.username);
            this.cookieService.put(this.vsacPasswordCookieKey, btoa(this.vsacCriteria.password));
        }

        this.importService.importVsac(this.vsacCriteria)
            .subscribe((results: OperationOutcome|Bundle) => {
                if (results.resourceType === 'OperationOutcome') {
                    this.outcome = <OperationOutcome>results;
                } else if (results.resourceType === 'Bundle') {
                    this.resultsBundle = <Bundle>results;
                }

                this.files = [];
                this.message = 'Done importing';
                setTimeout(() => {
                    tabSet.select('results');
                });
            }, (err) => {
                if (err && err.error && err.error.resourceType === 'OperationOutcome') {
                    this.outcome = <OperationOutcome> err.error;
                    this.files = [];
                    this.message = 'Import resulted in errors';
                    setTimeout(() => {
                        tabSet.select('results');
                    });
                } else if (err && err.message) {
                    this.message = 'Error while importing: ' + err.message;
                } else {
                    this.message = err;
                }
            });
    }

    public importGithub(tabSet: NgbTabset) {
        // Filter the paths so that we don't include duplicate paths, or paths for directories where
        // child files are already selected.
        const filteredPaths = _.filter(this.importGithubPanel.selectedPaths, (selectedPath: string) => {
            if (selectedPath.startsWith('dir|')) {
                const find1 = 'dir|' + selectedPath.substring(4) + '/';
                const find2 = 'file|' + selectedPath.substring(4) + '/';
                const foundChildren = _.find(this.importGithubPanel.selectedPaths, (next: string) => next.startsWith(find1) || next.startsWith(find2));

                return !foundChildren;
            }

            return true;
        });

        const observables = _.map(filteredPaths, (selectedPath: string) => {
            return this.githubService.getAllContents(this.importGithubPanel.ownerLogin, this.importGithubPanel.repositoryName, this.importGithubPanel.branchName, selectedPath);
        });

        forkJoin(observables).subscribe((results) => {
            let allFiles = [];

            _.each(results, (files) => {
                allFiles = allFiles.concat(files);
            });

            const notSupportedFiles = _.chain(allFiles)
                .filter((file: ContentModel) => !file.name.endsWith('.xml') && !file.name.endsWith('.json'))
                .map((file: ContentModel) => file.name)
                .value();

            if (notSupportedFiles.length > 0) {
                this.message = `One or more files are not XML or JSON files. Please un-select them before continuing: ${notSupportedFiles.join(', ')}`;
                return;
            }

            try {
                const bundle = new Bundle();
                bundle.type = 'transaction';
                bundle.entry = _.map(allFiles, (file: ContentModel) => {
                    const decodedContent = atob(file.content);
                    const entry = new EntryComponent();
                    entry.request = new RequestComponent();

                    if (decodedContent.startsWith('{')) {
                        entry.resource = JSON.parse(decodedContent);
                    } else if (decodedContent.startsWith('<')) {
                        try {
                            entry.resource = this.fhirService.deserialize(decodedContent);
                        } catch (ex) {
                            throw new Error(`An error occurred while converting ${file.path} from XML to JSON: ${ex.message}`);
                        }
                    } else {
                        throw new Error(`${file.path} does not appear to be a valid JSON or XML file.`);
                    }

                    this.fhirService.setResourceGithubDetails(entry.resource, {
                        owner: this.importGithubPanel.ownerLogin,
                        repository: this.importGithubPanel.repositoryName,
                        branch: this.importGithubPanel.branchName,
                        path: file.path
                    });

                    entry.request.method = entry.resource.id ? 'PUT' : 'POST';
                    entry.request.url = entry.resource.resourceType + (entry.resource.id ? '/' + entry.resource.id : '');

                    return entry;
                });

                const json = JSON.stringify(bundle, null, '\t');
                this.importService.import('json', json)
                    .subscribe((importResults: OperationOutcome|Bundle) => {
                        if (importResults.resourceType === 'OperationOutcome') {
                            this.outcome = <OperationOutcome> importResults;
                        } else if (importResults.resourceType === 'Bundle') {
                            this.resultsBundle = <Bundle> importResults;
                        }

                        this.files = [];
                        this.message = 'Done importing';
                        setTimeout(() => {
                            tabSet.select('results');
                        });
                    }, (err) => {
                        if (err && err.message) {
                            this.message = 'Error while importing: ' + err.message;
                        } else {
                            this.message = err;
                        }
                    });
            } catch (ex) {
                this.message = ex.message;
            }
        }, (err) => {
            this.message = err.message || err;
        });
    }

    public import(tabSet: NgbTabset) {
        this.outcome = null;
        this.resultsBundle = null;
        this.message = 'Importing...';

        if (this.activeTab === 'file') {
            this.importFiles(tabSet);
        } else if (this.activeTab === 'text') {
            this.importText(tabSet);
        } else if (this.activeTab === 'vsac') {
            this.importVsac(tabSet);
        } else if (this.activeTab === 'github') {
            this.importGithub(tabSet);
        }
    }

    public importDisabled(): boolean {
        if (this.activeTab === 'file') {
            return !this.files || this.files.length === 0 || !this.importBundle || !this.importBundle.entry || this.importBundle.entry.length === 0;
        } else if (this.activeTab === 'text') {
            return !this.textContent;
        } else if (this.activeTab === 'vsac') {
            return !this.vsacCriteria.id || !this.vsacCriteria.username || !this.vsacCriteria.password || !this.vsacCriteria.resourceType;
        } else if (this.activeTab === 'github') {
            return !this.importGithubPanel || !this.importGithubPanel.selectedPaths || this.importGithubPanel.selectedPaths.length === 0;
        }

        return true;
    }

    public getIdDisplay(file: ImportFileModel) {
        if (file.contentType === ContentTypes.Json || file.contentType === ContentTypes.Xml) {
            if (file.resource) {
                return file.resource.id;
            }
        } else if (file.contentType === ContentTypes.Xlsx) {
            if (file.vsBundle) {
                const ids = _.map(file.vsBundle.entry, (entry) => entry.resource.id);
                return ids.join(', ');
            }
        }
    }

    public getContentTypeDisplay(file: ImportFileModel) {
        switch (file.contentType) {
            case ContentTypes.Json:
                return 'Resource JSON';
            case ContentTypes.Xml:
                return 'Resource XML';
            case ContentTypes.Xlsx:
                return 'Value Set XLSX';
        }
    }

    ngOnInit() {
    }
}
