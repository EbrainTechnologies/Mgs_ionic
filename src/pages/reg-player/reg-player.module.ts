import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegPlayerPage } from './reg-player';

@NgModule({
  declarations: [
    RegPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(RegPlayerPage),
  ],
})
export class RegPlayerPageModule {}
