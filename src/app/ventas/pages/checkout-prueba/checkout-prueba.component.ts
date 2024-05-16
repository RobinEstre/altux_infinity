import { Component, OnInit } from '@angular/core';
import { ScriptServiceService } from '../../service/script-service.service';

@Component({
  selector: 'app-checkout-prueba',
  templateUrl: './checkout-prueba.component.html',
  styleUrls: ['./checkout-prueba.component.scss']
})
export class CheckoutPruebaComponent implements OnInit {

  constructor(private scriptService: ScriptServiceService) {}

  ngOnInit(): void {
  }

  openCheckout(){
    this.scriptService.removeScript(['culqi-checkout-v4', 'culqi-js-v4']);
    this.scriptService.loadScript({
      id: 'culqi-checkout-v4',
      url: 'https://checkout.culqi.com/js/v4',
    });
    this.scriptService.loadScript({
      id: 'culqi-js-v4',
      url: 'assets/js/checkout.js',
    });    
  }
}
