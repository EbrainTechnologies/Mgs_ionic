import { ElementRef, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController, ToastController, Navbar } from 'ionic-angular';

import { SessionModel } from '../../models/sessions/session.model';
import { SessionService } from '../../providers/session/session-service';
import { SportService } from '../../providers/sport/sport.service';
import { SportModel, SportPlayTypeModel } from '../../models/shared/sport.model';
import { TabModel } from '../../models/shared/tab.model';

import { AppSettings } from "../../app/app-settings";
import { LoadingProvider } from '../../providers/loading/loading';
import { AppContext } from '../../providers/shared/app-context';

import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-create-session',
  templateUrl: 'create-session.html',
})
export class CreateSessionPage {

  @ViewChild('slider') slider: Slides;
  @ViewChild(Navbar) navBar: Navbar;

  selectedStepIndex = 0;

  steps: TabModel[];
  imageBaseUrl = AppSettings.API_STARTPOINT;

  // Dropdown related input options
  sports: SportModel[] = null;
  selectVenueName: any = null;
  rankingTypeList: any = null;

  // Step Navigation related variables
  showNext: boolean = false;
  allowStepNavigation: boolean = false;
  stepHandlers = {};
  showInvite: boolean = false;

  // Input properties
  selectedSport: SportModel = null;
  selectedSportPlayType: SportPlayTypeModel = null;
  sessionStartsAt: any = null;
  duration: number = 1;
  registrationClosingOn: any = null;
  location: any;
  miles: number = 10;
  restrictionAge: any = null;
  ageRange: any = { lower: 5, upper: 25 };
  restrictionSkill: any = null;
  rankingFrom: any = null;
  rankingTo: any = null;
  restrictionAddon: any = null;
  players: any[];
  minStartDate: string;
  maxStartDate: string;

  @ViewChild("searchLocation")
  locationSearchElementRef: ElementRef;
  locationSearchControl: any = new FormControl();

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private sessionService: SessionService,
    private sportService: SportService,
    private loadingCtrl: LoadingProvider,
    private appContext: AppContext,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {
    this.populateSteps();

    this.stepHandlers = {
      'step0': this.validateStep1,
      'step1': this.validateStep2,
      'step2': this.validateStep3,
      'step3': this.validateStep4,
      'step4': this.validateStep5,
    }

    this.sessionStartsAt = moment().add(3, "h").format()
    this.registrationClosingOn = moment().add(2, "h").format()
    this.minStartDate = this.appContext.getMinStartDate();
    this.maxStartDate = this.appContext.getMaxStartDate();
  }

  ionViewWillEnter() {
    this.getSports();
    this.initGoogleLocation();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
     let alert = this.alertCtrl.create({
        message: `Do you want to exit the process?`,
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    }
  }

  populateSteps() {
    this.steps = [];
    this.steps.push(new TabModel(0, "Step 1"));
    this.steps.push(new TabModel(1, "Step 2"));
    this.steps.push(new TabModel(2, "Step 3"));
    this.steps.push(new TabModel(3, "Step 4"));
    this.steps.push(new TabModel(4, "Step 5"));
    this.steps[0].disabled = false;
  }

  isStepEnabled(step: TabModel) {
    switch (step.index) {
      case 0: return true;
      case 1: return this.validateStep1();
      case 2: return this.validateStep2();
      case 3: return this.validateStep3();
      case 4: return this.validateStep4();
    }
  }

  goToStep(index: number) {
    if (index == this.steps.length || !this.steps[index].disabled) {
      this.handleStepsMovement(index);
      if (index == this.steps.length) {
        this.players = [];
        this.players.push(this.appContext.userInfo.user);
        for (let i = 0; i < this.selectedSportPlayType.playerCount; i++) {
          this.players.push({});
        }
        this.showInvite = true;
        return;
      } else {
        this.showInvite = false;
      }
      if (index < this.steps.length - 1) {
        this.slider.lockSwipeToNext(this.steps[index + 1].disabled);
      }

      if (this.selectedStepIndex == 4 && this.rankingTypeList == null) {
        this.loadingCtrl.presentWithGif2();
        this.sportService.getRankingTypes(this.selectedSport['sportId'])
          .subscribe(response => {
            if (response["status"] == 0) {
              this.showMessage("Error Fetching in Sport")
            } else {
              this.rankingTypeList = response["rankingTypes"];
              this.loadingCtrl.dismiss();
            }
          }, error => {
            this.loadingCtrl.dismiss();
            this.showMessage("Error fetching in Ranking types");
          });
      }
    }
  }

  moveButton($event) {
    if (this.allowStepNavigation) {
      var index = $event._snapIndex
      this.selectedStepIndex = index;
      if (index < this.steps.length - 1) {
        this.slider.lockSwipeToNext(this.steps[index + 1].disabled);
      }
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
        // TODO: it should have been done in the backend data itself. Raised issue to @Nathan to fix the data.
        // TODO: should be removed once the backend data is fixed.
        this.sports.forEach(sport => {
          sport.sportPlayTypeList.forEach(playType => {
            playType.maxPlayerCount = playType.playerCount;
          });
        });
      }
    }, error => {
      this.loadingCtrl.dismiss();
      this.showMessage("Error Fetching Sports")
    });
  }

  initGoogleLocation() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.locationSearchElementRef.nativeElement, {
        types: ["(regions)"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.location = place;
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.validateStep4();
        });
      });
    });
  }

  onSportChange($event: SportModel) {
    this.selectedSport = $event;
    this.validateStep1();
    this.goToStep(1);
  }

  onSportPlayTypeChange($event) {
    if ($event instanceof SportPlayTypeModel) {
      this.selectedSportPlayType = $event;
    }
    this.validateStep2();
  }

  moveNextStep() {
    this.goToStep(this.selectedStepIndex + 1);
  }

  handleStepsMovement(selectedStep) {

    this.showNext = false;

    var result: boolean = false;
    if (this.selectedStepIndex == 0) {
      result = this.validateStep1();
    }
    else if (this.selectedStepIndex == 1) {
      result = this.validateStep2();
    } else if (this.selectedStepIndex == 2) {
      result = this.validateStep3();
    } else if (this.selectedStepIndex == 3) {
      result = this.validateStep4();
    } else if (this.selectedStepIndex == 4) {
      result = this.validateStep5();
    }

    if (result || selectedStep < this.selectedStepIndex) {
      this.selectedStepIndex = selectedStep;
      this.selectedStepIndex = this.selectedStepIndex;
      this.slider.lockSwipeToNext(false);
      this.slider.slideTo(selectedStep);
      this.handleCurrentPage();
    } else {
      this.selectedStepIndex = this.selectedStepIndex;
      this.slider.lockSwipeToNext(false);
      this.slider.slideTo(this.selectedStepIndex);
    }
  }

  handleCurrentPage() {

    this.showNext = false;
    this.allowStepNavigation = false;

    var result: boolean = false;
    if (this.selectedStepIndex == 0) {
      result = this.validateStep1();
    }
    else if (this.selectedStepIndex == 1) {
      result = this.validateStep2();
    } else if (this.selectedStepIndex == 2) {
      result = this.validateStep3();
    } else if (this.selectedStepIndex == 3) {
      result = this.validateStep4();
    } else if (this.selectedStepIndex == 4) {
      result = this.validateStep5();
    }
    if (result) {
      this.allowNavigation();
    }
  }

  validateStep1(): boolean {
    if (this.selectedSport == null) {
      return false;
    }
    this.allowNavigation();
    this.steps[this.selectedStepIndex + 1].disabled = false;
    return true;
  }

  validateStep2() {
    if (this.selectedSportPlayType == null) {
      this.steps[this.selectedStepIndex + 1].disabled = true;
      this.showNext = false;
      return false;
    }

    if (this.selectedSportPlayType.playerCount < 1 || this.selectedSportPlayType.playerCount > this.selectedSportPlayType.maxPlayerCount) {
      this.steps[this.selectedStepIndex + 1].disabled = true;
      this.showNext = false;
      return false;
    }
    this.allowNavigation();
    this.steps[this.selectedStepIndex + 1].disabled = false;
    return true;
  }

  validateStep3() {
    if (this.sessionStartsAt == null || this.registrationClosingOn == null) {
      return false;
    }
    var eventStartDate : Date = new Date(this.sessionStartsAt);
    var registrationCloseDate : Date = new Date(this.registrationClosingOn);
    var diffInMinutes = (eventStartDate.getTime() - registrationCloseDate.getTime()) / 1000 / 60;
    if (diffInMinutes < 30) {
      return false;
    }
    this.allowNavigation();
    this.steps[this.selectedStepIndex + 1].disabled = false;
    return true;
  }

  validateStep4() {
    if (this.location == null) {
      return false;
    }
    this.allowNavigation();
    this.steps[this.selectedStepIndex + 1].disabled = false;
    return true;
  }
  validateStep5() {
    return true;
  }
  allowNavigation() {
    this.allowStepNavigation = true;
    this.showNext = true;
  }

  onStep3InputChange($event) {
    if (this.validateStep3()) {
      this.steps[this.selectedStepIndex + 1].disabled = false;
    } else {
      this.steps[this.selectedStepIndex + 1].disabled = true;
      this.showNext = false;
    }
  }

  onStep4InputChange(value: any) {
    if (value == null || value.trim() == "") {
      this.location = null;
    }
    if (this.validateStep4()) {
      this.steps[this.selectedStepIndex + 1].disabled = false;
    } else {
      this.steps[this.selectedStepIndex + 1].disabled = true;
      this.showNext = false;
    }
  }

  onSaveChanges($event) {
    var startDate: Date = new Date(this.sessionStartsAt);
    var endDate: Date = new Date(startDate.getTime());
    endDate.setHours(startDate.getHours() + this.duration);

    var registractionstartsOn: Date = new Date();
    var registractionCloseOn: Date = new Date(this.registrationClosingOn);

    var address = null;
    if (this.location != null) {
      address = {
        "name": this.location['name'],
        "street1": this.searchAddressComponent("street_number"),
        "street2": this.searchAddressComponent("route") + ' ' + this.searchAddressComponent("locality"),
        "city": this.searchAddressComponent("administrative_area_level_2"),
        "statecode": this.searchAddressComponent("administrative_area_level_1", 'short_name'),
        "postcode": this.searchAddressComponent("postal_code"),
        "countrycode": this.searchAddressComponent("country", 'short_name'),
        "formattedAddress": this.location['formatted_address'],
        "latitude": this.location.geometry.location.lat(),
        "longitude": this.location.geometry.location.lng(),
        "isPrimary": 1,
        "status": 1
      }
    }

    let model = {
      "sessionType": "Match", // Match, Player
      "sportid": this.selectedSport.sportId,
      "playTypeId": this.selectedSportPlayType.playTypeId,
      "organizerId": this.appContext.userInfo.user.userid,  // Logged In User ID
      "address": address,
      "maxParticipantsCount": this.selectedSportPlayType.playerCount,
      "startDate": startDate.getTime(),
      "endDate": endDate.getTime(),
      "duration": (this.duration != null) ? this.duration : 0,
      "registrationOpenAt": registractionstartsOn.getTime(),
      "registrationClosAt": registractionCloseOn.getTime(),
      "venueName": this.selectVenueName,
      "distance": (this.miles != null) ? this.miles : 0,
      "ageLimit": (this.restrictionAge ? 1 : 0), // 0 - Age Limit Off, 1- Age Limit On
      "ageStart": (this.restrictionAge ? this.ageRange.lower : 0),
      "ageEnd": (this.restrictionAge ? this.ageRange.upper : 0),
      "rankTypeId": (this.restrictionSkill != null ? this.restrictionSkill.rankTypeId : null),
      "rankingLevelFrom": this.rankingFrom,
      "rankingLevelTo": this.rankingTo,
      "comments": this.restrictionAddon,
      "sessionStatus": "ACTIVE", // ACTIVE
      "createdBy": this.appContext.userInfo.user.displayName,
      "updatedBy": null
    }

    this.loadingCtrl.presentWithGif2();
    this.sessionService.createSession(model).subscribe(response => {
      if (response["status"] == 0){
        this.showMessage(response["error"]);
      } else {
        this.loadingCtrl.dismiss();
        let alert = this.alertCtrl.create({
          message: response["message"],
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();
      }
      
    }, error => {
      this.loadingCtrl.dismiss();
      this.showMessage("Error Saving Session");
    });
  }

  searchAddressComponent(compType, prop: any = null): any {
    var value = null;
    if (this.location != null) {
      this.location.address_components.forEach(addressComp => {
        addressComp["types"].forEach(type => {
          if (type == compType) {
            value = addressComp[(prop != null) ? prop : 'long_name'];
          }
        });
      });
    }
    return value;
  }

  supressEvent($event: any) {
    if ($event) {
      if (typeof $event.stopPropagation === 'function') {
        $event.stopPropagation();
      }
      if (typeof $event.preventDefault === 'function') {
        $event.preventDefault();
      }
    }
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
