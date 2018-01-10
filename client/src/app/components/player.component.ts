import { Component, OnInit } from "@angular/core";

import { GLOBAL } from "../Services/global";

import { Song } from "../models/song";



@Component({
              selector: 'player',
              template: `<div class="album_image_class"> 
                            <span *ngIf="song.album">
                              <figure>
                                <img id="id_play_image_album" 
                                     src="{{ url + 'get-image-album/' + song.album.image }}" />
                              </figure>
                            </span>
                            <span *ngIf="!song.album">
                              <figure>
                                <img id="id_play_image_album" class="img-fluid"
                                     src="../../assets/img/default_music_sml.png" />
                              </figure>
                            </span>
                        </div>
              
                        <div class="audio_file_class">
                          <p><small><strong>Playing...</strong></small></p>
                          <span id="id_play_song_title"><!-- *ngIf="song.name">-->
                            <!--<p><small>{{ song.name }}</small></p>-->
                            <p><small>Song Title: Empty</small></p>
                          </span>
                          
                          <span id="id_play_song_artist">
                            <!--<span *ngIf="song.album.artist">-->
                              <!--<p><small>{{ song.album.artist.name }}</small></p>-->
                              <p><small>Artist Name: Empty</small></p>
                            <!--</span>-->
                          </span>
                          
                          <audio controls id="id_player" *ngIf="song.file != ''">
                            <source id="id_mp3_source" 
                                    src="{{ url + 'get-file-song/' + song.file }}" 
                                    type="audio/mpeg" />
                            Your browser does not support audio files player
                          </audio>

                          <audio controls id="id_player" *ngIf="song.file === ''">
                            <source id="id_mp3_source"
                                    type="audio/mpeg" />
                            Your browser does not support audio files player
                          </audio>
                        </div>`
          })



export class PlayerComponent implements OnInit {
  public url: string;
  public song;



  constructor() {
    this.url  = GLOBAL.url;
    this.song = new Song(1, '', '', '', '');
  }



  ngOnInit() {
    console.log('[player.component > ngOnInit] Component Loaded');

    let song  = JSON.parse(localStorage.getItem('current_song'));

    if (song) {
      this.song = song;
    } else {
      this.song = new Song(1, '', '', '', '');
    }
  }
}
