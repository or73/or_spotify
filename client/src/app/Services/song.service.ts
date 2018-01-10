import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

import { GLOBAL } from "./global";
import { Song } from "../models/song";
import {Album} from "../models/album";



@Injectable()
export class SongService {
  public url: string;

  constructor(private  _http: Http) {
    this.url  = GLOBAL.url;
  }



  getSong(token, id:string) {
    console.log('[song.service > getSong] token:' + token + " \nid: " + id);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this
            ._http
            .get(this.url + 'song/' + id,
                  options)
            .map(res => res.json());
  }



  getSongs(token, albumId = null) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    if (albumId === null) {
      return this
              ._http
              .get(this.url + 'songs', options)
              .map(res => res.json());
    } else {
      return this
              ._http
              .get(this.url + 'songs/' + albumId)
              .map(res => res.json());
    }
  }



  addSong(token, song: Song) {
    console.log('[song.service > addSong] token:' + token + " \nsong: " + song);
    let params  = JSON.stringify(song);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = new RequestOptions({ headers: headers });


    return this
      ._http
      .post(this.url + 'song',
            params,
        { headers: headers })
      .map(res => res.json());
  }



  editSong(token, id:string, song: Song) {
    console.log('[song.service > editSong] token:' + token + " \nid: " + id + ' \n song: ' + song);
    let params  = JSON.stringify(song);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = new RequestOptions({ headers: headers });


    return this
            ._http
            .put(this.url + 'song/' + id,
                params,
              { headers: headers })
            .map(res => res.json());
  }



  deleteSong(token, id: string) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this
            ._http
            .delete(this.url + 'song/' + id,  options)
            .map(res => res.json());
  }
}
