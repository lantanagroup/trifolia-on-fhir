import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {ImplementationGuideService, PublishedGuideModel} from '../shared/implementation-guide.service';

@Component({
    selector: 'app-published-ig-select-modal',
    templateUrl: './published-ig-select-modal.component.html',
    styleUrls: ['./published-ig-select-modal.component.css']
})
export class PublishedIgSelectModalComponent implements OnInit {
    public guides: PublishedGuideModel[];

    constructor(
        public activeModal: NgbActiveModal,
        private igService: ImplementationGuideService) {
    }

    ngOnInit() {
        this.igService.getPublished()
            .subscribe((results) => {
                this.guides = results;
            }, (err) => {
                // TODO
            });
    }
}
