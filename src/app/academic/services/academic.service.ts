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
  
  list_diplomados() {
    return this.httpClient.get(this.envUrl.urlAddress + 'cursos/todos');
  }

  listar_diplomados(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar-todos-diplomados/');
  }

  listPrioridadLeads(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'users/sale-leads-priority/?paginate[index]=1&paginate[row]=20&sort[attr]=priority');
  }

  list_group(data: string){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/gestionar/diplomado/groups/'+ data);
  }

  list_module2(data: string){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar-modulos-cursos/'+data)
  }
  
  listVendedores(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'gerencia/listar-todos-vendedores/?'+ params)
  }
  
  listAllVendedores() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'gerencia/listar-todos-vendedores/')
  }

  createPriority(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'users/sale-leads-priority/', data)
  }

  updatePriority(id, data){
    return this.httpClient.patch<any>(this.envUrl.urlAddress + 'users/sale-leads-priority/'+id+'/', data)
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

  registerLeads(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'marketing/registrar/excel-leads/', data)
  }

  delEstadeClass(data){
    return this.httpClient.delete(this.envUrl.urlAddress + 'academico/clase/eliminar-diplomado-clase/'+ data)
  }

  actEstadeClass(data){
    return this.httpClient.patch<any>(this.envUrl.urlAddress + 'academico/clase/actualizar-estado_diplomado-clase/', data)
  }

  downloadFile(data){
    return this.httpClient.get(this.envUrl.urlAddress + 'marketing/download/dexcel-leads/?'+ data, {responseType: 'blob'})
  }
}
