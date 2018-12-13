import {Component, Input, OnInit} from '@angular/core';
import {ConceptReferenceComponent} from '../../models/stu3/fhir';
import {FhirValueSetIncludeConceptModalComponent} from '../../fhir-edit/value-set-include-concept-modal/value-set-include-concept-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import {Globals} from '../../globals';

@Component({
    selector: 'app-valueset-concept-card',
    templateUrl: './concept-card.component.html',
    styleUrls: ['./concept-card.component.css']
})
export class ConceptCardComponent implements OnInit {
    @Input() parentObject: any;
    @Input() propertyName: string;
    public filteredConcepts: ConceptReferenceComponent[] = [];
    public pagedConcepts: ConceptReferenceComponent[] = [];
    public page = 1;
    public totalPages = 1;
    public searchCode: string;
    public searchDisplay: string;
    public readonly perPage = 5;

    constructor(
        private globals: Globals,
        private modalService: NgbModal) {
    }

    public get concepts(): ConceptReferenceComponent[] {
        if (this.parentObject && this.propertyName && this.parentObject[this.propertyName]) {
            return this.parentObject[this.propertyName];
        }

        return [];
    }

    public addConcept() {
        if (!this.parentObject[this.propertyName]) {
            return;
        }

        this.searchCode = null;
        this.searchDisplay = null;
        this.page = Math.ceil(this.parentObject[this.propertyName].length / this.perPage);
        this.parentObject[this.propertyName].push({ code: '' });
        this.refreshConcepts();
    }

    public toggleConcepts() {
        this.globals.toggleProperty(this.parentObject, this.propertyName, [{ code: '' }]);
        this.page = 1;
        this.refreshConcepts();
    }

    public editConcept(concept: ConceptReferenceComponent) {
        const modalRef = this.modalService.open(FhirValueSetIncludeConceptModalComponent, { size: 'lg' });
        modalRef.componentInstance.concept = concept;
    }

    public criteriaChanged() {
        this.page = 1;
        this.refreshConcepts();
    }

    public removeConcept(concept: ConceptReferenceComponent) {
        if (!this.parentObject[this.propertyName]) {
            return;
        }

        const index = this.parentObject[this.propertyName].indexOf(concept);
        this.parentObject[this.propertyName].splice(index, 1);

        this.refreshConcepts();
    }

    public searchCodeChanged(newValue: string) {
        this.searchCode = newValue;
        this.refreshConcepts();
    }

    public searchDisplayChanged(newValue: string) {
        this.searchDisplay = newValue;
        this.refreshConcepts();
    }

    public refreshConcepts() {
        if (!this.parentObject || !this.propertyName) {
            return;
        }

        const actualConcepts = <ConceptReferenceComponent[]> this.parentObject[this.propertyName];
        let filtered = [];

        if (actualConcepts && actualConcepts.length > 0) {
            const lowerSearchCode = this.searchCode ? this.searchCode.toLowerCase() : null;
            const lowerSearchDisplay = this.searchDisplay ? this.searchDisplay.toLowerCase() : null;

            filtered = _.filter(actualConcepts, (concept: ConceptReferenceComponent) => {
                const matchesCode = !lowerSearchCode ||
                    (concept.code && concept.code.toLowerCase().indexOf(lowerSearchCode) >= 0);
                const matchesDisplay = !lowerSearchDisplay ||
                    (concept.display && concept.display.toLowerCase().indexOf(lowerSearchDisplay) >= 0);

                return matchesCode && matchesDisplay;
            });
        }

        this.totalPages = Math.ceil(filtered.length / this.perPage);

        if (this.page > this.totalPages) {
            this.page = this.totalPages;
        }

        this.filteredConcepts = filtered;

        const startIndex = this.page <= 1 ? 0 : (this.page - 1) * this.perPage;
        this.pagedConcepts = filtered.slice(startIndex, startIndex + this.perPage);
    }

    ngOnInit() {
        this.refreshConcepts();
    }
}
