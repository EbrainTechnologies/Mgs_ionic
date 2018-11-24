import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindRankingPage } from './find-ranking';

@NgModule({
  declarations: [
    FindRankingPage,
  ],
  imports: [
    IonicPageModule.forChild(FindRankingPage),
  ],
})
export class FindRankingPageModule {}
