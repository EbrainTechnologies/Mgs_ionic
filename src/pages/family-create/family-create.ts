import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';



@IonicPage()
@Component({
  selector: 'page-family-create',
  templateUrl: 'family-create.html',
})
export class FamilyCreatePage implements OnInit{



public userData:any={
                      "userid":"",
                      "firstName":"",
                      "lastName":"",
                      "phoneNumber":"",
                      "email":"",
                      "actionType":"CUSTOM"
                    };

  public userInfo:any=[{}];
  public response:any;
 
 
  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

   ngOnInit(){
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'))
      this.userData.userid=this.userInfo.user.userid;
      console.log(this.userInfo);
   }


   showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

   addFamily(){
              let getloadingcontroller = this.loadingCtrl.presentWithGif2();
                    this.userService.postData(AppSettings.API_STARTPOINT+'user/familymember',this.userData)
                     .subscribe(
                     response => {
                       this.loadingCtrl.dismiss();
                       this.response=response;
                       this.showToast('top',this.response.message);
                       this.resetForm();
                       this.navCtrl.setRoot('FamilyPage');
                   },
                   error =>  {
                     alert(error);
                     this.loadingCtrl.dismiss();
                   });

       }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FamilyCreatePage');
  }

  back(){
  	this.navCtrl.setRoot('FamilyPage');
  }

   resetForm(){
    this.userData.firstName="";
    this.userData.lastName="";
    this.userData.phoneNumber="";
    this.userData.email="";
  }


  

}
