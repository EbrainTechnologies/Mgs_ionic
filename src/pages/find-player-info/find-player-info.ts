import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

@IonicPage()
@Component({
  selector: 'page-find-player-info',
  templateUrl: 'find-player-info.html',
})
export class FindPlayerInfoPage {
  private player: any;

  imageBaseUrl: string = AppSettings.API_STARTPOINT;
  public currentPlace: any = null;
  public favoriteUsers: any;


  constructor(private userService: UserServiceProvider,
    private navParams: NavParams,
    private loadingCtrl: LoadingProvider,
    private toastCtrl: ToastController) {
      this.player = this.navParams.data['player'];
}

  ionViewWillEnter() {
    this.player['userProfileImage'] = `${AppSettings.API_STARTPOINT}upload/viewuserimage/${this.player.userid}`;
    this.currentPlace = this.player.locationText;
  }

  markFavorite(favorite: number){
    this.userService.markAsFavoritePlayer(this.player, favorite)
      .subscribe(response => {
        if (response["status"] == 0){
          this.showToast(response["error"]);
        } else {
          this.player["isFavoriteUser"] = (favorite == 1);
        }
      }, error => {
          this.showToast("Error marking player as favorite");
      });
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
  }
}
