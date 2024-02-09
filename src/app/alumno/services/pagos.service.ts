import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }
  
  getPagos(code) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar/pagos-estudiante/'+code);
  }

  getCourses() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/listar-cursos/');
  }

  postPagoEfectivo(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/crear/pagoefectivo-mensualidad/', data);
  }

  postPagoTarjeta(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'cobranza/pagar-mensualidad-con-tarjeta-estudiante/', data);
  }
  
  getInfoDNI(tipo, doc) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'consultar-dni-ruc/?type='+tipo+'&num_doc='+doc);
  }
}
