import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindPlayerInfoPage } from './find-player-info';

@NgModule({
  declarations: [
    FindPlayerInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(FindPlayerInfoPage),
  ],
})
export class FindPlayerInfoPageModule {}
