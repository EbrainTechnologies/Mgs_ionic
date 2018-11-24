import { Component, Input, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { AppSettings } from '../../app/app-settings';

@Component({
  selector: 'sport-layout',
  templateUrl: 'sportlayout.html'
})
export class SportlayoutComponent implements OnChanges {
  @Input('sport') sport: any;
  @Input('players') players: any[];

  width : any = 250;
  height : any = 250;

  constructor() {
  }

  ngOnChanges(): void {
    if ( this.sport != null){
      this.sport = this.sport.replace(' ', '-')
    }
    console.log(this.sport);

    if (this.players != null){
      this.players.forEach(player => {
        if (player['userProfileImage'] == null){
          player['userProfileImage'] = `${AppSettings.API_STARTPOINT}upload/viewuserimage/${player.userid}`;
        }
      });
    }
  }

}
