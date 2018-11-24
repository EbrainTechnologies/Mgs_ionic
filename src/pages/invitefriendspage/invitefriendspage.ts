import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';

/**
 * Generated class for the InvitefriendspagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invitefriendspage',
  templateUrl: 'invitefriendspage.html',
})
export class InvitefriendspagePage {
  @ViewChild('slider') slider: Slides;
  page="0"
  hideMe:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  selectedTab(ind){
    this.slider.slideTo(ind);
  }
  moveButton($event) {
    this.page = $event._snapIndex.toString();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad InvitefriendspagePage');
  }

}
