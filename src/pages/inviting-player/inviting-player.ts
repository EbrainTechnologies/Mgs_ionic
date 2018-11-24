import { Component, OnInit } from '@angular/core';
import moment from 'moment';

import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { AppSettings } from '../../app/app-settings';
import { AppContext } from '../../providers/shared/app-context';
import { LoadingProvider } from '../../providers/loading/loading';
import { SessionService } from '../../providers/session/session-service';
import { SportService } from '../../providers/sport/sport.service';
import { SportModel, SportPlayTypeModel } from '../../models/shared/sport.model';
import { SessionModel } from '../../models/sessions/session.model';
import { UserModel } from '../../models/shared/user.model';

@IonicPage()
@Component({
  selector: 'page-inviting-player',
  templateUrl: 'inviting-player.html',
})
export class InvitingPlayerPage {

  player: any;
  searchData: any = null;
  imageBaseUrl: string = AppSettings.API_STARTPOINT;
  currentPlace: any = null;
  startsAt: any = null;
  duration: number = 2;
  sports: SportModel[] = null;
  comments: string;
  user: UserModel[] = null;
  playTypeId: string;
  venueName: string;
  minStartDate: string;
  maxStartDate: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private appContext: AppContext,
    private loadingCtrl: LoadingProvider,
    private sessionService: SessionService,
    private alertCtrl: AlertController,
    private sportService: SportService,
    private toastCtrl: ToastController) {
  }

  ionViewWillEnter() {
    this.player = this.navParams.data['player'];
    this.searchData = this.navParams.data['criteria'];
    this.currentPlace = this.searchData.address.formattedAddress;
    this.getSports();

    this.startsAt = moment().add(3, "h").format();
    this.minStartDate = this.appContext.getMinStartDate();
    this.maxStartDate = this.appContext.getMaxStartDate();
  }

  changeStartDate(startAt: any){

  }

  validateAndInvitePlayer($event: any){
    if (this.venueName != null && this.venueName.trim() != ""){
      this.invitePlayer();
    } else {
      this.showMessage("Please enter a proposed venue");
    }
  }

  invitePlayer() {

    var startDate: Date = new Date(this.startsAt);
    var endDate: Date = new Date(startDate.getTime());

    endDate.setHours(startDate.getHours() + this.duration);

    var registractionstartsOn: Date = new Date();
    var registractionCloseOn: Date = new Date(endDate); // TODO expire this in 20mins

    var sportId = null;
    var sportName = null;

    sportId = this.searchData.sportId;
    this.sports.forEach(sport => {
      if (sport.sportId == sportId){
        sportName = sport.name;
      }
    });

    let model = {
      "sessionType": "Player",
      "sportid": sportId,
      "playTypeId": this.playTypeId,
      "organizerId": this.appContext.userInfo.user.userid,  // Logged In User ID
      "address": this.searchData.address,
      "maxParticipantsCount": 1,
      "startDate": startDate.getTime(),
      "endDate": endDate.getTime(),
      "duration": (this.duration != null) ? this.duration : 0,
      "registrationOpenAt": registractionstartsOn,
      "registrationClosAt": registractionCloseOn,
      "venueName": this.venueName,
      "distance": 0,
      "ageLimit": 0, // 0 - Age Limit Off, 1- Age Limit On
      "ageStart": 0,
      "ageEnd": 0,
      "rankTypeId": null,
      "rankingLevelFrom": 0,
      "rankingLevelTo": 0,
      "comments": this.comments,
      "sessionStatus": "ACTIVE", // ACTIVE
      "createdBy": this.appContext.userInfo.user.displayName,
      "updatedBy": null,
      "playerId": this.player.userid,
      "playerDisplayName": this.player.fullName,
      "sportsName": sportName
    }

    let alert = this.alertCtrl.create({
          message: `Your are about to invite ${this.player.fullName} to play ${sportName} at ${this.player.locationText} from
          ${this.appContext.getFormattedDateTime(startDate)} to ${this.appContext.getFormattedDateTime(endDate)}.          
          Important Note: Please don't send multiple request to other players for the same timeslot while your request is being processed.`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Proceed',
              handler: () => {
                this._invitePlayer(model);
              }
            }
          ]
        });
        alert.present();
  }

  _invitePlayer(model: any) {
    this.loadingCtrl.presentWithGif2();
    this.sessionService.createSession(model)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
        } else {
          this.navCtrl.pop();
        }
      }
      , error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error fetching Invite Players");
      });
  }

  getSports() {
    this.loadingCtrl.presentWithGif2();
    this.sportService.getSports()
      .subscribe(response => {
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
        this.showMessage("Error Fetching Sports");
      });
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
