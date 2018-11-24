import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentAdmissionPage } from './payment-gateway';

@NgModule({
  declarations: [
    PaymentAdmissionPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentAdmissionPage),
  ],
})
export class PaymentAdmissionPageModule {}
