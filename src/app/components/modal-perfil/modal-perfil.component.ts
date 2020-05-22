import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { UiServiceService } from 'src/app/servicios/ui-service.service';
import { DatePipe } from '@angular/common';
import { ModalController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-modal-perfil',
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.scss'],
})
export class ModalPerfilComponent implements OnInit {

  forma: FormGroup;

  @ViewChild( 'slideRegistro' , { static: true }) slides: IonSlides;

  sliderOpt = {
    allowSlidePrev: false,
    allowSlideNext: false,
    initialSlide: 0,
    speed: 500
  };

  constructor(private mAuth: AuthService,
              private formBuilder: FormBuilder,
              private ui: UiServiceService,
              public modalCtrl: ModalController ) {
    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.cambioDeFecha();
   }

  ngOnInit() {}

  crearFormulario() {
    this.forma = this.formBuilder.group({
      avatar         : [''],
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
    });
  }

  cargarDataAlFormulario() {

    this.forma.reset({
      nick: this.mAuth.usuario.nick,
      nombreCompleto: this.mAuth.usuario.nombreCompleto,
      estudios: this.mAuth.usuario.estudios,
      altura: this.mAuth.usuario.altura,
      fechaNac: this.mAuth.usuario.fechaNac,
      avatar: this.mAuth.usuario.avatar,
      sexo: this.mAuth.usuario.sexo,
      fondo: this.mAuth.usuario.fondo,
      comida: this.mAuth.usuario.comida,
      deporte: this.mAuth.usuario.deporte,
      lugar: this.mAuth.usuario.lugar,
      cita: this.mAuth.usuario.cita
    });

    console.log(this.forma.controls['avatar'].value);

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

  onGrabar(){

    if ( this.forma.invalid ) {
      this.ui.mostrarError('Error en Formulario', 'chequee los datos nuevamente');
    } else {

      this.mAuth.updateUsuario(this.forma.value).then( () => {
           this.ui.mostrarInfo('Datos', 'Modificado correctamente');
           this.modalCtrl.dismiss();
      });
    }

  }

}
