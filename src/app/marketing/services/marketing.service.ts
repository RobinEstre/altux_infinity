import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  listLeads(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/lead-recycling/?filter[procedencia]=LEADS&'+ params)
  }
  listBase(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/lead-recycling/?filter[procedencia]=BASE EXTRA&'+ params)
  }
  listVendedores(id) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'gerencia/listar-todos-vendedores/?exclude[sellers]='+ id)
  }
  asignarVendedores(id, data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'marketing/lead-recycling/assign/'+id+'/', data)
  }
}
