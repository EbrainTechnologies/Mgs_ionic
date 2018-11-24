import {Injectable} from '@angular/core';
import { Http, Headers, Response ,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AppSettings} from '../../app/app-settings';

@Injectable()
export class HomeServiceProvider {

     public token: string;
    headers = new Headers();
    options = new RequestOptions({headers: this.headers});

  constructor(public http: Http) {
    console.log('Hello HomeServiceProvider Provider');
  }


  postData() : Observable<string[]> 
  {
  return this.http.get(AppSettings.API_STARTPOINT+'app/cards',this.options)
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  private extractData(res: Response) {
  let body = res.json();
  return body || { };
}

private handleError (error: Response | any) {
  let errMsg: string;
  if (error instanceof Response) {
    const body = error.json() || '';
    const err = body.error || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Observable.throw(errMsg);
}

}
