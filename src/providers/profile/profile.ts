import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Profile} from "../../models/Profile";
import {Book} from "../../models/Book";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {

  private collection : AngularFirestoreCollection<Profile>;
  private profiles : Observable<Profile[]>;


  constructor(public http: HttpClient, private af: AngularFirestore) {
    console.log('Hello ProfileProvider Provider');
    this.collection = af.collection<Profile>("profiles");

  }


  addProfile(profile: Profile){
    return new Promise((resolve, reject) =>{
      this.collection.add(profile)
        .then(resolve)
        .catch(reject)
    });

  }


  getProfiles(){
    return this.collection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Profile;
          let id = action.payload.doc.id;

          return {
            id,
            ...data
          }
        });
      });
  }

  getProfile(email:string){
    this.profiles = this.getProfiles().map(
      array => array.filter(
        profile => profile.email === email));

    return this.profiles[0];
  }

}
