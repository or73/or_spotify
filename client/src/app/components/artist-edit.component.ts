import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";
import { UserService } from "../Services/user.service";
import { UploadService } from "../Services/upload.service";
import { ArtistService } from "../Services/artist.service";
import { Artist } from "../models/artist";




@Component({
            selector: 'artist-edit',
            templateUrl: '../views/artist-add.html',
            providers: [ UserService, ArtistService, UploadService ]
          })



export class ArtistEditComponent implements OnInit {
  public title: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;
  public filesToUpload: Array<File>;



  constructor (
                private _route: ActivatedRoute,
                private _router: Router,
                private _userService: UserService,
                private _uploadService: UploadService,
                private _artistService: ArtistService
              ) {
    this.title    = 'Edit Artist';
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
    this.artist   = new Artist('', '', '');
    this.is_edit  = true;
  }



  ngOnInit() {
    console.log('[artist-edit.component] Component Loaded');

    // Call API method to extract artist from DB
    this.getArtist();
  }



  getArtist() {
    this
      ._route
      .params
      .forEach((params: Params) => {
                                     let id = params['id'];

                                     this
                                       ._artistService
                                       .getArtist(this.token,  id)
                                       .subscribe(response => {
                                                                      if (!response.artist) {
                                                                        this._router.navigate(['/']);
                                                                      } else {
                                                                        this.artist = response.artist;
                                                                      }
                                                                    },
                                                  error => {
                                                                  var errorMessage = <any>error;
                                                                  if (errorMessage != null) {
                                                                    var body  = JSON.parse(error._body);

                                                                    this.alertMessage = body.message;

                                                                    console.log('Error[artist-edit.component > getArtist]: ', error)
                                                                  }
                                                                  });
                                  });
  }



  onSubmit() {
    console.log('[artist-edit.component] onSubmit');

    this
      ._route
      .params
      .forEach((params: Params) => {
        let id  = params['id'];

        this
          ._artistService
          .editArtist(this.token, id, this.artist)
          .subscribe(response => {
                                          if (!response.artist) {
                                            this.alertMessage = 'Error[artist-edit.component]: On Server Side';
                                          } else {
                                            this.alertMessage = 'Artist Data Has Been Updated Successfully';
                                            if (!this.filesToUpload) {
                                              this
                                                ._router
                                                .navigate(['/artist', response.artist._id])
                                            }
                                            else {
                                              // Upload artist image
                                              this
                                                ._uploadService
                                                .makeFileRequest(this.url + 'upload-image-artist/' + id,
                                                  [],
                                                  this.filesToUpload,
                                                  this.token,
                                                  'image')
                                                .then((result) => {
                                                    this
                                                      ._router
                                                      .navigate(['/artist', response.artist._id]);
                                                    console.log('[artist-edit.component > onSubmit]: Artist Updated ', result)
                                                  },
                                                  (error) => {
                                                    console.log('Error[artist-edit.component > onSubmit]: ', error);
                                                  });
                                            }
                                          }
                                        },
                      error => {
                                        var errorMessage = <any>error;
                                        if (errorMessage != null) {
                                          var body  = JSON.parse(error._body);

                                          this.alertMessage = body.message;

                                          console.log('Error[artist-edit.component > getArtist]: ', error)
                                        }
                                      });
      });
  }




  fileChangeEvent(fileInput: any) {
    this.filesToUpload  = <Array<File>> fileInput.target.files;
  }
}
