import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {


  constructor( private authService: AuthService,
               public platform: Platform ) {}

  ionViewWillEnter() {
    console.log('tabs: ', this.authService.islogeado());
    this.authService.getUbicacion();
  }

}
