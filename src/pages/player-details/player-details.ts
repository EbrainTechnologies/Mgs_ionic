import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';


@IonicPage()
@Component({
  selector: 'page-player-details',
  templateUrl: 'player-details.html',
})
export class PlayerDetailsPage {

   public userInfo:any=[{}];
  public playerInfo:any;
   public startPoint=AppSettings.API_STARTPOINT;

 constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {

  }

  ngOnInit(){
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'));
    this.playerInfo=this.navParams.data;
    console.log(this.playerInfo);
    if(this.playerInfo && this.playerInfo.user)
    this.playerInfo=this.playerInfo.user;
    else
    this.playerInfo=this.playerInfo;

  }

 calculateAge(birthday)
 {
   // birthday is a date
    var ageDifMs = Date.now() - birthday;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
 }

 back(){
   if(this.playerInfo && this.playerInfo.user)
   this.navCtrl.setRoot('FeaturedPlayersPage');
   else
   this.navCtrl.setRoot('FavouriteplayersPage');
   }

}
