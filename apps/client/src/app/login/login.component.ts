import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute} from '@angular/router';

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
      const fragmentParams = this.route.snapshot.fragment.split('&')
        .filter((param) => param.indexOf('=') > 0)
        .map((param) => {
          const split = param.split('=');
          return {
            key: split[0],
            value: split[1]
          };
        });
      const foundError = fragmentParams.find((fragmentParam) => fragmentParam.key === 'error');
      const foundErrorDescription = fragmentParams.find((fragmentParam) => fragmentParam.key === 'error_description');

      if (foundError || foundErrorDescription) {
        this.loggingIn = false;
        this.errorMessage = foundErrorDescription.value;
        return;
      }
    }
  }
}
