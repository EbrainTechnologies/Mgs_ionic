import { Component } from '@angular/core';
import { EventModel } from '../../models/events/event.model';
import { PaymentGatewayModel } from '../../models/events/payment-gateway.model'
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlayerDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paymentAddmission',
  templateUrl: 'payment-gateway.html',
})
export class PaymentAdmissionPage {

  event: EventModel;
  paymentGatewayModel: PaymentGatewayModel;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let event = this.navParams.get('event');
    this.event = JSON.parse(event);
  }

  pay(){
    this.showSucessPage();
  }

  showSucessPage(){
    this.navCtrl.push('EventRegistrationSuccessPage', {
      event: JSON.stringify(this.event)
    });
  }

  cancel() {
    this.paymentGatewayModel = null;
    this.navCtrl.push('EventDetailPage', {
      event: JSON.stringify(this.event)
    });
  }

  ionViewDidLoad() {
    this.paymentGatewayModel = new PaymentGatewayModel();
    console.log('ionViewDidLoad PaymentAdmissionPage');
  }
}
