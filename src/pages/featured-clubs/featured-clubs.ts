import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FeaturedClubsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-featured-clubs',
  templateUrl: 'featured-clubs.html',
})
export class FeaturedClubsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeaturedClubsPage');
  }

  back(){
  this.navCtrl.setRoot('HomePage');
  }

  groundDetails(){
  this.navCtrl.setRoot('GroundDetailsPage');
  }

}
