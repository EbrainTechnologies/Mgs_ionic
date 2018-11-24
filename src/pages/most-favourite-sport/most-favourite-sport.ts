import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

@IonicPage()
@Component({
  selector: 'page-most-favourite-sport',
  templateUrl: 'most-favourite-sport.html',
})
export class MostFavouriteSportPage implements OnInit{

  public sportLists:any;

  public primarySport:any={
                            "userid":"",
                            "displayName":"Primary Sport",
                            "sportId":"",
                            "sportName":"",
                            "orderBy":'',
                            "status":''
                          };
  public response:any=[{}];

  public startpoint=AppSettings.API_STARTPOINT;

  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

  ngOnInit(){
    let userdata=JSON.parse(localStorage.getItem('userRegisterDetail'));
    this.selectSport();
    this.primarySport.userid=userdata.user.userid;
   }

    showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MostFavouriteSportPage');
  }
  
  goToRanking(primarySelectedSport){
     
      this.primarySport.sportId=primarySelectedSport.sportId;
      this.primarySport.sportName=primarySelectedSport.name;
      this.primarySport.orderBy=primarySelectedSport.orderBy;
      this.primarySport.status=primarySelectedSport.status;
     console.log(this.primarySport);

      let getloadingcontroller = this.loadingCtrl.presentWithGif2();
        this.userService.postData(AppSettings.API_STARTPOINT+'sport/userexpertise',this.primarySport)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           console.log(this.response);
            localStorage.setItem('sportInfo',JSON.stringify(this.response));
           this.navCtrl.setRoot('SelectYourRankingPage');
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });


 
  }

  selectSport(){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'sport/sport/')
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.sportLists=response;
           this.sportLists=this.sportLists.sportsList;
           console.log(this.sportLists);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

   }

}
