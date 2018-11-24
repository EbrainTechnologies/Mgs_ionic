import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';
declare var google:any;
import { MapsAPILoader } from '@agm/core';
import {FormControl} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html',
})
export class AddAddressPage implements OnInit{

  public userData:any = {
                          "name": "",
                          "street1": "",
                          "street2": "",
                          "city": "",
                          "statecode": "",
                          "postcode": "",
                          "countrycode": "",
                          "formattedAddress": "",
                          "latitude":  '',
                          "longitude": '',
                          "isPrimary": 0,
                          "status": 1
                       };
  public userInfo:any=[{}];
  public userAddressDatas={};
  public response:any;
  public place:any={'name':''};


  public google:String;
  public searchControl: FormControl;
  public autocomplete:any;

  constructor(public toastCtrl: ToastController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public userService:UserServiceProvider,
              private mapsAPILoader: MapsAPILoader,
              public loadingCtrl: LoadingProvider) {
                this.searchControl = new FormControl();
              }

   ngOnInit(){

    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'))
    console.log(this.userInfo);
    this.searchControl = new FormControl();
    let thisObj=this;

    this.mapsAPILoader.load().then(() => {
      let nativeHomeInputBox = document.getElementById('street1').getElementsByTagName('input')[0];
      let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {

      });
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
               this.place = autocomplete.getPlace();
               console.log(this.place);
               console.log(thisObj.userData);

                thisObj.userData.street1=this.place.address_components[0].long_name;
                thisObj.userData.street2=this.place.address_components[1].long_name;
                thisObj.userData.formattedAddress=this.place.formatted_address;
                thisObj.userData.longitude=this.place.geometry.location.lng();
                thisObj.userData.latitude=this.place.geometry.location.lat();
                for (var i = 0; i < this.place.address_components.length; i++)
                 {
                   for(var j = 0; j < this.place.address_components[i].types.length; j++)
                    {
                     if (this.place.address_components[i].types[j] == "postal_code")
                     {
                     thisObj.userData.postcode = this.place.address_components[i].long_name;
                     }
                     if (this.place.address_components[i].types[j] == "country")
                     {
                     thisObj.userData.countrycode = this.place.address_components[i].long_name;
                     }
                     if (this.place.address_components[i].types[j] == "administrative_area_level_1")
                     {
                     thisObj.userData.statecode = this.place.address_components[i].long_name;
                     }
                     if (this.place.address_components[i].types[j] == " administrative_area_level_2")
                     {
                     thisObj.userData.city = this.place.address_components[i].long_name;
                     }
                   }
                 }
             });
         });


   }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAddressPage');
  }

  showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }


  updateAddress(){
    let thisObj=this;
    thisObj.userData.isPrimary=(thisObj.userData.isPrimary==true)?1:0;
    this.userAddressDatas={"user":{'userid':this.userInfo.user.userid},"address":this.userData};
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
        this.userService.postData(AppSettings.API_STARTPOINT+'user/useraddress',this.userAddressDatas)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           this.showToast('top',this.response.message);
           this.resetForm();
           this.navCtrl.setRoot('MyAddressPage');
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });
  }

  resetForm(){
    this.userData.name="";
    this.userData.street1="";
    this.userData.street2="";
    this.userData.city="";
    this.userData.statecode="";
    this.userData.postcode="";
    this.userData.countrycode="";
    this.userData.formattedAddress="";
    this.userData.latitude='';
    this.userData.longitude='';
    this.userData.isPrimary=0;
    this.userData.status='';
  }

  back(){
  this.navCtrl.setRoot('MyAddressPage');
  }

}
