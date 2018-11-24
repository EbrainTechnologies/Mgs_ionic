import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController } from 'ionic-angular';
import { SessionModel } from '../../models/sessions/session.model';
import { SessionService } from '../../providers/session/session-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { TabModel } from '../../models/shared/tab.model';
import { AppSettings } from '../../app/app-settings';
import { AppContext } from '../../providers/shared/app-context';

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
})
export class SessionPage {

  @ViewChild('slider') slider: Slides;

  sessions: SessionModel[] = [];

  openSession: SessionModel[] = [];
  closeession: SessionModel[] = [];
  closedSession: SessionModel[] = [];
  cancelledSession: SessionModel[] = [];
  tabs: TabModel[] = [];
  selectedTab: TabModel;
  selectedTabIndex: number = 0
  imageBaseUrl = AppSettings.API_STARTPOINT;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private sessionService: SessionService,
    private loadingCtrl: LoadingProvider,
    private toastCtrl: ToastController,
    private appContext: AppContext) {

    this.populateTabs();
    this.selectedTab = this.tabs[0];
    this.selectedTabIndex = 0
  }

  selectTab(ind) {
    this.slider.slideTo(ind);
  }

  moveButton($event) {
    this.selectedTabIndex = $event._snapIndex;
    this.loadSessions();
  }

  populateTabs() {
    this.tabs.push(new TabModel(0, 'Open'));
    this.tabs.push(new TabModel(1, 'History'));
    this.tabs.push(new TabModel(2, 'Cancelled'));
  }

  ionViewWillEnter() {
    this.loadSessions();
  }

  loadSessions() {
    var status = "ALL";
    switch (this.selectedTabIndex) {
      case 0:
        status = 'ACTIVE';
        break;
      case 1:
        status = 'COMPLETED';
        break;
      case 2:
        status = 'CANCELLED';
        break;
    }
    this.loadingCtrl.presentWithGif2();
    this.sessionService.getSessions(status)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
        } else {
          this.sessions = response;
          this.sessions = response["filteredResults"];
            if (status == 'ACTIVE') {
              this.openSession = this.sessions;
            } else if (status == 'COMPLETED') {
              this.closedSession = this.sessions;
            } else if (status == 'CANCELLED') {
              this.cancelledSession = this.sessions;
            } else {
              this.openSession = this.sessions.filter(session => (session.sessionStatus == 'ACTIVE'));
              this.closedSession = this.sessions.filter(session => (session.sessionStatus == 'COMPLETED'));
              this.cancelledSession = this.sessions.filter(session => (session.sessionStatus == 'CANCELLED'));
            }
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error fetching Sessions");
      });
  }

  navigateToSessionDetail(session: SessionModel) {
    this.navCtrl.push('SessionDetailPage', {
      sessionId: session.sessionid
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

  hostSession() {
    this.navCtrl.push('CreateSessionPage');
  }

}
