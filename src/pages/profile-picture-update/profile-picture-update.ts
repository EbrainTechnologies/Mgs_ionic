import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';






import {_throw} from 'rxjs/observable/throw';
/*import {throwError} from "rxjs";*/
import {Loading, LoadingController, ToastController} from "ionic-angular";
import {Camera} from '@ionic-native/camera';
import {File, FileEntry} from "@ionic-native/file";
import {catchError, finalize} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

import { AppSettings } from '../../app/app-settings';
import { UserServiceProvider } from '../../providers/auth-service/user-service';

/**
 * Generated class for the ProfilePictureUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-picture-update',
  templateUrl: 'profile-picture-update.html',
})
export class ProfilePictureUpdatePage implements OnInit{

	  public myPhoto: any;
      public error: string;
      private loading: Loading;
      public userId:any;

  constructor(public navParams: NavParams,public navCtrl: NavController,private readonly http: HttpClient,
              private readonly loadingCtrl: LoadingController,
              private readonly toastCtrl: ToastController,
              private readonly camera: Camera,
			  private readonly file: File,public userService:UserServiceProvider) {
  }


  ngOnInit(){
    let userdata=JSON.parse(localStorage.getItem('userInfo'));
    if(userdata==null)
      userdata=JSON.parse(localStorage.getItem('userRegisterDetail'))
      console.log(userdata);
      this.userId=userdata.user.userid;}

  takePhoto() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  private uploadPhoto(imageFileUri: any): void {
    this.error = null;
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });

    this.loading.present();

    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (entry as FileEntry).file(file => this.readFile(file)))
      .catch(err => alert(err));
  }

  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: file.type});
      formData.append('pofilePic', imgBlob, file.name);
      formData.append('userid',this.userId);
      this.http.post<boolean>(AppSettings.API_STARTPOINT+"upload/userprofilephoto", formData)
      .pipe(
        catchError(e => this.handleError(e)),
        finalize(() => this.loading.dismiss())
      )
      .subscribe(response => {
          console.log(response);
           alert(response);
           this.showToast('top','picture updated sucessfully');
           this.navCtrl.setRoot('MyProfilePage');
       },
       error =>  {
         alert(error);
         
       });
      };
    reader.readAsArrayBuffer(file);
  }

 
  showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    this.error = errMsg;
    alert(this.error);
    return _throw(errMsg);
  }


}

