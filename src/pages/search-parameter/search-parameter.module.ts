import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchParameterPage } from './search-parameter';

@NgModule({
  declarations: [
    SearchParameterPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchParameterPage),
  ],
})
export class SearchParameterPageModule {}
