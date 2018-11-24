import { Component, Input } from '@angular/core';
import { PaymentGatewayModel } from '../../models/events/payment-gateway.model'
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppContext } from '../../providers/shared/app-context';
import { UserModel } from '../../models/shared/user.model';
import { ReservationItemModel } from '../../models/reservations/reservation-item.model';

/**
 * Generated class for the PlayerDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-reservationtype',
  templateUrl: 'reservation-type-selector.html',
})
export class ReservationTypeSelectorPage {
    
  
  @Input() reservation: ReservationItemModel;
  @Input() user: UserModel;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appContext: AppContext) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservationTypeSelectorPage');
  }
}
