import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-pay',
  templateUrl: './form-pay.component.html',
  styleUrls: ['./form-pay.component.scss']
})
export class FormPayComponent implements OnInit {

  constructor() { }

  @Input()generate:any;

  codigo_pago:any;
  monto:any
  nombre:any

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    this.codigo_pago=this.generate['payment_code'];
    this.monto=+this.generate['amount']/100;
    if(this.monto==150){
      this.nombre='Matricula'
      return
    }
    if(this.monto==300){
      this.nombre='Matricula y 1era Mensualidad'
      return
    }
    if(this.monto>300){
      this.nombre='al Contado'
      return
    }
  }

  copyToClipboard() {    
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.codigo_pago;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    Swal.fire({
      position: "center",
      icon: "success",
      title: '¡Código Copiado!',
      showConfirmButton: false,
      timer:2000
    });
  }
}
