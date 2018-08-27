import { Component, OnInit } from '@angular/core';
import { PersonService } from '../services/person.service';
import { Person } from '../models/stu3/fhir';
import {Globals} from '../globals';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    public person: Person;
    public message: string;

    constructor(
        private personService: PersonService,
        private authService: AuthService,
        private globals: Globals) { }

    save() {
        this.message = 'Saving person...';

        this.personService.updateMe(this.person)
            .subscribe((updatedPerson) => {
                this.person = updatedPerson;
                this.message = 'Successfully saved person';
            }, err => {
                this.message = 'Error saving person: ' + this.globals.getErrorMessage(err);
            });
    }

    private getMe() {
        this.personService.getMe()
            .subscribe(person => {
                this.person = person;
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
