import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BooksProvider} from "../../providers/books/books";
import {Observable} from "rxjs/Observable";
import {Book} from "../../models/Book";
import {AngularFirestore} from "angularfire2/firestore";
import {Profile} from "../../models/Profile";
import {ProfileProvider} from "../../providers/profile/profile";

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  private mySoldBooks : Observable<Book[]>;
  private profile: Profile;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private booksProvider: BooksProvider,
              private profilePovider: ProfileProvider) {

    this.profile = this.profilePovider.getProfile(this.af.app.auth().currentUser.email);
    this.loadBooks()
  }


  loadBooks(){
    this.mySoldBooks = this.booksProvider
      .getYourBooks(this.profile.email)
      .map(array => array.filter(
        book => book.sold === true
      ));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

}
