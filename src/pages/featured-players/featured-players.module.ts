import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeaturedPlayersPage } from './featured-players';

@NgModule({
  declarations: [
    FeaturedPlayersPage,
  ],
  imports: [
    IonicPageModule.forChild(FeaturedPlayersPage),
  ],
})
export class FeaturedPlayersPageModule {}
