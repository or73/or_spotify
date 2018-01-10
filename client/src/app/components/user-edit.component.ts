import { Component, OnInit } from "@angular/core";
import { GLOBAL } from "../Services/global";
import { UserService } from "../Services/user.service";
import { User} from "../models/user";
import {parseHttpResponse} from "selenium-webdriver/http";


@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [ UserService ]
})

export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public alertMessage = '';
  public filesToUpload: Array<File>;
  public url: string;



  constructor(private _userService: UserService) {
    this.title    = 'Update my data';

    // localStorage variables
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();

    this.user     = this.identity;
    this.url      = GLOBAL.url;
  }



  ngOnInit() {
    console.log('[user-edit.component] Component loaded...');
  }



  onSubmit() {
    console.log('onSubmit: ' + this.user);

    this
      ._userService
      .updateUser(this.user)
      .subscribe( response => {
                                      if (!response.user) {
                                        this.alertMessage = 'User has not been updated';
                                      } else {
                                        console.log('onSubmit - User updating...');
                                        // update localStorage data
                                        localStorage.setItem('identity', JSON.stringify(this.user));
                                        // update user data on web page with javascript
                                        document.getElementById('id_user_logged_span').innerHTML = '<strong>' + this.user.surname + '</strong>,' + this.user.name;
                                        if (!this.filesToUpload) {
                                          // Redirect
                                        } else {
                                          //this.user = response.user;

                                          this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id,
                                                                [],
                                                                this.filesToUpload)
                                              .then((result: any) => {
                                                this.user.image = result.image;
                                                localStorage.setItem('identity', JSON.stringify(this.user));

                                                let image_path  = this.url + 'get-image-user/' + this.user.image;

                                                document.getElementById('id_user_avatar').setAttribute('src', image_path);
                                                console.log('onSubmit(): ', this.user);
                                                console.log('onSubmit() - image_path: ', image_path);
                                              });
                                        }
                                        this.alertMessage = 'User data has been update, successfully';
                                      }
                                   },
                  error => {
                                    var errorMessage  = <any>error;

                                    if (errorMessage != null) {
                                      var body  = JSON.parse(error._body);

                                      this.alertMessage = body.message;
                                      console.log(error);
                                    }
                                  });
  }

  fileChangeEvent (fileInput: any) {
   this.filesToUpload  = <Array<File>>fileInput.target.files; // collect all files from input
    console.log('[user-edit.component] fileChangeEvent: ', this.filesToUpload);
  }

  makeFileRequest (url: string, params: Array<string>, files: Array<File>) {
    var token = this.token;

    return new Promise(function (resolve, reject) {
      var formData:any  = new FormData();
      var xhr = new XMLHttpRequest();

      for (var counter = 0; counter < files.length; counter++) {
        formData.append('image', files[counter], files[counter].name);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url,  true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }
}
