import { Component } from '@angular/core';
import { Platform,ModalController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplashPage } from '../pages/splash/splash';
import { WelcomePage } from '../pages/welcome/welcome';
import { MenuPage } from '../pages/menu/menu';
import { EmailVerificationPage } from '../pages/email-verification/email-verification';

@Component({
  templateUrl: 'app.html'
})
export class MyApp{

  public userInfo:any;
  rootPage:any = this.init();
  footerIsHidden: boolean;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    modalCtrl:ModalController,
    public events: Events) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      // splashScreen.hide();
      let splash = modalCtrl.create(SplashPage);
      splash.present();
    });
    events.subscribe('hideHeader', (data) => {
      //this.footerIsHidden = data.isHidden;
    })
  }

    init(){
      let thisObj=this;
       thisObj.userInfo=JSON.parse(localStorage.getItem('userInfo'));
       if(thisObj.userInfo==null)
       {
          thisObj.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'));
            if(this.userInfo && this.userInfo.user.userid!=null)
               {
                   if(this.userInfo.user.isOtpVerified==0)
                   return 'EmailVerificationPage';
                   else
                   return 'MenuPage';
               }
            else
               return WelcomePage;
        }
        else
        {
          if(this.userInfo && this.userInfo.user.userid!=null)
              return 'MenuPage';
          else
              return WelcomePage;
        }
    }

}
