import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../app/app-settings';
import { BaseService } from '../base.service';

@Injectable()
export class ClubService {
    constructor(private baseService: BaseService) {
    }

    getHomeClubs(userId: string): Observable<any> {
        var url = `${AppSettings.API_STARTPOINT}club/getclubbyuser/${userId}`;
        return this.baseService.getJSON(url);
    }
}