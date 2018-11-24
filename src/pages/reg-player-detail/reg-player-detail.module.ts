import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegPlayerDetailPage } from './reg-player-detail';

@NgModule({
  declarations: [
    RegPlayerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RegPlayerDetailPage),
  ],
})
export class RegPlayerDetailPageModule {}
