import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerInviteFormPage } from './player-invite-form';

@NgModule({
  declarations: [
    PlayerInviteFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerInviteFormPage),
  ],
})
export class PlayerInviteFormPageModule {}
