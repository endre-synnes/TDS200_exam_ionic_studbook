import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";
import {SignUpPage} from "../sign-up/sign-up";


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
              private af: AngularFirestore,
              private toastController:ToastController) {
  }


  logInUser() {
    this.af.app.auth()
      .signInWithEmailAndPassword(this.user.email, this.user.password)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error);
        this.presentToast();
      });
  }

  registerUser() {
    this.navCtrl.push('SignUpPage')
  }


  private presentToast(){
    let toast = this.toastController.create({
      message: 'Could not log in, check username and password!',
      duration: 4000,
      position: 'middle'
    });

    toast.present();
  }
}
