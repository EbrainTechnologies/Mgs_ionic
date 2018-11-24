import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { NetworkInterface } from '@ionic-native/network-interface';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { MyApp } from './app.component';


import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPageModule } from './../pages/login/login.module';
import { SignupPage } from '../pages/signup/signup';
import { HttpClientModule } from '@angular/common/http';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BaseService } from '../providers/base.service';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from '../providers/auth-service/user-service';
import { HomeServiceProvider } from '../providers/auth-service/home-service';
import { VenueServiceProvider } from '../providers/venue-service/venue-service';

import {SessionService} from '../providers/session/session-service';
import {SportService} from '../providers/sport/sport.service';
import { EmailVerificationServiceProvider } from '../providers/auth-service/emailverify-service';
import { AgmCoreModule } from '@agm/core';
import { SplashPage } from '../pages/splash/splash';
import { LoadingProvider } from '../providers/loading/loading';
import { EventsService } from '../providers/events/events.service';
import { NotificationService } from '../providers/notification/notification.service';
import { ClubService } from '../providers/club/club-service';
import { ReservationsService } from "../providers/reservation/reservations.service";
import { AppContext } from '../providers/shared/app-context';

import {Camera} from '@ionic-native/camera';
import {File} from "@ionic-native/file";


@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    SignupPage,
    SplashPage
  ],
  imports: [
    BrowserModule,HttpModule,HttpClientModule,
    LoginPageModule,
    IonicModule.forRoot(
      MyApp, 
      {
        tabsHideOnSubPages: true
      }),
      AgmCoreModule.forRoot({
      apiKey: "AIzaSyB1Du2l8y6hvieh7MR-tOZy7F4Q4_ZnibE",
      libraries: ["places"]
  })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    SignupPage,
    SplashPage
   
  ],
  providers: [
    DatePipe,
    UniqueDeviceID,
    Network,
    NetworkInterface,
    Geolocation,
    LaunchNavigator,
    BaseService,
    StatusBar,
    SplashScreen,
    Camera,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    HomeServiceProvider,
    EmailVerificationServiceProvider,
    EventsService,
    LoadingProvider,
    UserServiceProvider,
    AppContext,
    SessionService,
    SportService,
    ReservationsService,
    VenueServiceProvider,
    NotificationService,
    ClubService
  ]
})
export class AppModule {}
