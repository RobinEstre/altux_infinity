import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getInfoUser() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'users/perfil-usuario/');
  }
  
  getCronograma(code) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar/eventos-proximos/'+code);
  }

  getNotasPay(code) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar/datos_dashboard/?courses_code='+code);
  }

  getPorcentajeEstudiante() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar/porcentajes-dashboard/');
  }

  getDiplomados() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/notas/diplomados');
  }

  getClassModule(id) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'cursos/listar/modulos-diplomado/'+id);
  }
}