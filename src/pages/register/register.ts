import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Location} from '@angular/common';
import { WelcomePage } from '../welcome/welcome'
import {LoadingProvider} from '../../providers/loading/loading';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public _location:Location,public loading: LoadingProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  previousPage(){
    this.presentLoading();
         this.navCtrl.push(WelcomePage);
  }

  registration(type){
    this.presentLoading();
    var d=JSON.parse(localStorage.getItem('userRegisterDetail'));
    if(d!=null)
      localStorage.removeItem('userRegisterDetail');
         this.navCtrl.push('RegPlayerPage',type);  
  }

  presentLoading() {
    const loader = this.loading.presentWithGif2();
    ({
      duration: 500
    });
    this.loading.dismiss()
  }
}
