import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Messages} from "../../models/Messages";
import {Message} from "../../models/Message";


@Injectable()
export class MessagesProvider {

  private messages: Observable<Messages[]>;
  private collection : AngularFirestoreCollection<Messages>;

  constructor(public http: HttpClient, private af:AngularFirestore) {
    this.collection = af.collection<Messages>("messages", ref => ref.orderBy('time', 'desc'));
    }


  public loadAllMessagesBasedOnEmail(email:string) {
    return this.getAllMessages()
      .map(arr => {
        return arr.filter(messages =>
          messages.receiver === email || messages.sender === email)
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


  public getMessagesObj(sender, bookId){
    return this.getAllMessages()
      .map(arr => {
        console.log("looking");
        return arr.find( obj => obj.sender === sender && obj.bookId === bookId)
      }).toPromise();
    }


  public addNewMessagesCollection(messages:Messages){
    return this.collection.add(messages).then(
      function (obj) {
        return obj.id
      }
    ).catch(
      function (error) {
        return null;
      }
    );
  }


  public addMessage(parent:string, message:Message){
    return new Promise((resolve, reject) => {
      this.collection
        .doc(parent)
        .collection('conversations')
        .add(message)
        .then(resolve)
        .catch(reject)
    })
  }



  public getConversations(id:string){
    return this.collection
      .doc(id)
      .collection('conversations', ref => ref.orderBy('time', 'asc'))
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


}
