import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FechasService } from '../../services/fechas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
registerLocaleData(localeEs, 'es');
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-fecha-pago',
  templateUrl: './fecha-pago.component.html',
  styleUrls: ['./fecha-pago.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class FechaPagoComponent implements OnInit {

  constructor(private fb: FormBuilder,private service: FechasService,private spinner: NgxSpinnerService, private modalService: NgbModal,
    private datePipe: DatePipe,) { 
  }

  formgrupos = this.fb.group({
    diplomado: [null]
  });

  diplomado: any; modulo:any; code:any; nombre:any;

  ngOnInit(): void {
    this.listDiplomado()
  }

  listDiplomado() {
    this.service.listar_diplomados().subscribe(data => {
      this.diplomado = data['data'];
    });
  }

  listGroup(event) {
    try {
      this.nombre = event.courses_name
      this.code = event.courses_code
      this.modulo=null
      if(event!=null){
        this.spinner.show()
        this.service.listPagos(this.code).subscribe(resp => {
          if (resp['success'] === true){
            let num=0
            resp.data.forEach(i=>{
              i.indice=num
              num++
            })
            this.modulo=resp.data
            this.spinner.hide()
          }
        })
      }else{
      }
    }catch (e) {
      this.modulo=null
    }
  }

  changeFecha(data, index){
    this.cambiarFecha(data,index)
  }

  cambiarFecha(data, index){
    let fecha:any=this.datePipe.transform(data.fecha_vencimiento*1000,"dd-MM-yyyy | h:mm a")
    if(!data.fecha_vencimiento){fecha='Sin fecha'}
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Seguro de Cambiar la fecha de '+data.num_cuota+'?\n'+fecha,
      icon: 'question',
      html:'<input id="datepicker" type="datetime-local" class="form-control text-dark" autofocus>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Seguro',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let dat= $('#datepicker').val().toString()
        let fecha= new Date(dat)
        let cuotas:any=[]
        this.modulo.forEach(i=>{
          if(i.indice==index){
            i.fecha_vencimiento=fecha.getTime()/1000
          }
          cuotas.push({
            indice: i.indice,
            fecha_vencimiento: i.fecha_vencimiento
          })
        })
        let body={
          diplomado_code: this.code,
          cuotas: cuotas
        }
        //console.log(body)
        this.actFecha(body)
      }
    })
  }

  actFecha(body){
    this.spinner.show()
    this.service.actFechaPago(body).subscribe(res => {
      if(res['success']==true){
        this.spinner.hide()
        this.reset()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: "Fecha Actualizada",
          showConfirmButton: false,
          timer: 2000
        });
      }
      else{
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error!",
          text: "No se realizó la actualización",
          showConfirmButton: false,
          timer: 2000
        });
      }
    })
  }

  reset(){
    this.spinner.show()
    this.service.listPagos(this.code).subscribe(resp => {
      if (resp['success'] === true){
        let num=0
        resp.data.forEach(i=>{
          i.indice=num
          num++
        })
        this.modulo=resp.data
        console.log(this.modulo)
        this.spinner.hide()
      }
    })
  }
}
