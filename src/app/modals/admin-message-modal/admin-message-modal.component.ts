import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-admin-message-modal',
    templateUrl: './admin-message-modal.component.html',
    styleUrls: ['./admin-message-modal.component.css']
})
export class AdminMessageModalComponent implements OnInit {
    @Input()
    public message: string;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }

    public ok() {
        this.activeModal.close();
    }
}
