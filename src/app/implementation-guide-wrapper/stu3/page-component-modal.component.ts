import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Binary, ImplementationGuide, PageComponent} from '../../models/stu3/fhir';
import * as _ from 'underscore';
import {Globals} from '../../globals';

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
        public globals: Globals) {

    }

    public get autoGenerate(): boolean {
        const autoGenerateExtension = _.find(this.page.extension, (extension) => extension.url === this.globals.extensionUrls['extension-ig-page-auto-generate-toc']);

        if (autoGenerateExtension) {
            return autoGenerateExtension.valueBoolean === true;
        }

        return false;
    }

    public set autoGenerate(value: boolean) {
        if (!this.page.extension) {
            this.page.extension = [];
        }

        let autoGenerateExtension = _.find(this.page.extension, (extension) => extension.url === this.globals.extensionUrls['extension-ig-page-auto-generate-toc']);

        if (!autoGenerateExtension) {
            autoGenerateExtension = {
                url: this.globals.extensionUrls['extension-ig-page-auto-generate-toc'],
                valueBoolean: false
            };
            this.page.extension.push(autoGenerateExtension);
        }

        autoGenerateExtension.valueBoolean = value;

        const foundIgPageContentExtension = _.find(this.page.extension, (extension) => extension.url === this.globals.extensionUrls['extension-ig-page-content']);

        if (value && foundIgPageContentExtension && foundIgPageContentExtension.valueReference && foundIgPageContentExtension.valueReference.reference && foundIgPageContentExtension.valueReference.reference.startsWith('#')) {
            const foundBinary = _.find(this.implementationGuide.contained, (contained) => contained.id === foundIgPageContentExtension.valueReference.reference.substring(1));

            if (foundBinary) {
                const binaryIndex = this.implementationGuide.contained.indexOf(foundBinary);
                const extensionIndex = this.page.extension.indexOf(foundIgPageContentExtension);

                this.implementationGuide.contained.splice(binaryIndex, 1);
                this.page.extension.splice(extensionIndex, 1);
                this.pageBinary = null;
            }
        }
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
            newBinary.content = result.substring(5 + file.type.length + 8);
            this.implementationGuide.contained.push(newBinary);

            if (!this.page.extension) {
                this.page.extension = [];
            }

            let contentExtension = _.find(this.page.extension, (extension) => extension.url === this.globals.extensionUrls['extension-ig-page-content']);

            if (!contentExtension) {
                contentExtension = {
                    url: this.globals.extensionUrls['extension-ig-page-content'],
                    valueReference: {
                        reference: '#' + newBinary.id,
                        display: 'Page content ' + newBinary.id
                    }
                };
                this.page.extension.push(contentExtension);
            } else {
                contentExtension.valueReference = {
                    reference: '#' + newBinary.id,
                    display: 'Page content ' + newBinary.id
                };
            }

            this.pageBinary = newBinary;
        };

        reader.readAsDataURL(file);
    }

    ngOnInit() {
        if (this.page && this.page.source) {
            const contentExtension = _.find(this.page.extension, (extension) => extension.url === this.globals.extensionUrls['extension-ig-page-content']);

            if (contentExtension && contentExtension.valueReference && contentExtension.valueReference.reference) {
                const reference = contentExtension.valueReference.reference;
                const parsedSourceUrl = this.globals.parseFhirUrl(reference);

                if (reference.startsWith('#')) {
                    // Find the Binary in the contained resources
                    this.pageBinary = <Binary> _.find(this.implementationGuide.contained, (extension) => extension.id === reference.substring(1));
                }
            }
        }
    }
}
