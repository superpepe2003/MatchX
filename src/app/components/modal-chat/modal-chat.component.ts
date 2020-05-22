import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { AuthService } from '../../servicios/auth.service';
import { auth } from 'firebase';

@Component({
  selector: 'app-modal-chat',
  templateUrl: './modal-chat.component.html',
  styleUrls: ['./modal-chat.component.scss'],
})
export class ModalChatComponent implements OnInit {

  @Input() user: any = {};
  @ViewChild('content', {static: false}) content: IonContent;

  mensajes: any [] = [];

  keyChat = '';

  mensaje = '';

  constructor(public modalCtrl: ModalController,
              private authService: AuthService) {
                
               }

  ngOnInit() {
    this.keyChat = Object.keys(this.authService.usuario.matches[this.user.uid])[0];
    this.authService.leerChat( this.user.uid, this.keyChat )
        .subscribe( resp => { 
                  this.mensajes = resp;
                  setTimeout(() => {
                    this.updateScroll();
                  }, 500);
                });
  }

  sendMessage() {
    if ( this.mensaje.length > 0) {
        this.authService.guardarMensaje(this.mensaje, this.keyChat);
        this.mensaje = '';
    }
  }

  updateScroll() {
    if (this.content.scrollToBottom) {
      this.content.scrollToBottom();
    }
}


}
