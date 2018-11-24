import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

/**
 * Generated class for the SelectSportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-sports',
  templateUrl: 'select-sports.html',
})
export class SelectSportsPage implements OnInit {

    public userSports:any=[{}];
    public primarySports:any=[{}];
    public secondarySports:any=[{}];
    public response:any;
    public response2:any;
    public sportLists:any=[{}];
    public startpoint=AppSettings.API_STARTPOINT;
    public primaryExpertise =   {
                                  "userid":"",
                                  "sportId":"",
                                  "sportName":""
                                }

       public userExpertise =  {
                                  "userid": "",
                                  "displayName": "Seconday",
                                  "sportId": "",
                                  "sportName": "",
                                  "orderBy": 2,
                                  "status": 1,
                                  "userCertifications": null
                                }


  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }


   ngOnInit(){
    this.initiate()
   }

   initiate(){
    let userdata=JSON.parse(localStorage.getItem('userInfo'));
    if(userdata==null)
      userdata=JSON.parse(localStorage.getItem('userRegisterDetail'))
      this.primaryExpertise.userid=userdata.user.userid;
      this.userExpertise.userid=userdata.user.userid;
      this.refreshUser(userdata.user.userid);
      this.selectotherSport(userdata.user.userid);
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
    console.log('ionViewDidLoad AboutMePage');
  }

  back(){
  this.navCtrl.setRoot('MyProfilePage');
  }

  

  refreshUser(userid){
   this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'sport/userexpertise/'+userid)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response
           this.userSports=this.response.userExpertiseList;
           console.log(this.userSports);
           for(var i=0;i<this.userSports.length;i++)
           {
                if(this.userSports[i].isPrimary && this.userSports[i].isPrimary==true)
                    this.primarySports=this.userSports[i];
                if(!this.userSports[i].isPrimary && this.userSports[i].isPrimary==false)
                    this.secondarySports.push(this.userSports[i]);
                    //this.secondarySports=this.userSports[i];
           }
           this.secondarySports.shift();
           console.log(this.secondarySports);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
  }

   selectotherSport(id){
         this.userService.getData(AppSettings.API_STARTPOINT+'sport/getothersports/'+id)
         .subscribe(
         response => {
           this.response2=response
           this.sportLists=this.response2.sportList;
           this.refreshUser(this.userExpertise.userid);
           this.loadingCtrl.dismiss();
         },
         error =>  {
           alert(error);
         });
    }

    changePrimary(sport){
       if(confirm('Are You Sure?'))
       {
        this.loadingCtrl.presentWithGif2();
        this.primaryExpertise.sportId=sport.sportId;
        this.primaryExpertise.sportName=sport.name;
        this.userService.postData(AppSettings.API_STARTPOINT+'sport/updateprimaryexpertise',this.primaryExpertise)
          .subscribe(
           response => {
            this.loadingCtrl.dismiss();
            this.response=response;
            this.refreshUser(this.userExpertise.userid);
            this.showToast('top',this.response.message);
           

         },
         error =>  {
          alert(error);
          this.loadingCtrl.dismiss();
         });
        
       }
    }

    deleteSport(sport){
       if(confirm('Are You Sure want to delete the sport'))
       {
            
                 this.loadingCtrl.presentWithGif2();
                 this.userService.deleteData(AppSettings.API_STARTPOINT+'sport/removeexpertise/'+this.primaryExpertise.userid+'/'+sport.sportId)
                   .subscribe(
                   response => {
                        this.showToast('top',this.response.message);
                       this.loadingCtrl.dismiss();
                       this.response=response;
                       this.selectotherSport(this.userExpertise.userid);
                 },
                 error =>  {
                   alert(error);
                   this.loadingCtrl.dismiss();
                 });


       }

     }


     addSport(sport){
             console.log(sport);
             if(confirm('Are you Sure want to add the sport')){
             this.userExpertise.sportName=sport.name;
             this.userExpertise.sportId=sport.sportId;
             this.loadingCtrl.presentWithGif2();
             this.userService.postData(AppSettings.API_STARTPOINT+'sport/userexpertise',this.userExpertise)
               .subscribe(
               response => {
                   this.response=response;
                       this.userSports=this.response.userExpertiseList;
                      for(var i=0;i<this.userSports.length;i++)
                     {
                      if(this.userSports[i].isPrimary && this.userSports[i].isPrimary==true)
                          this.primarySports=this.userSports[i];
                      if(!this.userSports[i].isPrimary && this.userSports[i].isPrimary==false)
                          this.secondarySports.push(this.userSports[i]);
                          //this.secondarySports=this.userSports[i];
                     }
                   this.loadingCtrl.dismiss();
                   this.showToast('top',this.response.message);
                   this.selectotherSport(this.userExpertise.userid);
               },
             error =>  {
               alert(error);
               this.loadingCtrl.dismiss();
             });
          }
       
       }


}
