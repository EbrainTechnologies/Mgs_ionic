import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VenueGroundDetailPage } from './venue-ground-detail';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    VenueGroundDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(VenueGroundDetailPage),
     AgmCoreModule.forRoot({
      apiKey: "AIzaSyB1Du2l8y6hvieh7MR-tOZy7F4Q4_ZnibE",
      libraries: ["places"]
      
  })
  ],
})
export class VenueGroundDetailPageModule {}
