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
    @Input() rootPage: boolean;
    public pageBinary: Binary;

    constructor(
        public activeModal: NgbActiveModal,
        public globals: Globals) {

    }

    public get autoGenerate(): boolean {
        const autoGenerateExtension = _.find(this.page.extension, (extension) => extension.url === this.globals.extensionIgPageAutoGenerateToc);

        if (autoGenerateExtension) {
            return autoGenerateExtension.valueBoolean === true;
        }

        return false;
    }

    public set autoGenerate(value: boolean) {
        if (!this.page.extension) {
            this.page.extension = [];
        }

        let autoGenerateExtension = _.find(this.page.extension, (extension) => extension.url === this.globals.extensionIgPageAutoGenerateToc);

        if (!autoGenerateExtension) {
            autoGenerateExtension = {
                url: this.globals.extensionIgPageAutoGenerateToc,
                valueBoolean: false
            };
            this.page.extension.push(autoGenerateExtension);
        }

        autoGenerateExtension.valueBoolean = value;

        if (value && this.page.nameReference && this.page.nameReference.reference && this.page.nameReference.reference.startsWith('#')) {
            const foundBinary = _.find(this.implementationGuide.contained, (contained) => contained.id === this.page.nameReference.reference.substring(1));

            if (foundBinary) {
                const index = this.implementationGuide.contained.indexOf(foundBinary);
                this.implementationGuide.contained.splice(index, 1);
                delete this.page.nameReference;
                this.page.nameUrl = 'toc.md';
                this.pageBinary = null;
            }
        }
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
        if (this.page && !this.page.nameReference && !this.page.nameUrl) {
            this.page.nameReference = { reference: '', display: '' };
        }

        if (this.page && this.page.nameReference && this.page.nameReference.reference && this.page.nameReference.reference.startsWith('#')) {
            // Find the Binary in the contained resources
            this.pageBinary = <Binary> _.find(this.implementationGuide.contained, (extension) => extension.id === this.page.nameReference.reference.substring(1));
        }
    }
}
