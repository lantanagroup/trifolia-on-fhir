import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {Bundle, ResourceReference} from '../../models/stu3/fhir';
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
    @Input() public parentObject: any;
    @Input() public propertyName: string;
    @Input() public isFormGroup = true;
    @Input() public title: string;
    @Input() public resourceType?: string;
    @Input() public required: boolean;
    @Input() public hideResourceType?: boolean;
    @Input() public disabled: boolean;
    public contentSearch?: string;
    public contentSearchChanged: Subject<string> = new Subject<string>();
    public results?: Bundle;

    constructor(
        private http: HttpClient,
        private modalService: NgbModal,
        public globals: Globals) {

        this.contentSearchChanged
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(() => this.criteriaChanged());
    }
    
    get reference(): string {
        if (this.parentObject[this.propertyName]) {
            return this.parentObject[this.propertyName].reference;
        }
        return '';
    }
    
    set reference(value: string) {
        if (!this.parentObject[this.propertyName]) {
            return;
        }
        
        this.parentObject[this.propertyName].reference = value;
    }

    get display(): string {
        if (this.parentObject[this.propertyName]) {
            return this.parentObject[this.propertyName].display;
        }
        return '';
    }

    set display(value: string) {
        if (!this.parentObject[this.propertyName]) {
            return;
        }

        this.parentObject[this.propertyName].display = value;
    }

    open(content) {
        this.modalService.open(content).result.then((result) => {

        }, (reason) => {

        });
    }

    select(resourceEntry, closeCb) {
        const reference: ResourceReference = this.parentObject[this.propertyName];
        reference.reference = resourceEntry.resource.resourceType + '/' + resourceEntry.resource.id;
        reference.display = new FhirDisplayPipe().transform(resourceEntry.resource, []);
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
