import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CobranzaService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getInfoDNI(tipo, doc) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'consultar-dni-ruc/?type='+tipo+'&num_doc='+doc);
  }

  listar_diplomados(){
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'academico/listar-todos-diplomados/');
  }

  listpagoStudent(data) {
    return this.httpClient.get(this.envUrl.urlAddress + 'cobranza/listar/pagos-estudiante-diplomado/'+ data);
  }

  listDetailCobranza(data) {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'cobranza/listar_cantidad_tipo_estudiante/' + data);
  }

  listReportStudent(student_id) {
    return this.httpClient.get(this.envUrl.urlAddress + 'cobranza/alumno/reporte/'+student_id);
  }

  migrate_Student(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'academico/gestionar/registrar-migracion-diplomado/', data)
  }

  compromiso_Student(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'alumno/compromiso-pago/registrar/', data)
  }

  control_Student(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'alumno/centro-contacto-outbound/crear/', data)
  }

  aprobar_rechazar(data){
    return this.httpClient.patch(this.envUrl.urlAddress + 'alumno/desuscribir-estudiante/actualizar-estado/', data);
  }

  baja_Student(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'alumno/desuscribir-estudiante/registrar/', data)
  }

  register_Observacion(data) {
    return this.httpClient.patch(this.envUrl.urlAddress + 'alumno/desuscribir-estudiante/agregar/observacion/', data);
  }

  registrarPagoNoCorriente(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'cobranza/descuento-no-corriente/', data);
  }

  registrarPagoNoCorrienteDividido(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'cobranza/pago-dividido/registrar/', data);
  }

  listDiscount(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'cobranza/detalle-pronto-pago/', data)
  }

  generate_prontoPago(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'cobranza/generar-pronto-pago/', data)
  }

  updatePago(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'cobranza/actualizar-pagos-estudiantes/', data);
  }

  registrarPagoManual(data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'cobranza/registrar-pago-mensualidad-manual/', data);
  }

  corregirPago(data) {
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'cobranza/corregir-pago/', data);
  }

  solicitarDetallePago(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'alumno/detalle-venta/listar/', data);
  }
  
  listMotivoCall(){
    return this.httpClient.get(this.envUrl.urlAddress + 'alumno/llamada/listar/tipo');
  }

  registrarMotivo(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'alumno/llamada/registrar/control-llamada', data);
  }

  list_compromisoPago(data){
    return this.httpClient.post(this.envUrl.urlAddress + 'alumno/compromiso-pago/listar/cuota/todo', data)
  }
  
  compromisoEstudiante(data){
    return this.httpClient.get(this.envUrl.urlAddress + 'alumno/compromiso-pago/listar/?student_id='+ data)
  }

  linkPago(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'cobranza/generar-link-tarjeta-pago-mensualdiad/', data);
  }

  postPagoEfectivo(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'cobranza/crear/alumno/pagoefectivo-mensualidad/', data);
  }
}
