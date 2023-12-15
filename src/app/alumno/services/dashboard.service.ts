import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getCronograma() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar/eventos-proximos/CAA0016');
  }

  getPorcentajeEstudiante() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar/porcentajes-dashboard/');
  }

  getDiplomados() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/notas/diplomados');
  }
}