import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";
import {Book} from "../../models/Book";
import {Observable} from "rxjs/Observable";
import {BooksProvider} from "../../providers/books/books";
import {CategoryProvider} from "../../providers/category/category";
import {Category} from "../../models/Category";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public allBooks : Observable<Book[]>;
  private categories: Observable<Category[]>;
  private selectedCategory: string = "";

  constructor(public navCtrl: NavController,
              private af:AngularFirestore,
              private booksProvider:BooksProvider,
              private ctgProvider: CategoryProvider) {

    this.allBooks = this.booksProvider.getAllBooksForSale();

    this.categories = this.ctgProvider.getAllCategories();
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


  filterByCategory(){
    this.allBooks = this.booksProvider.getBooksByCategory(this.selectedCategory);
  }

  resetFilter(){
    this.allBooks = this.booksProvider.getAllBooks();
  }
}
