import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { EventModel } from '../../models/events/event.model';
import { EventsService } from '../../providers/events/events.service';
import { AppContext } from '../../providers/shared/app-context';


@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  upcomingEvents: EventModel[];
  currentDate: Date;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private eventsService: EventsService,
    private loadingCtrl: LoadingProvider,
    private toastCtrl: ToastController,
    private appContext: AppContext) {
  }

  ionViewWillEnter() {
    this.currentDate = new Date();
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents() {    
    this.upcomingEvents = [];
    this.loadingCtrl.presentWithGif2();
    this.eventsService.getEvents()
      .subscribe(response => {
        this.loadingCtrl.dismiss();
        if (response["status"] == 0) {
          this.showMessage(response["error"]);
        } else {
          var events = response["eventList"];
          this.upcomingEvents = events;
          this.loadingCtrl.presentWithGif2();
          this.eventsService.getUserEvents()
            .subscribe(response => {
              this.loadingCtrl.dismiss();
              if (response["status"] == "0") {
                this.showMessage(response["error"]);
              } else {
                var userEvents = response["filteredResults"];
                userEvents.forEach(userEvent => {
                  events.forEach(event => {
                    if (event.eventId == userEvent["eventId"]) {
                      event.registrationStatus = userEvent["registrationStatus"];
                    }
                  });
                });
              }
            }, error => {
              this.loadingCtrl.dismiss();
              this.showMessage("Error fetching Events");              
            });
        }
      }, error => {
        this.loadingCtrl.dismiss();
        this.showMessage("Error fetching Events");        
      });
  }

  navigateToViewDetail(event: EventModel) {
    this.navCtrl.push('EventDetailPage', {
      event: event
    });
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
