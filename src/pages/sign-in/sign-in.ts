import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";
import {SignUpPage} from "../sign-up/sign-up";

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  private user = {
    email: "",
    password: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private af: AngularFirestore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }

  logInUser() {
    this.af.app.auth()
      .signInWithEmailAndPassword(this.user.email, this.user.password)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      });
  }

  registerUser() {
    this.navCtrl.push('SignUpPage')
  }
}
