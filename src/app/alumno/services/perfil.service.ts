import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getInfoUser() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'users/perfil-usuario/');
  }

  updateImgUser(data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'users/actualizar-foto-perfil/', data);
  }

  selectImgUser(data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'users/seleccionar/avatar-perfil/', data);
  }
}
