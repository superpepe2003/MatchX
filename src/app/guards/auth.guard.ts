import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private mAuth: AuthService,
               private router: Router) {}

  canActivate(): Observable<boolean> | boolean  {

        //console.log('AuthGuard: ', this.mAuth.islogeado());
        if ( !this.mAuth.islogeado() ) {
          this.router.navigateByUrl('login');
          return false;
        } else {
          return true;
        }
  }

}
