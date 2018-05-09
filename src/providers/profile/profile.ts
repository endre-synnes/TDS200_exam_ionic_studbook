import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Profile} from "../../models/Profile";
import {Observable} from "rxjs/Observable";


@Injectable()
export class ProfileProvider {

  private collection : AngularFirestoreCollection<Profile>;
  private profiles : Observable<Profile[]>;
  private filteredProfiles: Observable<Profile[]>;


  constructor(public http: HttpClient, private af: AngularFirestore) {
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
    this.profiles = this.collection.snapshotChanges()
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

    this.profiles.forEach(console.log);

    return this.profiles;
  }


  getProfile(email:string){
    console.log("email:"+email);
    this.filteredProfiles = this.getProfiles().map(arr => arr.filter(
      obj => obj.email === email
    ));

    return this.filteredProfiles;
  }

}
