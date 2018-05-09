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
  private email: string;
  private profiles: Observable<Profile[]>;
  private firstName: string = "";
  private lastName: string = "";
  private imgUrl: string = "";
  private id:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private booksProvider: BooksProvider,
              private profilePovider: ProfileProvider) {

    this.email = this.af.app.auth().currentUser.email;



    this.loadProfile();
    // this.profiles.map(arr => {
    //   arr.map( e => {
    //     console.log("first name: "+e.firstName);
    //     this.firstName = e.email;
    //     this.lastName = e.lastName;
    //   })
    // });

    this.loadBooks()
  }

  loadProfile(){
    this.profiles = this.profilePovider.getProfile(this.email);

    this.profiles.forEach( e => e.forEach(profile => {
      this.firstName = profile.firstName;
      this.lastName = profile.lastName;
      this.id = profile.id;
    }));
  }


  loadBooks(){
    this.mySoldBooks = this.booksProvider
      .getYourBooks(this.email)
      .map(array => array.filter(
        book => book.sold === true
      ));
  }


}
