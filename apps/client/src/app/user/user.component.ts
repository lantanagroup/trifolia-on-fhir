import {Component, OnInit} from '@angular/core';
import {PractitionerService} from '../shared/practitioner.service';
import {Practitioner} from '../models/stu3/fhir';
import {Globals} from '../globals';
import {AuthService} from '../shared/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../shared/fhir.service';

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
        private fhirService: FhirService) { }

    public save() {
        this.message = 'Saving person...';

        this.personService.updateMe(this.practitioner)
            .subscribe((updatedPractitioner) => {
                this.practitioner = updatedPractitioner;
                this.message = 'Your changes have been saved!';
            }, err => {
                this.message = 'Error saving practitioner: ' + this.fhirService.getErrorString(err);
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
