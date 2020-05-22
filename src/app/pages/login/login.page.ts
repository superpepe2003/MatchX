import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { UiServiceService } from '../../servicios/ui-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  forma: FormGroup;



  constructor(private mAuth: AuthService,
              private router: Router,
              private uiService: UiServiceService,
              private formBuilder: FormBuilder) {

      this.crearFormulario();

  }

  ngOnInit() {
  }

  campoNoValido( campo: string ) {
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  crearFormulario() {
    this.forma = this.formBuilder.group({
      email: ['', [ Validators.required , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,3}$') ]],
      password: ['', [ Validators.required ]]
    });
  }

  onLogin() {
    if (this.forma.valid) {

      this.mAuth.login(this.forma.controls['email'].value, this.forma.controls['password'].value).then(user => {
        this.router.navigate(['/tabs']);
      }).catch(err => {
        this.uiService.presentToast('El mail o la contraseña no son correctos');
      });

    }
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

}
