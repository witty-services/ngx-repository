import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './component/app/app.component';
import { CoreModule } from './module/@core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './service/in-memory-data.service';
import { SystemModule } from './module/@system/system.module';
import { LibrariesComponent } from './component/libraries/libraries.component';
import { LibraryComponent } from './component/library/library.component';
import { NgxRepositoryModule } from '@witty-services/ngx-repository';
import { MyPageResponseProcessor } from './module/@core/processor/my-page-response.processor';
import { ClientComponent } from './component/client/client.component';
import { NgxHttpRepositoryModule } from '@witty-services/ngx-http-repository';
import { FIRESTORE_APP, NgxFirebaseRepositoryModule } from '@witty-services/ngx-firebase-repository';
import firebase from 'firebase';
import { BookService } from './module/@core/service/book.service';
import Firestore = firebase.firestore.Firestore;
import initializeApp = firebase.initializeApp;

export function createFirestore(): Firestore {
  return initializeApp({
    apiKey: 'AIzaSyDSd6EXdQWaWcBMxbTYp-kFAV3zxNu-ArM',
    authDomain: 'ngx-repository.firebaseapp.com',
    databaseURL: 'https://ngx-repository.firebaseio.com',
    projectId: 'ngx-repository',
    storageBucket: 'ngx-repository.appspot.com',
    messagingSenderId: '352664344689',
    appId: '1:352664344689:web:20ec56387616cba621e3d0',
    measurementId: 'G-0RD9MTX3PB'
  }).firestore();
}

@NgModule({
  declarations: [
    AppComponent,
    LibrariesComponent,
    LibraryComponent,
    ClientComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    FormsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 100 }),
    NgxRepositoryModule.forRoot({
      normalizerConfiguration: {
        denormalizeNull: true,
        normalizeNull: false,
        denormalizeUndefined: true,
        normalizeUndefined: false
      }
    }),
    NgxFirebaseRepositoryModule.forRoot({
      debug: true
    }),
    NgxHttpRepositoryModule.forRoot({
      debug: true
    }),
    SystemModule
  ],
  providers: [
    MyPageResponseProcessor,
    BookService,
    {
      provide: FIRESTORE_APP,
      useFactory: createFirestore
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

