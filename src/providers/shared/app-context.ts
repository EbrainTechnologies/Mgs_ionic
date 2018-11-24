import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { UserModel } from '../../models/shared/user.model';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Network } from '@ionic-native/network';
import { NetworkInterface } from '@ionic-native/network-interface';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Platform } from 'ionic-angular';
import { UserInfoModel } from '../../models/shared/user-info.model';

@Injectable()
export class AppContext {

    userInfo: UserInfoModel;
    ipAddress: string;
    latitude: number;
    longitude: number;
    
    constructor(
        private platform: Platform, 
        private uniqueDeviceID: UniqueDeviceID,
        private network: Network,
        private networkInterface: NetworkInterface,
        private geolocation: Geolocation,
        private launchNavigator: LaunchNavigator
    ){
        this.network.onConnect().subscribe(() => {
            setTimeout(() => {
                this.initializeIPAddress();
            });
        });
        
        this.initializeIPAddress();
        this.initializeGeoLocation();
        this.getUserInfo().subscribe(response => {});
    }

    initializeIPAddress(){
        var networkAPI = this.networkInterface.getCarrierIPAddress();
        if (this.network.type === 'wifi') {
            networkAPI = this.networkInterface.getWiFiIPAddress();
        } 
        networkAPI.then(address => {
            this.ipAddress = address.ip;
        }, error => {
            this.ipAddress = "no-ip-address";
            console.log(error);
        });
    }

    initializeGeoLocation(){
        this.platform.ready().then(()=>{
            this.geolocation.getCurrentPosition({timeout: 20000}).then((resp) => {
                if (resp != null && resp.coords != null){
                    this.latitude = resp.coords.latitude;
                    this.longitude = resp.coords.longitude;
                }
               
            }).catch((error) => {
                console.log('Error getting location', error);
            });
        });

        this.geolocation.watchPosition().subscribe(resp => {
            if (resp != null && resp.coords != null){
                this.latitude = resp.coords.latitude;
                this.longitude = resp.coords.longitude;
            }
        });
    }

    openMap(latitude?: number, longitude?: number){
        if (latitude == null){
            latitude = this.latitude;
        }

        if (longitude == null) {
            longitude = this.longitude;
        }
        this.launchNavigator.navigate([latitude, longitude]).then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator', error)
        );
    }

    setUserInfo(userInfo: UserInfoModel){
        this.userInfo = userInfo;
        this.userInfo.user.displayName = this.userInfo.user.firstName;
        if (this.userInfo.user.lastName != null){
            this.userInfo.user.displayName += (" " + this.userInfo.user.lastName);
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        if (this.userInfo.user.userDeviceId == null){
            this.uniqueDeviceID.get().then(uuid => {
                this.userInfo.user.userDeviceId = uuid;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }).catch(error => {
                //TODO check Browser?
                this.userInfo.user.userDeviceId = 'browser';
                console.log(error);
            });
        }
    }

    getUserInfo() : Observable<UserInfoModel>  {
        var appContext = this;
        let observable: Observable<UserInfoModel> = new Observable(function(observer){
            if (appContext.userInfo == null){
                if (localStorage.getItem('userInfo') == null){
                    observer.next(null);
                    return;
                }
                appContext.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            }
            if (appContext.userInfo.user.userDeviceId == null){
                appContext.uniqueDeviceID.get().then(uuid => {
                    appContext.userInfo.user.userDeviceId = uuid;
                    observer.next(appContext.userInfo);
                }).catch(error => {
                    //TODO check Browser?
                    appContext.userInfo.user.userDeviceId = 'browser';
                    console.log(error);
                    observer.next(appContext.userInfo);
                });
                
            } else {
                observer.next(appContext.userInfo);
            }
        });
        return observable;
    }

    getUser(): Observable<UserModel> {
        var appContext = this;
        let observable: Observable<UserModel> = new Observable(function(observer){
            appContext.getUserInfo().subscribe(userInfo => {
                observer.next(userInfo.user);
            });
        });

        return observable;
    }

    getCurrency() : Observable<any> {
        let currency = '';
        return Observable.of(currency);
    }

    getDateTimeFormat(): string {
        if (this.userInfo && this.userInfo.user && this.userInfo.user.dateTimeFormat != null){
            return this.userInfo.user.dateTimeFormat;
        } else {
            return 'MM/DD/YYYY h:mm a';  
        }
    }

    getDateFormat(): string {
        if (this.userInfo && this.userInfo.user && this.userInfo.user.dateFormat != null){
            return this.userInfo.user.dateFormat;
        } else {
            return 'MM/DD/YYYY';  
        }
    }

    getTimeFormat(): string {
        if (this.userInfo && this.userInfo.user && this.userInfo.user.timeFormat != null){
            return this.userInfo.user.timeFormat;
        } else {
            return 'h:mm a';  
        }
    }

    getFormattedDateTime(date: any) : string {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        date = moment(date).format(this.getDateTimeFormat());
        return date;
    }

    getFormattedDate(date: any) : string {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        date = moment(date).format(this.getDateFormat());
        return date;
    }

    getFormattedTime(date: any) : string {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        date = moment(date).format(this.getTimeFormat());
        return date;
    }

    getMinStartDate() {
        var date = moment().format("YYYY-MM-DD");
        return date;
    }

    getMaxStartDate() {
        var date = moment().add(1, "y").format("YYYY-MM-DD");
        return date;
    }
    
}
