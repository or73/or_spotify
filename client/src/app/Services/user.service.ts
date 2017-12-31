// Services to interact with API

import { Injectable } from '@angular/core'
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { observable } from "rxjs/symbol/observable";
import { GLOBAL } from './global'

@Injectable()
export class UserService {
  public url: string;

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
    let json    = JSON.stringify(user_to_login);
    let params  = json;

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
}
