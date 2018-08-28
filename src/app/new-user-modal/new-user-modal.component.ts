import {Component, OnInit} from '@angular/core';
import {HumanName, Person} from '../models/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../globals';
import {PersonService} from '../services/person.service';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'app-new-user-modal',
    templateUrl: './new-user-modal.component.html',
    styleUrls: ['./new-user-modal.component.css']
})
export class NewUserModalComponent implements OnInit {
    public person = new Person();
    public message: string;

    constructor(
        private activeModal: NgbActiveModal,
        public globals: Globals,
        private personService: PersonService,
        private authService: AuthService) {
        this.person.name = [new HumanName()];
    }

    public ok() {
        this.personService.updateMe(this.person)
            .subscribe((newPerson) => {
                this.authService.person = newPerson;
                this.authService.authChanged.emit();
                this.activeModal.close();
            }, (err) => {
                this.message = this.globals.getErrorMessage(err);
            });
    }

    ngOnInit() {
    }
}
