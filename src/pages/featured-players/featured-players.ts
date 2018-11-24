import { Component, OnInit } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { ToastController } from 'ionic-angular';
import { HomeServiceProvider } from '../../providers/auth-service/home-service';
import { LoadingProvider } from '../../providers/loading/loading';
import {AppSettings} from '../../app/app-settings';
/**
 * Generated class for the FeaturedPlayersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-featured-players',
  templateUrl: 'featured-players.html',
})
export class FeaturedPlayersPage {

  public errorMessage: any;
  public response:any;
  public list:any;
  public userInfo:any;
  public startPoint=AppSettings.API_STARTPOINT;

   public userData:any = {
                          "userId": "",
                          "favoriteType": "PLAYER",
                          "sportName": "",
                          "favoriteUserId": ""
                          }

  constructor(public userService:UserServiceProvider,public app: App, public navCtrl: NavController, public homeService: HomeServiceProvider, public loadingCtrl: LoadingProvider,public toastCtrl: ToastController) {

  }

  ngOnInit() {
    this.initiate();
  }


  initiate(){

      this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
      if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'));
      this.userData.userId=this.userInfo.user.userid;
      console.log(this.userInfo);


     let getloadingcontroller = this.loadingCtrl.presentWithGif2();

       this.userService.getData(AppSettings.API_STARTPOINT+'user/featuredplayer/'+this.userInfo.user.userid)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
            this.response=response;
            this.list=this.response.list;
            this.userInfo=this.list.user;
            for(var i = 0;i < this.list.length;i++)
            {
              //if(this.list[i].favoriteFlag===null)
                // this.list[i].favoriteFlag=0;
            }
           console.log(this.list);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeaturedPlayersPage');
  }


  markAsFav(item,val){
    console.log('vignesh');
    console.log(this.userInfo);
      let thisObj=this;

      thisObj.userData.favoriteUserId=item.userid;
      thisObj.userData.favoriteFlag=val;

      console.log(thisObj.userData);

    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
        this.userService.postData(AppSettings.API_STARTPOINT+'/user/favorite',this.userData)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.showToast('top','Marked as Favourite player')
           this.initiate();
           console.log(response);
          },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
  }


playerdetail(item){
  this.navCtrl.setRoot('PlayerDetailsPage',item);
  }

back(){
  this.navCtrl.setRoot('HomePage');
  }


 showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });
}


}
