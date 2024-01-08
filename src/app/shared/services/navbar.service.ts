import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlEnviromentService} from './url-enviroment.service';
import * as CryptoJS from 'crypto-js';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private _navbar = new BehaviorSubject<boolean>(false);
  readonly navbarObs = this._navbar.asObservable();

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getMenuToStudent(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-estudiante/');
  }

  getMenuToTeacher(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-profesor/');
  }

  getMenuToAcademic(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-academico/');
  }

  getMenuToSeller(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-vendedor/');
  }

  getMenuToAccounting(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-contabilidad/');
  }

  getMenuToCobranza(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-cobrador/');
  }

  getMenuToFinanza(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-finanzas/');
  }

  getMenuToGerencia(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-gerente/');
  }

  getMenuToAdmin(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-jefe-academico/');
  }

  getMenuToLiderVenta(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-lider-venta/');
  }

  getMenuToJefeCobranza(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-jefe-cobranza/');
  }

  getMenuToStaff(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-staff/');
  }

  getMenuToMarketing(){
    return this.httpClient.get(this.envUrl.urlAddress + 'theme/listar-menu-marketing/');
  }

  refresNav(val: boolean) {
    this._navbar.next(val);
  }

  getpathCourse() {
    return 'alumno/curso/';
  }

  removeItemNavCource() {
    return localStorage.removeItem('nav-course');
  }
  removeNavCourseCode(){
    return localStorage.removeItem('nav-course-code');
  }

  getNavCourseCode() {
    return localStorage.getItem('nav-course-code');
  }

  getItemnavCourse(){
    return localStorage.getItem('nav-course');
  }


  validateUrlPathIsMenuCourse(pathurl: string){
    let spliturl = pathurl.split('/');
    let pathCourse =spliturl[1]+'/'+spliturl[2]+'/';
    const urlPath = this.getpathCourse();
    if (pathCourse != urlPath){
      const value = this.getNavCourseCode();
      const value2 = this.getItemnavCourse();
      if (value && value2){
        this.removeItemNavCource();
        this.removeNavCourseCode();
      }
    }
    this.refresNav(true);

  }

  CryptoJSAesDecrypt(passphrase, encryptedJsonString) {
    var objJson = JSON.parse(encryptedJsonString);
    var encrypted = objJson.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(objJson.salt);
    var iv = CryptoJS.enc.Hex.parse(objJson.iv);
    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999});
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
