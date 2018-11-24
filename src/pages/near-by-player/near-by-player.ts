import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events  } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { SportService } from '../../providers/sport/sport.service'
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';
import { AppContext } from '../../providers/shared/app-context';


@IonicPage()
@Component({
  selector: 'page-near-by-player',
  templateUrl: 'near-by-player.html',
})
export class NearByPlayerPage {

  userInfo: any;
  userFeature: any;
  players: any = [];
  currentPlace: any = null;
  showLoadMore: boolean = false;
  imageBaseUrl = AppSettings.API_STARTPOINT;

  searchData = {
    "userId": null,
    "pageNumber": 1,
    "searchType": "LOCATION",
    "address": {},
    "distance": 50,
    "advAgeStart": 5,
    "advAgeEnd": 25,
    "sportId": null,
    "advRankingLevel": null,
    "advRankingRegion": null, //What is this? - Always it will be null
    "advFromRank": null,
    "advToRank": null,
    "club": null, // send the club uuid
    "userName": null,

    "advAge": { lower: 5, upper: 25 },
    "restrictHomeClub": false
  };

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private userService: UserServiceProvider,
    private sportService: SportService,
    private loadingCtrl: LoadingProvider,
    private appContext: AppContext,
    private events: Events) {
      this.navParams.data.autoSearch = true;
  }

  ionViewWillEnter() {
    if (this.navParams.data.autoSearch == false){
      //do auto search only first time
      return;
    }
    this.navParams.data.autoSearch = false;
    this.appContext.getUserInfo().subscribe(userInfo => {
      this.userInfo = userInfo;
      this.searchData.userId = userInfo.user.userid;
      if (userInfo.user.address != null) {
        this.currentPlace = this.userInfo.user.address[0].formattedAddress;
      }
      if (this.searchData.sportId == null) {
        this.sportService.getUserExpertise(this.userInfo.user.userid)
          .subscribe(response => {
            if (response["status"] == 0) {
              this.showMessage(response["error"]);
            } else {
              if (response["userExpertiseList"].length > 0) {
                this.searchData.sportId = response["userExpertiseList"][0]["sportId"];
                this.initializePlayers();
              } else {
                this.sportService.getSports().subscribe(response => {
                  if (response["status"] == 0) {
                    this.showMessage(response["error"]);
                  } else {
                    var sports = response["sportsList"];
                    this.initializePlayers();
                  }
                }, error => {
                  this.showMessage("Error fetching sports");
                });
              }
            }
          }, error => {
            this.showMessage("Error fetching user expertise");
          });
      } else {
          this.initializePlayers();
      }
    });
  }

  initializePlayers() {
    if (this.navParams.data != null && this.navParams.data['criteria'] != null) {

      this.searchData = this.navParams.data['criteria'];
      if (this.navParams.data["showLoadMore"] != null) {
        this.showLoadMore = this.navParams.data["showLoadMore"];
      }
      if (this.navParams.data['players'] != null) {
        this.players = this.navParams.data['players'];
      } else {
        this.loadPlayers();
      }
    }
    else {
      this.searchData.address = this.userInfo.user.address[0];
      this.loadPlayers();
    }
  }

  loadPlayers(append?: boolean) {
    if (append == true) {
      this.searchData.pageNumber += 1;
    }

    var searchData = JSON.parse(JSON.stringify(this.searchData));
    switch (this.searchData.searchType) {
      case 'LOCATION':
        searchData.userName = null;
        searchData.club = null;
        break;
      case 'USER':
        searchData.club = null;
        searchData.address = {};
        break;
      case 'CLUB':
        searchData.address = {};
        searchData.userName = null;
        searchData.distance = null;
        break;
    }

    delete searchData.advAge;
    delete searchData.restrictHomeClub;

    this.loadingCtrl.presentWithGif2();
    this.userService.findUsers(searchData)
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
          this.showLoadMore = false;
        } else {
          if (append) {
            this.players = this.players.concat(response["userResponseList"])
          } else {
            this.players = response["userResponseList"];
          }
          this.navParams.data['players'] = this.players;
          this.showLoadMore = response["isNextPage"];
        }
      },
      error => {
        this.loadingCtrl.dismiss();
        this.showMessage('Error fetching players!');
      });
  }

  showPlayerInfo(curPlayerInfo: any) {
    var params = {
      player: curPlayerInfo,
      criteria: this.searchData,
      players: this.players
    }

    this.navCtrl.push('FindPlayerInfoPage', params);
  }


  invitePlayer(curPlayerInfo) {
    var params = {
      player: curPlayerInfo,
      criteria: this.searchData
    }
    this.navCtrl.push('InvitingPlayerPage', params);
  }

  modifySearch() {

    this.events.subscribe('back-from-search', (params) => {
        this.events.unsubscribe('back-from-search'); // unsubscribe this event
        this.navParams.data = params;
        setTimeout(() => {
          this.initializePlayers();
        });
    });
      
    var params = {
      criteria: this.searchData
    }
    this.navCtrl.push('SearchParameterPage', params);
  }

  showMessage(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "top"
    });
    toast.present(toast);
  }

}
