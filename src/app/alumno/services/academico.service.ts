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

  getClassModule(id) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'cursos/listar/modulos-diplomado/'+id);
  }

  getDetailDiplomadoByCode(data){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/diplomado/listar-modulos/'+ data);
  }

  getModActual(data){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/list-modulo-actual/'+ data);
  }

  clasesGrabadas(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/listar/clase-grabada/',data);
  }

  getStudyMaterials(body){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/material-estudio/todos/',body);
  }

  marcarAsistencia(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/marcar-asistencia/',data);
  }
  
  list_Calendar(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'alumno/reporte/listar-calendario-diplomado/', data);
  }
}
