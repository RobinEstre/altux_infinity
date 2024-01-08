import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../shared/services/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getInfoUser() {
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'ventas/pre-venta/listar-cartera-alumnos/');
  }
}
