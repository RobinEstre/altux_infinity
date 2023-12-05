import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AcademicoService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getCourses() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar-cursos/');
  }

  getDetailDiplomadoByCode(data){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/diplomado/listar-modulos/'+ data);
  }

  getModActual(data){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/list-modulo-actual/'+ data);
  }
}
