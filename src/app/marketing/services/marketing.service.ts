import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getInformeDiplomados() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar/diplomados/activos-todos')
  }
  actFechalimite(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/actualizar-fecha-inicio-diplomado/',data);
  }
  listLeads(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/lead-recycling/?filter[procedencia]=LEADS&'+ params)
  }
  listBase(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/lead-recycling/?filter[procedencia]=BASE EXTRA&'+ params)
  }
  listVendedores(id) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'gerencia/listar-todos-vendedores/?exclude[sellers]='+ id)
  }
  listVendedores2() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'gerencia/listar-todos-vendedores/')
  }
  listEvents(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/listar-eventos/?'+ params)
  }
  asignarVendedores(id, data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'marketing/lead-recycling/assign/'+id+'/', data)
  }
  asignarVendedores2(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'marketing/asignar/leads-recycling/', data)
  }
  subirFileS3(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'marketing/archivo-s3/upload/', data)
  }
  subirFileS3Event(data, type) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'marketing/archivo-s3/upload/?type='+type, data)
  }
  createEvent(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'marketing/create-new-event/', data)
  }
  updateEvent(id, data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'marketing/actualizar-evento/'+id, data)
  }
  deleteEvent(id) {
    return this.httpClient.delete<any>(this.envUrl.urlAddress + 'marketing/eliminar-evento/'+id)
  }
}
