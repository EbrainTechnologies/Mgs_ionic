import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

/**
 * Generated class for the FindRankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find-ranking',
  templateUrl: 'find-ranking.html',
})
export class FindRankingPage {

public response:any;
  public userData={
                  'firstName':'',
                  'lastName':'',
                  'location':'',
                  'action':'',
                  'search':'',

                  }


   constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindRankingPage');
  }

  back(){
    this.navCtrl.setRoot('HomePage');
  }
  findRank(){
  	alert('api');
  }

}

