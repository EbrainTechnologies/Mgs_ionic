import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

/**
 * Generated class for the EditaboutmePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editaboutme',
  templateUrl: 'editaboutme.html',
})
export class EditaboutmePage implements OnInit{

  public userInfo:any=[{}];
  public response:any;


   public userData:any = {
                          "userid": "",
                          "displayName": "",
                          "firstName": "",
                          "lastName": "",
                          "phoneNumber": "",
                          "externalReference":''
                        };


  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

   ngOnInit(){
    let userdata=JSON.parse(localStorage.getItem('userInfo'));
    if(userdata==null)
      userdata=JSON.parse(localStorage.getItem('userRegisterDetail'))
    console.log(userdata);
    this.userData.userid=userdata.user.userid;
    this.refreshUser(this.userData.userid);
   }


   showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

   editForm(){
    console.log(this.userData);
      this.userService.postData(AppSettings.API_STARTPOINT+'user/updateuserprofile',this.userData)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           this.showToast('top','Profile has been updated sucessfully');
           this.navCtrl.setRoot('AboutMePage');
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
   }

   
    resetForm(){
    this.userData.firstName="";
    this.userData.lastName="";
    this.userData.displayName="";
    this.userData.phoneNumber="";
    this.userData.external_refernce='';
  }


  refreshUser(userid){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'user/user/'+userid)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response
           this.userData=this.response.user;
           console.log(this.userInfo);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

   }
  


   ionViewDidLoad() {
     console.log('ionViewDidLoad EditaboutmePage');
   }

   back(AboutMePage){
   this.navCtrl.setRoot('AboutMePage');
   }


}
