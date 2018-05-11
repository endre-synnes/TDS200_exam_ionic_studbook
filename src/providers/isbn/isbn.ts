import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class IsbnProvider {

  constructor(public http: HttpClient) {
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
