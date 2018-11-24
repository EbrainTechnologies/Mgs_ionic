import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ChooseFamilyTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-family-type',
  templateUrl: 'choose-family-type.html',
})
export class ChooseFamilyTypePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseFamilyTypePage');
  }

  goToMember(){
  	this.navCtrl.setRoot('FamilyCreatePage');
  }

  goToDatabase(){
  	this.navCtrl.setRoot('ChooseFamilyFromDatabasePage');
  }

}
