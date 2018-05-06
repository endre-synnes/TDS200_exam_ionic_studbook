import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";
import {Profile} from "../../models/Profile";
import {ProfileProvider} from "../../providers/profile/profile";



@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {


  private profile = {} as Profile;

  private password: "";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private profileProvider: ProfileProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }


  async register(){
    try {
      const result = await this.af.app.auth()
        .createUserWithEmailAndPassword(this.profile.email, this.password);

      if (result) {
        this.profileProvider.addProfile(this.profile);
      }

      console.log(result);
    }catch (e) {
      console.log(e);
    }
  }


}
