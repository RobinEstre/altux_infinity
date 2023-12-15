import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn')  || 'false');
  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService,  private router: Router,) { }

  resetPassword(user: any){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'users/email-reestablecer-password/', user);
  }

  validateUser(user: any){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'users/validate-user/?usuario='+user);
  }

  login(data: any){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'users/login/', data);
  }

  logout(url_paht:any){
    return this.httpClient.get(this.envUrl.urlAddress + url_paht);
  }

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true');
  }

  get isLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn')  || this.loggedInStatus.toString());
  }

  getoken() {
    return localStorage.getItem('token');
  }

  isLoggedInUser(): boolean {
    return !!localStorage.getItem('token');
  }

  isLogoutUnathorizated() {
    localStorage.removeItem('token');
    localStorage.removeItem('config');
    localStorage.removeItem('empresa_name');
    localStorage.removeItem('group_name');
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('empresa_logo');
  }
}
