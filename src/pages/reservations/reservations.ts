import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Tab, AlertController, ToastController } from 'ionic-angular';

import { LoadingProvider } from '../../providers/loading/loading';

import { ReservationsService } from '../../providers/reservation/reservations.service';
import { UserModel } from '../../models/shared/user.model';
import { AppContext } from '../../providers/shared/app-context';
import { TabModel } from '../../models/shared/tab.model';
import { ReservationItemModel } from '../../models/reservations/reservation-item.model';
import { AppSettings } from '../../app/app-settings';
import { SessionService } from '../../providers/session/session-service';

@IonicPage()
@Component({
  selector: 'page-reservations',
  templateUrl: 'reservations.html',
})
export class ReservationsPage {
  @ViewChild('slider') slider: Slides;

  reservation: ReservationItemModel[] = [];
  
  scheduledReservations: ReservationItemModel[] = [];
  completedReservations: ReservationItemModel[] = [];
  cancelledReservations: ReservationItemModel[] = [];
  selectedTabIndex: number;
  selectedTab: TabModel;
  page = "0";
  tabs: TabModel[];
  isVenuBooking: boolean;
  imageBaseUrl: string = AppSettings.API_STARTPOINT;


  constructor(
    private navCtrl: NavController,
    private reservationService: ReservationsService,
    private navParams: NavParams,
    private loadingCtrl: LoadingProvider,
    private appContext: AppContext,
    private alertCtrl: AlertController,
    private sessionsService: SessionService,
    private toastCtrl: ToastController) {
      
    this.populateTabs();
    this.selectedTab = this.tabs[0];
    this.selectedTabIndex = 0
  }

  ionViewWillEnter() {
    this.getScheduledReservations();
  }

  populateTabs() {
    this.tabs = [];
    this.tabs.push(new TabModel(0, "SCHEDULED"));
    this.tabs.push(new TabModel(1, "COMPLETED"));
    this.tabs.push(new TabModel(2, "CANCELLED"));
  }


  selectTab(index: number, tab: TabModel) {
    this.slider.slideTo(index);
    this.getReservationsByTab(tab.page);
    this.selectedTabIndex = index;
  }

  moveButton($event: any) {
    this.selectedTabIndex = $event._snapIndex;
    let foundTab = this.tabs.find((tab: TabModel) => tab.index == this.selectedTabIndex);
    this.selectedTab = foundTab;
  }

  getReservationsByStatus(status: string) {
    switch (status) {
      case "Open": this.getScheduledReservations();
        break;
      case "Completed": this.getCompletedReservations();
        break;
      case "Cancelled": this.getCancelledReservations();
        break;
    }
  }

  getReservationsByTab(name: string) {
    switch (name) {
      case "SCHEDULED": this.getScheduledReservations();
        break;
      case "COMPLETED": this.getCompletedReservations();
        break;
      case "CANCELLED": this.getCancelledReservations();
        break;
    }
  }

  getScheduledReservations() {
    this.loadingCtrl.presentWithGif2();
    this.reservationService.getScheduledReservations().subscribe(
      (response: any) => {
        this.scheduledReservations = response;
        this.loadingCtrl.dismiss();
      }, (error: any) => {
        console.log('error -> ', error);
        this.loadingCtrl.dismiss();
      })
  }

  getCompletedReservations() {
    this.loadingCtrl.presentWithGif2();
    
    this.reservationService.getCompletedReservations().subscribe(
      (response: any) => {
        this.completedReservations = response;
        this.loadingCtrl.dismiss();
      }, (error: any) => {
        console.log('error ->', error);
        this.loadingCtrl.dismiss();
      }
    )
  }

  getCancelledReservations() {
    this.loadingCtrl.presentWithGif2();
    
    this.reservationService.getCancelledReservations().subscribe(
      (response: any) => {
        this.cancelledReservations = response;
        this.loadingCtrl.dismiss();
      }, (error: any) => {
        console.log('error ->', error);
        this.loadingCtrl.dismiss();
      })
  }

  navigateToSessionDetail(reservation: ReservationItemModel) {

    if (reservation.eventId != null){
      this.navCtrl.push('EventDetailPage', {
        eventId: reservation.eventId
      });
    } else if (reservation.playerId == null){
      this.navCtrl.push('SessionDetailPage', {
        sessionId: reservation.sessionId
      });
    }
    
  }


  cancelPlayerInvite(reservation: ReservationItemModel) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: `Are you sure you want to cancel the reservation?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this._cancelPlayerInvite(reservation);
          }
        }
      ]
    });
    alert.present();
  }

  _cancelPlayerInvite(reservation: ReservationItemModel) {
    this.loadingCtrl.presentWithGif2();
    this.sessionsService.cancelPlayerBooking(reservation)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 1) {
          this.showMessage(response["message"]);
          this.getScheduledReservations();
        } else {
          this.showMessage(response["error"]);
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Cancel reservation failed!");        
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
