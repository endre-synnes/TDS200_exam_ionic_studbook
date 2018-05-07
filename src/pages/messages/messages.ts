import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BooksProvider} from "../../providers/books/books";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Messages} from "../../models/Messages";
import {Book} from "../../models/Book";
import {MessagesProvider} from "../../providers/messages/messages";

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  private email: string;
  private messages: Observable<Messages[]>;
  private collection : AngularFirestoreCollection<Messages>;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private booksProvider: BooksProvider,
              private af: AngularFirestore,
              private messagesProvider: MessagesProvider) {
    this.email = af.app.auth().currentUser.email;
    this.collection = af.collection<Messages>("messages");
    this.loadAllMessagesBasedOnEmail();
  }

  public loadAllMessagesBasedOnEmail() {
    this.messages = this.getAllMessages()
      .map(arr => {
        return arr.filter(messages =>
          messages.receiver === this.email || messages.sender === this.email)
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

  checkSender(message:Messages){
    return message.sender === this.email;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

  goToConversation(messages: Messages) {
    this.navCtrl.push('ConversationPage', {
      messages,
      messagesCollection: this.collection
    });
  }
}
