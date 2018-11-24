import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';


@IonicPage()
@Component({
  selector: 'page-select-your-ranking',
  templateUrl: 'select-your-ranking.html',
})
export class SelectYourRankingPage implements OnInit{

  public event = {
    month: '',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }
  public sportId='';
  public response:any=[{}];
  public responses:any=[{}];
  public rankingTypes:any;
  public rankingLevels:any;
  public rankType='';
  public rankLevel='';


  public saveUserPrimaryRank={
                              "userid": "",
                              "displayName": "",
                              "sportId": "",
                              "sportName": "",
                              "rankLevelId": "",
                              "rankLevelName": "",
                              "position": "",
                              "fromDate": "", 
                              "isPrimary": 1,
                              "status": 1
                              }


  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

   ngOnInit(){
    let userData=JSON.parse(localStorage.getItem('userRegisterDetail'));
    this.saveUserPrimaryRank.userid=userData.user.userid;
    this.saveUserPrimaryRank.displayName=userData.user.displayName;
    let sportdata=JSON.parse(localStorage.getItem('sportInfo'));
    console.log(sportdata);
    this.sportId=sportdata.userExpertiseList[0].sportId;
    this.saveUserPrimaryRank.sportId=this.sportId;
    this.saveUserPrimaryRank.sportName=sportdata.userExpertiseList[0].sportName;
    this.selectRankType(this.sportId);
   }

    showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }


   selectRankType(sId){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'sport/rankingtype/'+sId)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           this.rankingTypes=this.response.rankingTypes;
           console.log(this.rankingTypes);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

   }

   RankChange(){
    console.log(this.rankType);
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'sport/rankinglevel/'+this.rankType)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.responses=response
           this.rankingLevels=this.responses.rankingLevels;
           console.log(this.rankingLevels);
          
          
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
   }

   saveRank(){
      console.log(this.saveUserPrimaryRank);
      for(var i =0;i<this.rankingLevels.length;i++)
      {
        if(this.rankingLevels[i].rankLevelId==this.saveUserPrimaryRank.rankLevelId)
        {
         this.saveUserPrimaryRank.rankLevelName=this.rankingLevels[i].name;
         break; 
        }
      }
      console.log(this.saveUserPrimaryRank);

      let getloadingcontroller = this.loadingCtrl.presentWithGif2();
        this.userService.postData(AppSettings.API_STARTPOINT+'sport/playerranking',this.saveUserPrimaryRank)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           this.showToast('top',this.response.message);
           this.navCtrl.setRoot('SelectOtherSportPage');
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
   }




  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectYourRankingPage');
  }
  
  goToOtherSport(){
  this.navCtrl.setRoot('SelectOtherSportPage');
  }

}
