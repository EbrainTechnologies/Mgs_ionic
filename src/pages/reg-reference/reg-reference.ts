import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {FormControl} from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {LoadingProvider} from '../../providers/loading/loading';
declare var google:any;


@IonicPage()
@Component({
  selector: 'page-reg-reference',
  templateUrl: 'reg-reference.html',
})
export class RegReferencePage implements OnInit {
  
 public regRefDetail : any= {
     'useraddress': '',
     'reference': '',
     'acctType': 'CLUB',
     'acctStatus': '',
     'referenceId':'',
      'phoneNumber':'',
     "userLocation": {
                  "name": "",
                  "street1": "",
                  "street2": "",
                  "city": "",
                  "statecode": "",
                  "postcode": "",
                  "countrycode": "",
                  "formattedAddress": "",
                  "latitude": 75.989,
                  "longitude": -65.7485748,
                  "isPrimary": 1,
                  "status": 1
                }
                
    };

 public place:any={'name':''};
 public searchResult:any;
 public response:any;

 public items;
   

 
  public google:String;
  public searchControl: FormControl;
  public autocomplete:any;

  constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,
    private mapsAPILoader: MapsAPILoader, public authService:AuthServiceProvider,public loadingCtrl: LoadingProvider) {
    this.searchControl = new FormControl();

    

  }

  ngOnInit(){
    let thisObj=this;
   var checkData=JSON.parse(localStorage.getItem('userRegisterDetail'));
   
    if(checkData.useraddress!=null)
    this.regRefDetail=JSON.parse(localStorage.getItem('userRegisterDetail'));


    this.searchControl = new FormControl();
     //load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
       let nativeHomeInputBox = document.getElementById('location').getElementsByTagName('input')[0];
       let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
           types: ['(cities)']
       });
       google.maps.event.addListener(autocomplete, 'place_changed', function() {
                this.place = autocomplete.getPlace();
                console.log(this.place);
                console.log(thisObj.regRefDetail);
                 
                 thisObj.regRefDetail.useraddress=this.place.name;
                 thisObj.regRefDetail.userLocation.name=this.place.name;
                 thisObj.regRefDetail.userLocation.street1=this.place.address_components[0].long_name;
                 thisObj.regRefDetail.userLocation.street2=this.place.address_components[1].long_name;
          //thisObj.regRefDetail.userLocation.city=this.place.address_components[2].long_name;
                 thisObj.regRefDetail.userLocation.formattedAddress=this.place.formatted_address;
                 thisObj.regRefDetail.userLocation.longitude=this.place.geometry.location.lng();
                 thisObj.regRefDetail.userLocation.latitude=this.place.geometry.location.lat(); 
                 


                   for (var i = 0; i < this.place.address_components.length; i++)
                  {
                    for(var j = 0; j < this.place.address_components[i].types.length; j++)
                     { 

                      if (this.place.address_components[i].types[j] == "postal_code") 
                      {
                      thisObj.regRefDetail.userLocation.postcode = this.place.address_components[i].long_name;
                      }

                      if (this.place.address_components[i].types[j] == "country") 
                      {
                      thisObj.regRefDetail.userLocation.countrycode = this.place.address_components[i].long_name;
                      }

                      if (this.place.address_components[i].types[j] == "administrative_area_level_1") 
                      {
                      thisObj.regRefDetail.userLocation.statecode = this.place.address_components[i].long_name;
                      }

                       if (this.place.address_components[i].types[j] == " administrative_area_level_2") 
                      {
                      thisObj.regRefDetail.userLocation.city = this.place.address_components[i].long_name;
                      }

                     }
                   }
                
              
            });
         
           
           
   });

     
}

  ionViewDidLoad() {
   

  }

  regplayer(){
         this.navCtrl.push('RegPlayerPage');  
  }
  
  initializeItems(key) {
    this.authService.reference(key)
          .subscribe(     response => 
          {   
            this.response=response;

            console.log(response)
            if(this.response.userList && this.response.userList.length>0)
            {
               this.searchResult=this.response.userList;
               for(var i=0;i<this.searchResult.length;i++)
                console.log(this.searchResult[i].firstName)
             }
            else
            {
              this.searchResult=[];
            }
          },error =>{

               });
  }


  getItems(ev) {
    this.initializeItems(this.regRefDetail.reference);
    return ev;
 }


   
  regplayerdetail(){
           console.log(this.regRefDetail);

          var items=[];
          items=JSON.parse(localStorage.getItem('userRegisterDetail'));
          var allRules = Object.assign({}, items,this.regRefDetail);
          localStorage.setItem('userRegisterDetail',JSON.stringify(allRules));
          var items2=JSON.parse(localStorage.getItem('userRegisterDetail'));
          console.log(items2);
          let getloadingcontroller = this.loadingCtrl.presentWithGif2();
         this.navCtrl.push('RegPlayerDetailPage');  
         this.loadingCtrl.dismiss();
  }
 
   showToast(position: string,message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

     toast.present(toast);
  }

      regAsPlayer() {

        this.regRefDetail.useraddress=this.regRefDetail.userLocation.formattedAddress;
        this.navCtrl.push('RegPlayerPage');
     }

     getItemsN(){
     this.regRefDetail.phoneNumber = this.regRefDetail.phoneNumber.replace(/\D/g,'');
     return this.regRefDetail.phoneNumber;
     }



     selectedRef(curRef){
       this.regRefDetail.reference=curRef.firstName;
       this.regRefDetail.referenceId=curRef.userid;
     }
  

}
