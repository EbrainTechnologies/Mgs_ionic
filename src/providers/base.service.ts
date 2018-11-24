import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppContext } from "./shared/app-context";
import { UserModel } from "../models/shared/user.model";
import { Injectable } from "@angular/core";

@Injectable()
export class BaseService{

    headers = new Headers({ 'Accept': 'application/json', 'content-type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private appContext: AppContext) {
        
    }
   
    getJSON(url: string, attribute?: string): any{

        return this.http.get(url)
            .map((res: Response) => {
                var resJSON = this.handleJSONResponse(res);
                if (attribute != null){
                    resJSON = resJSON[attribute];
                }
                return resJSON;
            })
            .catch((error) => {
                return this.handleError(error);
            });
    }

    postJSON(url: string, params: any, attribute?: string){
        return this.http.post(url, params, this.options)
            .map((res: Response) => {
                var resJSON = this.handleJSONResponse(res);
                if (attribute != null){
                    resJSON = resJSON[attribute];
                }
                return resJSON;
            })
            .catch((error) => {
                return this.handleError(error);
            });
    }

    putJSON(url: string, params: any, attribute?: string){
        return this.http.put(url, params, this.options)
            .map((res: Response) => {
                var resJSON = this.handleJSONResponse(res);
                if (attribute != null){
                    resJSON = resJSON[attribute];
                }
                return resJSON;
            })
            .catch((error) => {
                return this.handleError(error);
            });
    }

    deleteJSON(url: string, attribute?: string){
        return this.http.delete(url, this.options)
            .map((res: Response) => {
                var resJSON = this.handleJSONResponse(res);
                if (attribute != null){
                    resJSON = resJSON[attribute];
                }
                return resJSON;
            })
            .catch((error) => {
                return this.handleError(error);
            });
    }

    protected handleJSONResponse(res: Response): any {
        let body = res.json();
        return body || {};
    }

    protected handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}