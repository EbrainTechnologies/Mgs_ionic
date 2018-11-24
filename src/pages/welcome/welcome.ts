import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { LoadingController } from 'ionic-angular';
import {LoadingProvider} from '../../providers/loading/loading';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, public loading: LoadingProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  goToLogin(){
    this.presentLoading();
         this.navCtrl.push(LoginPage);
  }

  goToSignUp(){
    this.presentLoading();
         this.navCtrl.push('EventRegistrationPage');	
  }

  register(){
         this.presentLoading();
         this.navCtrl.push('RegisterPage');  
  }


    presentLoading() {
    const loader = this.loading.presentWithGif2();
    ({
      duration: 500
    });
    this.loading.dismiss()
  }




}
