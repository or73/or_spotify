import { Component, OnInit } from "@angular/core";
import { Router,  ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";

import { AlbumService } from "../Services/album.service";
import { SongService } from "../Services/song.service";
import { UserService } from "../Services/user.service";

import { Song } from "../models/song";


@Component({
  selector: 'song-add',
  templateUrl: '../views/song-add.html',
  providers: [ AlbumService, SongService, UserService ]
})



export class SongAddComponent implements OnInit {
  public title: string;
  public song: Song;
  public identity;
  public token;
  public url:string;
  public alertMessage;

  constructor( private _route: ActivatedRoute,
               private _router: Router,
               private _albumService: AlbumService,
               private _songService: SongService,
               private _userService: UserService) {
    this.title    = 'Add New Song';
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
    this.song     = new Song(1, '', '', '', '');
  }



  ngOnInit() {
    console.log('[song-add.component]: Component Loaded');

    this.song_data();
  }



  song_data() {
    this._route.params.forEach((params: Params)=> {
      let album_id  = params['album'];

      this
        ._albumService
        .getAlbum(this.token, album_id)
        .subscribe( response => {
            if (!response.album) {
              this.alertMessage  = 'Error[song-add.component > onSubmit] Not Album found';
            } else {
              let album_title  = response.album.title;


              if (album_title != null) {
                document.getElementById('id_album_title').innerHTML = '<strong>To Album</strong>:  ' + album_title;
              } else {
                console.log('none album name identified');
              }
            }
          },
          error => {
            let errorMessage  = <any>error;

            if (errorMessage != null) {
              let body = JSON.parse(error._body);
              this.alertMessage = body.message;

              console.log(error);
            }
          });
    });
  }



  onSubmit() {
    console.log('[song-add.component > onSubmit]', this.song);

    this
      ._route
      .params
      .forEach((params: Params)=> {
                                          let album_id  = params['album'];
                                          this.song.album = album_id;

                                          console.log(this.song);

                                          this
                                            ._songService
                                            .addSong(this.token, this.song)
                                            .subscribe(response => {
                                              console.log('response: ', response);
                                                console.log('response.song: ', response.song);
                                              console.log('response.songStored: ', response.songStored);

                                              if (!response.songStored && !response.song) {
                                                this.alertMessage = 'Error[song-add.component > onSubmit]: On server side';
                                              } else {
                                                this.alertMessage = '[song-add.component > onSubmit]Song added/created successfully';

                                                if (response.song != undefined && response.song != null) {
                                                  console.log('[song-add.component > onSubmit]response.song has been stored');
                                                  this.song = response.song;
                                                } else {
                                                  console.log('[song-add.component > onSubmit]response.songStored has been stored');
                                                  this.song = response.songStored;
                                                }

                                                /*this
                                                  ._router
                                                  .navigate(['/edit-song', response.song._id]);*/
                                              }
                                            },
                                            error => {
                                              let errorMessage  = <any>error;

                                              if (errorMessage != null) {
                                                let body  = JSON.parse(error._body);
                                                this.alertMessage  = body.message;

                                                console.log(error);
                                              }
                                            });
                                        });
  }
}
