import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage implements OnInit{


  public userInfo:any=[{}];
  public userFeature:any=[{}];
  public slidetoggle:boolean=false;
  public response:any;
  public updateRes:any;
  public userAddress:any=[{}];
  public location:any;
  public startPoint=AppSettings.API_STARTPOINT;
  public userLocation:any;

public userData = {
                  "userid": "",
                  "address":
                            {    "name": "",
                                 "street1": "",
                                 "street2": "",
                                 "city": "",
                                 "statecode": "",
                                 "postcode": "9",
                                 "countrycode": "",
                                 "formattedAddress": "",
                                 "latitude": 40.4613323,
                                 "longitude": -74.3501357,
                                 "isPrimary": 1,
                                 "status": 1
                              },
                                 "actionBy": ""
                    }

 constructor(public toastCtrl: ToastController,
             public navCtrl: NavController,
             public navParams: NavParams,
             public userService:UserServiceProvider,
             public loadingCtrl: LoadingProvider)
             {
             }


   ngOnInit(){
    let userdata=JSON.parse(localStorage.getItem('userInfo'));
    if(userdata==null)
      userdata=JSON.parse(localStorage.getItem('userRegisterDetail'))
      console.log(userdata);
      this.userData.userid=userdata.user.userid;
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
    console.log('ionViewDidLoad MyProfilePage');
  }

  back(){
  this.navCtrl.setRoot('HomePage');
  }

  aboutme(){
  this.navCtrl.setRoot('AboutMePage');
  }

  myaddress(){
  this.navCtrl.setRoot('MyAddressPage');
  }

  playsports(){
  this.navCtrl.setRoot('SelectSportsPage');
  }

  homeclub(){
  this.navCtrl.setRoot('HomeclubPage');
  }

  family(){
  this.navCtrl.setRoot('FamilyPage');
  }

  myranking(){
  this.navCtrl.setRoot('MyrankingPage');
  }

   refreshUser(userid){
     this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'user/user/'+userid)
         .subscribe(
         response => {
           this.response=response;
           this.userInfo=this.response.user;
           console.log(this.userInfo);
           this.userFeature=this.response.userFeature;
           this.userAddress=this.response.user.address;
           if(this.response.user.userLocation==null)
           this.userLocation=this.response.user.address[0];
           else 
           this.userLocation=this.response.user.userLocation;
           this.loadingCtrl.dismiss();
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

   }

   onChange(){
    console.log(this.location);

    for(var i=0;i<this.userAddress.length;i++){
      if(this.location==i){
        this.userData.address=this.userAddress[i];
        break;
      }
    }

    this.userData.userid=this.userInfo.userid;

    console.log(this.userData);



    this.loadingCtrl.presentWithGif2();
    this.userService.putData(AppSettings.API_STARTPOINT+'user/changepreferredlocation',this.userData)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.updateRes=response;
           this.showToast('top',this.updateRes.message);

       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });



   }

   profilePicUpdate(){
    this.navCtrl.setRoot('ProfilePictureUpdatePage');
   }

}
