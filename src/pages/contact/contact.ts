import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
	public response:any;
	public userData={
		              'userid':'',
                  'name':'',
                  'emailid':'',
                  'type':'',
                  'phoneNumber':'',
                  'message':''

	                }


   constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

   ngOnInit(){
    let userData=JSON.parse(localStorage.getItem('userInfo'));
    if(userData==null)
      userData=JSON.parse(localStorage.getItem('userRegisterDetail'));
      console.log(userData);
      this.userData.userid=userData.userid;
    }
     
     showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

    send(){
    console.log(this.userData);
    this.loadingCtrl.presentWithGif2();
        this.userService.postData(AppSettings.API_STARTPOINT+'support/createenquiry',this.userData)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           console.log(this.response)
           this.showToast('top',this.response.message);
           this.resetForm();
          
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
         
    }

    resetForm(){
       this.userData.name='';
       this.userData.type='';
       this.userData.emailid='';
       this.userData.phoneNumber='';
       this.userData.message='';

    }

    

}
