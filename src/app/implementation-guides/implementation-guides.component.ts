import {Component, OnInit} from '@angular/core';
import {ImplementationGuideService} from '../services/implementation-guide.service';
import {ImplementationGuideListItemModel} from '../models/implementation-guide-list-item-model';
import {ConfigService} from '../services/config.service';
import {ImplementationGuide} from '../models/stu3/fhir';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-implementation-guides',
    templateUrl: './implementation-guides.component.html',
    styleUrls: ['./implementation-guides.component.css']
})
export class ImplementationGuidesComponent implements OnInit {
    public implementationGuides: ImplementationGuideListItemModel[] = [];
    public page = 1;
    public contentText: string;

    constructor(
        private igService: ImplementationGuideService,
        private configService: ConfigService,
        private modalService: NgbModal) { }

    public getImplementationGuides() {
        this.implementationGuides = [];
        this.configService.setStatusMessage('Loading implementation guides');

        this.igService.getImplementationGuides(undefined)
            .subscribe(res => {
                this.implementationGuides = res;
                this.configService.setStatusMessage('');
            }, err => {
                this.configService.handleError(err, 'Error loading implementation guides.');
            });
    }

    public remove(implementationGuide: ImplementationGuideListItemModel) {
        this.igService.removeImplementationGuide(implementationGuide.id)
            .subscribe(() => {
                const igIndex = this.implementationGuides.indexOf(implementationGuide);
                this.implementationGuides.splice(igIndex, 1);
            }, (err) => {
                // TODO
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

    public contentTextChanged(value: string) {

    }

    ngOnInit() {
        this.getImplementationGuides();
        this.configService.fhirServerChanged.subscribe((fhirServer) => this.getImplementationGuides());
    }
}
