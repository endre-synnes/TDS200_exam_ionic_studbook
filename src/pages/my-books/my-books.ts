import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";
import {BooksProvider} from "../../providers/books/books";
import {Book} from "../../models/Book";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-my-books',
  templateUrl: 'my-books.html',
})
export class MyBooksPage {

  user:any;
  userEmail:string;
  currentUserBooks:Observable<Book[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private booksProvider:BooksProvider) {

    this.user = af.app.auth().currentUser;
    this.userEmail = this.user.email;

    this.currentUserBooks = booksProvider.getYourBooks(this.userEmail)
    console.log(this.userEmail)

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
