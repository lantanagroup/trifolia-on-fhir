import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ImportService, VSACImportCriteria} from '../services/import.service';
import {Bundle, DomainResource, EntryComponent, OperationOutcome, RequestComponent} from '../models/stu3/fhir';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {FileSystemFileEntry, UploadEvent} from 'ngx-file-drop';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'underscore';
import {FhirService} from '../services/fhir.service';
import {CookieService} from 'angular2-cookie/core';

enum ContentTypes {
    Json,
    Xml
}

class ImportFileModel {
    public name: string;
    public contentType: ContentTypes = ContentTypes.Json;
    public content: string;
    public resource: DomainResource;
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

    constructor(
        public fhirService: FhirService,
        private importService: ImportService,
        private cdr: ChangeDetectorRef,
        private cookieService: CookieService) {

        const vsacUsername = this.cookieService.get(this.vsacUsernameCookieKey);
        const vsacPassword = this.cookieService.get(this.vsacPasswordCookieKey);

        if (vsacUsername && vsacPassword) {
            this.vsacCriteria.username = vsacUsername;
            this.vsacCriteria.password = atob(vsacPassword);
            this.rememberVsacCredentials = true;
        }
    }

    private populateFile(file) {
        const extension = file.name.substring(file.name.lastIndexOf('.'));
        const reader = new FileReader();

        if (extension !== '.json' && extension !== '.xml') {
            alert('Expected either json or xml');
            return;
        }

        reader.onload = (e: any) => {
            const result = e.target.result;
            const importFileModel = new ImportFileModel();
            importFileModel.name = file.name;
            importFileModel.content = result;
            importFileModel.contentType = extension === '.json' ? ContentTypes.Json : ContentTypes.Xml;

            try {
                if (importFileModel.contentType === ContentTypes.Xml) {
                    importFileModel.resource = this.fhirService.deserialize(result);
                } else {
                    importFileModel.resource = JSON.parse(result);
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

        reader.readAsText(file);
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
            .filter((importFile: ImportFileModel) => !!importFile.resource)
            .map((importFile: ImportFileModel) => {
                const entry = new EntryComponent();
                entry.request = new RequestComponent();
                entry.request.method = importFile.resource.id ? 'PUT' : 'POST';
                entry.request.url = importFile.resource.resourceType + (importFile.resource.id ? '/' + importFile.resource.id : '');
                entry.resource = importFile.resource;

                return entry;
            })
            .value();

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

    public import(tabSet: NgbTabset) {
        this.outcome = null;
        this.resultsBundle = null;
        this.message = 'Importing...';

        if (this.activeTab === 'text') {
            this.importText(tabSet);
        } else if (this.activeTab === 'file') {
            this.importFiles(tabSet);
        } else if (this.activeTab === 'vsac') {
            this.importVsac(tabSet);
        }
    }

    public importDisabled(): boolean {
        if (this.activeTab === 'file') {
            return !this.files || this.files.length === 0;
        } else if (this.activeTab === 'text') {
            return !this.textContent;
        } else if (this.activeTab === 'vsac') {
            return !this.vsacCriteria.id || !this.vsacCriteria.username || !this.vsacCriteria.password || !this.vsacCriteria.resourceType;
        }

        return true;
    }

    ngOnInit() {
    }

}
