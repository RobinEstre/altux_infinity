import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getDetailExamen(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'academico/evaluacion/rendir-evaluacion-alumno/',data);
  }

  sendRespuestas(data){
    return this.httpClient.patch(this.envUrl.urlAddress + 'academico/evaluacion/actualizar-respuesta-alumno/',data);
  }

  getDetailExamenResp(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'academico/evaluacion/estudiante/listar/evaluacion/',data);
  }

  end_Examen(data){
    return this.httpClient.patch(this.envUrl.urlAddress + 'academico/evaluacion/actualizar-finalizar-evaluacion/',data);
  }

  get_Nota(data:string){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/evaluacion/mostrar-nota-evaluacion/'+data);
  }
}
