import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";
import { UserService } from "../Services/user.service";
import { ArtistService } from "../Services/artist.service";
import { Artist } from "../models/artist";



@Component({
            selector: 'artists-add',
            templateUrl: '../views/artist-add.html',
            providers: [ UserService, ArtistService ]
          })



export class ArtistAddComponent implements OnInit {
  public title: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage: string;

  constructor (
                private _route: ActivatedRoute,
                private _router: Router,
                private _userService: UserService,
                private _artistService: ArtistService
              ){
    this.title    = 'Add New Artist';
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
    this.artist   = new Artist('', '', '');
  }

  ngOnInit() {
    console.log('[artist-add.component] Component Loaded...');
    /* for testing purposes
    console.log(this._artistService.addArtist());
     */
  }

  onSubmit() {
    console.log('[artist-add.component] onSubmit(): ', this.artist);
    this
      ._artistService
      .addArtist(this.token,
                  this.artist)
      .subscribe(response => {
                                    if (!response.artist) {
                                      this.alertMessage = 'Error[artist-add.component]: On server side';
                                    } else {
                                      this.alertMessage = 'Artist created successfully';

                                      this.artist = response.artist;

                                      this
                                        ._router
                                        .navigate(['/edit-artist', response.artist._id]);
                                    }
                                  },
                  error => {
                                  var errorMessage  = <any>error;

                                  if (errorMessage != null) {
                                    var body  = JSON.parse(error._body);
                                    this.alertMessage  = body.message;

                                    console.log(error);
                                  }
                                });
  }
}

