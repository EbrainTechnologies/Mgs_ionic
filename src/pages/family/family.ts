import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

/**
 * Generated class for the FamilyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-family',
  templateUrl: 'family.html',
})
export class FamilyPage implements OnInit{

   public familyLists:any;
   public userId=''
   public userInfo:any;

  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

   ngOnInit(){
     this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'))
      this.userId=this.userInfo.user.userid;
      console.log(this.userInfo);
      this.familyList();
   }


    showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }


   familyList(){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'user/familymember/'+this.userId)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.familyLists=response;
           this.familyLists=this.familyLists.userFamilyList;
           console.log(this.familyLists);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FamilyPage');
  }
  back(){
    this.navCtrl.setRoot('MyProfilePage');
  }
  addFamily(){
   this.navCtrl.setRoot('ChooseFamilyTypePage'); 
  }
}
