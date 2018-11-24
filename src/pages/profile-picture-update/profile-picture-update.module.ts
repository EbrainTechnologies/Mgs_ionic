import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePictureUpdatePage } from './profile-picture-update';

@NgModule({
  declarations: [
    ProfilePictureUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePictureUpdatePage),
  ],
})
export class ProfilePictureUpdatePageModule {}
