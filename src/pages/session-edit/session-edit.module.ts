import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SessionEditPage } from './session-edit';

@NgModule({
  declarations: [
    SessionEditPage,
  ],
  imports: [
    IonicPageModule.forChild(SessionEditPage),
  ],
})
export class SessionEditPageModule {}