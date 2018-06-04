import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Binary, ImplementationGuide, PageComponent} from '../../models/fhir';
import * as _ from 'underscore';
import {Globals} from '../../globals';

@Component({
    selector: 'app-page-component-modal',
    templateUrl: './page-component-modal.component.html',
    styleUrls: ['./page-component-modal.component.css']
})
export class PageComponentModalComponent implements OnInit {
    @Input() page: PageComponent;
    @Input() implementationGuide: ImplementationGuide;
    public pageBinary: Binary;

    constructor(
        public activeModal: NgbActiveModal,
        private globals: Globals) {

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

    ngOnInit() {
        if (this.page.source && this.page.source.startsWith('#')) {
            // If the page does have a source and it starts with a #
            // Find the Binary in the contained resources
            this.pageBinary = _.find(this.implementationGuide.contained, (extension) => extension.id === this.page.source.substring(1));
        }
    }
}
