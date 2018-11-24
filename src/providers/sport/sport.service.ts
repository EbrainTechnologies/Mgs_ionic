import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppSettings } from '../../app/app-settings';

// Models import
import { SportModel } from '../../models/shared/sport.model';
import { SportPlayTypeModel } from '../../models/shared/sport.model';

import { BaseService } from '../base.service';

@Injectable()
export class SportService {

    constructor(private baseService: BaseService) {
    }

    getRankingTypes(sportId : any) : Observable<any[]>  {
        var url = `${AppSettings.API_STARTPOINT}sport/rankingtype/${sportId}`;
        return this.baseService.getJSON(url);    
    }

    getSports() : Observable<SportModel[]>  {
        var url = `${AppSettings.API_STARTPOINT}sport/sport`;
        return this.baseService.getJSON(url);
    }

    getUserExpertise(userId: string) : Observable<any>{
        var url = `${AppSettings.API_STARTPOINT}sport/userexpertise/${userId}`;
        return this.baseService.getJSON(url);
    }
    
}
