///<reference path="../../node_modules/@angular/http/src/http_module.d.ts"/>
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Forms module to integrate Values/Properties in Front-End with Back-End Values/Properties
import { HttpModule } from "@angular/http";

import { routing, appRoutingProviders } from "./app.routing";

/*  General Components */
import { AppComponent } from './app.component';
import { HomeComponent } from "./components/home.component";

/*  Album Components */
import { AlbumAddComponent } from "./components/album-add.component";
import { AlbumDetailComponent } from "./components/album-detail.component";
import { AlbumEditComponent } from "./components/album-edit.component";

/*  Artist Components */
import { ArtistAddComponent } from "./components/artist-add.component";
import { ArtistDetailComponent } from "./components/artist-detail.component";
import { ArtistEditComponent } from "./components/artist-edit.component";
import { ArtistListComponent } from "./components/artist-list.component";

/*  Player Component */
import { PlayerComponent } from "./components/player.component";

/* Song Component */
import { SongAddComponent } from "./components/song-add.component";
import { SongEditComponent } from "./components/song-edit.component";

/*  User Component */
import { UserEditComponent} from "./components/user-edit.component";



@NgModule({
  declarations: [ // Load components and directives
    AppComponent,
    AlbumAddComponent,
    AlbumDetailComponent,
    AlbumEditComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistListComponent,
    ArtistDetailComponent,
    HomeComponent,
    PlayerComponent,
    SongAddComponent,
    SongEditComponent,
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
