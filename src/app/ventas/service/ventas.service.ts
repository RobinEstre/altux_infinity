import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import DataTables from 'datatables.net';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getFichas() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/pre-venta/listar-cartera-alumnos/');
  }
  getMatriculas() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/listar/estudiantes-matriculados/');
  }
  getLeads() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/listar/leads-vendedor/');
  }
  getEstado() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/listar/estados-leads/');
  }
  listDiscount(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/vendedor/listar-descuento/', data);
  }
  list_diplomados() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'cursos/todos');
  }
  listregistro(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'ventas/matricula/listar-estudiantes-matriculados/', data);
  }
  listPreMatricula(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/pre-venta/listar-reserva-matriculas/', data);
  }
  validarDNI(data: number) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/matricula/validar-dni/' + data);
  }
  getInfoDNI(tipo, doc) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'consultar-dni-ruc/?type='+tipo+'&num_doc='+doc);
  }
  getInfoByDniV2(data) {
    let url =  'ventas/buscar-documento-api/';
    return this.httpClient.post(this.envUrl.urlAddress + url, data);
  }
  getCentroLaboral(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/hospitales/listar-todos/');
  }
  getArea(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/areas/listar-todos/');
  }
  actFechaPago(data) {
    return this.httpClient.patch<any>(this.envUrl.urlAddress + 'ventas/reprogramar-fecha-pago/', data);
  }
  registrarPreVenta(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/pre-venta/guardar-cliente/', data)
  }
  registrarSeguimiento(id, data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'marketing/agregar/seguimiento-leads/'+id, data)
  }
  registrarMatricula(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/matricula/registrar-matricula/', data)
  }
  registrarLinkMatricula(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/generar/url-formulario-llenado/', data)
  }
  reenviarAcceso(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/reenviar-accesos/estudiante/', data)
  }
  registrarLinkPreMatricula(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/ficha/generar-link-pago-con-tarjeta/', data)
  }
  generarPagoPreventa(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/pre-venta/reservar-matricula/generar-codigo-de-pago/', data);
  }
  generarSegundoPago(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/pre-venta/generar-codigo-segundo-pago/', data);
  }
  deleteClient(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/pre-venta/eliminar-contacto-alumno/', data);
  }
}
