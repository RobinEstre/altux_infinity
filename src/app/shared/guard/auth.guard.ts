import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, Route, UrlSegment} from '@angular/router';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { AuthServiceService } from 'src/app/auth/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  token: any;
  private secretrol = 'K56QSxGeKImwBRmiY';
  constructor(private loginuserService: AuthServiceService, private routes: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(this.loginuserService.isLoggedInUser()){
      return true;
    }else{
      this.routes.navigate(['/']);
      return false;
    }
  }

  canActivateChild(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
      route: Route,
      segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
