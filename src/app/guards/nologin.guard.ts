import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NologinGuard implements CanActivate {

  constructor(private mAuth: AuthService,
              private router: Router) {}

  canActivate(): Observable<boolean> | boolean  {

        console.log('NOlogin id: ', this.mAuth.usuario.uid);
        if ( this.mAuth.islogeado() ) {
          this.router.navigateByUrl('');
          return false;
        } else {
          return true;
        }
  }
}
