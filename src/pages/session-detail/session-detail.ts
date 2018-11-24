import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { SessionModel } from '../../models/sessions/session.model';
import { SessionService } from '../../providers/session/session-service';
import { LoadingProvider } from "../../providers/loading/loading";
import { AppContext } from '../../providers/shared/app-context';
import { UserModel } from '../../models/shared/user.model';
import { AppSettings } from '../../app/app-settings';

@IonicPage()
@Component({
  selector: 'session-detail-page',
  templateUrl: 'session-detail.html',
})

export class SessionDetailPage {

  organizer: any = null;
  session: SessionModel;
  user: UserModel;
  isEdit: boolean = false;
  sessionBookingList: any = null;
  imageBaseUrl: string = AppSettings.API_STARTPOINT;

  orgainizerView: boolean = false;
  loaded: boolean = false;
  prevalidationPassed: boolean = false;
  prevalidationFailed: boolean = false;
  validationMessage: string;
  withdrawFlag: boolean = false;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private sessionsService: SessionService,
    private loadingCtrl: LoadingProvider,
    private alertCtrl: AlertController,
    private appContext: AppContext) {

    this.getUser();
    this.imageBaseUrl = AppSettings.API_STARTPOINT;
  }

  ionViewWillEnter() {
    let sessionId = this.navParams.get('sessionId');
    this.getSession(sessionId);
  }


  getUser() {
    this.appContext.getUser().subscribe(user => {
      this.user = user;
    });
  }

  getSession(sessionId: string) {
    this.loaded = false;
    this.loadingCtrl.presentWithGif2();
    this.sessionsService.getSessionById(sessionId)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
        } else {
          this.loadingCtrl.dismiss();
          this.loaded = true;
          this.organizer = response['organizer'];
          this.orgainizerView = this.organizer.userid == this.appContext.userInfo.user.userid;
          this.organizer['userProfileImage'] = `${AppSettings.API_STARTPOINT}upload/viewuserimage/${this.organizer.userid}`;
          this.session = response['session'];
          this.prevalidate();
          this.sessionBookingList = [];
          response['sessionBookingList'].forEach(booking => {
            booking.participant.registrationid = booking.registrationid;
            booking.participant.sessionid = booking.sessionid;
            booking.participant.organizerId = booking.organizerId;
            booking.participant.organizerName = booking.organizerName;

            var participant = booking.participant;
            participant['userProfileImage'] = `${AppSettings.API_STARTPOINT}upload/viewuserimage/${participant.userid}`;
            this.sessionBookingList.push(participant);
          });
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error fetching Session Details");
      });
  }

  edit() {
    this.navCtrl.push('SessionEditPage', {
      sessionId: this.session.sessionid
    });
  }

  cancel() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: `Are you sure you want to cancel the match?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this._cancel();
          }
        }
      ]
    });
    alert.present();
  }

  _cancel() {
    this.loadingCtrl.presentWithGif2();
    this.sessionsService.cancel(this.session)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 1) {
          this.navCtrl.pop();
        } else {
          this.showMessage(response["error"]);
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Cancel match failed!");        
      });
  }

  cancelRegistration() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: `Are you sure you want to cancel the registration?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this._cancelRegistration();
          }
        }
      ]
    });
    alert.present();
  }

  _cancelRegistration() {
    this.loadingCtrl.presentWithGif2();

    var sessionBooking = null;
    this.sessionBookingList.forEach(booking => {
      if (booking.userid == this.appContext.userInfo.user.userid){
        sessionBooking = booking;
      }
    });

    this.sessionsService.cancelBooking(sessionBooking)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 1) {
          this.navCtrl.pop();
        } else {
          this.showMessage(response["error"]);
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Cancel match failed!");        
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

  register() {
    this.loadingCtrl.presentWithGif2();
    this.sessionsService.register(this.session.sessionid, this.session.organizerId)
      .subscribe(status => {
        this.loadingCtrl.dismiss();
        if (status["status"] == "0") {
          this.showMessage(status["error"]);
        } else {
          this.navCtrl.pop();
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Session Register failed!");
      });
  }

  prevalidate() {
    this.prevalidationPassed = false;
    this.prevalidationFailed = false;
    this.loadingCtrl.presentWithGif2();
    this.sessionsService.prevalidate(this.session.sessionid, this.session.organizerId)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == "0") {
          this.prevalidationFailed = true;
          this.validationMessage = response['error'];
          this.withdrawFlag = response["withdrawFlag"]
        } else {
          this.prevalidationPassed = true;
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Session pre-validation failed!");
      });
  }

}