import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomeSliderPage } from './welcome-slider';

@NgModule({
  declarations: [
    WelcomeSliderPage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomeSliderPage),
  ],
})
export class WelcomeSliderPageModule {}
