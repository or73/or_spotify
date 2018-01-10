import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";

import { AlbumService } from "../Services/album.service";
import { ArtistService } from "../Services/artist.service";
import { UserService } from "../Services/user.service";

import { Album } from "../models/album";
import { Artist } from "../models/artist";




@Component({
  selector: 'artist-detail',
  templateUrl: '../views/artist-detail.html',
  providers: [ AlbumService, ArtistService, UserService ]
})

export class ArtistDetailComponent implements OnInit {
  public albums: Album[];
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public confirmation;



  constructor( private _route: ActivatedRoute,
               private _router: Router,
               private _albumService: AlbumService,
               private _artistService: ArtistService,
               private _userService: UserService) {
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
  }



  ngOnInit() {
    console.log('[artist-detail.component]: Uploaded Component');

    this.getArtist();
  }



  getArtist() {
    this
      ._route
      .params
      .forEach((params: Params) => {
        let id  = params['id'];

        this
          ._artistService
          .getArtist(this.token, id)
          .subscribe(response => {
              if (!response.artist) {
                this
                  ._router
                  .navigate(['/']);
              } else {
                this.artist = response.artist;

                // Load artist albums from DB
                this
                  ._albumService
                  .getAlbums(this.token, response.artist._id)     /* this.token, result.artist._id */
                  .subscribe(response => {
                                if (!response.albums) {
                                  this.alertMessage = 'This Artist does not have albums';
                                } else {
                                 this.albums  = response.albums;
                                }
                              },
                              error => {
                                let errorMessage  = <any>error;

                                if (errorMessage != null) {
                                  let body  = JSON.parse(error._body);

                                  console.log('Error [artist-detail.component > getArtist1]:', error)
                                }
                              });
              }
            },
                      error => {
                        let errorMessage  = <any>error;

                        if (errorMessage != null) {
                          let body  = JSON.parse(error._body);

                          console.log('Error [artist-detail.component > getArtist2]:', error)
                        }
                      });
      });
  }



  onDeleteConfirm(id) {
    this.confirmation = id;
  }



  onDeleteAlbum(id) {
    this
      ._albumService
      .deleteAlbum(this.token, id)
      .subscribe(response => {
          if (!response.album) {
            alert('Error[artist_detail.component > onDeleteAlbum]: Server Side...')
          }
          this.getArtist();
        },
        error => {
          let errorMessage  = <any>error;

          if (errorMessage != null) {
            let body = JSON.parse(error._body);

            console.log('Error[artist_list.component > onDeleteArtist]', error);
          }
        }
      );
  }



  onCancelAlbum() {
    this.confirmation = null;
  }
}
