import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { IonicModule } from '@ionic/angular';
import { FondoSelectorComponent } from './fondo-selector/fondo-selector.component';
import { PipesModule } from '../pipes/pipes.module';
import { ModalChatComponent } from './modal-chat/modal-chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalPerfilComponent } from './modal-perfil/modal-perfil.component';



@NgModule({
  declarations: [
    AvatarSelectorComponent, 
    FondoSelectorComponent, 
    ModalChatComponent,
    ModalPerfilComponent
  ],
  exports: [
    AvatarSelectorComponent, 
    FondoSelectorComponent ,
    ModalChatComponent,
    ModalPerfilComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
