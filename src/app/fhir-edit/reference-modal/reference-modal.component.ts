import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {Bundle, Coding} from '../../models/stu3/fhir';
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
    public criteriaChangedEvent: Subject<string> = new Subject<string>();
    public nameSearch?: string;
    public titleSearch?: string;
    public results?: Bundle;
    public resourceTypeCodes: Coding[] = [];
    public nameSearchTypes: string[] = [];
    public titleSearchTypes: string[] = [];
    public message: string;

    constructor(
        public activeModal: NgbActiveModal,
        private http: HttpClient,
        private fhirService: FhirService,
        public globals: Globals) {

        this.criteriaChangedEvent
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(() => this.criteriaChanged());
    }

    public get showContentSearch() {
        return this.resourceType && this.nameSearchTypes.concat(this.titleSearchTypes).indexOf(this.resourceType) < 0;
    }

    public get showNameSearch() {
        return this.nameSearchTypes.indexOf(this.resourceType) >= 0;
    }

    public get showTitleSearch() {
        return this.titleSearchTypes.indexOf(this.resourceType) >= 0;
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

    criteriaChanged(loadMore?: boolean) {
        if (!loadMore) {
            this.results = null;
        }

        if (!this.resourceType) {
            return;
        }

        const nonContentResourceTypes = this.nameSearchTypes.concat(this.titleSearchTypes);
        let url = '/api/fhir/' + this.resourceType + '?_summary=true&_count=10&';

        if (this.results && this.results.entry) {
            url += '_getpagesoffset=' + this.results.entry.length + '&';
        }

        if (this.contentSearch && nonContentResourceTypes.indexOf(this.resourceType) < 0) {
            url += '_content=' + encodeURIComponent(this.contentSearch) + '&';
        }

        if (this.nameSearch && this.nameSearchTypes.indexOf(this.resourceType) >= 0) {
            url += 'name:contains=' + encodeURIComponent(this.nameSearch);
        }

        if (this.titleSearch && this.titleSearchTypes.indexOf(this.resourceType) >= 0) {
            url += 'title:contains=' + encodeURIComponent(this.titleSearch);
        }

        this.http.get(url)
            .subscribe((results: Bundle) => {
                if (this.results) {
                    this.results.entry = this.results.entry.concat(results.entry);
                } else {
                    this.results = results;
                }
            }, (err) => {
                this.message = err.message || err.data || err;
            });
    }

    ngOnInit() {
        this.resourceTypeCodes = this.fhirService.getValueSetCodes('http://hl7.org/fhir/ValueSet/resource-types');
        this.criteriaChanged();
        this.nameSearchTypes = this.fhirService.findResourceTypesWithSearchParam('name');
        this.titleSearchTypes = this.fhirService.findResourceTypesWithSearchParam('title');
    }
}
