import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Binary, ImplementationGuide, ImplementationGuidePageComponent} from '../../models/r4/fhir';
import * as _ from 'underscore';
import {Globals} from '../../globals';

@Component({
    selector: 'app-fhir-page-component-modal',
    templateUrl: './page-component-modal.component.html',
    styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
    @Input() page: ImplementationGuidePageComponent;
    @Input() implementationGuide: ImplementationGuide;
    public pageBinary: Binary;

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {

    }

    public get nameType(): string {
        if (this.page.hasOwnProperty('nameReference')) {
            return 'Reference';
        } else if (this.page.hasOwnProperty('nameUrl')) {
            return 'Url';
        }
    }

    public set nameType(value: string) {
        if (this.nameType === value) {
            return;
        }

        if (this.nameType === 'Reference') {
            delete this.page.nameReference;
            this.pageBinary = null;
            this.page.nameUrl = '';
        } else if (this.nameType === 'Url') {
            delete this.page.nameUrl;
            this.page.nameReference = { reference: '', display: '' };
        }
    }

    public get pageContent() {
        if (!this.pageBinary || !this.pageBinary.data) {
            return '';
        }

        return atob(this.pageBinary.data);
    }

    public set pageContent(value: string) {
        if (!this.pageBinary) {
            return;
        }

        this.pageBinary.data = btoa(value);
    }

    public importFile(file: File) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
            const result = e.target.result;

            if (!this.implementationGuide.contained) {
                this.implementationGuide.contained = [];
            }

            const newBinary = new Binary();
            newBinary.id = this.globals.generateRandomNumber(5000, 10000).toString();
            newBinary.contentType = file.type;
            newBinary.data = result.substring(5 + file.type.length + 8);
            this.implementationGuide.contained.push(newBinary);

            if (!this.page.extension) {
                this.page.extension = [];
            }

            this.nameType = 'Reference';
            this.page.nameReference.reference = '#' + newBinary.id;
            this.page.nameReference.display = 'Page content ' + newBinary.id;

            this.pageBinary = newBinary;
        };

        reader.readAsDataURL(file);
    }

    ngOnInit() {
        // Make sure the page has the required name property
        if (!this.page.nameReference && !this.page.nameUrl) {
            this.page.nameReference = { reference: '', display: '' };
        }

        if (this.page.nameReference && this.page.nameReference.reference && this.page.nameReference.reference.startsWith('#')) {
            // Find the Binary in the contained resources
            this.pageBinary = _.find(this.implementationGuide.contained, (extension) => extension.id === this.page.nameReference.reference.substring(1));
        }
    }
}
