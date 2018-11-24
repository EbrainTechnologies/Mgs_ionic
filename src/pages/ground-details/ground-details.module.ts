import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroundDetailsPage } from './ground-details';

@NgModule({
  declarations: [
    GroundDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroundDetailsPage),
  ],
})
export class GroundDetailsPageModule {}
