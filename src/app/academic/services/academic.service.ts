import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AcademicService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  listar_diplomado(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/formulario/listar-diplomados/');
  }

  list_group(data: string){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/gestionar/diplomado/groups/'+ data);
  }

  list_module2(data: string){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar-modulos-cursos/'+data)
  }

  createClass(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/clase/publicar-link-clase/', data)
  }

  addRecording(data){
    return this.httpClient.patch<any>(this.envUrl.urlAddress + 'academico/clase/actualizar-clase-grabada/', data)
  }

  listClass(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/clase/listar-todo-diplomado-clase/', data)
  }

  delEstadeClass(data){
    return this.httpClient.delete(this.envUrl.urlAddress + 'academico/clase/eliminar-diplomado-clase/'+ data)
  }

  actEstadeClass(data){
    return this.httpClient.patch<any>(this.envUrl.urlAddress + 'academico/clase/actualizar-estado_diplomado-clase/', data)
  }
}
