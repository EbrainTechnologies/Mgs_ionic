import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyCreatePage } from './family-create';

@NgModule({
  declarations: [
    FamilyCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyCreatePage),
  ],
})
export class FamilyCreatePageModule {}
