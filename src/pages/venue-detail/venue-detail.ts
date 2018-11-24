import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';
import {FormControl} from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
declare var google:any;


@IonicPage()
@Component({
  selector: 'page-venue-detail',
  templateUrl: 'venue-detail.html',
})
export class VenueDetailPage implements OnInit{

  public place:any={'name':''};
  public items;
  public google:String;
  public searchControl: FormControl;
  public autocomplete:any;
  public userInfo:any=[{}];
  public venueInfo:any=[{}];


 constructor(private mapsAPILoader: MapsAPILoader,public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public userService:UserServiceProvider,public loadingCtrl: LoadingProvider) {
  }

  ngOnInit(){
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'))
    this.venueInfo=this.navParams.data;
    console.log(this.venueInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VenueDetailPage');
  }

  venueGroundInfo(item){
    console.log(item);
    this.navCtrl.push('VenueGroundDetailPage',item);
  }

}
