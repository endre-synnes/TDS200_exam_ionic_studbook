import { Component } from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  normalizeURL,
  Platform
} from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";
import {Profile} from "../../models/Profile";
import {ProfileProvider} from "../../providers/profile/profile";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {AngularFireStorage} from "angularfire2/storage";



@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {


  private profile = {
    email: "",
    firstName: "",
    lastName: "",

  } as Profile;

  private password: "";

  private previewImage: string = "";
  private uploadBase64: string = "";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private profileProvider: ProfileProvider,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              private afStorage: AngularFireStorage
              ) {
  }


  async register(){
    if (this.profile.email !== "" && this.password !== "") {
      try {
        const result = await this.af.app.auth()
          .createUserWithEmailAndPassword(this.profile.email, this.password);

        if (result) {
          if (this.uploadBase64 !== ""){
            this.uploadProfilePicture();
          }else {
            this.profileProvider.addProfile(this.profile);
          }
        }

        console.log(result);
      } catch (e) {
        console.log(e);
      }
    }
  }


  presentPictureChoices() {
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


  takePicture(sourceType: number){

    const options: CameraOptions = {
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
      }, (err) => {
      });
  }

  private uploadProfilePicture() {
    let imgFileName = `${this.profile.email}_${new Date().getTime()}.png`;

    let task = this.afStorage
      .ref(imgFileName)
      .putString(this.uploadBase64, 'base64', {contentType: 'image/png'});

    let uploadEvent = task.downloadURL();

    uploadEvent.subscribe((uploadImageUrl) => {
      this.profile.imgUrl = uploadImageUrl;
      this.profileProvider.addProfile(this.profile);
    });

  }
}
