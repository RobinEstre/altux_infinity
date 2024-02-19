import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamenesService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  listar_ExamenAcademic(){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/jefe-academico/listar-fichas-evaluacion/');
  }

  listar_Examen(){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/evaluacion/listar-ficha-evaluacion-academico/');
  }

  update_fechaExamen(data){
    return this.httpClient.patch<any>(this.envUrl.urlAddress + 'academico/evaluacion/actualizar-fecha-ficha-evaluacion-academico/', data)
  }

  list_Notes(data){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/listar-notas-ficha-evaluacion/'+data)
  }

  resetExamen(data){
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'academico/reestablecer/evaluacion-estudiante/',data)
  }

  mostrar_NotaExamen(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'academico/evaluacion/estudiante/listar/evaluacion/',data);
  }

  mostrar_Examen(data){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/ficha-evaluacion/listar/formulario/'+data);
  }

  cambiarRespuesta(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'academico/actualizar-respuesta-examen/', data);
  }

  // CREAR

  listar_tipoExamen(){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/evaluacion/listar-tipo-evaluacion/');
  }

  listar_diplomado(){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/formulario/listar-diplomados/');
  }

  listar_diplomados(){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/listar-todos-diplomados/');
  }

  list_module(data: string){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/gestionar/diplomado/listar-modulos/'+data)
  }

  addExcelExamen(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/form/convert/excel-to-json', data)
  }

  registrarExamen(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/evaluacion/crear-ficha-evaluacion/', data)
  }
}
