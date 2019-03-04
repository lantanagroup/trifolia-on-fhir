import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public loggingIn = true;
    public errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService) {
    }

    ngOnInit() {
        if (this.route.snapshot && this.route.snapshot.fragment) {
            const fragmentParams = _.chain(this.route.snapshot.fragment.split('&'))
                .filter((param) => param.indexOf('=') > 0)
                .map((param) => {
                    const split = param.split('=');
                    return {
                        key: split[0],
                        value: split[1]
                    };
                })
                .value();
            const foundError = _.find(fragmentParams, (fragmentParam) => fragmentParam.key === 'error');
            const foundErrorDescription = _.find(fragmentParams, (fragmentParam) => fragmentParam.key === 'error_description');

            if (foundError || foundErrorDescription) {
                this.loggingIn = false;
                this.errorMessage = foundErrorDescription.value;
                return;
            }
        }

        this.authService.handleAuthentication();
    }
}
