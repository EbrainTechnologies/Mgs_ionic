import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides, App } from 'ionic-angular';

/**
 * Generated class for the SlidesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams,private app:App) {
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex==3){
      let _app= this.app.getRootNav();
      // this.slides.stopAutoplay();
      _app.push('LoginPage')
      // this.navCtrl.setRoot('SignupPage');
    }
  }

}
