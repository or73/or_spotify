import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";
import { UserService } from "../Services/user.service";
import { ArtistService } from "../Services/artist.service";
import { Artist } from "../models/artist";

@Component({
  selector: 'artist-list',
  templateUrl: '../views/artist-list.html',
  providers: [ UserService, ArtistService ]
})

export class ArtistListComponent implements OnInit {
  public title: string;
  public artists: Artist[];
  public identity;
  public token;
  public url;
  public prev_page;
  public next_page;
  public confirmation;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _userService: UserService,
              private _artistService: ArtistService) {
    this.title    = 'Artists List';
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
    this.next_page= 1;
    this.prev_page= 1;
  };



  ngOnInit() {
    console.log('[artist-list.component] Component loaded...');

    // Obtain list of artist from DB
    this.getArtists();
  }



  getArtists() {
    this
      ._route
      .params
      .forEach((params: Params) => {
        let page  = +params['page'];

        if (!page) {
          page = 1;
        } else {
          this.next_page = page + 1;
          this.prev_page = page - 1;

          if (this.prev_page === 0) {
            this.prev_page  = 1;
          }
        }
        this
          ._artistService
          .getArtists(this.token, page.toString())
          .subscribe(response => {
                                          if (!response.artists) {
                                            this
                                              ._router
                                              .navigate(['/']);
                                          } else {
                                            this.artists  = response.artists;
                                          }
                                        },
                      error => {
                                        let errorMessage  = <any>error;

                                        if (errorMessage != null) {
                                          let body  = JSON.parse(error._body);

                                          console.log('Error[artist_list.component > getArtists]', error);
                                        }
                                      });
      });
  }



  onDeleteConfirm(id) {
    this.confirmation = id;
  }



  onDeleteArtist(id) {
    this
      ._artistService
      .deleteArtist(this.token, id)
      .subscribe(response => {
                                    if (!response.artist) {
                                      alert('Error[artist_list.component > onDeleteArtist]: Server Side...')
                                    }
                                    this.getArtists();
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



  onCancelArtist() {
    this.confirmation = null;
  }
}
