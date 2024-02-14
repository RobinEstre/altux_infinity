import {Component, Input, LOCALE_ID, Output, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import { DatePipe } from '@angular/common';
import { DiplomadosService } from 'src/app/academic/services/diplomados.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  providers: [DatePipe]
})
export class VentasComponent implements OnInit {
  @Output('miEvento') miPrueba = new EventEmitter<any>()
  @Input() data_ventas:any

  constructor(private fb: FormBuilder, public diplomadoService: DiplomadosService, private spinner: NgxSpinnerService, 
    private modalService: NgbModal, private datePipe: DatePipe,) {
  }

  formVentas = this.fb.group({
    matricula: [0, Validators.required],
    mes: ['', Validators.required],
    mensualidades: [0, Validators.required],
    certificado: [0, Validators.required],
    total: [0, Validators.required],
    descuento: [0, Validators.required],
    contado: [0, Validators.required],
    fecha_inicio: [null, Validators.required],
    fecha_fin: [null, Validators.required],
  });

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    if(this.data_ventas!=null){
      let inicio= (new Date(this.data_ventas.inicio*1000).getTime())
      let fecha_inicio:any= this.datePipe.transform(inicio,"yyyy-MM-dd")
      let fin= (new Date(this.data_ventas.fin*1000).getTime())
      let fecha_fin:any= this.datePipe.transform(fin,"yyyy-MM-dd")
      this.formVentas.controls['fecha_inicio'].setValue(fecha_inicio)
      this.formVentas.controls['fecha_fin'].setValue(fecha_fin)
      this.formVentas.controls['matricula'].setValue(+this.data_ventas.ventas.cuotas[0].monto_matricula)
      this.formVentas.controls['mensualidades'].setValue(+this.data_ventas.ventas.cuotas[0].monto_couta_1)
      this.formVentas.controls['certificado'].setValue(+this.data_ventas.ventas.certification)
      this.miPrueba.emit('lleno')
    }else{
      this.formVentas.controls['matricula'].setValue(150)
      this.formVentas.controls['mensualidades'].setValue(150)
      this.formVentas.controls['certificado'].setValue(220)
    }
    let num:any=7
    this.formVentas.controls['mes'].setValue(num)
    this.formVentas.controls['descuento'].setValue(10)
    let matricula= +this.formVentas.controls['matricula'].value
    let mes= +this.formVentas.controls['mes'].value
    let mensualidades= +this.formVentas.controls['mensualidades'].value
    let certificado= +this.formVentas.controls['certificado'].value
    let descuento= +this.formVentas.controls['descuento'].value
    let total:any= matricula+(mes*mensualidades)+certificado
    let contado:any= total-(total*(descuento/100))
    this.formVentas.controls['total'].setValue(total)
    this.formVentas.controls['contado'].setValue(contado)
  }

  keyMes(event){
    if(+this.formVentas.controls['mes'].value<7 && this.formVentas.controls['mes'].value!=''){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Mes no puede ser menos a 7',
        showConfirmButton: false,
        timer: 1500
      })
      let num:any=7
      this.formVentas.controls['mes'].setValue(num)
    }
    let matricula= +this.formVentas.controls['matricula'].value
    let mes= +this.formVentas.controls['mes'].value
    let mensualidades= +this.formVentas.controls['mensualidades'].value
    let certificado= +this.formVentas.controls['certificado'].value
    let descuento= +this.formVentas.controls['descuento'].value
    let total:any= matricula+(mes*mensualidades)+certificado
    let contado:any= total-(total*(descuento/100))
    this.formVentas.controls['total'].setValue(total)
    this.formVentas.controls['contado'].setValue(contado)
    this.formVentas.controls['fecha_inicio'].setValue(null)
    this.formVentas.controls['fecha_fin'].setValue(null)
    this.miPrueba.emit('vacio')
  }

  obtenerFechaPago(){
    let data, fecha, certi
    let fecha_inicio:any= (new Date(this.formVentas.controls['fecha_inicio'].value).getTime())/1000
    let fecha_fin:any= (new Date(this.formVentas.controls['fecha_fin'].value).getTime())/1000
    data={
      "inicio_diplomado":fecha_inicio,
      "fin_diplomado":fecha_fin,
      "monto_mensualidad":this.formVentas.controls['mensualidades'].value,
      "monto_matricula":this.formVentas.controls['matricula'].value,
      "monto_certificado":this.formVentas.controls['certificado'].value
    }
    let date = new Date(this.formVentas.controls['fecha_inicio'].value)
    let dia=date.getDay()
    let mes_inicio=date.getMonth()+1
    let year=date.getFullYear()
    for(let i=0; i<7;i++){
      fecha=(new Date(year+'-'+(mes_inicio)+'-'+dia).getTime())/1000
      mes_inicio=mes_inicio+1
      data["fecha_pago"+ (i+1)] = fecha;
      if(mes_inicio==12){
        year=date.getFullYear()+1
        mes_inicio=1
      }
    }
    fecha=(new Date(year+'-'+(mes_inicio)+'-'+dia).getTime())/1000
    certi=fecha
    data["fecha_pago_certificado"] = certi;
    console.log(data);
    this.miPrueba.emit(data)
  }
}