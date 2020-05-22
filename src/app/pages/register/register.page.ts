import { Component, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { ModalController, ToastController, IonSlides } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { Validators, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ValidadoresService } from '../../servicios/validadores.service';
import { UiServiceService } from '../../servicios/ui-service.service';
import { formatDate, DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  @ViewChild( 'slideRegistro' , { static: true }) slides: IonSlides;

  usuario: Usuario = new Usuario();
  forma: FormGroup;

  sliderOpt = {
    allowSlidePrev: false,
    allowSlideNext: false,
    initialSlide: 0,
    speed: 500
  };

  constructor( private router: Router,
               private mAuth: AuthService,
               private modalController: ModalController,
               private toastController: ToastController,
               private formBuilder: FormBuilder,
               private validadores: ValidadoresService, 
               private ui: UiServiceService) {

                this.crearFormulario();
                this.cargarDataAlFormulario();
                this.cambioDeFecha();

  }

  get pass2NoValido() {
    const pass1 = this.forma.get('password').value;
    const pass2 = this.forma.get('password2').value;
    return ( pass1 === pass2 ) ? false : true;
  }

  crearFormulario() {
    this.forma = this.formBuilder.group({
      avatar         : [''],
      email          : ['', Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,3}$') ],
      password       : ['', [ Validators.required, Validators.minLength(6)] ],
      password2      : ['', Validators.required ],
      nick           : ['', Validators.required ],
      nombreCompleto : [''],
      estudios       : [''],
      altura         : [''],
      fechaNac       : [''],
      sexo           : ['', Validators.required ],
      comida         : [''],
      deporte        : [''],
      lugar          : [''],
      cita           : [''],
      fondo          : ['', Validators.required]
    }, {
      validators: this.validadores.passwordIguales('password', 'password2')
    });
  }

  cargarDataAlFormulario() {

    
    this.forma.reset({
      email: 'pablofretes@gmail.com',
      password: '123456',
      password2: '123456',
      nick: 'pepe',
      fechaNac: (new Date()).toJSON(),
      avatar: 'av-1.png',
      sexo: 'Masculino',
      fondo: '01-fondo.jpg'
    });

  }

  cambioDeFecha() {
    this.forma.get('fechaNac').valueChanges.subscribe( resp => {
      const datePipe = new DatePipe('es');
      resp = datePipe.transform(resp, 'dd/MM/yyyy');
    });
  }

  campoNoValido( campo: string ) {
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }


  onNext() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  onBack() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  onRegistro() {

    if ( this.forma.invalid ){
      this.ui.mostrarError('Error en Formulario', 'chequee los datos nuevamente');
    } else {

      let per: any = {};
      per = Object.assign(per, this.forma.value);

      delete per.password2;
      this.usuario = per;
      this.usuario.uid = '';

      this.mAuth.register(this.usuario).then( () => {
           this.ui.mostrarInfo('Datos', 'Grabados correctamente');
           this.router.navigateByUrl('/tabs/tab2');
      });
    }
  }

  // registrarEnDb() {
  //   this.mAuth.register(this.email, this.password, this.data)
  //         .then( auth => {
  //           this.mensajeToast('Usuario Registrado');
  //         }).catch( err => {
  //           this.mensajeToast(err);
  //         });
  // }

  // valida(): boolean {
  //   if (this.email.length > 0 && this.password.length >= 6 ) {
  //      return true;
  //   } else {
  //     return false;
  //   }

  // }

}
