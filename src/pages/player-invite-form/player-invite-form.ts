import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlayerInviteFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player-invite-form',
  templateUrl: 'player-invite-form.html',
})
export class PlayerInviteFormPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerInviteFormPage');
  }

  back(){
  this.navCtrl.setRoot('ErrorbookingServicePage');
  }

  requestlist(){
  this.navCtrl.setRoot('RequestPlayerListPage');
  }

}
