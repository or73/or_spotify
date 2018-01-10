import { Component, OnInit } from "@angular/core";
import { Router,  ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";
import { SongService } from "../Services/song.service";
import { UploadService } from "../Services/upload.service";
import { UserService } from "../Services/user.service";

import { Song } from "../models/song";



@Component({
  selector: 'song-edit',
  templateUrl: '../views/song-add.html',
  providers: [ SongService, UploadService, UserService ]
})



export class  SongEditComponent implements OnInit {
  public title: string;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;
  public filesToUpload;



  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _songService: SongService,
              private _uploadService: UploadService,
              private _userService: UserService) {
    this.title    = 'Edit Song';
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
    this.song     = new Song(1, "", '', '', '');
    this.is_edit  = true;
  }



  ngOnInit() {
    console.log('[song-edit.component] Component uploaded');

    // Call method to collect song to edit
    this.getSong();
  }



  getSong() {
    console.log('[song-edit.component > getSong] token: ', this.token);
    this
      ._route
      .params
      .forEach((params: Params) => {
                                            let id  = params['id'];

                                            this
                                              ._songService
                                              .getSong(this.token, id)
                                              .subscribe(response => {
                                                                              console.log('response ***: ', response);

                                                                              if (!response.song) {
                                                                                this
                                                                                  ._router
                                                                                  .navigate(['/']);
                                                                              } else {
                                                                                this.song = response.song;
                                                                              }
                                                                          },
                                                          error => {
                                                                            let errorMessage  = <any>error;

                                                                            if (errorMessage != null) {
                                                                              //let body  = JSON.parse(error._body);
                                                                              //this.alertMessage  = body.message;

                                                                              console.log('Error[song-edit.component > getSong]: ', error);
                                                                            }
                                                                        });
                                      });
  }



  onSubmit() {
    this
      ._route
      .params
      .forEach((params: Params) => {
                                          let id    = params['id'];
                                          let responseSongAlbum;

                                          this
                                            ._songService
                                            .editSong(this.token, id,  this.song)
                                            .subscribe(response => {
                                                                          console.log('[song-edit.component > onSubmit] response: ', response);
                                                                          if (!response.song && !response.songUpdated && !response.songStored) {
                                                                            this.alertMessage = 'Error[song-edit.component > onSubmit]: On Server Side';
                                                                          } else {


                                                                            console.log('[song-edit.component > onSubmit] response.song: ', response.song);
                                                                            // Validation of response by: song, songUpdated, songStored
                                                                            if (response.song) {
                                                                              //this.song = response.song;
                                                                              responseSongAlbum = response.song.album;
                                                                              console.log('response.song');
                                                                              console.log('[song-edit.component > onSubmit] this.song: ', this.song);
                                                                            } else if (response.songUpdated) {
                                                                              //this.song = response.songUpdated;
                                                                              responseSongAlbum = response.songUpdated.album;
                                                                              console.log('response.songUpdated');
                                                                              console.log('[song-edit.component > onSubmit] this.song: ', this.song);
                                                                            } else {
                                                                              //this.song = response.songStored();
                                                                              responseSongAlbum = response.songStored.album;
                                                                              console.log('response.songStored');
                                                                              console.log('[song-edit.component > onSubmit] this.song: ', this.song);
                                                                            }

                                                                            console.log('[song-edit.component > onSubmit] Song updated successfully');

                                                                            // Upload Audio File
                                                                            if (!this.filesToUpload) {
                                                                              this
                                                                                ._router
                                                                                .navigate(['/album', responseSongAlbum]);
                                                                            } else {
                                                                              this
                                                                                ._uploadService
                                                                                .makeFileRequest(this.url + 'upload-file-song/' + id,
                                                                                  [],
                                                                                  this.filesToUpload,
                                                                                  this.token,
                                                                                  'file')
                                                                                .then((result) => {
                                                                                    this
                                                                                      ._router
                                                                                      .navigate(['/album', responseSongAlbum]);
                                                                                  },
                                                                                  (error) => {
                                                                                    console.log('Error[song-edit.component > onSubmit]: ', error);
                                                                                  });
                                                                            }
                                                                          }
                                                                         },
                                                      error => {
                                                                        let errorMessage  = <any>error;

                                                                        if (errorMessage != null) {
                                                                          let body = JSON.parse(error._body);
                                                                          this.alertMessage = body.message;

                                                                          console.log('Error[song-edit.component > onSubmit]', error);
                                                                        }
                                                                    });
                                        });
  }



  fileChangeEvent(fileInput: any) {
    this.filesToUpload  = <Array<File>>fileInput.target.files;
  }
}
