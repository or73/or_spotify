///<reference path="../../node_modules/@angular/http/src/http_module.d.ts"/>
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Forms module to integrate Values/Properties in Front-End with Back-End Values/Properties
import { HttpModule } from "@angular/http";

import { AppComponent } from './app.component';


@NgModule({
  declarations: [ // Load components and directives
    AppComponent
  ],
  imports: [  // Load modules of Framework and our modules
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],  // Load services
  bootstrap: [AppComponent]
})
export class AppModule { }
