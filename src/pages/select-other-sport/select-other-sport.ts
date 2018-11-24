import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';



@IonicPage()
@Component({
  selector: 'page-select-other-sport',
  templateUrl: 'select-other-sport.html',
})
export class SelectOtherSportPage implements OnInit{
  public response:any=[{}];
  public sportLists:any;

  public secondarySport:any={
                            "userid":"",
                            "displayName":"Secondary Sport",
                            "sportId":"",
                            "sportName":"",
                            "orderBy":2,
                            "status":''
                          };

  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

  ngOnInit(){
    let userdata=JSON.parse(localStorage.getItem('userRegisterDetail'));
     this.secondarySport.userid=userdata.user.userid;
     this.selectotherSport(this.secondarySport.userid);
   }

   showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

  goToHome(secondarySelectedSport){
     
      this.secondarySport.sportId=secondarySelectedSport.sportId;
      this.secondarySport.sportName=secondarySelectedSport.name;
      this.secondarySport.status=secondarySelectedSport.status;
      console.log(this.secondarySport);

     let getloadingcontroller = this.loadingCtrl.presentWithGif2();
        this.userService.postData(AppSettings.API_STARTPOINT+'sport/userexpertise',this.secondarySport)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           console.log(this.response);
           this.navCtrl.setRoot('MenuPage')  
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });


   
  }



  selectotherSport(id){
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'sport/getothersports/'+id)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response
           this.sportLists=this.response.sportList;
           console.log(this.sportLists);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

   }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectOtherSportPage');
  }

  skipHome(){
   this.navCtrl.setRoot('MenuPage')  
  }

}
