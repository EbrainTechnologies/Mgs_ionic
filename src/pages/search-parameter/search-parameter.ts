import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';
import { MapsAPILoader } from '@agm/core';
import { AppContext } from '../../providers/shared/app-context';
import { SportService } from '../../providers/sport/sport.service';
import { ClubService } from '../../providers/club/club-service';
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-search-parameter',
  templateUrl: 'search-parameter.html',
})
export class SearchParameterPage {

  searchData = {
    "userId": null,
    "pageNumber": 1,
    "searchType": "LOCATION",
    "address": {},
    "distance": 50,
    "advAgeStart": 5,
    "advAgeEnd": 25,
    "sportId": null,
    "advRankingLevel": null,
    "advRankingRegion": null, //What is this? - Always it will be null
    "advFromRank": null,
    "advToRank": null,
    "club": null, // send the club uuid
    "userName": null,
    "advAge": { lower: 5, upper: 25 },
    "restrictHomeClub": false
  };

  userInfo: any;
  sports: any[];
  rankingTypeList: any[];
  players: any;

  clubs: any[];

  @ViewChild("searchLocation")
  locationSearchElementRef: ElementRef;
  locationSearchControl: any = new FormControl();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private userService: UserServiceProvider,
    private sportService: SportService,
    private loadingCtrl: LoadingProvider,
    private appContext: AppContext,
    private ngZone: NgZone,
    private clubService: ClubService,
    private events: Events) {

  }

  ionViewWillEnter() {
    if (this.navParams.data != null && this.navParams.data['criteria'] != null) {
      this.searchData = this.navParams.data['criteria'];
    }
    this.appContext.getUserInfo().subscribe(userInfo => {
      this.userInfo = userInfo;
      this.searchData.userId = userInfo.user.userid;
    });

    this.getSports();
    this.changeSport(this.searchData.sportId);
    this.getClubs();
    this.initilizeGoogleMaps();
  }

  changeSearchType(searchType: string) {
    if (searchType == 'LOCATION') {
      this.initilizeGoogleMaps();
    }
  }

  initilizeGoogleMaps() {
    if (this.searchData.searchType == 'LOCATION') {
      setTimeout(() => {
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.locationSearchElementRef.nativeElement, {
            types: ["(cities)"]
          });
          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
              this.searchData.address = {};
              this.searchData.address["city"] = place.name;
              this.searchData.address["formattedAddress"] = place.formatted_address;
              this.searchData.address["longitude"] = place.geometry.location.lat();
              this.searchData.address["latitude"] = place.geometry.location.lng();

            });
          });
        });
      });
    }
  }

  getSports() {
    this.loadingCtrl.presentWithGif2();
    this.sportService.getSports().subscribe(response => {
      this.loadingCtrl.dismiss();
      if (response["status"] == 0) {
        this.showMessage(response["error"]);
      } else {
        this.sports = response["sportsList"];
      }
    }, error => {
      this.loadingCtrl.dismiss();
      this.showMessage("Error fetching Sports");
    });
  }

  getClubs() {
    if (this.clubs == null) {
      var userId = this.userInfo.user.userid;
      this.clubService.getHomeClubs(userId).subscribe(response => {
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
        } else {
          this.clubs = response["clubList"];
          if (this.clubs != null && this.clubs.length > 0) {
            if (this.searchData.club == null) {
              this.searchData.club = this.clubs[0]["clubId"];
            } else {
              // do not overwrite the previous selection
            }
          } else {
            this.searchData.club = null;
            this.searchData.restrictHomeClub = false;
          }
        }
      }, error => {
        this.showMessage("Error Fetching in HomeClub");
      });
    }
  }


  changeSport(sportId: string) {
    sportId = this.searchData.sportId;
    if (sportId != null && sportId != '') {
      this.sportService.getRankingTypes(sportId)
        .subscribe(response => {
          if (response["status"] == 0) {
            this.showMessage(response["error"]);
          } else {
            this.rankingTypeList = response["rankingTypes"];
          }
        }, error => {
          this.showMessage("Error Fetching Sport")
        });
    }
  }

  changeRankType(rankType: any) {

  }

  changeLocation(location: string) {
    if (location == '') {
      this.searchData.address = {};
    }
  }

  changeAgeRange(advAge: any) {
    this.searchData.advAgeStart = advAge.lower;
    this.searchData.advAgeEnd = advAge.upper;
  }

  searchPlayers() {
    if (this.validateSearchRequest()) {
      let params = {
        criteria: this.searchData,
        players: null
      }
      // Fresh search has to be performed.
      this.searchData.pageNumber = 1;
      this.navCtrl.pop().then(() => {
        // Trigger custom event and pass data to be send back
        this.events.publish('back-from-search', params);
    });
    }
  }

  validateSearchRequest(): boolean {
    if (this.searchData.searchType == 'LOCATION') {
      return this.validateLocation();
    } else if (this.searchData.searchType == 'USER') {
      return this.validateUserName();
    } else if (this.searchData.searchType == 'CLUB') {
      return this.validateHomeClub();
    }
  }

  validateLocation(): boolean {
    let valid = true;
    var addressInputValue = this.searchData.address["formattedAddress"]
    if (addressInputValue == null || addressInputValue.trim() == "") {
      valid = false;
      this.showMessage("Please enter the valid city and state!")
    }
    return valid;
  }

  validateUserName(): boolean {
    let valid = true;
    if (this.searchData.userName == null || this.searchData.userName == undefined) {
      valid = false;
      this.showMessage("Please enter the Player Name!");
    }
    return valid;
  }

  validateHomeClub(): boolean {
    let valid = true;
    if (this.searchData.restrictHomeClub == false || this.searchData.club == null || this.searchData.club.trim() == "") {
      valid = false;
      this.showMessage("Please select the Home Club!")
    }
    return valid;
  }

  showMessage(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "top"
    });
    toast.present(toast);
  }


}
