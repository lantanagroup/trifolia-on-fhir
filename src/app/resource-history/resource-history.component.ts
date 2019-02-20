import {Component, Input, OnInit, Output} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {Bundle} from '../models/stu3/fhir';

@Component({
    selector: 'app-resource-history',
    templateUrl: './resource-history.component.html',
    styleUrls: ['./resource-history.component.css']
})
export class ResourceHistoryComponent implements OnInit {

    @Input()
    public resource: any;
    public historyBundle: Bundle;

    constructor(private fhirService: FhirService) {
    }

    public loadHistory(resource: any) {
        if (confirm('Loading the history will overwrite any changes you have made to the resource that are not saved. Save to confirm reverting to the selected historical item. Are you sure want to continue?')) {
            Object.assign(this.resource, resource);
        }
    }

    ngOnInit() {
        if (this.resource && this.resource.resourceType && this.resource.id) {
            this.fhirService.history(this.resource.resourceType, this.resource.id)
                .subscribe((bundle: Bundle) => {
                    this.historyBundle = bundle;
                }, (err) => {
                    console.log('An error occurred');
                });
        }
    }
}
