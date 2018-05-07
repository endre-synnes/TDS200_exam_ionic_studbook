import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';


import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth'
import {AngularFireStorageModule} from "angularfire2/storage";
import {HttpClientModule} from "@angular/common/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import env from "./env";
import {Camera} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import { LocationProvider } from '../providers/location/location';
import {TabsPage} from "../pages/tabs/tabs";
import {MyBooksPage} from "../pages/my-books/my-books";
import { BooksProvider } from '../providers/books/books';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import { IsbnProvider } from '../providers/isbn/isbn';
import { ProfileProvider } from '../providers/profile/profile';
import {MessagesPage} from "../pages/messages/messages";
import { MessagesProvider } from '../providers/messages/messages';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    MyBooksPage,
    MessagesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(env),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    MyBooksPage,
    MessagesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationProvider,
    Camera,
    Geolocation,
    BooksProvider,
    BarcodeScanner,
    IsbnProvider,
    ProfileProvider,
    MessagesProvider
  ]
})
export class AppModule {}
