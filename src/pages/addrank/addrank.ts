import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddrankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addrank',
  templateUrl: 'addrank.html',
})
export class AddrankPage {
  sport;
  value;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddrankPage');
  }
  back(){
    this.navCtrl.setRoot('MyrankingPage');
  }
  onChange(sport){
    if (this.sport == '2'){
    this.value = 2; }
        else if (this.sport == '1'){
       this.value = 0; }
}
}
