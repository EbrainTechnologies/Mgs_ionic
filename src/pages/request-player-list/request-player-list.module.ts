import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestPlayerListPage } from './request-player-list';

@NgModule({
  declarations: [
    RequestPlayerListPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestPlayerListPage),
  ],
})
export class RequestPlayerListPageModule {}
