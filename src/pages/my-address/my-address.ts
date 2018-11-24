import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

/**
 * Generated class for the MyAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-address',
  templateUrl: 'my-address.html',
})
export class MyAddressPage implements OnInit {

    public userInfo:any=[{}];
    public response:any;


  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }


   ngOnInit(){
    let userdata=JSON.parse(localStorage.getItem('userInfo'));
    if(userdata==null)
      userdata=JSON.parse(localStorage.getItem('userRegisterDetail'))
    console.log(userdata);
    this.refreshUser(userdata.user.userid);
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
    console.log('ionViewDidLoad AboutMePage');
  }

  back(){
  this.navCtrl.setRoot('MyProfilePage');
  }

  addAddress(){
  this.navCtrl.setRoot('AddAddressPage');
  }

  refreshUser(userid){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'user/user/'+userid)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response
           this.userInfo=this.response.user.address;
           console.log(this.userInfo);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
  }

}
