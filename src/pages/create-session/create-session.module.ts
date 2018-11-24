import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateSessionPage } from './create-session';
import {SportlayoutComponent} from '../../components/sportlayout/sportlayout';

@NgModule({
  declarations: [
    CreateSessionPage,
    SportlayoutComponent
  ],
  imports: [
    IonicPageModule.forChild(CreateSessionPage),
  ],
})
export class CreateSessionPageModule {}
