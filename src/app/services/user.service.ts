import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {

    constructor(public authHttp: AuthHttp) { }

    public getUsers(): void {
        this.authHttp.get('/api/user')
            .subscribe(data => {
                console.log('test');
            },
            error => {
                console.error(error);
            })
    }
}
