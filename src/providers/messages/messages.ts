import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Messages} from "../../models/Messages";

/*
  Generated class for the MessagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessagesProvider {

  private messages: Observable<Messages[]>;
  private collection : AngularFirestoreCollection<Messages>;

  constructor(public http: HttpClient, private af:AngularFirestore) {
    this.collection = af.collection<Messages>("messages");



    console.log('Hello MessagesProvider Provider');
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


}
