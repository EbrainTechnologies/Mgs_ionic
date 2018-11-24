import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, AlertController} from 'ionic-angular';
import { LoadingProvider } from "../../providers/loading/loading";
import { NotificationService } from '../../providers/notification/notification.service';
import { SessionModel } from '../../models/sessions/session.model';
import { SessionService } from '../../providers/session/session-service';
import { AppSettings } from "../../app/app-settings";
import { AppContext } from '../../providers/shared/app-context';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  @ViewChild('slider') slider: Slides;
  imageBaseUrl = AppSettings.API_STARTPOINT;

  matchInviteCount: number = 0;
  playerInviteCount: number = 0;
  matchNotifications: any[] = [];
  playerNotificationsByStatus: any[] = [[], [], []];

  page: string = "0";
  subPage: string = "0";
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingProvider,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private appContext: AppContext,
    private alertCtrl: AlertController) {
  }

  selectedTab(ind) {
    this.slider.slideTo(ind);
  }

  selectMatchInvite() {
    this.selectedTab(0);
  }

  selectPlayerInvite() {
    this.subPage = "0";
    this.selectedTab(1);
  }


  moveButton($event) {
    this.page = $event._snapIndex.toString();
    this.loadNotifications();
  }

  ionViewWillEnter() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotificationsCount()
      .subscribe(response => {
        if (response["status"] == 0){
          this.showMessage(response["error"]);
        } else {
          this.matchInviteCount = response["matchInviteCount"]?response["matchInviteCount"]:0;
          this.playerInviteCount= response["playerInviteCount"]?response["playerInviteCount"]:0;
        }
      }, error => {
        this.showMessage("Error fetching Notification count");
      });

    if (this.page == "0"){
      this.loadMatchInvites();
    } else {
      this.loadPlayerInvites();
    }
  }

  loadPlayerInvites() {
    var status = "pending";
    if (this.subPage == "1"){
      status = "completed";
    } else if (this.subPage == "2") {
      status = "sent";
    }
    this.loadingCtrl.presentWithGif2();
    this.notificationService.getPlayerInviteNotifications(status)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
        } else {
          let notifications: any[] = response['sessionList'];
          notifications.forEach(notification => {
            notification['userProfileImage'] = `${AppSettings.API_STARTPOINT}upload/viewuserimage/${notification.organizerId}`;
            if (notification['organizerName'] != null) {
              notification['organizerFirstName'] = notification['organizerName'].split(' ')[0];
            } else {
              this.showMessage(response["error"]);
            }
          });
          this.playerNotificationsByStatus[parseInt(this.subPage)] = notifications;
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error fetching Notifications");
    });
  }

  loadMatchInvites(){
    this.loadingCtrl.presentWithGif2();
    this.notificationService.getMatchInviteNotifications()
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
        } else {
          this.matchNotifications = response['sessionList'];
          this.matchNotifications.forEach(notification => {
            notification['userProfileImage'] = `${AppSettings.API_STARTPOINT}upload/viewuserimage/${notification.organizerId}`;
            if (notification['organizerName'] != null) {
              notification['organizerFirstName'] = notification['organizerName'].split(' ')[0];
            } else {
              this.showMessage(response["error"]);
            }
          });
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error fetching Notifications");
      });
  }

  acceptSession(notification: any) {
    this.loadingCtrl.presentWithGif2();
    this.prevalidate(notification)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
        } else {
          this.loadingCtrl.presentWithGif2();
          this.sessionService.register(notification.sessionid, notification.organizerId)
            .subscribe(response => {
              this.loadingCtrl.dismiss();
              if (response["status"] == 0) {
                this.showMessage(response["error"]);
              }
            }, error => {
              this.loadingCtrl.dismiss();
              this.showMessage("Session is not accepted");
            });
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Session is not accepted");
      });
  };
  prevalidate(notification: any) {
    return this.sessionService.prevalidate(notification.sessionid, notification.organizerId);
  }

  acceptPlayerInvite(notification: any) {
    this.loadingCtrl.presentWithGif2();
    console.log(notification);
    this.sessionService.register(notification.sessionid, notification.organizerId)
      .subscribe(status => {
        this.loadingCtrl.dismiss();
        if (status["status"] == "0") {
          this.showMessage(status["error"]);
        } else {
          this.loadNotifications();
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Accept Player Invite!");
      });
  }

  rejectPlayerInvite(session) {
    let alert = this.alertCtrl.create({
      title: 'Reject',
      message: `Are you sure you want to reject the Invitation?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this._rejectPlayerInvite(session);
          }
        }
      ]
    });
    alert.present();
  }

   _rejectPlayerInvite(session: SessionModel) {
    this.loadingCtrl.presentWithGif2();
    this.sessionService.rejectPlayerNotification(session)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 1) {
          this.showMessage(response["message"]);
          this.loadNotifications();
        } else {
          this.showMessage(response["error"]);
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Reject player Invite!");        
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

  navigateToSessionDetail(notification: any) {
    this.navCtrl.push('SessionDetailPage', {
      sessionId: notification.sessionid
    });
  }

}
