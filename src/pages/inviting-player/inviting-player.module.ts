import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvitingPlayerPage } from './inviting-player';

@NgModule({
  declarations: [
    InvitingPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(InvitingPlayerPage),
  ],
})
export class InvitingPlayerPageModule {}
