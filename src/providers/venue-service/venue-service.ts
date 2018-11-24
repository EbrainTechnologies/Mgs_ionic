import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppContext } from '../shared/app-context';
import { BaseService } from '../base.service';
import { AppSettings } from '../../app/app-settings';
import { VenuSearchModel } from '../../models/venu/venu-search.model';

@Injectable()
export class VenueServiceProvider {

    public token: string;
    headers = new Headers();
    options = new RequestOptions({ headers: this.headers });

    constructor(private baseService: BaseService, private appContext: AppContext) {
    }

    getNearByVenue(url: string, venuSearchModel: VenuSearchModel) {

        var params = {};
        var address = {};
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["address"] = venuSearchModel.address;
        params["ipAddress"] = this.appContext.ipAddress;
        params["pageNumber"] = 1;
        params["userId"] = this.appContext.userInfo.user.userid;
        address["latitude"] = venuSearchModel.address.latitude;
        address["longitude"] = venuSearchModel.address.longitude;
        
        var url = `${AppSettings.API_STARTPOINT}venue/getvenuebyfilter`;
        return this.baseService.postJSON(url, params, 'venueList');
    }

    getUserExpertiseGame(url: string) {
        return this.baseService.getJSON(url);
    }

    venueBooking(venueBooking: any): Observable<any[]> {

        var params = {};
        params["actionDoneBy"] = this.appContext.userInfo.user.displayName;
        params["userDeviceId"] = this.appContext.userInfo.user.userDeviceId;
        params["ipAddress"] = this.appContext.ipAddress;

        var sessionRegistration = {};
        sessionRegistration["venueid"] = venueBooking.venueid;
        sessionRegistration["userid"] = this.appContext.userInfo.user.userid;
        sessionRegistration["sportid"] = venueBooking.sportid;
        sessionRegistration["startTime"] = venueBooking.startTime;
        sessionRegistration["playtypeid"] = venueBooking.playtypeid;
        sessionRegistration["calendarDate"] = 'ACTIVE';
        sessionRegistration["endTime"] = venueBooking.endTime;
        sessionRegistration["status"] = '1';

        params["sessionRegistration"] = sessionRegistration;

        var url = `${AppSettings.API_STARTPOINT}session/booking/book`;

        return this.baseService.postJSON(url, params);
    }
}
