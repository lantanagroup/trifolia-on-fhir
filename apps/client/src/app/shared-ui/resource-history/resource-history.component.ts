import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FhirService} from '../../shared/fhir.service';
import {Bundle} from '../../models/stu3/fhir';

@Component({
    selector: 'app-resource-history',
    templateUrl: './resource-history.component.html',
    styleUrls: ['./resource-history.component.css']
})
export class ResourceHistoryComponent implements OnInit {
    @Input() public resource: any;
    @Output() public resourceChange = new EventEmitter<any>();

    public historyBundle: Bundle;
    public message: string;
    public compareResource: any;

    constructor(private fhirService: FhirService) {
    }

    public loadHistory(resource: any) {
        if (!confirm('Loading the history will overwrite any changes you have made to the resource that are not saved. Save to confirm reverting to the selected historical item. Are you sure want to continue?')) {
            return;
        }

        this.compareResource = null;
        this.resourceChange.emit(resource);
        this.message = `Done loading version ${this.compareResource.meta.versionId}`;
    }

    ngOnInit() {
        if (this.resource && this.resource.resourceType && this.resource.id) {
            this.fhirService.history(this.resource.resourceType, this.resource.id)
                .subscribe((bundle: Bundle) => {
                    this.historyBundle = bundle;
                }, (err) => {
                    this.message = this.fhirService.getErrorString(err);
                });
        }
    }
}
