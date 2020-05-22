import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { ModalPerfilComponent } from '../../components/modal-perfil/modal-perfil.component';
import { ModalController, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  user: any = {};

  constructor( public mAuth: AuthService,
               private modalController: ModalController,
               private routerOutlet: IonRouterOutlet ) {}

  ngOnInit() {
     console.log(this.mAuth.usuario);
  }

  onlogout() {
    this.mAuth.logout();
  }

  async onPerfil() { 
    const modal = await this.modalController.create({
      component: ModalPerfilComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

}
