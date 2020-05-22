import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ComponentsModule } from '../../components/components.module';
import { ModalChatComponent } from '../../components/modal-chat/modal-chat.component';

@NgModule({
  imports: [
    IonicModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }])
  ],
  declarations: [Tab3Page],
  entryComponents: [
    ModalChatComponent
  ]
})
export class Tab3PageModule {}
