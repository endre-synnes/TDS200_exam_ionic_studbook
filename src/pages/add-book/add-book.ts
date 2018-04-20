import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Camera} from "@ionic-native/camera";
import {LocationProvider} from "../../providers/location/location";
import {AngularFirestore} from "angularfire2/firestore";
import {AngularFireStorage} from "angularfire2/storage";
import {Book} from "../../models/Book";
import {BooksProvider} from "../../providers/books/books";
import {Geolocation} from "@ionic-native/geolocation";


@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage {

  private book: Book = {
    author:"",
    price:150,
    seller:"",
    sold:false,
    title:"",
    imgUrl:"",
    city:"Oslo"};


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private location: Geolocation,
              private locationProvider: LocationProvider,
              private af: AngularFirestore,
              private afStorage: AngularFireStorage,
              private bookProvider: BooksProvider) {

  }


  addBook(){
    this.book.seller = this.getCurrentUser();
    this.bookProvider.addBook(this.book);
  }


  getCurrentUser(){
    return this.af.app.auth().currentUser.email;
  }



}
