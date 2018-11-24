import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
import { VenuSearchModel } from '../../models/venu/venu-search.model';
import { UserExpertiseModel } from '../../models/shared/user-expertise.model';
import { VenueServiceProvider } from '../../providers/venue-service/venue-service';
import { Geolocation } from '../../../node_modules/@ionic-native/geolocation';
import { AddressModel } from '../../models/shared/address.model';
import { isDifferent } from '@angular/core/src/render3/util';
import moment, { min } from 'moment';
import { TypeScriptEmitter } from '@angular/compiler';

declare var google: any;

/**
 * Generated class for the FindVenuePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find-venue',
  templateUrl: 'find-venue.html',
})
export class FindVenuePage implements OnInit {


  public searchVenue: any = {
    "pageNumber": 1,
    "sportid": "",
    "address": {
      "latitude": 0.0,
      "longitude": 0.0,
      "city": "",
      "state": ""
    },
    "date": "2018-08-06",
    "startTime": "",
    "endTime": "",
    "distance": "",
    "userName": ""
  };
  public userInfo: any = [{}];
  public userSports: any = [{}];
  public sportSelectedId: any;
  public isSportSelected = 0;
  public userSportsRank: any = [{}];
  public venueList: any = [{}];
  userExpertiseModel: UserExpertiseModel[] = [];
  userdefaultExpertise: UserExpertiseModel;
  venuSearchModel: VenuSearchModel;
  userFevGame: string;

  public place: any = { 'name': '' };
  public items;
  public google: String;
  public searchControl: FormControl;
  public autocomplete: any;


  constructor(private mapsAPILoader: MapsAPILoader,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public loadingCtrl: LoadingProvider,
    public venueServiceProvider: VenueServiceProvider,
    private geolocation: Geolocation) {
    this.initVenuSearchModel();
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (this.userInfo == null)
      this.userInfo = JSON.parse(localStorage.getItem('userRegisterDetail'));
    console.log(this.userInfo);
    this.selectedSports();
    this.searchControl = new FormControl();
    this.getCurrentLocation();
    this.googleMapListner();
  }

  initVenuSearchModel() {
    this.venuSearchModel = new VenuSearchModel();
    this.venuSearchModel.address = new AddressModel();
  }

  /**
   * Google map listner for the location change.
   */
  googleMapListner() {
    console.log(this.venuSearchModel);
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let nativeHomeInputBox = document.getElementById('location').getElementsByTagName('input')[0];
      let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
        types: ["address"]
      });
      let currentObject: FindVenuePage = this;
      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        this.place = autocomplete.getPlace();
        console.log(this.place);
        console.log("Inside Listner", this.venuSearchModel);
        currentObject.venuSearchModel.address.city = this.place.address_components[2].long_name;
        currentObject.venuSearchModel.address.longitude = this.place.geometry.location.lat();
        currentObject.venuSearchModel.address.latitude = this.place.geometry.location.lng();
      });
    });
  }

  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let geocoder = new google.maps.Geocoder;
      let latlng = { lat: resp.coords.latitude, lng: resp.coords.longitude };
      geocoder.geocode({ 'location': latlng }, (results, status) => {
        console.log("Here is location ", results); // read data from here
        console.log(status);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  /**
   * Get list of sport abilable in database.
   */
  selectedSports() {
    let getloadingcontroller = this.loadingCtrl.presentWithGif2();
    this.venueServiceProvider.getUserExpertiseGame(AppSettings.API_STARTPOINT + 'sport/userexpertise/' + this.userInfo.user.userid)
      .subscribe(
        response => {
          this.loadingCtrl.dismiss();
          this.userExpertiseModel = response.userExpertiseList;
          this.setDefaultValues();
          console.log(this.userSports);
        },
        error => {
          alert(error);
          this.loadingCtrl.dismiss();
        });
  }

  /**
   * Set the default value for the user like sport.
   */
  setDefaultValues() {
    this.userdefaultExpertise = this.userExpertiseModel.find(s => s.isPrimary == true);
    if (this.userdefaultExpertise != null && this.userdefaultExpertise != undefined) {
      this.venuSearchModel.sportName = this.userdefaultExpertise.sportName;
      this.venuSearchModel.sportId = this.userdefaultExpertise.sportId;
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FindVenuePage');
  }

  search() {
    if (this.validateSearch()) {
      let getloadingcontroller = this.loadingCtrl.presentWithGif2();
      this.venueServiceProvider.getNearByVenue(AppSettings.API_STARTPOINT + 'venue/getvenuebyfilter', this.venuSearchModel)
        .subscribe(
          response => {
            this.loadingCtrl.dismiss();
            this.venueList = response;
            this.venueList = this.venueList;
            this.navCtrl.setRoot('VenueDetailPage', this.venueList);
          },
          error => {
            alert(error);
            this.loadingCtrl.dismiss();
          });
    }
  }

  /**
   * Validate search critare like date should be not past date.
   * if it is present date then start time should be lower then end time.
   */
  validateSearch() {
    let processService = false;
    // if(this.venuSearchModel.sportName == null || this.venuSearchModel.sportName == undefined){
    //   this.showToast("Please Select sport Name");
    // }
    if (this.venuSearchModel.address.city == null
      || this.venuSearchModel.address.city == undefined) {
      this.showToast("Please enter city");
    }
    if (this.venuSearchModel.playingDate != null
      || this.venuSearchModel.playingDate != undefined) {
      processService = this.validateDate();
    }
    return processService;
  }

  /**
   * This function will validate the date and time enter by user 
   * ex end datetime should be greater then start DateTime or should not be past Date.
   */
  validateDate() {
    let currentDate: string = this.formatDate();
    let processService = false;
    if (this.isPastDate(currentDate)) {
      this.showToast("Date Entered is past date");
      return processService;
    } else if (this.isPresentDate(currentDate)) {
      processService = this.validateTime();
    } else if (this.isFutureDate(currentDate)) {
      processService = this.validateTime();
    }
    return processService;
  }

  /**
   * Show toast message.
   * @param date 
   */
  validateTime() {
    var result = true;
    var startDateTime = new Date(this.venuSearchModel.playingDate + ' ' + this.venuSearchModel.startTime);
    var endDateTime = new Date(this.venuSearchModel.playingDate + ' ' + this.venuSearchModel.endTime);
    var formatedStartDate = moment(startDateTime);
    var formatedEndDate = moment(endDateTime);
    var duration = moment.duration(formatedEndDate.diff(formatedStartDate));
    var minute = duration.asMinutes();
    if (minute <= 0) {
      result = false;
      this.showToast("End Time should be greater then StartTime");
    }
    return result;
  }

  /**
   * Show toast message.
   * @param date 
   */
  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });

    toast.present(toast);
  }

  /**
   * This mehod will check whether the passed date is present date or not.
   * @param date 
   */
  isPresentDate(date: string) {
    let result = false;
    let selectedDate: Date = new Date(this.venuSearchModel.playingDate);
    let currentDate: Date = new Date(date);
    if (selectedDate == currentDate) {
      result = true;
      return result;
    }
    return result;
  }

  /**
   * This mehod will check whether the passed date is future date or not.
   * @param date 
   */
  isFutureDate(date: string) {
    let result = false;
    let selectedDate: Date = new Date(this.venuSearchModel.playingDate);
    let currentDate: Date = new Date(date);
    if (selectedDate > currentDate) {
      result = true;
      return result;
    }
    return result;
  }

  /**
   * This mehod will check whether the passed date is past date or not.
   * @param date 
   */
  isPastDate(date: string) {
    let result = false;
    let selectedDate: Date = new Date(this.venuSearchModel.playingDate);
    let currentDate: Date = new Date(date);
    if (selectedDate < currentDate) {
      result = true;
      return result;
    }
    return result;
  }

  /**
   * This method will return the formated Date in yyy-mm--dd format.
   */
  formatDate() {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = '' + d.getHours(),
      minutes = '' + d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
