import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Messages} from "../../models/Messages";
import {Observable} from "rxjs/Observable";
import {Message} from "../../models/Message";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {BooksProvider} from "../../providers/books/books";
import {Book} from "../../models/Book";

/**
 * Generated class for the ConversationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {

  private messages:Messages;
  private conversation:Observable<Message[]>;
  private messagesCollection:AngularFirestoreCollection<Messages>;
  private title:string;
  private price:number;
  private chatInput:string;
  private email:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private bookProvider: BooksProvider,
              private af: AngularFirestore) {
    this.messages = this.navParams.get('messages');
    this.email = af.app.auth().currentUser.email;


    this.messagesCollection = this.conversation = this.navParams.get('messagesCollection');

    this.bookProvider.getBook(this.messages.bookId)
      .then((book:Book) => {
        this.title = book.title;
        this.price = book.price
      });


    this.conversation = this.messagesCollection
      .doc(this.messages.id)
      .collection('conversations')
      .snapshotChanges().map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Message;
          let id = action.payload.doc.id;

          return {
            id,
            ...data
          }
        });
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationPage');
  }

}
