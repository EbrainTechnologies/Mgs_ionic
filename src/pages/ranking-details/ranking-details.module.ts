import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RankingDetailsPage } from './ranking-details';

@NgModule({
  declarations: [
    RankingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RankingDetailsPage),
  ],
})
export class RankingDetailsPageModule {}
