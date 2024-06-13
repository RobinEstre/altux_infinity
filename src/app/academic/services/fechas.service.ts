import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FechasService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  listar_diplomados(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar-todos-diplomados/');
  }
  listModulos(code){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar-fechas-modulos-diplomado/'+code);
  }
  actFechas(id, data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'academico/actualizar/fechas_evaluacion/'+id, data);
  }
}
