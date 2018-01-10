import {asNativeElements, Component, OnInit} from "@angular/core";
import { Router,  ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../Services/global";

import { AlbumService } from "../Services/album.service";
import { SongService } from "../Services/song.service";
import { UserService } from "../Services/user.service";

import { Album } from "../models/album";
import { Song } from "../models/song";


@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [ AlbumService, SongService, UserService ]
})



export class AlbumDetailComponent implements OnInit {
  public album: Album;
  public songs: Song[];
  public identity;
  public token;
  public url:string;
  public alertMessage;
  public confirmation;



  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _albumService: AlbumService,
              private _songService: SongService,
              private _userService: UserService) {
    this.identity = this._userService.getIdentity();
    this.token    = this._userService.getToken();
    this.url      = GLOBAL.url;
  }



  ngOnInit() {
    console.log('[album-detail.component] Component Uploaded');

    // Call API method to get/obtain an album from DB
    this.getAlbum();
  }



  getAlbum() {
    console.log('[album-detail.component > getAlbum]');
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

                                            // Load all songs included in an Album
                                            this
                                              ._songService
                                              .getSongs(this.token, response.album._id)
                                              .subscribe( response => {
                                                                        if (!response.songs) {
                                                                          this.alertMessage = '[album-detail.component > getAlbum] This album does not contains any song';
                                                                        } else {
                                                                          this.songs  = response.songs;
                                                                        }
                                                                      },
                                                          error => {
                                                                      let errorMessage  = <any>error;
                                                                      let body          = JSON.parse(error._body);

                                                                      console.log('Error[album-detail.component > getAlbum]:', error);
                                                                    });
                                          }
                                        },
                      error => {
                                        let errorMessage  = <any>error;

                                        if (errorMessage != null ) {
                                          let body  = JSON.parse(error._body);

                                          this.alertMessage = body.message;

                                          console.log('ERROR[album-detail.component > getAlbum]: ', error);
                                        }
                                      });
    });
  }


  onDeleteConfirm(id) {
    this.confirmation  = id;
  }



  onDeleteSong(id) {
    this
      ._songService
      .deleteSong(this.token, id)
      .subscribe(response => {
                                    if (!response.song) {
                                      this.alertMessage = '[album-detail.component > onDeleteSong] On Server Side';
                                    }
                                    this.getAlbum();
                                  },
                error => {
                                  let errorMessage  = <any>error;
                                  let body          = JSON.parse(error._body);

                                  console.log('Error[album-detail.component > getAlbum]:', error);
                });
  }



  onCancelSong() {
    this.confirmation  = null;
  }



  startPlayer(song) {
    console.log('[album-details.component > start_player]');
    let song_player = JSON.stringify(song);
    console.log('[album-details.component > start_player] song_player: ' + song_player);
    let file_path   = this.url + 'get-file-song/' + song.file;
    let image_path  = this.url + 'get-image-album/' + song.album.image;

    console.log('[album-details.component > start_player] image_path: ', song.album);

    localStorage.setItem('current_song', song_player);

    document.getElementById('id_mp3_source').setAttribute('src', file_path);
    (document.getElementById('id_player') as any).load();
    (document.getElementById('id_player') as any).play();

    document.getElementById('id_play_song_title').innerHTML   = '<p><small><strong>Song</strong>:' + song.name + '</small></p>';
    document.getElementById('id_play_song_artist').innerHTML  = '<p><small><strong>Artist</strong>:' + song.album.artist.name + '</small></p>';
    document.getElementById('id_play_image_album').setAttribute('src',image_path);
  }
}
