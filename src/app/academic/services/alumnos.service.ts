import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  listar_diplomados(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar-todos-diplomados/');
  }
  listar_estudiantes(code){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'cobranza/listar/todo-cobranza-ventas/'+code);
  }
  listStudents(params){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar/estudiantes-matriculados/?'+params);
  }
  listar_vendedores(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'gerencia/listar-todos-vendedores/');
  }
  validarDNI(data: number) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/matricula/validar-dni/' + data);
  }
  getInfoDNI(tipo, doc) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'consultar-dni-ruc/?type='+tipo+'&num_doc='+doc);
  }
  addEstudiante(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'finanzas/registrar-estudiante/', data);
  }
  reenviarAcceso(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/reenviar-accesos/estudiante/', data)
  }
}
