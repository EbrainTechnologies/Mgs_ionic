  import { Component,ViewChild,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams,Nav, Events } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/auth-service/user-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/app-settings';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
  enableBack:boolean;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  public userInfo:any=[{}];
  rootPage='TabsPage';
  public userMenu:any=[{}];
  public response:any;
  public footerIsHidden: boolean;
  public startPoint=AppSettings.API_STARTPOINT;

  @ViewChild(Nav) nav:Nav;
  pages: PageInterface[] = this.userMenus();
 constructor(public toastCtrl: ToastController,
  public navCtrl: NavController,
  public navParams: NavParams,
  public userService:UserServiceProvider,
  public loadingCtrl: LoadingProvider,
  public events: Events) {
  events.subscribe('hideHeader', (data) => {
    this.footerIsHidden = data.isHidden;
  })
  }

  ngOnInit(){

   }


  userMenus(){
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo==null)
      this.userInfo=JSON.parse(localStorage.getItem('userRegisterDetail'))
    this.refreshUser(this.userInfo.user.userid);
     this.loadingCtrl.dismiss();
    if(this.userInfo.userFeature.displayName=="Player")
    {
      this.userMenu=
      [
        { title: 'Home Page', pageName: 'TabsPage', tabComponent: 'HomePage', index: 0, icon: 'ios-home-outline' },
        { title: 'Profile', pageName: 'MyProfilePage', icon: 'ios-person-outline' },
        { title: 'Sports You Play', pageName: 'SelectSportsPage', icon: 'ios-play' },
        { title: 'Events', pageName: 'EventsPage', icon: 'ios-calendar-outline', enableBack: true },
        { title: 'Favourite Players', pageName: 'FavouriteplayersPage', icon: 'ios-heart' },
        { title: 'Invite Friends', pageName: 'InvitefriendspagePage', icon: 'md-person-add' },
        { title: 'Contact Us', pageName: 'TabsPage', tabComponent: 'ContactPage', index: 1, icon: 'ios-contact-outline' },
      ];
    }
    if(this.userInfo.userFeature.displayName=="Coach")
    {
      this.userMenu=
      [
        { title: 'Home Page', pageName: 'TabsPage', tabComponent: 'HomePage', index: 0, icon: 'ios-home-outline' },
        { title: 'Profile', pageName: 'MyProfilePage', icon: 'ios-person-outline' },
        { title: 'Sports You Play', pageName: 'SelectSportsPage', icon: 'ios-play' },
        { title: 'Events', pageName: 'EventsPage', icon: 'ios-calendar-outline' },
        { title: 'Favourite Players', pageName: 'FavouriteplayersPage', icon: 'ios-heart' },
        { title: 'Invite Friends', pageName: 'InvitefriendspagePage', icon: 'md-person-add' },
        { title: 'Contact Us', pageName: 'TabsPage', tabComponent: 'ContactPage', index: 1, icon: 'ios-contact-outline' },
      ];
    }
    return this.userMenu;
   }

   refreshUser(userid){
    this.loadingCtrl.presentWithGif2();
       this.userService.getData(AppSettings.API_STARTPOINT+'user/user/'+userid)
         .subscribe(
         response => {
           this.loadingCtrl.dismiss();
           this.response=response;
           this.userInfo=this.response.user;
       },
       error =>  {
         alert(error);
         this.loadingCtrl.dismiss();
       });

   }



  openPage(page:PageInterface){
    let params = {};
    if (page.index) {
      params = { tabIndex: page.index };
    }

    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    }else{
      if (page.enableBack) {
        this.nav.push(page.pageName, params);
      } else {
        this.nav.setRoot(page.pageName, params);
      }
    }
  }
  isActive(page:PageInterface){
    let childNav = this.nav.getActiveChildNav();
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;


  }
}
