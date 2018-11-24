import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

/**
 * Generated class for the AccessdealsinnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accessdealsinner',
  templateUrl: 'accessdealsinner.html',
})
export class AccessdealsinnerPage {

   public response:any=[{}];
   public dealDetail:any;
   public userInfo:any;


  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }


  ngOnInit(){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'))
      
      this.dealDetail=this.navParams.data;
      console.log(this.dealDetail);
      this.loadingCtrl.dismiss();
   }


   showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccessdealsinnerPage');
  }
  backtoaccessdeals(){
    this.navCtrl.push('AccessdealsPage');
  }

  formatDate(dateString){
    return new Date(dateString);
  }
}


