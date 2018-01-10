import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";

import { AlbumService } from "../Services/album.service";
import { UploadService } from "../Services/upload.service";
import { UserService } from "../Services/user.service";

import { Album } from "../models/album";
import {THIS_EXPR} from "@angular/compiler/src/output/output_ast";



@Component({
  selector: 'album-edit',
  templateUrl: '../views/album-add.html',
  providers: [  AlbumService,
                UploadService,
                UserService
              ]
})



export class AlbumEditComponent implements OnInit {

  public title: string;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage: string;
  public is_edit;
  public filesToUpload: Array<File>;


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _albumService: AlbumService,
              private _uploadService: UploadService,
              private _userService: UserService) {
    this.title    = 'Edit Album';
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
    this.album    = new Album('', '', 2018, '', '');
    this.is_edit  = true;
  }

  ngOnInit() {
    console.log('[album-edit.component]: Component Loaded');

    // Load/Obtain Album from DB
    this.getAlbum();
  }


  getAlbum() {
    this
      ._route
      .params
      .forEach((params: Params) => {
                                          let id  = params['id'];

                                          this
                                            ._albumService
                                            .getAlbum(this.token, id)
                                            .subscribe(response => {
                                                                          if (!response.album) {
                                                                            this
                                                                              ._router
                                                                              .navigate(['/']);
                                                                          } else {
                                                                            this.album  = response.album;
                                                                          }
                                                                        },
                                                        error => {
                                                                          let errorMessage  = <any>error;

                                                                          if (errorMessage != null) {
                                                                            let body  = JSON.parse(error._body);
                                                                            this.alertMessage = body.message;

                                                                            console.log('Error[album-edit.component > getAlbum]: ', error)
                                                                          }
                                                                        });
                                        });
  }



  onSubmit() {
    this
      ._route
      .params
      .forEach((params: Params) => {
                                          let id  = params['id'];

                                          this
                                            ._albumService
                                            .editAlbum(this.token, id, this.album)
                                            .subscribe(response => {
                                                if (!response.album) {
                                                  this.alertMessage = 'Error[album-edit.component > onSubmit]: On Server Side';
                                                } else {
                                                  this.alertMessage = 'Album has been updated successfully';

                                                  if (!this.filesToUpload) {
                                                    // Redirect
                                                    this
                                                      ._router
                                                      .navigate(['/artist', response.album.artist]);
                                                  } else {

                                                    // Upload Album Image
                                                    this
                                                      ._uploadService
                                                      .makeFileRequest(this.url + 'upload-image-album/' + id,
                                                                        [],
                                                                        this.filesToUpload,
                                                                        this.token,
                                                                        'image')
                                                      .then((result) => {
                                                                                    this
                                                                                      ._router
                                                                                      .navigate(['/artist',
                                                                                                            response.album.artist]);
                                                                                  },
                                                            (error) => {
                                                                                    console.log(error);
                                                                                  });
                                                  }
                                                }
                                              },
                                              error => {
                                                let errorMessage  = <any>error;

                                                if (errorMessage != null) {
                                                  let body  = JSON.parse(error._body);
                                                  this.alertMessage = body.message;

                                                  console.log('Error[album-edit.component > onSubmit]: ', error)
                                                }
                                              });
                                        });
  }



  fileChangeEvent(fileInput: any) {
    this.filesToUpload  = <Array<File>> fileInput.target.files;
  }

}
