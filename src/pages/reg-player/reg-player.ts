import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {LoadingProvider} from '../../providers/loading/loading';
/**
 * Generated class for the RegPlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reg-player',
  templateUrl: 'reg-player.html',
})
export class RegPlayerPage implements OnInit {

   public regDetail = {
    "userid": null,
    "identifier":null,
    "emailid": "",
    "password": "",
    "cPassword":"",
    "userType":"",
    "userName": "",
    "createdFrom": null,
    "isRestricted": null,
    "timezone": null,
    "defaultLanguage": null,
    "lastLogin": null,
    "emailViewed": null,
    "pushViewed": null,
    "externalReference": null,
    "status": null,
  };
   
    public response:any;
    public errorMessage:any;
    public alldata =[];

     public type = 'password';
     public type2 = 'password';
     public showPass = false;
     public showPass2 = false;
     public PassVal:boolean=false;


     public cPassVal:boolean=false;

  constructor(public toastCtrl: ToastController,public navCtrl: NavController, 
    public navParams: NavParams,public authService:AuthServiceProvider, public loadingCtrl: LoadingProvider) {
  }

  ngOnInit(){
   var d=JSON.parse(localStorage.getItem('userRegisterDetail'));
    if(d!=null)
    this.regDetail=JSON.parse(localStorage.getItem('userRegisterDetail'));
    console.log(this.navParams.data);
    this.regDetail.userType=this.navParams.data;
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegPlayerPage');
  }

  register(){
         localStorage.removeItem('this.regDetail');
         this.navCtrl.push('RegisterPage');  
  }
  
	regreference(){
    if(this.regDetail.password!=this.regDetail.cPassword)
    {
      this.showToast('top','Given passwords does not matched');
    } 
     else
     {   
         let thisObj=this;
         thisObj.regDetail.userName=thisObj.regDetail.emailid;
         let getloadingcontroller = this.loadingCtrl.presentWithGif2();
         this.authService.verifyEmail({emailid:this.regDetail.emailid})
         .subscribe(
         response => {
          this.loadingCtrl.dismiss();
          this.alldata= response
          this.response=response;
         if(this.response)
         {
           if(this.response.status==1)
           {
            localStorage.setItem('userRegisterDetail',JSON.stringify(this.regDetail));
            this.navCtrl.push('RegReferencePage');  
           }
           else{
               this.showToast('top',this.response.error);
           } 
         }
       },
       error =>  {
        this.showToast('top','Email Id already Exists');
        this.loadingCtrl.dismiss();
       });



      
     }
  }




  showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

  showPassword() {
    this.showPass = !this.showPass;
 
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  showCPassword() {
    this.showPass2 = !this.showPass2;
 
    if(this.showPass2){
      this.type2 = 'text';
    } else {
      this.type2 = 'password';
    }
  }


 passwordValueValidator() {
  console.log(this.regDetail.password);
  if (this.regDetail && this.regDetail.password != undefined) 
  {
    if (!this.regDetail.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
      this.PassVal=true;
      return { 'invalidPassword': true };
    }
    else{
      this.PassVal=false;
    }
  }


}

 cPasswordValueValidator() {
  console.log(this.regDetail.cPassword);
  if (this.regDetail && this.regDetail.cPassword != undefined) 
  {
    if (!this.regDetail.cPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
      this.cPassVal=true;
      return { 'invalidPassword': true };
    }
    else{
      this.cPassVal=false;
    }
  }


}


}
