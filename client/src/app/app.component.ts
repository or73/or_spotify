import { Component, OnInit } from '@angular/core';
import { UserService} from "./Services/user.service"; // Importing UserService
import {User} from './models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ UserService ] // Load different services
})



export class AppComponent implements OnInit{
  public title = 'OR-Spotify app';
  public user: User;
  public identity;  // object user to be validated, local_storage   true: login   false: not login
  public token; // to validate user identity/password
  public errorMessage;

  // Loading userService, contains all methods of our services
  constructor (private _userService:UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  // When loading the component executes several instructions
  ngOnInit() {
    // calling a signup() service
   /*// For Testing Purposes
   var test = this._userService.signup();

   console.log(test);*/
  }

  public onSubmitLoginForm() {
    console.log(this.user);

    // Obtain all data of logged and validated user
    this
      ._userService
      .signup(this.user)
      .subscribe(response => {
                                    console.log('response: ', response);
                                    let identity  = response.user;  // validated user
                                    this.identity = identity;

                                    if (!this.identity._id) { // validate if data is correct
                                      alert('Unknown/non valid user');
                                    } else {  // create a session in localStorage, for user session purposes
                                      // obtain token/hash to be used in each http request
                                      this
                                        ._userService
                                        .signup(this.user, 'true')
                                        .subscribe( response => {
                                                                        let token = response.token;
                                                                        this.token= token;

                                                                        if (this.token.length <= 0) {
                                                                          // No token generated
                                                                          alert('Not token has been generated...');
                                                                        } else {
                                                                          // token generated to be stored in localStorage
                                                                          console.log('user token: ', token);
                                                                          console.log('user identity: ', this.identity);
                                                                        }
                                          },
                                                    error => {
                                                                      let errorMessage  = <any>error;

                                                                      if (errorMessage != null) {
                                                                        let body  = JSON.parse(error._body);
                                                                        this.errorMessage = body.message;
                                                                        console.log('Error [onSubmitLoginForm - user.service]: ' + error);
                                                                      }
                                                                    });
                                    }
                                  },
                error => {
                                  let errorMessage  = <any>error;

                                  if (errorMessage != null) {
                                    let body  = JSON.parse(error._body);
                                    this.errorMessage = body.message;
                                    console.log('Error [onSubmitLoginForm - user.service]: ' + error);
                                  }
                                });
  }

  public onSubmitRegistrationForm() {
    console.log(this.user);
  }
}
