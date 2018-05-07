import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";
import {Book} from "../../models/Book";
import {Observable} from "rxjs/Observable";
import {BooksProvider} from "../../providers/books/books";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public allBooks : Observable<Book[]>;

  constructor(public navCtrl: NavController,
              private af:AngularFirestore,
              private booksProvider:BooksProvider) {

    this.allBooks = this.booksProvider.getAllBooksForSale();
  }

  logOut() {
    this.af.app.auth().signOut();
  }

  addBookPage() {
    this.navCtrl.push('AddBookPage');
  }

  goToDetails(book) {
    this.navCtrl.push('DetailPage', {book});
  }
}
