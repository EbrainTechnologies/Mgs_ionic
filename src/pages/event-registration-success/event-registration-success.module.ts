import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventRegistrationSuccessPage } from './event-registration-success';

@NgModule({
  declarations: [
    EventRegistrationSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(EventRegistrationSuccessPage),
  ],
})
export class EventRegistrationSuccessPageModule {}
