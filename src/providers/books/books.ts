import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Book} from "../../models/Book";
import {Observable} from "rxjs/Observable";


@Injectable()
export class BooksProvider {

  public collection : AngularFirestoreCollection<Book>;
  private allBooks : Observable<Book[]>;
  private yourBooks: Observable<Book[]>;

  constructor(public http: HttpClient, private af: AngularFirestore) {
    this.collection = af.collection<Book>("books");
  }

  getAllBooks(){
    this.allBooks = this.collection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Book;
          let id = action.payload.doc.id;

          return {
            id,
            ...data
          }
        });
      });
    return this.allBooks;
  }

  getAllBooksForSale(){
    return this.getAllBooks().map(
      array => array.filter(
        book => book.sold === false));
  }


  getYourBooks(email:string){
    this.yourBooks = this.getAllBooks().map(
      array => array.filter(
          book => book.seller === email));

    this.yourBooks.forEach(console.log);

    return this.yourBooks;
  }


  addBook(book: Book){
    return new Promise((resolve, reject) =>{
      this.collection.add(book)
        .then(resolve)
        .catch(reject)
    });
  }


  getBook(id:string){
    return new Promise(((resolve, reject) => {
      this.collection.doc(id).ref.get()
        .then(function (doc) {
          resolve(doc.data())
        })
    })
    );
  }

  markBookAsSold(book:Book){
    this.collection.doc(book.id).update({
      sold: true
    })
  }
}
