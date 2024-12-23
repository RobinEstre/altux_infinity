import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import DataTables from 'datatables.net';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  actualizarPreVenta(data) {
    return this.httpClient.put(this.envUrl.urlAddress + 'ventas/preventa/actualizar-datos-cliente/', data)
  }
  actualizarLeads(id, data) {
    return this.httpClient.put(this.envUrl.urlAddress + 'marketing/actualizar/datos-leads/'+id, data)
  }
  getCantidadDashboard() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/listar/dashboard-vendedor/');
  }
  getInformeDiplomados() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/listar/informe_diplomados');
  }
  getCompromisosMatriculaLeads() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/listar/compromisos-matricula/');
  }
  getInformesPersonasLeads() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/listar/informacion-matricula/');
  }
  getCompromisosMatriculaFicha() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/listar/compromiso-matricula-ficha/');
  }
  getInformesPersonasFicha() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/listar/informacion-matricula-ficha/');
  }
  actFechalimite(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/actualizar-fecha-inicio-diplomado/',data);
  }
  getFichas() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/pre-venta/listar-cartera-alumnos/');
  }
  getMatriculas() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/listar/estudiantes-matriculados/');
  }
  getLeads(param) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/listar/leads-vendedor/?estado_id=1&'+param);
  }
  getEstado() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/listar/estados-leads/');
  }
  listControlLeads(params) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'marketing/listar/control-leads/?'+ params);
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
  actEstadoReporteFacebook(id, data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'marketing/actualizar/reporte-facebook-leads/'+id, data);
  }
  registrarPreVenta(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/pre-venta/guardar-cliente/', data)
  }
  registrarSeguimiento(id, data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'marketing/agregar/seguimiento-leads/'+id, data)
  }
  registrarSeguimientoFicha(id, data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'ventas/insertar/seguimiento-ficha/'+id, data)
  }
  registrarMatricula(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/matricula/registrar-matricula/', data)
  }
  registrarLinkMatricula(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/generar/url-formulario-llenado/', data)
  }
  registerLeads(data){
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'marketing/registrar/excel-leads/', data)
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
