import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";

import { AlbumService } from "../Services/album.service";
import { ArtistService } from "../Services/artist.service";
import { UserService } from "../Services/user.service";

import { Album } from "../models/album";
import { Artist } from "../models/artist";



@Component({
            selector: 'album-add',
            templateUrl: '../views/album-add.html',
            providers: [  AlbumService,
                          ArtistService,
                          UserService
                       ]
          })



export class AlbumAddComponent implements OnInit {

  public title: string;
  public album: Album;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage: string;



  constructor ( private _route: ActivatedRoute,
                private _router: Router,
                private _albumService: AlbumService,
                private _userService: UserService ) {
    this.title    = 'Add New Album';
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
    this.album    = new Album('', '', 2018, '', '');
  }

  ngOnInit () {
    console.log('[album-add.component]: Component Loaded');
  }



  onSubmit() {
    console.log('[album-add.component] onSubmit(): ', this.album);

    this
      ._route
      .params
      .forEach((params: Params) => {
                                          let artist_id   = params['artist'];

                                          this.album.artist = artist_id;

                                          console.log(this.album);
                                        });

    this
      ._albumService
      .addAlbum(this.token,
        this.album)
      .subscribe(response => {
          if (!response.album) {
            this.alertMessage = 'Error[album-add.component]: On server side';
          } else {
            this.alertMessage = 'Album created successfully';

            this.album = response.album;

            this
              ._router
              .navigate(['/edit-album', response.album._id]);
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
  }
}

