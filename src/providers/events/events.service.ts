import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppSettings } from '../../app/app-settings';
import { EventModel } from "../../models/events/event.model";
import { BaseService } from '../base.service';
import { AppContext } from '../shared/app-context';
import { PromoCodeModel } from '../../models/events/promo-code.model';


@Injectable()
export class EventsService  {

    constructor(
        private baseService: BaseService,
        private appContext: AppContext){

    }

    public getEvents(): Observable<EventModel[]> {
        var params = {};
        params["userId"] = this.appContext.userInfo.user.userid;
        params["status"] = "ACTIVE";
        params["latitude"] = this.appContext.latitude;
        params["longitude"] = this.appContext.longitude;

        var url = `${AppSettings.API_STARTPOINT}event/eventsbyfilters`;
        return this.baseService.putJSON(url, params);
    }

    public getEvent(eventId: string): Observable<EventModel> {
        var url = `${AppSettings.API_STARTPOINT}event/event/${eventId}`;
        return this.baseService.getJSON(url);
    }

    validateEventRegistration(event: EventModel): Observable<any> {
        var params = {};
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["userId"] = this.appContext.userInfo.user.userid;
        params["eventId"] = event.eventId;
        params["actionBy"] = this.appContext.userInfo.user.displayName;
        params["status"] = "ACTIVE";

        var url = `${AppSettings.API_STARTPOINT}event/prevalidateeventregistration`;
        return this.baseService.putJSON(url, params);
    }

    public registerEvent(event: EventModel, paidFee: number, promoCode: PromoCodeModel): Observable<any> {
        var params = {};
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        var eventRegistration = {};
        eventRegistration["userId"] = this.appContext.userInfo.user.userid;
        eventRegistration["eventId"] = event.eventId;
        eventRegistration["userDisplayName"] = this.appContext.userInfo.user.displayName;
        eventRegistration["registrationStatus"] = "ACTIVE";
        if (promoCode != null){
            eventRegistration["promoCodeId"] = promoCode.id;
            eventRegistration["promoCode"] = promoCode.code;
        }
        eventRegistration["paidFee"] = paidFee;
        params["eventRegistration"] = eventRegistration

        var url = `${AppSettings.API_STARTPOINT}event/eventregistration`;
        return this.baseService.postJSON(url, params);
    }

    cancelRegistration(event: EventModel, node: string): Observable<any> {
        var params = {};
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["userId"] = this.appContext.userInfo.user.userid;
        params["eventId"] = event.eventId;
        params["actionBy"] = this.appContext.userInfo.user.displayName;
        params["status"] = "CANCELLED";
        params["note"] = node;

        var url = `${AppSettings.API_STARTPOINT}event/manageeventregistration`;
        return this.baseService.putJSON(url, params);
    }

    validatePromocode(event: EventModel, promoCode: string) : Observable<any>{
        var params = {};
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["userId"] = this.appContext.userInfo.user.userid;
        params["eventId"] = event.eventId;
        params["promoCode"] = promoCode;
        params["actionBy"] = this.appContext.userInfo.user.displayName;
        params["status"] = "ACTIVE";

        let url = `${AppSettings.API_STARTPOINT}event/eventpromocodevalidation`;
        return this.baseService.putJSON(url, params);
    }

    public getUserEvents(): Observable<any[]> {
        var userId = this.appContext.userInfo.user.userid;
        var url = `${AppSettings.API_STARTPOINT}event/listeventregistration/${userId}/ALL`;
        return this.baseService.getJSON(url);
    }

}
