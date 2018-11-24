import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';


@IonicPage()
@Component({
  selector: 'page-choose-family-from-database',
  templateUrl: 'choose-family-from-database.html',
})
export class ChooseFamilyFromDatabasePage implements OnInit{
 public searchResult:any;
 public response:any;
 public items;
 public searchData:any={
                        "userid":"",
                        "familyMemberUserId":"",
                        "actionType":"ISUSER"
                        }
public memberName:any;
public userInfo:any=[{}];
public showData='';
   constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }


  ngOnInit(){
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'))
    this.searchData.userid=this.userInfo.user.userid;
    this.searchFamily();
   }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseFamilyFromDatabasePage');
  }

  searchFamily(){

          this.userService.getData(AppSettings.API_STARTPOINT+'user/familymember/'+this.searchData.userid)
         .subscribe(
         response => {
          
           this.searchResult=response;
           this.searchResult=this.searchResult.userFamilyList;
           console.log(this.searchResult);
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

  }


  

  getItems() {
    console.log(this.memberName);
    if(this.searchResult && this.searchResult.length>0)
            {
               
               for(var i=0;i<this.searchResult.length;i++)
                {
                  if(this.memberName==this.searchResult[i].firstName)
                  {
                    this.showData=this.searchResult[i].firstName;
                    this.searchData.familyMemberUserId=this.searchResult[i].userid;
                  }
                  console.log('searching');
                }
             }
            else
            {
              this.searchResult=[];
            }
 }


  back(){
  	this.navCtrl.setRoot('FamilyPage');
  }

   showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }


  selectMember(){
    if(confirm('Are You Sure?'))
    {

    console.log(this.searchData);
            let getloadingcontroller = this.loadingCtrl.presentWithGif2();
        this.userService.postData(AppSettings.API_STARTPOINT+'user/familymember',this.searchData)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           this.showToast('top',this.response.message);
           this.navCtrl.setRoot('FamilyPage');
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
  }
 }

}
