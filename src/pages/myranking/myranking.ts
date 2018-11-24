import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';



@IonicPage()
@Component({
  selector: 'page-myranking',
  templateUrl: 'myranking.html',
})
export class MyrankingPage implements OnInit{

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

    public userSports:any;
    public rankingLevels:any;


  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

  ngOnInit(){
     let userdata=JSON.parse(localStorage.getItem('userInfo'));
    if(userdata==null)
      userdata=JSON.parse(localStorage.getItem('userRegisterDetail'))
      this.primarySport.userid=userdata.user.userid;
      console.log(this.primarySport.userid);
      this.initiate();
    
   }

   initiate(){
      this.selectSport();
      this.refreshUser(this.primarySport.userid);
   }



  refreshUser(userid){
       this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'sport/userexpertise/'+this.primarySport.userid)
         .subscribe(
         response => {
           this.response=response
           this.userSports=this.response.userExpertiseList;
           this.loadingCtrl.dismiss();
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
  }

 selectSport(){
      this.userService.getData(AppSettings.API_STARTPOINT+'/sport/rankinglevel/'+this.primarySport.userid)
         .subscribe(
         response => {
            this.response=response
           this.rankingLevels=this.response.rankingLevels;
       },
       error =>  {
         alert(error);
       });

   }

   sportChange(){
     this.loadingCtrl.presentWithGif2();
     this.userService.getData(AppSettings.API_STARTPOINT+'sport/playerranking/'+this.primarySport.userid)
         .subscribe(
         response => {
            this.response=response
            this.sportLists=this.response.playerRankings;
             this.loadingCtrl.dismiss();
       },
       error =>  {
         alert(error);
          this.loadingCtrl.dismiss();
       });

   }

    ionViewDidLoad() {
      console.log('ionViewDidLoad MyrankingPage');
    }

    back(){
      this.navCtrl.setRoot('MyProfilePage');
    }

    addrankpage(){
      this.navCtrl.setRoot('AddrankPage');
    }

}
