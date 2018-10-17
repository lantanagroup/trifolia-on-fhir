import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../services/config.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal,
        public configService: ConfigService) {

    }

    ngOnInit() {
    }
}
