import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }
  
  getPagos() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + '');
  }

  getCourses() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar-cursos/');
  }
}
