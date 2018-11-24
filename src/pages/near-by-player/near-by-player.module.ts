import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearByPlayerPage } from './near-by-player';

@NgModule({
  declarations: [
    NearByPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(NearByPlayerPage),
  ],
})
export class NearByPlayerPageModule {}
