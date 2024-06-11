import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { UrlEnviromentService } from 'src/app/shared/services/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  registrarMatricula(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'ventas/vendedor/matricula-link/', data)
  }
  generarSegundoPago(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'ventas/pre-venta/generar-codigo-segundo-pago/', data);
  }

  expirarCodigo(data) {
    //const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.patch(this.envUrl.urlAddress + 'ventas/actualizar/estado/formulario-llenado/', data)
  }
  listDiscount(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'ventas/vendedor/listar-descuento/', data);
  }
  listFomularioLink(data) {
    return this.httpClient.get(this.envUrl.urlAddress + 'ventas/listar/url-formulario-llenado/' + data);
  }
  listDiscountweb(data) {
    return this.httpClient.post(this.envUrl.urlAddress + 'ventas/vendedor/listar-descuento-web/', data);
  }
  validarDNI(data: number) {
    return this.httpClient.get(this.envUrl.urlAddress + 'ventas/matricula/validar-dni/' + data);
  }
  list_diplomados() {
    return this.httpClient.get(this.envUrl.urlAddress + 'cursos/todos');
  }
  generatePagoTarjeta(body, token_device){
    const dataHeaders = new HttpHeaders().set('TOKEN-DEVICE', token_device);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'pagos/realizar-pago-tarjeta/', body, {headers: dataHeaders});
  }
  validarURL(data){
    return this.httpClient.get(this.envUrl.urlAddress + 'ventas/codigo-qr/validar/' + data);
  }
  postPagoTarjeta(data) {
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'cobranza/pagar-mensualidad-con-tarjeta-cobrador/', data);
  }
}
