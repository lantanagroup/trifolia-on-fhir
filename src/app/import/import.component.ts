import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ImportService} from '../services/import.service';
import {OperationOutcome} from '../models/stu3/fhir';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {FileSystemFileEntry, UploadEvent} from 'ngx-file-drop';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'underscore';

enum ContentTypes {
    Json,
    Xml
}

class ImportFileModel {
    public name: string;
    public contentType: ContentTypes = ContentTypes.Json;
    public content: string;
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
    public results: OperationOutcome[];
    public message: string;
    public activeTab = 'file';

    constructor(
        private importService: ImportService,
        private cdr: ChangeDetectorRef) {
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

            const foundImportFile = _.find(this.files, (importFile: ImportFileModel) => importFile.name === file.name);

            if (foundImportFile) {
                const index = this.files.indexOf(foundImportFile);
                this.files.splice(index, 1);
            }

            this.files.push(importFileModel);
            this.cdr.detectChanges();
        };

        reader.readAsText(file);
    }

    public filesChanged(event) {
        const files = event.target.files;
        if (files.length === 1) {
            this.populateFile(files[0]);
        }
    }

    public dropped(event: UploadEvent) {
        for (const droppedFile of event.files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    this.populateFile(file);
                });
            }
        }

    }

    public import(tabSet: NgbTabset) {
        this.results = [];
        this.message = 'Importing...';

        if (this.activeTab === 'text') {
            const contentType = this.textContentType === ContentTypes.Json ? 'json' : 'xml';
            this.importService.import(contentType, this.textContent)
                .subscribe((results: OperationOutcome) => {
                    if (results.resourceType === 'OperationOutcome') {
                        results.location = ['Text upload'];
                    }
                    this.textContent = '';
                    this.results.push(results);
                    this.message = 'Done importing';
                    setTimeout(() => {
                        tabSet.select('results');
                    });
                }, (err) => {
                    this.results.push({
                        resourceType: 'OperationOutcome',
                        text: {
                            status: 'generated',
                            div: 'An error occurred while importing the resource(s): ' + err
                        },
                        issue: []
                    });
                    setTimeout(() => {
                        tabSet.select('results');
                    });
                });
        } else if (this.activeTab === 'file') {
            const imports = _.map(this.files, (importFile: ImportFileModel) => {
                const contentType = importFile.contentType === ContentTypes.Json ? 'json' : 'xml';
                const observable = this.importService.import(contentType, importFile.content);
                return observable;
            });

            Observable.forkJoin(imports)
                .subscribe((allResults: OperationOutcome[]) => {
                    _.each(allResults, (results, index) => {
                        if (results.resourceType === 'OperationOutcome') {
                            results.location = ['File upload ' + (index + 1)];
                        }
                    });
                    this.files = [];
                    this.results = allResults;
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
    }

    public importDisabled(): boolean {
        if (this.activeTab === 'file') {
            return !this.files || this.files.length === 0;
        } else if (this.activeTab === 'text') {
            return !this.textContent;
        }
    }

    ngOnInit() {
    }

}
