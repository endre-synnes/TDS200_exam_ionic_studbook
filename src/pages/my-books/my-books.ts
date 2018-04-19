import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";

@IonicPage()
@Component({
  selector: 'page-my-books',
  templateUrl: 'my-books.html',
})
export class MyBooksPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyBooksPage');
  }

  goToAccount() {
    this.navCtrl.push('AccountPage');
  }

  logOut(){
    this.af.app.auth().signOut();
  }
}
