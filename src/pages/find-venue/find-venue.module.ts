import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindVenuePage } from './find-venue';

@NgModule({
  declarations: [
    FindVenuePage,
  ],
  imports: [
    IonicPageModule.forChild(FindVenuePage),
  ],
})
export class FindVenuePageModule {}
