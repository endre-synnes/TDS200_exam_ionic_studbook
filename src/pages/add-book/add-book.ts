import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, normalizeURL, Platform} from 'ionic-angular';
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
    price:0,
    seller:"",
    sold:false,
    title:"",
    imgUrl:"",
    city:"Oslo"};

  private imageString: string = "";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private location: Geolocation,
              private locationProvider: LocationProvider,
              private af: AngularFirestore,
              private afStorage: AngularFireStorage,
              private bookProvider: BooksProvider,
              private platform: Platform) {

  }


  addBook(){
    if (this.imageString !== "") {
      this.book.seller = this.getCurrentUser();

      let imgFileName = `${this.book.seller}_${new Date().getTime()}.png`;

      let task = this.afStorage
        .ref(imgFileName)
        .putString(this.imageString, 'base64', {contentType: 'image/png'});

      let uploadEvent = task.downloadURL();

      uploadEvent.subscribe((uploadImageUrl) => {
        this.book.imgUrl = uploadImageUrl;
        this.bookProvider.addBook(this.book)
          .then(() => this.navCtrl.pop())
          .catch(console.log)
      });
    }

  }

  takePicture(){
    this.camera.getPicture({
      destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      cameraDirection: this.camera.Direction.BACK,
      correctOrientation: true,
      mediaType: this.camera.MediaType.PICTURE
    })
      .then( (imageData) => {

        let base64Image = null;

        //get photo from the camera based on platform type
        if (this.platform.is('ios'))
          base64Image = normalizeURL(imageData);
        else
          base64Image = "data:image/jpeg;base64," + imageData;

        this.imageString = base64Image;

      }).catch(console.log)
  }


  getCurrentUser(){
    return this.af.app.auth().currentUser.email;
  }



}
