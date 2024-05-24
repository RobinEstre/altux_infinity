import { Component, OnInit } from '@angular/core';
import { ScriptServiceService } from '../../service/script-service.service';

import { greet } from '../../../../assets/js/service.js';
import { config_data } from '../../../../assets/js/config.js';

@Component({
  selector: 'app-checkout-prueba',
  templateUrl: './checkout-prueba.component.html',
  styleUrls: ['./checkout-prueba.component.scss']
})
export class CheckoutPruebaComponent implements OnInit {

  constructor(private scriptService: ScriptServiceService) {}

  apiUrl = "https://api.culqi.com/v2/orders";
  apiKey = "sk_test_74e145db239733c3";
  numeroAleatorio = this.generarNumeroAleatorio();
  requestData = {
    amount: 600,
    currency_code: "PEN",
    description: "Venta de prueba",
    order_number: this.numeroAleatorio,
    client_details: {
      first_name: "Hans",
      last_name: "Chullo",
      email: "prueba@culqi.com",
      phone_number: "945737476"
    },
    expiration_date: this.obtenerEpochDeFechaActual(),
    confirm: false
  };

  // Configura la solicitud a la API
  requestOptions = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(this.requestData)
  };

  ngOnInit(): void {
  }

  openCheckout(){
    let data={
      TOTAL_AMOUNT: 600,
      firstName: "Hans",
      lastName: "Exebio",
      address: "San Francisco",
      address_c: "Lurigancho",
      phone: "945737476",
      email: "review1" + Math.floor(Math.random() * 100) + "@altux.com",
    }
    greet(this.apiUrl, this.requestOptions);
    config_data(data);
    // this.scriptService.removeScript(['culqi-checkout-v4', 'culqi-js-v4']);
    // this.scriptService.loadScript({
    //   id: 'culqi-checkout-v4',
    //   url: 'https://checkout.culqi.com/js/v4',
    // });
    setTimeout(() => { 
      this.scriptService.loadScript({
      id: 'culqi-js-v4',
      url: 'assets/js/checkout.js',});
    },2000);
    
  }

  generarNumeroAleatorio() {
    // Generar un número decimal aleatorio entre 0 y 1
    const numeroDecimal = Math.random();
  
    // Multiplicar por 10^9 y redondear para obtener un número entero
    const numeroEntero = Math.floor(numeroDecimal * Math.pow(10, 9));
  
    // Asegurarse de que tenga exactamente 9 dígitos
    let numeroAleatorio = String(numeroEntero).padStart(9, '0');
  
    return numeroAleatorio;
  }
  
  obtenerEpochDeFechaActual() {
    // Obtener la fecha actual en segundos desde el 1 de enero de 1970 (epoch)
    const fechaActualEnSegundos = Math.floor(Date.now() / 1000);
  
    // Sumar un día en segundos (86400 segundos) al timestamp actual
    const epochConUnDiaMas = fechaActualEnSegundos + 86400;
  
    return epochConUnDiaMas;
  }
}
