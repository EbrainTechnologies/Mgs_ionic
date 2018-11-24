import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';



@IonicPage()
@Component({
  selector: 'page-accessdeals',
  templateUrl: 'accessdeals.html',
})
export class AccessdealsPage implements OnInit{

  public userInfo:any=[{}];
  public response:any=[{}];
   public dealLists:any;

  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

   ngOnInit(){
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'))
    console.log(this.userInfo);
    this.dealList();
   }

    showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

  dealList(){
   
      let getloadingcontroller = this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'deal/getactivedeals')
         .subscribe(
         response => {
           
           this.dealLists=response;
           this.dealLists=this.dealLists.dealList;
           console.log(this.dealLists);
           this.loadingCtrl.dismiss();
           
       },
       error =>  {
         alert(error);
         
       });

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad AccessdealsPage');
  }


    back(){
    this.navCtrl.setRoot('HomePage')
    }

    MoreDetails(item){
      this.navCtrl.push('AccessdealsinnerPage',item)
    }
}
