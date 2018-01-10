import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';

import { GLOBAL } from "./global";

import { Artist } from "../models/artist";



@Injectable()
export class ArtistService {
  public url: string;

  constructor ( private _http: Http ) {
    this.url  = GLOBAL.url;
  }



  getArtists(token, page) {
    console.log('[artists.service] getArtist');

    let headers = new Headers({
                                'Content-Type': 'application/json',
                                'Authorization': token
                              });
    let options = new RequestOptions({ headers: headers });

    return this
            ._http
            .get(this.url + 'artists/' + page, options)
            .map( res => res.json());
  }



  getArtist(token, id: string) {
    console.log('[artists.service] getArtist');

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    let options = new RequestOptions({ headers: headers });

    return this
      ._http
      .get(this.url + 'artist/' + id, options)
      .map( res => res.json());
  }



  editArtist (token, id: string, artist: Artist) {
    console.log('[artist.service] editArtist');

    let params  = JSON.stringify(artist);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this
      ._http
      .put(this.url + 'artist/' + id,
            params,
            { headers: headers })
      .map(res => res.json());
  }



  addArtist (token, artist: Artist) {
    console.log('[artist.service] addArtist');

    let params  = JSON.stringify(artist);
    let headers = new Headers({
                                'Content-Type': 'application/json',
                                'Authorization': token
                              });

    return this
            ._http
            .post(this.url + '/artist',
                    params,
                    { headers: headers })
            .map(res => res.json());
  }



  deleteArtist(token, id: string) {
    console.log('[artist.service] deleteArtist');

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    let options = new RequestOptions({ headers: headers });

    return this
      ._http
      .delete(this.url + 'artist/' + id, options)
      .map( res => res.json());
  }
}
