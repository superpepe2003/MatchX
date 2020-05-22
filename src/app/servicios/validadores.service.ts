import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

interface IErrorValidate {
  [ s: string ]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  passwordIguales( pass1: string, pass2: string){
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.controls[pass1];
      const pass2Control = formGroup.controls[pass2];

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noIguales: true });
      }
    }
  }
}
