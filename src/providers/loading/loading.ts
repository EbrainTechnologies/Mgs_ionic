import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
/*
  Generated class for the LoadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingProvider {
  loading: Loading;
  constructor(public http: HttpClient,public loadingCtrl: LoadingController) {
    console.log('Hello LoadingProvider Provider');
  }
  presentWithGif2() {
    this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        cssClass: 'my-loading-class',
        content: `
      <div class="custom-spinner-container">
        <img class="loading" width="200px" height="200px" src="assets/imgs/15.gif" />
      </div>`
    });
    
    
    return this.loading.present();
  }
  presentWithGif3() {
    this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        cssClass: 'my-loading-class',
        content: `
      <div class="custom-spinner-container">
        <img class="loading" width="100px" height="200px" src="assets/imgs/lg.comet-spinner.gif" />
      </div>`
    });
    
    
    return this.loading.present();
  }
  dismiss() {
    return new Promise((resolve, reject) => {
        if (this.loading) {
            return this.loading.dismiss(resolve(true)).catch(error => {
                console.log('loading error: ', error);
            });
        } else {
            resolve(true);
        }
    });
  
  }  
}
