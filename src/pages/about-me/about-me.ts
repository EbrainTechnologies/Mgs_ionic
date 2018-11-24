import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';


@IonicPage()
@Component({
  selector: 'page-about-me',
  templateUrl: 'about-me.html',
})
export class AboutMePage implements OnInit{

    public userInfo:any=[{}];
    public userFeature:any=[{}];
    public response:any;
    public startPoint=AppSettings.API_STARTPOINT;

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

  formatDate(date){
    if(date)
    {
    console.log(date);
    var myDate = new Date(date);
    var date:any =  myDate.toLocaleString();
    return date.substr(0, date.lastIndexOf(","));
    }
    else
      return '';
  }

  gotoedit(EditaboutmePage){
    this.navCtrl.setRoot('EditaboutmePage');
  }

   refreshUser(userid){
       this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'user/user/'+userid)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           if(response)
              this.response=response;
            this.userInfo=this.response.user;
            this.userFeature=this.response.userFeature;
           console.log(this.userInfo);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

   }

   profilePic(){
    this.navCtrl.setRoot('ProfilePictureUpdatePage');
   }
   
}

