import {Component, OnInit} from '@angular/core';
import {PractitionerService} from '../services/practitioner.service';
import {Practitioner} from '../models/stu3/fhir';
import {Globals} from '../globals';
import {AuthService} from '../services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    public practitioner = new Practitioner();
    public message: string;

    constructor(
        private modalService: NgbModal,
        private personService: PractitionerService,
        private authService: AuthService,
        private globals: Globals) { }

    public save() {
        this.message = 'Saving person...';

        this.personService.updateMe(this.practitioner)
            .subscribe((updatedPractitioner) => {
                this.practitioner = updatedPractitioner;
                this.message = 'Successfully saved practitioner';
            }, err => {
                this.message = 'Error saving practitioner: ' + this.globals.getErrorMessage(err);
            });
    }

    private getMe() {
        this.personService.getMe()
            .subscribe(practitioner => {
                this.practitioner = practitioner;
            }, err => {
                console.log(err);
                // todo: handle
            });
    }

    ngOnInit() {
        this.authService.authChanged.subscribe(() => this.getMe());
        this.getMe();
    }
}
