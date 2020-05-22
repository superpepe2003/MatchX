import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { ModalChatComponent } from '../../components/modal-chat/modal-chat.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {

  usuario: any[] = [];
  subsCargaMatch: Subscription;

  constructor( private service: AuthService,
               private modalController: ModalController,
               private routerOutlet: IonRouterOutlet ) {}

  async ngOnInit() {

    this.subsCargaMatch = this.service.cargarMatch()
         .subscribe( (resp: any[]) => {

             this.usuario =  resp || [];

         });
  }

  async onChat(user: any) {

    const modal = await this.modalController.create({
      component: ModalChatComponent,
      swipeToClose: true,
      componentProps: {'user': user},
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }


  ngOnDestroy() {
    this.subsCargaMatch.unsubscribe();
  }


}
