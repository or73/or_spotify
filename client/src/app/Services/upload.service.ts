import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "./global";
import { Artist } from "../models/artist";



@Injectable()
export class UploadService {
  public url: string;



  constructor( private _http: Http ) {
    this.url  = GLOBAL.url;
  }


  makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
    console.log('[upload.service > makeFileRequest] token: ', token + ' \nparams: ' + params);

    return new Promise(function (resolve, reject) {
                        let formData: any = new FormData();
                        let xhr           = new XMLHttpRequest();

                        for (let counter = 0; counter < files.length; counter++) {
                          formData.append(name,  files[counter], files[counter].name);
                        }

                        xhr.onreadystatechange  = function () {
                          if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                              resolve(JSON.parse(xhr.response));
                            } else {
                              reject(xhr.response);
                            }
                          }
                        };

                        xhr.open('POST', url, true);
                        xhr.setRequestHeader('Authorization', token);
                        xhr.send(formData);
                      });
  }
}
