import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { EmailVerificationServiceProvider } from '../../providers/auth-service/emailverify-service';
import {LoadingProvider} from '../../providers/loading/loading';

/**
 * Generated class for the EmailVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-email-verification',
  templateUrl: 'email-verification.html',
})
export class EmailVerificationPage {

  public verification:any = { "userid": null, "emailid": "",  "otp": "" }
  public errorMessage:any;
  public response:any={'responsecode':''};

  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,
     public verifyService:EmailVerificationServiceProvider,public loadingCtrl: LoadingProvider) {
  }
  ngOnInit(){
    var checkData=JSON.parse(localStorage.getItem('userRegisterDetail'));
    console.log(checkData);

    //this.verification.otp=JSON.stringify(this.navParams.data);
   // this.verification=JSON.parse(localStorage.getItem('userRegisterDetail'));


  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailVerificationPage');
  }

  welcomeslider(){

  }
  showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }
  register_verification(){
    var items:any=[];
    items=JSON.parse(localStorage.getItem('userRegisterDetail'));

   
    this.verification.emailid=items.user.emailid;
    this.verification.userid=items.user.userid;

     console.log('verification array:');
     console.log(this.verification);

     this.loadingCtrl.presentWithGif2();
     this.verifyService.userEmailVerifyValidate(this.verification,'verify')
              .subscribe(
               response => {
                this.loadingCtrl.dismiss();
                console.log(this.response)

                if(response)
                  {
                    this.loadingCtrl.dismiss();
                    this.response=response;
                    console.log(this.response);
                    this.showToast('top',this.response.message);
                    this.navCtrl.push('WelcomeSliderPage');

                  }
                else
                  alert('Code does not matched');
            },
            error =>  {
              alert(error);
              this.loadingCtrl.dismiss();
            });

  }
  resendotp(){
     var items:any=[];
    items=JSON.parse(localStorage.getItem('userRegisterDetail'));
    console.log(items);
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
     this.verifyService.userEmailVerify({'userid':items.user.userid})
              .subscribe(
               response => {
                this.loadingCtrl.dismiss();
                this.response=response;
                console.log(this.response);
                this.showToast('top',this.response.message);

            },
            error =>  {
              alert(error);
              this.loadingCtrl.dismiss();
            });

  }
}
