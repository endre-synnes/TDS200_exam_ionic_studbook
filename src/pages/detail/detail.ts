import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BooksProvider} from "../../providers/books/books";
import {Book} from "../../models/Book";
import {MessagesProvider} from "../../providers/messages/messages";
import {AngularFirestore} from "angularfire2/firestore";
import {Messages} from "../../models/Messages";
import {Message} from "../../models/Message";

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  private book:Book;
  private email:string = "";
  private text:string = "";


  private messages: Messages = {
    sender : "",
    bookId : "",
    bookTitle : "",
    receiver : ""
  };

  private message:Message = {
    sender: "",
    text: ""
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private bookProvider: BooksProvider,
              private messagesProvider: MessagesProvider,
              private af:AngularFirestore) {
    this.book = navParams.get('book');

    this.email = af.app.auth().currentUser.email;

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }


  sendMessage(){
    this.messages.sender = this.email;
    this.messages.bookId = this.book.id;
    this.messages.bookTitle = this.book.title;
    this.messages.receiver = this.book.seller;

    this.message.sender = this.email;
    this.message.text = this.text;

    this.messagesProvider.addNewMessagesCollection(this.messages)
      .then( (e) => {
        console.log("response: "+e);
        this.messagesProvider.addMessage(e.toString() , this.message)
      }
    );

  }

}
