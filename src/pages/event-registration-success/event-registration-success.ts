import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { EventModel } from '../../models/events/event.model';


/**
 * Generated class for the EventDetail page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-registration-success',
  templateUrl: 'event-registration-success.html',
})

export class EventRegistrationSuccessPage { 
    event:EventModel;

    constructor(public navParams: NavParams ) {
        let event = this.navParams.get('event');
        this.event = JSON.parse(event);
    }
}