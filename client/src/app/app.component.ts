import { Component, OnInit } from '@angular/core';
import { GLOBAL } from "./Services/global";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserService} from "./Services/user.service"; // Importing UserService
import { User } from './models/user';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ UserService ] // Load different services
})



export class AppComponent implements OnInit{
  public title = 'OR-Musify';
  public user: User;
  public user_register: User;
  public identity;  // object user to be validated, local_storage   true: login   false: not login
  public token; // to validate user identity/password
  public errorMessage;
  public alertRegistrationMessage;
  public url:string;

  // Loading userService, contains all methods of our services
  constructor (
                private _route: ActivatedRoute,
                private _router: Router,
                private _userService:UserService
              ) {
    this.user           = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register  = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url            = GLOBAL.url;
  }

  // When loading the component executes several instructions
  ngOnInit() {
    // calling a signup() service
   /*// For Testing Purposes
   var test = this._userService.signup();

   console.log(test);*/
   /* Initializing/Obtaining from localStorage both: identity and token keys */
   this.identity  = this._userService.getIdentity();
   this.token     = this._userService.getToken();

   console.log('identity: ', this.identity);
   console.log('token: ', this.token);
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
                                      // create an element 'identity' to be stored in localStorage
                                      localStorage.setItem('identity', JSON.stringify(this.identity));
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
                                                                          // create element 'token' in localStorage
                                                                          localStorage.setItem('token', this.token);

                                                                          this.user  = new User('', '', '', '', '', 'ROLE_USER', '');
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
                                    console.log('Error [onSubmitLoginForm - app.component]: ' + error);
                                  }
                                });
  }



  public onSubmitRegistrationForm() {
    console.log('user to be registered: ', this.user_register);

    this
      ._userService
      .register(this.user_register)
      .subscribe(response => {
                                    let user  = response.user; // store user returned by API RES from DB
                                    this.user_register  = user;

                                    if (!user._id) {  // if not valid user id
                                      this.alertRegistrationMessage = 'Error: At user registration';
                                    } else {
                                      this.alertRegistrationMessage = 'Successful Registration, your user id is: ' + this.user_register.email;
                                      this.user_register  = new User('', '', '', '', '', 'ROLE_USER', '');
                                    }
                                  },
                 error => {
                                    let errorMessage  = <any>error;

                                    if (errorMessage != null) {
                                      let body  = JSON.parse(error._body);
                                      this.alertRegistrationMessage = body.message;
                                      console.log('Error [onSubmitRegistrationForm - app.Component]: ' + error);
                                    }
                                  });
  }


  public logOut() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token    = null;

    this._router.navigate(['/']);
  }
}
