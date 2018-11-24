import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ErrorbookingServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-errorbooking-service',
  templateUrl: 'errorbooking-service.html',
})
export class ErrorbookingServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErrorbookingServicePage');
  }

  back(){
  this.navCtrl.setRoot('InvitingPlayerPage');
  }

  playerinvite(){
  this.navCtrl.setRoot('PlayerInviteFormPage');
  }

}

