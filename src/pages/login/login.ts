import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {LoadingProvider} from '../../providers/loading/loading';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AppContext } from '../../providers/shared/app-context';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    userData = {"userName": "","password": ""};
    public response:any;
    public errorMessage:any;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService:AuthServiceProvider,
    public loadingCtrl: LoadingProvider,
    private appContext: AppContext) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

  login(){   
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
        this.authService.postData(this.userData,'signup')
         .subscribe(
         response => {
                      this.loadingCtrl.dismiss();
                      this.response=response;
                      console.log(response);
                   if(this.response.status==1)
                   {
                     this.appContext.setUserInfo(this.response);
                     //this.showToast('top',this.response.message);
                     this.navCtrl.setRoot('MenuPage')    
                   } 
                   else
                   {
                     this.showToast('top',this.response.error);
                   }
                },
          error =>  {
            this.showToast('top',error);
            this.loadingCtrl.dismiss();
          });

         }


   forgetPassword(){
   this.navCtrl.setRoot('WelcomePage');
   }

   regPage(){
    this.navCtrl.setRoot('RegisterPage');
   }

   


}
