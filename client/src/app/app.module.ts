///<reference path="../../node_modules/@angular/http/src/http_module.d.ts"/>
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Forms module to integrate Values/Properties in Front-End with Back-End Values/Properties
import { HttpModule } from "@angular/http";

import { routing, appRoutingProviders } from "./app.routing";

import { AppComponent } from './app.component';
import { UserEditComponent} from "./components/user-edit.component";



@NgModule({
  declarations: [ // Load components and directives
    AppComponent,
    UserEditComponent
  ],
  imports: [  // Load modules of Framework and our modules
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [ appRoutingProviders ],  // Load services
  bootstrap: [AppComponent]
})



export class AppModule { }
