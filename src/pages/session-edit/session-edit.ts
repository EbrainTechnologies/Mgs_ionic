import { Component } from '@angular/core';
import moment from 'moment';

import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { SessionModel } from '../../models/sessions/session.model';
import { SessionService } from '../../providers/session/session-service';
import { LoadingProvider } from "../../providers/loading/loading";
import { AppContext } from '../../providers/shared/app-context';
import { UserModel } from '../../models/shared/user.model';
import { AppSettings } from '../../app/app-settings';

@IonicPage()
@Component({
  selector: 'session-edit-page',
  templateUrl: 'session-edit.html',
})

export class SessionEditPage {

  organizer : any = null;
  session: SessionModel;
  user: UserModel;  
  sessionClosingOn : string = null;
  comments : any = null;
  sessionBookingList : any = null;
  imageBaseUrl: string = AppSettings.API_STARTPOINT;


  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public sessionsService: SessionService,
    public loadingCtrl: LoadingProvider,
    public alertCtrl: AlertController,
    public appContext: AppContext) {

    let sessionId = this.navParams.get('sessionId');
    this.getUser();
    this.getSession(sessionId);
    this.imageBaseUrl = AppSettings.API_STARTPOINT;
 
  }

  getUser() {
    this.appContext.getUser().subscribe(user => this.user = user)
  }

  getSession(sessionId: string) {

    this.sessionsService.getSessionById(sessionId).subscribe(
      session => {

        this.organizer = session['organizer'];
        this.session = session['session'];
        this.sessionBookingList = session['sessionBookingList'];

        this.comments = this.session.comments;
        this.sessionClosingOn = moment(this.session.registrationClosAt).format(); 
      })
  }

  saveSession($event) {

    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: `Save Changes?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this._saveSession();
          }
        }
      ]
    });
    alert.present();

  }
  
  _saveSession(){
    var registractionCloseOn: Date = new Date(this.sessionClosingOn);

    this.session.registrationClosAt = registractionCloseOn.getTime();
    this.session.comments = this.comments;

    this.loadingCtrl.presentWithGif2();

    this.sessionsService.updateSession(this.session).subscribe(result => {
      this.loadingCtrl.dismiss();
      this.navCtrl.pop();
    }, error => {
      this.loadingCtrl.dismiss();
    });
  }

}