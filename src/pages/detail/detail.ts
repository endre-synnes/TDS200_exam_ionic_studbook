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
    receiver : "",
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

    sendMessage() {
      if (this.text.length > 0) {
        this.messages.sender = this.email;
        this.messages.bookId = this.book.id;
        this.messages.bookTitle = this.book.title;
        this.messages.receiver = this.book.seller;
        this.messages.time = new Date();

        this.message.sender = this.email;
        this.message.text = this.text;
        this.message.time = new Date();
        this.text = "";

        // this.messagesProvider.getMessagesObj(this.messages.sender, this.messages.bookId).then(
        //   response => {
        //     if (response.sender === this.messages.sender){
        //       console.log("Messages exist");
        //       this.messagesProvider.addMessage(response.id, this.message);
        //     }else {
        //       console.log("Creating messaes");
        //       this.messagesProvider.addNewMessagesCollection(this.messages)
        //         .then( (e) => {
        //           console.log("adding messages");
        //           this.messagesProvider.addMessage(e, this.message);
        //         })
        //     }
        //   }
        // ).catch((e) => console.log("error "+e))


        this.messagesProvider.addNewMessagesCollection(this.messages)
          .then((e) => {
              console.log("response: " + e);
              this.messagesProvider.addMessage(e, this.message)
            }
          );

      }
    }

}
