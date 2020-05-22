import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { Usuario } from '../models/usuario';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  usuario: any = {};

  //subscriciones que despues destruyo
  subsCargarPerfil: Subscription;

  constructor(private mAuth: AngularFireAuth,
              private router: Router,
              private mDb: AngularFireDatabase,
              private geo: Geolocation,
              private storage: Storage) {

                this.leerUser();
                // console.log(this.usuario.uid );
                // if ( this.usuario.uid ) {
                //   this.cargarPerfil();
                // }

              }



  ////////
  //////// LOGIN
  ///////


  login(email: string, pass: string) {
    return new Promise((resolve, rejected) => {
        this.mAuth.auth.signInWithEmailAndPassword(email, pass).
                      then((user: any) => {
                        this.usuario.uid = user.user.uid;
                        this.cargarPerfil();
                        this.guardarUser();
                        resolve( user );
                      })
                      .catch(err => rejected(err));
    });

  }

  islogeado() {

    return (this.usuario.uid) ? true : false;
    
  }

  logout() {
    this.mAuth.auth.signOut().then( auth => {
      this.usuario = {};
      this.usuario.uid = null;
      this.storage.remove('userId');
      this.router.navigate(['/login']);
    });
  }

  ///////
  /////// REGISTRO
  ///////

  register(usuario: Usuario) {
    console.log('crear registro');

    return new Promise((resolve, reject) => {
      this.mAuth.auth.createUserWithEmailAndPassword(usuario.email, usuario.password)
          .then( res => {
            this.usuario.uid = res.user.uid;
            console.log('register: ', this.islogeado());
            this.crearPerfil(usuario);
            resolve();
          }).catch(err => {
            reject(err);
          });
    });
  }


  crearPerfil(usuario: Usuario) {
    const userId = this.usuario.uid;

    const tempUser: any = usuario;

    delete tempUser.password;

    this.usuario = {...tempUser};
    this.usuario.uid = userId;
    console.log('crearPerfil: ', this.islogeado());

    delete tempUser.uid;
    delete tempUser.email;

    console.log('crearPerfil: ', this.islogeado());

    return this.mDb.database.ref('users/' + userId).set(tempUser);

  }

  updateUsuario(usuario: any) {
    return this.mDb.database.ref('users/' + this.usuario.uid).update(usuario);
  }


  ////////
  //////// CARGA DE PERFIL Y TARJETAS
  ///////


  cargarPerfil() {

    if ( this.usuario.uid ) {

      const userId = this.usuario.uid;

      this.subsCargarPerfil = this.mDb.object('users/' + userId).valueChanges()
          .subscribe( (user: any) => {
            if ( user ) {
              this.usuario = user;
              this.usuario.uid = userId;
              console.log(this.usuario);
            }
          });

    }
  }

  cargarPerfilOtro( uid: string ) {
    if ( uid.length > 0) {
      return this.mDb.object('users/' + uid).valueChanges();
    }
  }


  cargarUsuarios(query: string) {
    if ( !this.usuario.uid ) { return; }
    
    return this.mDb.list<any>('users').snapshotChanges().
               pipe(
                // take(1),
                 map(changes => {
                    const userId = this.usuario.uid;
                    const val = changes.filter(c => {
                                // Compruebo que el id no sea el del usuario
                                if ( (c.key !== userId) ) {
                                  const valor = c.payload.val();

                                  /// compruebo que las conecciones exista
                                  if ( valor.connections ) {

                                    // compruebo si hay yes o no al id del usuario activo, si es asi lo filtro
                                    //para que no lo retorne

                                    if ( valor.connections.yes ) {
                                       if (valor.connections.yes[this.usuario.uid]) {
                                         return;
                                       }
                                    }
                                    if ( valor.connections.no ) {
                                        if (valor.connections.no[this.usuario.uid]) {
                                          return;
                                        }
                                    }
                                  }
                                  //Regreso las tarjetas con esas 3 condiciones, que no sea el usuario
                                  //y que el usuario no le haya dado ya Yes o No

                                  return c;
                                }
                              });
                    return val.map( c => {
                      const user = c.payload.val();
                      user.uid = c.key;
                      return user;
                    });
                  })
                );

  }


  cargarMatch() {
    // console.log( this.usuario.uid );
    // if ( !this.usuario.uid ) { return new Observable(); }
    // if ( !this.usuario.matches ) { return new Observable(); }

    return this.mDb.list('users').snapshotChanges()
              .pipe(
                // take(1),
                 map(changes => {

                  console.log('cargarMatch');

                  if ( !this.usuario.uid ) { return; }
                  if ( !this.usuario.matches ) { return; }

                  const matches = this.usuario.matches;

                  const val = changes.filter( (c: any) => {
                              // busco que el key del usuario coincidida con la lista de matches
                              if ( matches.hasOwnProperty(c.key) ) {
                                return c;
                              }
                            });
                  return val.map( c => {
                    const user: any = c.payload.val();
                    user.uid = c.key;
                    return user;
                  });
                  return changes;
                })
                );

  }


  ////
  //// FUNCIONES QUE TRABAJAN CON LA UBICACION
  ////

  getUbicacion() {
    this.geo.getCurrentPosition().then((resp) => {
       this.guardarUbicacion(resp.coords.latitude, resp.coords.longitude);
      // resp.coords.latitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }

  guardarUbicacion(lat, lng) {

    if ( this.usuario.uid ) {
      const userId = this.usuario.uid;

      this.mDb.database.ref('users').child(userId).child('location').set({
         latitud: lat,
         longitud: lng
       });
    }
  }


  ////
  //// FUNCIONES QUE GUARDAN Y LEEN EL USUARIO
  ////

  guardarUser() {
    if (this.usuario.uid) {
      this.storage.set( 'userId', this.usuario.uid );
    }
  }

  leerUser() {
      this.storage.get('userId')
            .then( resp => {
              if ( resp ) {
                this.usuario.uid = resp;
                this.cargarPerfil();
              }
            });


  }


  ///////
  // pongo Yes si es LIke o No si es Dislike
  //////

  async ponerLike( like: boolean, uid: string ) {
    console.log('evento poner LIKE');
    console.log(`de ${this.usuario.uid} a ${uid}`);
    if ( this.usuario.uid ) {
      if ( like ) {
          let f = false;
          await this.mDb.database.ref('users/' + uid + '/connections/yes/' + this.usuario.uid).set(true)
                  .then( resp => {
                    f = this.isMatch(uid);
                  });
          return f;
      } else {
        this.mDb.database.ref('users/' + uid + '/connections/no/' + this.usuario.uid).set(true);
      }
    }
    return false;
  }

  isMatch(uid) {

    console.log('evento isMatch');

    if (this.usuario.connections) {

      if ( this.usuario.connections.yes[uid] ) {
        //console.log('ES MATCH');

        const chatId = this.mDb.database.ref('chats').push(true).key;

        //this.mDb.database.ref('chats/' + chatId).push().set({creadoPor: uid, mensaje: 'hola bebe'});

        console.log(chatId);

        this.mDb.database.ref('users/' + uid + '/matches/' + this.usuario.uid + '/' + chatId).set(true);
        this.mDb.database.ref('users/' + this.usuario.uid + '/matches/' + uid + '/' + chatId).set(true);

        return true;
      } else {
        //console.log('NO ES MATCH');
        return false;
      }
    } else {
      //console.log('NO ES MATCH');
      return false;
    }



    //if(this.usuario.connectiones.yes)

  }

  ////
  //// FUNCIONES DE CHAT

  leerChat(uid: string, keyChat: string) {

    console.log('ESTOY');

    return this.mDb.list(`chats/${keyChat}`).snapshotChanges()
               .pipe(
                  map( (resp: any) => resp.map( v => v.payload.val())));
  }

  guardarMensaje(mensaje: string, keyChat: string) {
      this.mDb.database.ref(`chats/${keyChat}`).push({creadoPor: this.usuario.uid, mensaje});
  }

  ngOnDestroy(): void {

    this.subsCargarPerfil.unsubscribe();

  }


}
