import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VenueDetailPage } from './venue-detail';

@NgModule({
  declarations: [
    VenueDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(VenueDetailPage),
  ],
})
export class VenueDetailPageModule {}
