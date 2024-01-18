import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getFichas() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/pre-venta/listar-cartera-alumnos/');
  }
  getLeads() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/listar/leads-vendedor/');
  }
  listDiscount(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'ventas/vendedor/listar-descuento/', data);
  }
  list_diplomados() {
    return this.httpClient.get(this.envUrl.urlAddress + 'cursos/todos');
  }
  validarDNI(data: number) {
    return this.httpClient.get(this.envUrl.urlAddress + 'ventas/matricula/validar-dni/' + data);
  }
  getInfoDNI(tipo, doc) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'consultar-dni-ruc/?type='+tipo+'&num_doc='+doc);
  }
  getInfoByDniV2(data) {
    let url =  'ventas/buscar-documento-api/';
    return this.httpClient.post(this.envUrl.urlAddress + url, data);
  }
  getCentroLaboral(){
    return this.httpClient.get(this.envUrl.urlAddress + 'ventas/hospitales/listar-todos/');
  }
  getArea(){
    return this.httpClient.get(this.envUrl.urlAddress + 'ventas/areas/listar-todos/');
  }
  registrarPreVenta(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'ventas/pre-venta/guardar-cliente/', data)
  }
  registrarMatricula(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'ventas/matricula/registrar-matricula/', data)
  }
  registrarLinkMatricula(data) {
      return this.httpClient.post(this.envUrl.urlAddress + 'ventas/generar/url-formulario-llenado/', data)
  }
}
