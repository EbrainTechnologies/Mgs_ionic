import {Injectable} from '@angular/core';
import { Http, Headers, Response ,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AppSettings} from '../../app/app-settings';
//let apiUrl = 'http://localhost/';
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmailVerificationServiceProvider {

     public token: string;
    headers = new Headers({'Accept': 'application/json','content-type':'application/json'});
    options = new RequestOptions({headers: this.headers});

  constructor(public http: Http) {
    console.log('Hello EmailVerificationServiceProvider Provider');
  }


  userEmailVerify(params) : Observable<string[]> 
  {
  return this.http.post(AppSettings.API_STARTPOINT  +'user/sendotp', JSON.stringify(params),this.options)
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  userEmailVerifyValidate(params, type) : Observable<string[]> 
  {
  return this.http.post(AppSettings.API_STARTPOINT  +'user/verifyotp', JSON.stringify(params),this.options)
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
