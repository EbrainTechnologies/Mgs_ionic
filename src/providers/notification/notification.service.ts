import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppContext } from '../shared/app-context';
import { BaseService } from '../base.service';
import { AppSettings } from '../../app/app-settings';

@Injectable()
export class NotificationService {

    public token: string;
    headers = new Headers();
    options = new RequestOptions({ headers: this.headers });

    constructor(private baseService: BaseService, private appContext: AppContext) {
    }

    getMatchInviteNotifications(): Observable<any[]> {
        var url = `${AppSettings.API_STARTPOINT}/notification/usernotification/${this.appContext.userInfo.user.userid}`;
        return this.baseService.getJSON(url);
    }
    
    getNotificationsCount(): Observable<any> {
        var url = `${AppSettings.API_STARTPOINT}/notification/count/${this.appContext.userInfo.user.userid}`;
        return this.baseService.getJSON(url);
    } 

     getPlayerInviteNotifications(status: string): Observable<any[]> {
         var url = `${AppSettings.API_STARTPOINT}/notification/player/${status}/${this.appContext.userInfo.user.userid}`
        return this.baseService.getJSON(url);
    }
}