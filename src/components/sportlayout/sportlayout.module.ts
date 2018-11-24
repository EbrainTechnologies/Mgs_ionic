import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SportlayoutComponent } from './sportlayout';

@NgModule({
  declarations: [
    SportlayoutComponent
   ],
  imports: [
    IonicModule,
  ],
  exports: [
    SportlayoutComponent
  ],
  entryComponents:[
    SportlayoutComponent
  ]
})
export class SportlayoutComponentModule {}