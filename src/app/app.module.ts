import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { firebaseConfig } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ComponentsModule } from './components/components.module';


import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/es';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { SwipeCardsModule } from 'ng2-swipe-cards';
import { IonicStorageModule } from '@ionic/storage';

registerLocaleData(localeAr, 'es');



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            SwipeCardsModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            ComponentsModule,
            AngularFireModule.initializeApp(firebaseConfig),
            AngularFireAuthModule,
            AngularFireDatabaseModule,
            AngularFirestoreModule,
            IonicStorageModule.forRoot()
            // FormsModule,
            // ReactiveFormsModule
          ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es'
    },
    StatusBar,
    Keyboard,
    SplashScreen,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  // condicion = true;

  constructor( private platform: Platform) {
    // if(this.condicion) {
    //   this.router.navigateByUrl('/inicio');
    // }
  }

}
