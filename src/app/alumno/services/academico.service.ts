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

  get_Action(body){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/evaluacion/accion-ficha-evaluacion/',body);
  }

  /*EXAMEN HANS*/
  getEvaluationsHans( body){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/estudiante/listar-ficha-evaluacion/',body);
  }

  create_Evaluation_Estudent(body){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/evaluacion/crear-estudiante-evaluacion/',body);
  }

  getEvaluations(code, modulo){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar/evaluaciones-notas-studiante/?course_code='+code+'&modulo_id='+modulo);
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
  
  generateConstancia(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/generate-certificate/', data);
  }
  
  listConstancias(user, diplomado){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/state-certificado/?user_id='+user+'&diplomado_id='+diplomado);
  }

  getInfoUser() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'users/perfil-usuario/');
  }
}
