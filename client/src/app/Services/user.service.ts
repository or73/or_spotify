// Services to interact with API

import { Injectable } from '@angular/core'
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { observable } from "rxjs/symbol/observable";
import { GLOBAL } from './global'
import {identifierName} from "@angular/compiler";
import {identity} from "rxjs/util/identity";

@Injectable()
export class UserService {
  public url: string;
  public identity: string;
  public token: string;

  constructor(private _http: Http) {
    this.url  = GLOBAL.url;
  }

// user_to_login
  /**
   * @param user_to_login: user to login
   * @param {any} get_hash: optional parameter,to obtain the toke if possible
   */
  signup (user_to_login, gethash = null) {
    if (gethash != null) {
      user_to_login.gethash = gethash;
    }

    // requirement to REST service
    let params  = JSON.stringify(user_to_login);

    let headers = new Headers({ 'Content-Type': 'application/json'});

    return this
            ._http
            .post(this.url + 'login',
                  params,
                  { headers: headers })
            .map(res => res.json());
  }
  /*// For testing purposes
  signup() {
    return '\n\n\n*** TESTING APPLICATION ***\n\n\n';
  }*/



  register(user_to_register) {
    let params  = JSON.stringify(user_to_register);

    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this
            ._http
            .post(this.url + 'register',
                  params,
                  { headers: headers })
            .map(res => res.json());
  }


  /**
   * Edit basic user data, to call update user in API
   */
  updateUser(user_to_update) {
   let params = JSON.stringify(user_to_update);
   let headers  = new Headers({ 'Content-Type': 'application/json',
                                        'Authorization': this.getToken()});

   return this
     ._http
     .put(this.url + 'update-user/' + user_to_update._id,
          params,
       { headers: headers })
     .map(res => res.json());
  }



  // load identity information from localStorage
  getIdentity() {
    let identity  = JSON.parse(localStorage.getItem('identity'));

    if (identity != 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }



  // load token of current user from localStorage
  getToken() {
    let token = localStorage.getItem('token');

    if (token != 'undefined') {
      this.token  = token;
    } else {
      this.token  = null;
    }

    return this.token;
  }
}
