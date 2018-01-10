import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";

/* ALBUM */
import { AlbumAddComponent } from "./components/album-add.component";         // import album-add.component
import { AlbumDetailComponent } from "./components/album-detail.component";
import {AlbumEditComponent} from "./components/album-edit.component";         // import album-edit.component

/* ARTIST */
import { ArtistAddComponent } from "./components/artist-add.component";       // import artist_add.component
import { ArtistDetailComponent } from "./components/artist-detail.component"; // import artist-detail.component
import { ArtistEditComponent} from "./components/artist-edit.component";      // import artist-edit.component
import { ArtistListComponent } from "./components/artist-list.component";     // import artist-list.component

/* HOME */
import { HomeComponent } from "./components/home.component";                  // import home.component

/* SONG */
import { SongAddComponent } from "./components/song-add.component";           // import song_add.component
import { SongEditComponent } from "./components/song-edit.component";         // import song_edit.component

/* USER */
import { UserEditComponent } from './components/user-edit.component';         // import user-edit.component



const appRoutes: Routes = [
        /* --------------
            main path
        -------------- */
  {
    path: '',
    component: HomeComponent
  },
        /* -----------------
                ALBUM
        ----------------- */
  {                                   // POST Add Album
    path: 'create-album/:artist',
    component: AlbumAddComponent
  },
  {                                   // GET Detail Album
    path: 'album/:id',
    component: AlbumDetailComponent
  },
  {
    path: 'edit-album/:id',           // PUT Edit Album
    component: AlbumEditComponent
  },
        /* -----------------
                ARTIST
        ----------------- */
  {                                   // POST Add Artist
    path: 'create-artist',
    component: ArtistAddComponent
  },
  {                                   // GET Detail Artist
    path: 'artist/:id',
    component: ArtistDetailComponent
  },
  {
    path: 'artists/:page',            // GET List Artists
    component: ArtistListComponent
  },
  {
    path: 'edit-artist/:id',          // PUT Edit Artist
    component: ArtistEditComponent
  },
        /* -----------------
                SONG
        ----------------- */
  {                                   // POST Add Song
    path: 'create-song/:album',
    component: SongAddComponent

  },
  {
    path: 'edit-song/:id',            // PUT Edit Song
    component: SongEditComponent
  },
  {
    path: 'songs/albumId?',
    component: SongEditComponent
  },
  {
    path: 'song/',
    component: SongEditComponent
  },
        /* ---------------
                USER
        --------------- */
  {                                   // POST Edit User
    path: 'my-data',
    component: UserEditComponent
  },

        /* ------------------
            default path
        ------------------ */
  {
    path: '**',
    component: HomeComponent
  }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
