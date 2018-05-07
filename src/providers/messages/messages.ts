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
    this.collection = af.collection<Messages>("messages");
    }


  public loadAllMessagesBasedOnEmail(email:string) {
    return this.getAllMessages()
      .map(arr => {
        return arr.filter(messages =>
          messages.receiver === email || messages.sender === email)
      });
    }

  public checkIfConversationExists(messages:Messages){
    const usersRef = this.collection.doc(messages.id);

    return usersRef.ref.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          return true
        }
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

  public addNewMessagesCollection(messages:Messages){
    return new Promise(((resolve, reject) => {
      this.collection.add(messages)
        .then(function (obj) {
          return obj.id;
        })
        .catch(reject)
    }))

    // return new Promise((resolve, reject) =>{
    //
    //   this.collection.add(book)
    //     .then(resolve)
    //     .catch(reject)
    // });
    //
    //
    // this.checkIfConversationExists(messages).then((e) => {
    //   if (e === false) {
    //     this.collection.add(messages).then( () =>
    //       this.addMessage(messages, message)
    //     )
    //   }else {
    //     this.addMessage(messages, message)
    //   }
    //
    // });
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


}
