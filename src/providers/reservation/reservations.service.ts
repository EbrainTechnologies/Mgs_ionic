import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ReservationItemModel } from '../../models/reservations/reservation-item.model';
import {SessionModel} from '../../models/sessions/session.model';
import { AppContext } from '../shared/app-context';
import { BaseService } from '../base.service';
import { AppSettings } from '../../app/app-settings';


@Injectable()
export class ReservationsService {

    public token: string;
    headers = new Headers();
    options = new RequestOptions({ headers: this.headers });

    constructor(private baseService: BaseService, private appContext: AppContext) {
    }

    getReservations(status): Observable<ReservationItemModel[]> {
        var url = `${AppSettings.API_STARTPOINT}/reservation/getreservation/${this.appContext.userInfo.user.userid}/${status}`;
        return this.baseService.getJSON(url, 'bookings');
    }


    getScheduledReservations(params: any = null): Observable<ReservationItemModel[]> {
        return this.getReservations("SCHEDULED");
    }

    getCompletedReservations(params: any = null): Observable<ReservationItemModel[]> {
        return this.getReservations("COMPLETED");
    }

    getCancelledReservations(params: any = null): Observable<ReservationItemModel[]> {
        return this.getReservations("CANCELLED");
    }

}