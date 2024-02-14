import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }
  
  listTipoMaterial(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar/tipo-material/');
  }

  getStudyMaterials(body){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/material-estudio/todos/',body);
  }

  listar_diplomados(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar-todos-diplomados/');
  }

  list_module(data: string){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/gestionar/diplomado/listar-modulos/'+data)
  }

  deleteMaterial(body){
    return this.httpClient.delete<any>(this.envUrl.urlAddress + 'academico/material-estudio-academico/eliminar/'+body);
  }

  addMaterial(body){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/upload/material/estudio-academico/',body);
  }
}
