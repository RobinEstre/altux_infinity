import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiplomadosService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  listTipos(){
    return this.httpClient.get(this.envUrl.urlAddress + 'cursos/categoria/modalidad-estudio/listar');
  }

  listDiplomadosTemporales(){
    return this.httpClient.get(this.envUrl.urlAddress + 'cursos/listar/cursos-temporales-usuario');
  }

  listDiplomados(){
    return this.httpClient.get(this.envUrl.urlAddress + 'cursos/listar/courses-names-all');
  }

  listDiplomadoId(id){
    return this.httpClient.get(this.envUrl.urlAddress + 'cursos/listar/informacion-diplomado/'+id);
  }

  listUniversidades(){
    return this.httpClient.get(this.envUrl.urlAddress + 'cursos/listar/todas-universidades/');
  }

  listSat(){
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/jefe-academico/listar-coordinadores/')
  }

  crearDiplomadoTemporal(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'cursos/crear-diplomado-temporal/', data)
  }

  saveInfoTemporal(code, data){
    return this.httpClient.put(this.envUrl.urlAddress + 'cursos/guardar-informacion-diplomado/'+code, data)
  }

  saveModulosTemporal(code, data){
    return this.httpClient.put(this.envUrl.urlAddress + 'cursos/guardar-modulos-diplomado/'+code, data)
  }

  savePagosTemporal(code, data){
    return this.httpClient.put(this.envUrl.urlAddress + 'cursos/guardar-precios-diplomado/'+code, data)
  }

  saveImagesTemporal(code, data){
    return this.httpClient.put(this.envUrl.urlAddress + 'cursos/guardar-imagenes-diplomado/'+code, data)
  }

  crearDiplomado(code){
    let data={}
    return this.httpClient.post(this.envUrl.urlAddress + 'cursos/crear/nuevo-diplomado/'+code, data)
  }

  subirImagenes(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'marketing/archivo-s3/upload/?type=pdf', data)
  }

  deleteTemporal(code){
    return this.httpClient.delete(this.envUrl.urlAddress + 'cursos/eliminar/curso-temporal/'+code)
  }

  getInfoTeacher() {
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/listar-todos-docentes/');
  }
}
