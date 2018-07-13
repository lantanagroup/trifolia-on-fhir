import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {Bundle, ResourceReference} from '../../models/fhir';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {FhirDisplayPipe} from '../../pipes/fhir-display-pipe';

@Component({
    selector: 'app-fhir-reference',
    templateUrl: './reference.component.html',
    styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit {
    @Input() public resourceType?: string;
    @Input() public reference: ResourceReference;
    @Input() public hideResourceType?: boolean;
    @Input() public disabled: boolean;
    public contentSearch?: string;
    public contentSearchChanged: Subject<string> = new Subject<string>();
    public results?: Bundle;

    constructor(
        private http: HttpClient,
        private modalService: NgbModal,
        private globals: Globals) {

        this.contentSearchChanged
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(() => this.criteriaChanged());
    }

    open(content) {
        this.modalService.open(content).result.then((result) => {

        }, (reason) => {

        });
    }

    select(resourceEntry, closeCb) {
        this.reference.reference = resourceEntry.resource.resourceType + '/' + resourceEntry.resource.id;
        this.reference.display = new FhirDisplayPipe().transform(resourceEntry.resource, []);
        closeCb();
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
        this.criteriaChanged();
    }

}
