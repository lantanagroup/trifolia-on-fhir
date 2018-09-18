import {Component, OnInit} from '@angular/core';
import {HumanName, Practitioner} from '../models/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../globals';
import {PractitionerService} from '../services/practitioner.service';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'app-new-user-modal',
    templateUrl: './new-user-modal.component.html',
    styleUrls: ['./new-user-modal.component.css']
})
export class NewUserModalComponent implements OnInit {
    public practitioner = new Practitioner();
    public message: string;

    constructor(
        private activeModal: NgbActiveModal,
        public globals: Globals,
        private practitionerService: PractitionerService,
        private authService: AuthService) {
        this.practitioner.name = [new HumanName()];
    }

    public ok() {
        this.practitionerService.updateMe(this.practitioner)
            .subscribe((newPerson) => {
                this.authService.practitioner = newPerson;
                this.authService.authChanged.emit();
                this.activeModal.close();
            }, (err) => {
                this.message = this.globals.getErrorMessage(err);
            });
    }

    ngOnInit() {
    }
}
