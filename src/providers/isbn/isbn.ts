import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the IsbnProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IsbnProvider {

  constructor(public http: HttpClient) {
    console.log('Hello IsbnProvider Provider');
  }


  getBookInformation(isbn){
    return new Promise((resolve, reject) => {
      this.http.get(`http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`)
        .subscribe(
          function (data) {
            resolve(data);
        },
          function (error) {
            reject(error);
          });
    });
  }

}
