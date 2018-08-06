import {Component, OnInit} from '@angular/core';
import {ImportService} from '../services/import.service';
import {OperationOutcome} from '../models/stu3/fhir';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

enum ContentTypes {
    Json,
    Xml
}

@Component({
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.css'],
    providers: [ImportService]
})
export class ImportComponent implements OnInit {
    public importType = 'file';
    public text: string;
    public contentType: ContentTypes = ContentTypes.Json;
    public results: OperationOutcome;

    constructor(private importService: ImportService) {
    }

    public filesChanged(event) {
        const files = event.target.files;
        if (files.length === 1) {
            const extension = files[0].name.substring(files[0].name.lastIndexOf('.'));
            const reader = new FileReader();

            if (extension !== '.json' && extension !== '.xml') {
                alert('Expected either json or xml');
                return;
            }

            reader.onload = (e: any) => {
                const result = e.target.result;
                this.text = result;
                this.importType = 'text';
                this.contentType = extension === '.json' ? ContentTypes.Json : ContentTypes.Xml;
            };

            reader.readAsText(files[0]);
        }
    }

    public import(tabSet: NgbTabset) {
        const contentType = this.contentType === ContentTypes.Json ? 'json' : 'xml';
        this.importService.import(contentType, this.text)
            .subscribe((results) => {
                this.results = results;
                setTimeout(() => {
                    tabSet.select('results');
                });
            }, (err) => {
                this.results = {
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

    ngOnInit() {
    }

}
