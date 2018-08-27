import { Component, OnInit } from '@angular/core';
import { PersonService } from '../services/person.service';
import { Person } from '../models/stu3/fhir';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    public person: Person;
    public message: string;

    constructor(private personService: PersonService) { }

    save() {
        this.message = 'Saving person...';

        this.personService.updateMe(this.person)
            .subscribe(() => {
                this.message = 'Successfully saved person';
            }, err => {
                this.message = 'Error saving person: ' + err;
            });
    }

    ngOnInit() {
        this.personService.getMe()
            .subscribe(person => {
                this.person = person;
            }, err => {
                console.log(err);
                // todo: handle
            });
    }
}
