import {Component, OnInit} from '@angular/core';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {ConfigService} from '../services/config.service';
import {Bundle, ImplementationGuide} from '../models/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import {Subject} from 'rxjs';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'app-implementation-guides',
    templateUrl: './implementation-guides.component.html',
    styleUrls: ['./implementation-guides.component.css']
})
export class ImplementationGuidesComponent implements OnInit {
    public results: Bundle = null;
    public page = 1;
    public nameText: string;
    public criteriaChangedEvent = new Subject();

    constructor(
        private igService: ImplementationGuideService,
        private configService: ConfigService,
        private modalService: NgbModal) {

        this.criteriaChangedEvent
            .debounceTime(500)
            .subscribe(() => {
                this.getImplementationGuides();
            });
    }

    public clearFilters() {
        this.nameText = null;
        this.page = 1;
        this.criteriaChanged();
    }

    public getImplementationGuides() {
        this.results = null;
        this.configService.setStatusMessage('Loading implementation guides');

        this.igService.getImplementationGuides(this.page, this.nameText)
            .subscribe((res: Bundle) => {
                this.results = res;
                this.configService.setStatusMessage('');
            }, err => {
                this.configService.handleError(err, 'Error loading implementation guides.');
            });
    }

    public remove(implementationGuide: ImplementationGuide) {
        this.igService.removeImplementationGuide(implementationGuide.id)
            .subscribe(() => {
                const foundEntry = _.find(this.results.entry, (entry) => entry.resource === implementationGuide);
                const index = this.results.entry.indexOf(foundEntry);
                this.results.entry.splice(index, 1);
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while deleting the implementation guide');
            });
    }

    public changeId(implementationGuide: ImplementationGuide) {
        const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
        modalRef.componentInstance.resourceType = 'ImplementationGuide';
        modalRef.componentInstance.originalId = implementationGuide.id;
        modalRef.result.then((newId) => {
            implementationGuide.id = newId;
        });
    }

    public get implementationGuides() {
        if (!this.results) {
            return [];
        }

        return _.map(this.results.entry, (entry) => <ImplementationGuide> entry.resource);
    }

    public nameTextChanged(value: string) {
        this.nameText = value;
        this.page = 1;
        this.criteriaChanged();
    }

    private criteriaChanged() {
        this.criteriaChangedEvent.next();
    }

    ngOnInit() {
        this.getImplementationGuides();
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getImplementationGuides());
    }
}
