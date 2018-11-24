import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpcomingServicePage } from './upcoming-service';

@NgModule({
  declarations: [
    UpcomingServicePage,
  ],
  imports: [
    IonicPageModule.forChild(UpcomingServicePage),
  ],
})
export class UpcomingServicePageModule {}
