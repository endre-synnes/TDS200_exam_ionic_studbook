import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Messages} from "../../models/Messages";
import {Observable} from "rxjs/Observable";
import {Message} from "../../models/Message";
import {AngularFirestore} from "angularfire2/firestore";
import {BooksProvider} from "../../providers/books/books";
import {Book} from "../../models/Book";
import {MessagesProvider} from "../../providers/messages/messages";


@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {

  private messages:Messages;
  private conversation:Observable<Message[]>;
  private title:string;
  private price:number;
  private chatInput:string = "";
  private email:string = "";
  private sold:boolean;
  private id:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private bookProvider: BooksProvider,
              private af: AngularFirestore,
              private messagesProvider: MessagesProvider) {
    this.messages = this.navParams.get('messages');

    this.email = af.app.auth().currentUser.email;

    this.bookProvider.getBook(this.messages.bookId)
      .then((book:Book) => {
        this.title = book.title;
        this.price = book.price;
        this.sold = book.sold;
        this.id = book.id;
      });


    this.conversation = this.messagesProvider
      .getConversations(this.messages.id);

  }

  //Checking if message is from you or the other person in this chat
  rowCondition(mess:Message) {
    return mess.sender === this.email;
  }

  send() {
    if (this.chatInput.length > 0) {
      let text = this.chatInput;
      this.chatInput = "";
      console.log("send clicked");
      this.messagesProvider.addMessage(this.messages.id, {
        sender: this.email,
        text: text,
        time: new Date()
      } as Message).then(() =>
        this.chatInput = ""
      )
    }
  }

  //Converting Date object (not used anymore)
  convertTime(date:Date){
    let time:string = date.getDate() + " "
      + date.getUTCMonth() + " "
      + date.getFullYear() + " at "
      + date.getHours() + ":"
      + date.getMinutes() + ":"
      + date.getSeconds();
    return time;
  }
}
