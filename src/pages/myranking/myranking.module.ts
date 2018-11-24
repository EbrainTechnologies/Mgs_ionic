import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyrankingPage } from './myranking';

@NgModule({
  declarations: [
    MyrankingPage,
  ],
  imports: [
    IonicPageModule.forChild(MyrankingPage),
  ],
})
export class MyrankingPageModule {}
