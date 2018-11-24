import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeaturedClubsPage } from './featured-clubs';

@NgModule({
  declarations: [
    FeaturedClubsPage,
  ],
  imports: [
    IonicPageModule.forChild(FeaturedClubsPage),
  ],
})
export class FeaturedClubsPageModule {}
