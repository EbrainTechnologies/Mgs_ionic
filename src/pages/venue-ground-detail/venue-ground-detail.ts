import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { VenueServiceProvider } from '../../providers/venue-service/venue-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { VenuSearchModel } from '../../models/venu/venu-search.model';
import { AppContext } from '../../providers/shared/app-context';
import { AppSettings } from '../../app/app-settings';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-venue-ground-detail',
  templateUrl: 'venue-ground-detail.html',
})
export class VenueGroundDetailPage {

  public place: any = { 'name': '' };
  public items;
  public google: String;
  public searchControl: FormControl;
  public autocomplete: any;
  public userInfo: any = [{}];
  public venueInfo: any = [{}];
  public photos: string[] = [];
  public venu: VenuSearchModel;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private userService: UserServiceProvider,
    private venueService: VenueServiceProvider,
    private loadingCtrl: LoadingProvider,
    private appContext: AppContext) {

  }

  ionViewWillEnter() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (this.userInfo == null)
      this.userInfo = JSON.parse(localStorage.getItem('userRegisterDetail'))
    this.venueInfo = this.navParams.data;
    this.assignImageBaseUrl()
    console.log(this.venueInfo);
  }

  /**
   * Apped base URL for the Image and if there is not image avilable then
   * add default image.
   */
  assignImageBaseUrl() {
    if (this.venueInfo.photos != null && this.venueInfo.photos != undefined
      && this.venueInfo.photos.length > 0) {
      this.venueInfo.photos.forEach(element => {
        this.photos.push(AppSettings.API_STARTPOINT + "upload/viewvenuephoto/" + element);
        this.photos.push("assets/imgs/defaultGround.jpg")
      });
    } else {
      this.photos.push("assets/imgs/defaultGround.jpg")
    }
  }

  register() {
    this.loadingCtrl.presentWithGif2();
    this.venueService.venueBooking(this.venu)
      .subscribe(status => {
        this.loadingCtrl.dismiss();
        if (status["status"] == "0") {
          this.showMessage(status["error"]);
        } else {
          this.navCtrl.pop();
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Venue Register failed!");
      });
  }

  showMessage(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present(toast);
  }
}
