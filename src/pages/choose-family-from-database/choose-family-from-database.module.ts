import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseFamilyFromDatabasePage } from './choose-family-from-database';

@NgModule({
  declarations: [
    ChooseFamilyFromDatabasePage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseFamilyFromDatabasePage),
  ],
})
export class ChooseFamilyFromDatabasePageModule {}
