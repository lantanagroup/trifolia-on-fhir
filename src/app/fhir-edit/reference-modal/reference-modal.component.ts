import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {Bundle, Coding, ResourceReference} from '../../models/stu3/fhir';
import {FhirDisplayPipe} from '../../pipes/fhir-display-pipe';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {FhirService} from '../../services/fhir.service';

@Component({
    selector: 'app-fhir-reference-modal',
    templateUrl: './reference-modal.component.html',
    styleUrls: ['./reference-modal.component.css']
})
export class FhirEditReferenceModalComponent implements OnInit {
    @Input() public resourceType?: string;
    @Input() public hideResourceType?: boolean;
    public contentSearch?: string;
    public contentSearchChanged: Subject<string> = new Subject<string>();
    public results?: Bundle;
    public resourceTypeCodes: Coding[] = [];

    constructor(
        public activeModal: NgbActiveModal,
        private http: HttpClient,
        private fhirService: FhirService,
        public globals: Globals) {

        this.contentSearchChanged
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(() => this.criteriaChanged());
    }

    public select(resourceEntry) {
        this.activeModal.close({
            resourceType: resourceEntry.resource.resourceType,
            id: resourceEntry.resource.id,
            display: new FhirDisplayPipe().transform(resourceEntry.resource, []),
            fullUrl: resourceEntry.fullUrl,
            resource: resourceEntry.resource
        });
    }

    criteriaChanged() {
        if (!this.resourceType) {
            this.results = null;
            return;
        }

        let url = '/api/fhir/' + this.resourceType + '?_summary=true&';

        if (this.contentSearch) {
            url += '_content=' + encodeURIComponent(this.contentSearch) + '&';
        }

        this.http.get(url)
            .subscribe((results: Bundle) => {
                this.results = results;
            }, (err) => {
                // TODO
            });
    }

    ngOnInit() {
        this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
        this.criteriaChanged();
    }
}
