import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BooksProvider} from "../../providers/books/books";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Book} from "../../models/Book";
import {Messages} from "../../models/Messages";

/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  private email: string;
  private messages: Observable<Messages[]>;
  private yourBooks: Observable<Book[]>;
  private collection : AngularFirestoreCollection<Messages>;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private booksProvider: BooksProvider,
              private af: AngularFirestore) {
    this.email = af.app.auth().currentUser.email;
    this.collection = af.collection<Messages>("messages");

  }

  public loadAllMessagesBasedOnBook(bookId: any) {
    return this.getAllMessages()
      .map(arr => {
        return arr.filter(book =>
          book.bookId === bookId)
      });
  }



  private getAllMessages(){
    this.messages = this.collection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Messages;
          let id = action.payload.doc.id;

          return {
            id,
            ...data
          }
        });
      });
    return this.messages;
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

}
