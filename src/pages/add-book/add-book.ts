import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, normalizeURL, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
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

  private previewImage: string = "";
  private uploadBase64: string = "";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private location: Geolocation,
              private locationProvider: LocationProvider,
              private af: AngularFirestore,
              private afStorage: AngularFireStorage,
              private bookProvider: BooksProvider,
              private platform: Platform,
              private actionSheetCtrl: ActionSheetController) {

  }


  addBook(){

    this.book.seller = this.getCurrentUser();

    let imgFileName = `${this.book.seller}_${new Date().getTime()}.png`;
    console.log(imgFileName);

    let task = this.afStorage
      .ref(imgFileName)
      .putString(this.uploadBase64, 'base64', {contentType: 'image/png'});

    console.log("Uploaded image");

    let uploadEvent = task.downloadURL();

    console.log("Downloading url");

    uploadEvent.subscribe((uploadImageUrl) => {
      this.book.imgUrl = uploadImageUrl;
      this.bookProvider.addBook(this.book)
        .then(() => this.navCtrl.pop())
        .catch(console.log)
    });

  }



  takePicture(sourceType: number){
    const options: CameraOptions = {
      destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType
    };

    this.camera.getPicture(options)
      .then( (imageData) => {

        this.uploadBase64 = imageData;

        //get photo from the camera based on platform type
        if (this.platform.is('ios'))
          this.previewImage = normalizeURL(imageData);
        else
          this.previewImage = "data:image/jpeg;base64," + imageData;
      }, (err) => {

      });
  }


  getCurrentUser(){
    return this.af.app.auth().currentUser.email;
  }


  presentPictureOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Add Picture",
      buttons: [
        {
          text: "Take Picture",
          icon: "camera",
          handler: () => this.takePicture(1)
        },
        {
          text: "From Archive",
          icon: "photos",
          handler: () => this.takePicture(0)
        },
        {
          text: "Cancel",
          icon: "cancel",
          role: "cancel"
        }
      ]
    });

    actionSheet.present();

  }
}
