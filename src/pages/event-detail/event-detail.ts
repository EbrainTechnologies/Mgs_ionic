import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { EventModel } from '../../models/events/event.model';
import { EventsService } from "../../providers/events/events.service";
import { LoadingProvider } from "../../providers/loading/loading";
import { PromoCodeModel } from '../../models/events/promo-code.model';
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';
import { AppContext } from '../../providers/shared/app-context';

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})

export class EventDetailPage {
  event: EventModel;
  eventId: string;
  promoCode: PromoCodeModel;
  cancellationNode: string;
  currentDate: Date;
  loaded: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private eventsService: EventsService,
    private loadingCtrl: LoadingProvider,
    private events: Events,
    private alertCtrl: AlertController,
    private appContext: AppContext) {

    // userParams is an object we have in our nav-parameters
    this.event = this.navParams.data["event"];
    if (this.event != null){
      this.eventId = this.event.eventId;
    } else {
      this.eventId = this.navParams.data["eventId"];
    }
  }

  ionViewWillEnter() {
    this.loaded = false;
    this.loadEvent();
  }

  loadEvent() {
    this.currentDate = new Date();
    this.loadingCtrl.presentWithGif2()
    this.eventsService.getEvent(this.eventId)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == "0") {
          this.showMessage(response["error"]);
        } else {
          var event = response["event"];
          if (event != null) {
            this.event = event;
            this.loadingCtrl.presentWithGif2();
            this.eventsService.getUserEvents().subscribe(response => {
              this.loadingCtrl.dismiss();
              if (response["status"] == 0) {
                this.showMessage(response["error"]);
              } else {
                var userEvents = response["filteredResults"];
                this.loaded = true;
                userEvents.forEach(userEvent => {
                  if (event.eventId == userEvent["eventId"]) {
                    event.registrationStatus = userEvent["registrationStatus"];
                  }
                });
              }
            }, error => {
              this.loadingCtrl.dismiss();
              this.showMessage("Error fetching Event Details");
            });
          } else {
            this.loadingCtrl.dismiss();
            this.showMessage("Error fetching Event Details");
          }
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error fetching Event Details");
      });
  }

  public register() {
    this.loadingCtrl.presentWithGif2();
    this.eventsService.validateEventRegistration(this.event)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response.status == 0) {
          this.showMessage(response.error);
        } else if (response.status == 1) {
          if (this.event.entryFee > 0) {
            this.capturePromoCode();
          } else {
            this.completeRegistration();
          }
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Registeration Event!");
      });
  }

  completeRegistration(paidFee?: number) {
    if (paidFee == null) {
      paidFee = 0;
    }
    this.loadingCtrl.presentWithGif2();
    this.eventsService.registerEvent(this.event, paidFee, this.promoCode)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response.status == 0) {
          this.showMessage(response.error);
        } else if (response.status == 1) {
            this.showSucessPage();
            this.event = response["event"];
        }
      }, (error: any) => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error Registeration Event!");
      });
  }

  showSucessPage() {
    this.navCtrl.push('EventRegistrationSuccessPage', {
      event: JSON.stringify(event)
    });
  }

  capturePromoCode() {
    this.promoCode = new PromoCodeModel();
    let alert = this.alertCtrl.create({
      title: 'Promo code',
      inputs: [
        {
          name: 'promocode',
        }
      ],
      buttons: [
        {
          text: 'Skip',
          role: 'skip',
          handler: data => {
            this.completeRegistration(this.event.entryFee);
            return true;
          }
        },
        {
          text: 'Apply',
          handler: data => {
            this.promoCode.id = null;
            this.promoCode.code = data.promocode;
            this.validatePromoCode().then(valid => {
              if (valid) {
                this.completeRegistration();
                alert.dismiss();
              }
            }).catch(error => {
              console.log(error);
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  validatePromoCode(): Promise<boolean> {
    let promise: Promise<boolean> = new Promise((resolve, reject) => {
      this.loadingCtrl.presentWithGif2();
      this.eventsService.validatePromocode(this.event, this.promoCode.code)
        .subscribe((promoCodeDetail: any) => {
          this.loadingCtrl.dismiss();
          if (promoCodeDetail.status == 1) {
            this.promoCode.id = promoCodeDetail["promotion"]["promocodeid"]
            this.promoCode.orginialPrice = promoCodeDetail["orginialPrice"];
            this.promoCode.discountedEventPrice = promoCodeDetail["discountedEventPrice"];
            resolve(true);
          } else {
            this.showMessage(promoCodeDetail.error);
            reject(promoCodeDetail.error);
          }
        }, (error: any) => {
          this.loadingCtrl.dismiss();
          this.showMessage("Error Validate PromoCode");
          reject(error);
        })
    });
    return promise;
  }

  goToPaymentGatewayPage() {
    /*this.navCtrl.push('PaymentAdmissionPage', {
      event: JSON.stringify(this.event)
    });*/ //TODO Integrate with Payment Gateway
    this.completeRegistration();
  }


  cancelEventRegistration(){
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: `Are you sure you want to cancel your registration of this Event?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this._cancelEventRegistration();
          }
        }
      ]
    });
    alert.present();
  }

  _cancelEventRegistration() {
    this.eventsService.cancelRegistration(this.event, this.cancellationNode)
      .subscribe(response => {
        if (response.status == 1) {
          this.navCtrl.pop();
        } else {
          this.showMessage(response.error);
        }
      }, (error: any) => {
        this.showMessage("Error Event cancel Registration");
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

  ionViewWillLeave() {
    //Make footer visiable while leaving the page.
    this.events.publish('hideHeader', { isHidden: false });
  }

}