import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservationsPage } from './reservations';
import{ReservationTypeSelectorPageModule} from '../reservation-type-selector/reservation-type-selector.module'

@NgModule({
  declarations: [
    ReservationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservationsPage),
    ReservationTypeSelectorPageModule
  ],
})
export class ReservationsPageModule {}
