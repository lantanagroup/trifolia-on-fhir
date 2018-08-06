import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Binary, ImplementationGuide, PageComponent} from '../../models/stu3/fhir';
import * as _ from 'underscore';
import {Globals} from '../../globals';
import {BinaryService} from '../../services/binary.service';

@Component({
    selector: 'app-fhir-page-component-modal',
    templateUrl: './page-component-modal.component.html',
    styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
    @Input() page: PageComponent;
    @Input() implementationGuide: ImplementationGuide;
    public pageBinary: Binary;

    constructor(
        public activeModal: NgbActiveModal,
        private globals: Globals,
        private binaryService: BinaryService) {

    }

    public get pageContent() {
        if (!this.pageBinary || !this.pageBinary.content) {
            return '';
        }

        return atob(this.pageBinary.content);
    }

    public set pageContent(value: string) {
        if (!this.pageBinary) {
            return;
        }

        this.pageBinary.content = btoa(value);
    }

    public ok() {
        const parsedSourceUrl = this.globals.parseFhirUrl(this.page.source);

        if (parsedSourceUrl && parsedSourceUrl.resourceType === 'Binary') {
            this.binaryService.save(this.pageBinary)
                .subscribe((results) => {
                    this.activeModal.close();
                }, (err) => {

                });
        }
    }

    public cancel() {
        this.activeModal.dismiss();
    }

    ngOnInit() {
        if (this.page.source) {
            const parsedSourceUrl = this.globals.parseFhirUrl(this.page.source);

            if (this.page.source.startsWith('#')) {
                // If the page does have a source and it starts with a #
                // Find the Binary in the contained resources
                this.pageBinary = _.find(this.implementationGuide.contained, (extension) => extension.id === this.page.source.substring(1));
            } else if (parsedSourceUrl && parsedSourceUrl.resourceType === 'Binary') {
                this.binaryService.get(parsedSourceUrl.id)
                    .subscribe((binary) => {
                        this.pageBinary = binary;
                    }, (err) => {

                    });
            }
        }
    }
}
