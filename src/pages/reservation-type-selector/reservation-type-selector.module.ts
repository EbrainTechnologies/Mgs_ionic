import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservationTypeSelectorPage } from './reservation-type-selector';
import { CommonModule } from '@angular/common';  

@NgModule({
  declarations: [
    ReservationTypeSelectorPage,
  ],
  exports: [
    ReservationTypeSelectorPage,
  ],
  imports:[
    CommonModule
  ],
})
export class ReservationTypeSelectorPageModule {}
