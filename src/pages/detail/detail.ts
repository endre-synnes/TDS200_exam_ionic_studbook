import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BooksProvider} from "../../providers/books/books";
import {Book} from "../../models/Book";
import {MessagesProvider} from "../../providers/messages/messages";

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

  private title:string;
  private author:string;
  private price:number;
  private seller:string;
  private imgUrl:string;
  private city:string;
  private isbn:string;

  private book:Book;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private bookProvider: BooksProvider,
              private messagesProvider: MessagesProvider) {
    this.book = navParams.get('book');

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
