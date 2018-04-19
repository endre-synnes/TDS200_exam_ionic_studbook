import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {AngularFirestore} from "angularfire2/firestore";
import {SignInPage} from "../pages/sign-in/sign-in";

import { TabsPage} from "../pages/tabs/tabs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              af: AngularFirestore) {

    const authObserver = af.app.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = "SignInPage";
        }
      }
    );


    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

