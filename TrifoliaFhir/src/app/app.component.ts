import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService, UserService]
})
export class AppComponent implements OnInit {
  profile: any;

  constructor(public auth: AuthService, public userService: UserService) {        
  }

  ngOnInit() {
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
          this.profile = profile;

          this.userService.getUsers();
      });
    }
  }
}
