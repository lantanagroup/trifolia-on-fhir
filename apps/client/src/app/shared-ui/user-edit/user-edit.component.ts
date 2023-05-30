import { Component, Input, OnInit } from "@angular/core";
import { IUser } from "@trifolia-fhir/models";

@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

    @Input() user: IUser;


    ngOnInit(): void {
    }

    get email() {
        if (this.user.email && this.user.email.startsWith('mailto:')) {
            return this.user.email.substring('mailto:'.length);
        } else {
            return this.user.email;
        }
    }

    set email(value: string) {
        this.user.email = `mailto:${value}`;
    }


    get valid(): boolean {
        return !!this.user.firstName && !!this.user.lastName && !!this.email;
    }

}