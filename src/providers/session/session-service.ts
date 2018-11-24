import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppContext } from '../shared/app-context';
import { BaseService } from '../base.service';
import { AppSettings } from '../../app/app-settings';
import { ReservationItemModel } from '../../models/reservations/reservation-item.model';

@Injectable()
export class SessionService {

    public token: string;
    headers = new Headers();
    options = new RequestOptions({ headers: this.headers });

    constructor(private baseService: BaseService, private appContext: AppContext) {
    }

    getNearByVenue(): Observable<any[]> {

        var params = {};


        var address = {};
        address["latitude"] = this.appContext.latitude;
        address["longitude"] = this.appContext.longitude;

        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["userId"] = this.appContext.userInfo.user.userid;
        params["address"] = address;
        params["pageNumber"] = 1;

        var url = `${AppSettings.API_STARTPOINT}venue/getvenuebyfilter`;

        return this.baseService.postJSON(url, params, 'venueList');
    }

    getSessions(status: string): Observable<any[]> {
        var url = `${AppSettings.API_STARTPOINT}session/session/${this.appContext.userInfo.user.userid}/${status}`;
        return this.baseService.getJSON(url);
    }

    createSession(model: any) {

        var url = `${AppSettings.API_STARTPOINT}session/session`;

        return this.baseService.postJSON(url, model);
    }

    updateSession(model: any) {

        var url = `${AppSettings.API_STARTPOINT}session/session`;

        return this.baseService.putJSON(url, model, 'venueList');
    }

    getSessionById(sessionId: string) {
        var url = `${AppSettings.API_STARTPOINT}session/session/${sessionId}`;
        return this.baseService.getJSON(url);
    }

    prevalidate(sessionId, organizerId): Observable<any[]> {

        var params = {};

        var sessionRegistration = {};
        sessionRegistration["sessionid"] = sessionId;
        sessionRegistration["userid"] = this.appContext.userInfo.user.userid;
        sessionRegistration["organizerId"] = organizerId;
        sessionRegistration["displayName"] = this.appContext.userInfo.user.displayName;
        sessionRegistration["registrationStatus"] = 'ACTIVE';
        sessionRegistration["createdBy"] = this.appContext.userInfo.user.userName;
        sessionRegistration["updatedBy"] = this.appContext.userInfo.user.userName;


        params["sessionRegistration"] = sessionRegistration;
        params["userId"] = this.appContext.userInfo.user.userid;
        params["sessionId"] = sessionId;
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["actionBy"] = this.appContext.userInfo.user.userName;

        var url = `${AppSettings.API_STARTPOINT}session/booking/prevalidation`;

        return this.baseService.putJSON(url, params);
    }

    register(sessionId, organizerId): Observable<any[]> {

        var params = {};

        var sessionRegistration = {};
        sessionRegistration["sessionid"] = sessionId;
        sessionRegistration["userid"] = this.appContext.userInfo.user.userid;
        sessionRegistration["organizerId"] = organizerId;
        sessionRegistration["displayName"] = this.appContext.userInfo.user.displayName;
        sessionRegistration["registrationStatus"] = 'ACTIVE';
        sessionRegistration["createdBy"] = this.appContext.userInfo.user.displayName;
        sessionRegistration["updatedBy"] = this.appContext.userInfo.user.displayName;


        params["sessionRegistration"] = sessionRegistration;
        params["userId"] = this.appContext.userInfo.user.userid;
        params["sessionId"] = sessionId;
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["actionBy"] = this.appContext.userInfo.user.displayName;

        var url = `${AppSettings.API_STARTPOINT}session/booking/book`;

        return this.baseService.postJSON(url, params);
    }

    cancelBooking(sessionBooking: any): Observable<any[]> {

        var params = {};
        params["userId"] = this.appContext.userInfo.user.userid;
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["actionBy"] = this.appContext.userInfo.user.displayName;

        var sessionRegistration = {};
        sessionRegistration["registrationid"] = sessionBooking.registrationid;
        sessionRegistration["sessionid"] = sessionBooking.sessionid;
        sessionRegistration["userid"] = this.appContext.userInfo.user.userid;
        sessionRegistration["organizerId"] = sessionBooking.organizerId;
        sessionRegistration["displayName"] = sessionBooking.organizerName;
        sessionRegistration["registrationStatus"] = 'CANCELLED';
        sessionRegistration["createdBy"] = sessionBooking.organizerName;
        sessionRegistration["updatedBy"] = this.appContext.userInfo.user.displayName;

        params["sessionRegistration"] = sessionRegistration;

        var url = `${AppSettings.API_STARTPOINT}session/booking/cancel`;

        return this.baseService.postJSON(url, params);
    }

    cancelPlayerBooking(reservation: ReservationItemModel): Observable<any[]> {

        var params = {};
        params["userId"] = this.appContext.userInfo.user.userid;
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["actionBy"] = this.appContext.userInfo.user.displayName;

        var sessionRegistration = {}; 
        sessionRegistration["registrationid"] = reservation.sessionRegistrationId;
        sessionRegistration["sessionid"] = reservation.sessionId;
        sessionRegistration["userid"] = this.appContext.userInfo.user.userid;
        sessionRegistration["organizerId"] = reservation.userId;
        sessionRegistration["displayName"] = reservation.displayName;
        sessionRegistration["registrationStatus"] = 'CANCELLED';
        sessionRegistration["createdBy"] = reservation.displayName;
        sessionRegistration["updatedBy"] = this.appContext.userInfo.user.displayName;

        params["sessionRegistration"] = sessionRegistration;

        var url = `${AppSettings.API_STARTPOINT}session/booking/cancel`;

        return this.baseService.postJSON(url, params);
    }

    cancel(session: any)  : Observable<any[]> {
        var url = `${AppSettings.API_STARTPOINT}session/cancel/${session.sessionid}`;

        return this.baseService.deleteJSON(url);
    }

    rejectPlayerNotification(session: any): Observable<any[]> {
       
        var params = {};
        params["userId"] = this.appContext.userInfo.user.userid;
        params["sessionId"] = session.sessionid;
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;
        params["actionBy"] = this.appContext.userInfo.user.displayName;
        params["registrationStatus"] = 'REJECTED';

        var url = `${AppSettings.API_STARTPOINT}session/booking/reject/playerinvite`;
        return this.baseService.postJSON(url, params);
    }


}
