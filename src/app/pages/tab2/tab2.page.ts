import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import 'firebase/database';
import { AuthService } from '../../servicios/auth.service';

import 'hammerjs';
import 'ng2-swipe-cards';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  cardCursor = 0;
  orientation = 'x';
  overlay = {
        like: {
          backgroundColor: 'green',
          img: './assets/swipe/like.png'
        },
        dislike: {
          backgroundColor: 'red',
          img: './assets/swipe/dislike.png'
        }
    };


  users: any[] = [];
  userMatch: any = {};

  path = '/assets/fondos/07-fondo.jpg';

  subsCargarUsuarios: Subscription;
  subsPerfilMatch: Subscription;

  banderaSplash = false;

  constructor( public service: AuthService,
               private modalController: ModalController ) {}

  ngOnInit() {
    this.subsCargarUsuarios = this.service.cargarUsuarios('').pipe(
       map( resp => {
           return resp.map((c: any) => {
              c.likeEvent = new EventEmitter();
              return c;
           });
         }
       )
     )
     .subscribe( actions => {
       this.users = actions;
     });
  }

  onlike( like: boolean ) {
     if ( this.users.length > 0) {

        this.users[0].likeEvent.emit({ like });
        this.onCardLike({ like }, this.users[0].uid);

     }
}

  onCardLike(event: any, uid: number) {

    //console.log(event.like);

    const id = uid;
    const like = event.like;

    setTimeout( () => {
          this.users.splice( 0, 1 );
          console.log('Es Match: ');
          this.service.ponerLike(like, id.toString()).then( resp => {

            if ( resp ) {
              this.CargaSplashMatch(id.toString());
             } else {
               console.log('no gay');

             }

          });
        }, 200);


    // const removeIndex = this.users.map( resp => resp.uid).indexOf(obj.uid);

    // this.users.splice( removeIndex , 1 );

  }


  onRelease(event) {

  }

  onAbort(event) {
  }

  onSwipe(event) {
  }

  ngOnDestroy() {
    if (this.subsCargarUsuarios) {
      this.subsCargarUsuarios.unsubscribe();
    }
    if ( this.subsPerfilMatch ){
      this.subsPerfilMatch.unsubscribe();
    }
  }

  CargaSplashMatch( uid: string) {
    this.subsPerfilMatch = this.service.cargarPerfilOtro(uid)
                      .subscribe( resp => this.userMatch = resp );

    this.banderaSplash = true;
    setTimeout( () => {
       this.banderaSplash = false;
       this.userMatch = {};
     }, 5000);
  }

}
