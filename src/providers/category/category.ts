import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Category} from "../../models/Category";


@Injectable()
export class CategoryProvider {

  public collection : AngularFirestoreCollection<Category>;
  private categories : Observable<Category[]>;
  private category: Observable<Category>;

  constructor(public http: HttpClient, private af:AngularFirestore) {
    this.collection = af.collection<Category>("categories");
  }


  public getCategory(id:string){
    const document: AngularFirestoreDocument<Category> = this.af.doc('categories/' + id);
    this.category = document.valueChanges();
    return this.category;
  }


  public getAllCategories(){
    this.categories = this.collection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Category;
          let id = action.payload.doc.id;

          return {
            id,
            ...data
          }
        });
      });

    this.categories.forEach(console.log);
    return this.categories;
  }

}
