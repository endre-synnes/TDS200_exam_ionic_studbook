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
      this.http.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
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
