import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { EmailVerificationServiceProvider } from '../../providers/auth-service/emailverify-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {LoadingProvider} from '../../providers/loading/loading';
import { AppContext } from '../../providers/shared/app-context';

@IonicPage()
@Component({
  selector: 'page-reg-player-detail',
  templateUrl: 'reg-player-detail.html',
})
export class RegPlayerDetailPage {

   regPlayerDetail = {"firstName": "","lastName": "","displayName":'','birthDate':'','sex':''};

   public event = {
    month: '',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }
  public response:any;
  public message:any;
  public age:number=0;

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private verificationService:EmailVerificationServiceProvider,
    private authService:AuthServiceProvider,
    private loadingCtrl: LoadingProvider,
    private appContext: AppContext) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegPlayerDetailPage');
  }

  regreference(){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
         this.navCtrl.push('RegReferencePage');
         this.loadingCtrl.dismiss();
  }


   calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}




  emailverify(){

          this.age = this.calculate_age(new Date(this.regPlayerDetail.birthDate))
          var olditems=[];
          olditems=JSON.parse(localStorage.getItem('userRegisterDetail'));
          var newItems = Object.assign({}, olditems,this.regPlayerDetail);
          localStorage.setItem('userRegisterDetail',JSON.stringify(newItems));
          var items2=JSON.parse(localStorage.getItem('userRegisterDetail'));
          console.log(items2.userType);

            if(items2 && items2.userType=='Player')
               {
                   if(this.age>=13)
                   {
                   this.userRegistraion();
                   }
                   else
                   {
                    this.showToast('top'," Sorry, the entered DOB indicates that you are not eligible for our application. Ask your parent or guardian to create an account and add you  a family member! ");
                   }
               }

            if(items2 && items2.userType=='Coach')
               {
                   if(this.age>=18)
                   {
                    this.userRegistraion();
                   }
                   else
                   {
                    this.showToast('top'," Sorry, the entered DOB indicates that you are not eligible for our application. Ask your parent or guardian to create an account and add you  a family member! ");
                   }
                }

              if(items2 && items2.userType=='Parent')
               {
                   if(this.age>=21)
                   {
                    this.userRegistraion();
                   }
                   else
                   {
                    this.showToast('top'," Sorry, the entered DOB indicates that you are not eligible for our application. Ask your parent or guardian to create an account and add you  a family member! ");
                   }
               }
  }

  userRegistraion(){



          var olditems=[];
          olditems=JSON.parse(localStorage.getItem('userRegisterDetail'));
          var newItems = Object.assign({}, olditems,this.regPlayerDetail);
          localStorage.setItem('userRegisterDetail',JSON.stringify(newItems));
          var items2=JSON.parse(localStorage.getItem('userRegisterDetail'));
          console.log(items2.userType);


           let getloadingcontroller = this.loadingCtrl.presentWithGif2();
          this.authService.userRegistration(items2).subscribe(
            response=>{
              this.loadingCtrl.dismiss();

              if(response)
              {
                console.log(response);
                this.response=response
                localStorage.setItem('userRegisterDetail',JSON.stringify(this.response));
              //  this.appContext.setUserInfo(this.response);
                this.sendOtp();
              }
            },
            error=>{}
            );

  }

  sendOtp(){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
          this.verificationService.userEmailVerify({'userid':this.response.user.userid})
          .subscribe(     response => {
            this.loadingCtrl.dismiss();
            console.log(response)
            this.message=response;
            if(this.message)
            {
               this.showToast('top',this.message.message);
            }
             this.navCtrl.push('EmailVerificationPage');
             },  error =>
          {});
  }


 showToast(position: string,message:string) {
  let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }


}
