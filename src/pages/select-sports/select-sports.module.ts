import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSportsPage } from './select-sports';

@NgModule({
  declarations: [
    SelectSportsPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectSportsPage),
  ],
})
export class SelectSportsPageModule {}
