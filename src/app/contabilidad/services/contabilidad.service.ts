import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getReportBoletas(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'contabilidad/boleta/reporte/?'+ params)
  }
  getReportFacturas(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'contabilidad/factura/reporte/?'+ params)
  }
}
