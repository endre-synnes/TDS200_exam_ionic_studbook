import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private af:AngularFirestore) {

  }

  logOut() {
    this.af.app.auth().signOut();
  }

  addBookPage() {
    this.navCtrl.push('AddBookPage');
  }
}
