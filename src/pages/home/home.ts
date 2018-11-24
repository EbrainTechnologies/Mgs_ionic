import { Component, OnInit } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ToastController } from 'ionic-angular';
import { HomeServiceProvider } from '../../providers/auth-service/home-service';
import { LoadingProvider } from '../../providers/loading/loading';
import {AppSettings} from '../../app/app-settings';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

 
  
  public errorMessage: any;
  public response:any;
  public list:any;
  public startPoint=AppSettings.API_STARTPOINT;

  constructor(public app: App, public navCtrl: NavController, public homeService: HomeServiceProvider, public loadingCtrl: LoadingProvider) {

  }

  ngOnInit() {
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
    this.homeService.postData()
      .subscribe(
        response => {
          this.loadingCtrl.dismiss();
          this.response = response;
          this.list=this.response.cards;
          console.log(response);
        },
        error => this.errorMessage = <any>error);
  }




  goToDetail(page) {
       switch(page) {
          case 'SESSION':
              this.navCtrl.push('SessionPage');
              break;
          case 'FINDVENUE':
               this.loadingCtrl.presentWithGif2();
               this.navCtrl.push('FindVenuePage');
               this.loadingCtrl.dismiss();
              break;
          case 'FINDPLAYERS':
               this.navCtrl.push('NearByPlayerPage');
              break;  
          case 'FINDRANKING':
               this.loadingCtrl.presentWithGif2();
               this.navCtrl.setRoot('FindRankingPage');
               this.loadingCtrl.dismiss();
              break;  
          case 'DEALS':
               this.loadingCtrl.presentWithGif2();
               this.navCtrl.setRoot('AccessdealsPage');
               this.loadingCtrl.dismiss();
              break;
          case 'EVENTS':
               this.navCtrl.push('EventsPage');
          break;
    }
  }

  logout() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRegisterDetail');
    const root = this.app.getRootNav();
    root.setRoot('LoginPage');
    console.log('log out');
  }


  fplayer(){
     this.navCtrl.setRoot('FeaturedPlayersPage');
       this.loadingCtrl.dismiss();
  }

  
      

 

}
