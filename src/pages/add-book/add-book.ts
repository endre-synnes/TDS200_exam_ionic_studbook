import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  normalizeURL,
  Platform
} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {LocationProvider} from "../../providers/location/location";
import {AngularFirestore} from "angularfire2/firestore";
import {AngularFireStorage} from "angularfire2/storage";
import {Book} from "../../models/Book";
import {BooksProvider} from "../../providers/books/books";
import {Geolocation} from "@ionic-native/geolocation";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {IsbnProvider} from "../../providers/isbn/isbn";
import {CategoryProvider} from "../../providers/category/category";
import {Observable} from "rxjs/Observable";
import {Category} from "../../models/Category";


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
    city:"",
    isbn:""};

  private previewImage: string = "";
  private uploadBase64: string = "";

  private categories: Observable<Category[]>;
  private category:string = "Other";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private location: Geolocation,
              private locationProvider: LocationProvider,
              private af: AngularFirestore,
              private afStorage: AngularFireStorage,
              private bookProvider: BooksProvider,
              private platform: Platform,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private barcodeScanner: BarcodeScanner,
              private isbnProvider: IsbnProvider,
              private alertCtrl: AlertController,
              private categoryProvider: CategoryProvider
              ) {

    this.categories = this.categoryProvider.getAllCategories();

  }


  addBook(){
    if (this.uploadBase64 !== "") {

      let loading = this.loadingCtrl.create({
        content : "Uploading book...",
      });
      loading.present();

      this.book.category = this.category;
      this.book.seller = this.getCurrentUser();
      this.book.time = new Date();

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
          .then(() => {
            loading.dismissAll();
            this.navCtrl.pop();
          }).catch( () =>
            loading.dismissAll())
      });
    }

  }



  takePicture(sourceType: number){
    this.setLocationName();

    const options: CameraOptions = {
      //destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
      destinationType: this.camera.DestinationType.DATA_URL,
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
          this.previewImage =  imageData;
        //this.previewImage = "data:image/jpeg;base64," + imageData;
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


  setLocationName(){
    this.location.getCurrentPosition({
      enableHighAccuracy: true
    }).then( coordinates => {
      this.locationProvider.
        getLocation(coordinates.coords.latitude, coordinates.coords.longitude)
        .then((place: any) => {
          if (place.error_message){
            console.log(place.error_message)
          } else {
            this.book.city = place.results[1].formatted_address;
          }
        });
    }).catch( error => {
      console.log(error);
    })
  }


  scanBarcode(){
    this.barcodeScanner.scan().then( barcodeData => {
      console.log('Barcode data', barcodeData.text);

      let loading = this.loadingCtrl.create({
        content : "Looking for book information",
      });
      loading.present();

      this.isbnProvider.getBookInformation(barcodeData.text)
        .then( (json: any) => {
          if (json.length === 0){
            console.log("empty");
          }else {
            this.book.isbn = barcodeData.text;
            this.book.title = json.items[0].volumeInfo.title;
            this.book.author = json.items[0].volumeInfo.authors[0];
          }
          loading.dismissAll();
        })
        .catch(() => {
          loading.dismissAll();
          let alert = this.alertCtrl.create({
            title: "Not Found",
            subTitle: "This book is not in our database",
            buttons: ['Dismiss']
          });
          alert.present();
      })


    }).catch( err => {
      console.log('error', err);
    });
  }
}
