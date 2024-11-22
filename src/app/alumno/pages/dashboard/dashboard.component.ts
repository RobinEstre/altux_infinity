import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from '../../services/dashboard.service';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import { FormBuilder } from '@angular/forms';
import { timer } from 'rxjs';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class DashboardComponent implements OnInit {

  constructor(private service: DashboardService, private spinner: NgxSpinnerService,private fb: FormBuilder,) { }

  formMatricula = this.fb.group({
    diplomado: [null],
    diplomado_clase: [null],
    diplomado_crono: [null],
  })
  userName:any;

  date: Date = new Date(); class_module:any; course:any; link_clase:any; nombre_dip:any; pago:any; notas_pay:any

  cronograma:any; porcentajes:any; diplomados:any=[];  detail_diplomado:any; source=timer(0,1000);

  ngOnInit(): void {
    this.source.subscribe(t => {
      this.date = new Date();
    });
    this.userName = localStorage.getItem('USERNAME');
    this.listInit()
  }

  listInit(){
    this.spinner.show()
    this.service.getPorcentajeEstudiante().subscribe(resp=>{
      if(resp.success){
        this.porcentajes=resp.data
        this.service.getDiplomados().subscribe(resp=>{
          if(resp.success){
            let data:any=[]
            resp.diplomados.forEach(i=>{
              let name
              const split = i.course.courses_name.split(' ')
              split.splice(0, 3);
              name=split.map(x=>x).join(" ")
              data.push({
                "courses_code": i.course.courses_code,
                "courses_name": i.course.courses_name
              })
            })
            let code=data[0].courses_code
            this.formMatricula.controls.diplomado.setValue(code)
            this.formMatricula.controls.diplomado_clase.setValue(code)
            this.formMatricula.controls.diplomado_crono.setValue(code)
            this.changeDiplomado(code)
            this.classModule(code)
            this.getCronograma(code)
            this.getNotasPay(code)
            this.diplomados=data
          }
        })
      }
    })
  }

  getNotasPay(code){
    this.spinner.show()
    this.pago=null
    this.service.getNotasPay(code).subscribe(resp=>{
      if(resp.success){
        this.spinner.hide()
        this.notas_pay=resp.data
      }
    },error => {
      if(error.status==400){
        Swal.fire({
          title: 'Advertencia!',
          text: error.error.message,
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar'
        })
      }
      if(error.status==500){
        Swal.fire({
          title: 'Advertencia!',
          text: 'Comuniquese con el Área de Sistemas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar'
        })
      }
      this.spinner.hide()
    })
  }

  getCronograma(code){
    this.spinner.show()
    this.pago=null
    this.service.getCronograma(code).subscribe(resp=>{
      if(resp.success){
        let data:any=[]
        resp.data.forEach(i=>{
          let name
          if(i.evento.pago){
            const split = i.evento.pago[0].diplomado.split(' ')
            split.splice(0, 3);
            name=split.map(x=>x).join(" ")
            data.push({
              "id": i.id,
              "tipo": 'pago',
              "detalle":{
                "is_paid": i.evento.pago[0].is_paid,
                "num_cuota": i.evento.pago[0].num_cuota,
                "monto_pagar": i.evento.pago[0].monto_pagar,
                "fecha_vencimiento": i.evento.pago[0].fecha_vencimiento,
                "diplomado_code": i.evento.pago[0].diplomado_code,
                "diplomado": i.evento.pago[0].diplomado
              }
            })
          }
          if(i.evento.clase){
            const split = i.evento.clase[0].diplomado.split(' ')
            split.splice(0, 3);
            name=split.map(x=>x).join(" ")
            data.push({
              "id": i.id,
              "tipo": 'clase',
              "detalle":{
                "clase": i.evento.clase[0].clase,
                "fecha_clase": i.evento.clase[0].fecha_clase,
                "diplomado_code": i.evento.clase[0].diplomado_code,
                "diplomado": i.evento.clase[0].diplomado,
                "modulo": i.evento.clase[0].modulo
              }
            })
          }
          if(i.evento.evaluacion){
            const split = i.evento.evaluacion[0].diplomado.split(' ')
            split.splice(0, 3);
            name=split.map(x=>x).join(" ")
            data.push({
              "id": i.id,
              "tipo": 'evaluacion',
              "detalle":{
                "fecha_fin": i.evento.evaluacion[0].fecha_fin,
                "fecha_inicio": i.evento.evaluacion[0].fecha_inicio,
                "name_evaluacion": i.evento.evaluacion[0].name_evaluacion,
                "diplomado_code": i.evento.evaluacion[0].diplomado_code,
                "diplomado": i.evento.evaluacion[0].diplomado,
                "modulo": i.evento.evaluacion[0].modulo
              }
            })
          }
        })
        this.spinner.hide()
        this.cronograma=data
      }
    },error => {
      if(error.status==400){
        Swal.fire({
          title: 'Advertencia!',
          text: error.error.message,
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar'
        })
      }
      if(error.status==500){
        Swal.fire({
          title: 'Advertencia!',
          text: 'Comuniquese con el Área de Sistemas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar'
        })
      }
      this.spinner.hide()
    })
  }

  classModule(code){    
    this.spinner.show()
    this.service.getClassModule(code).subscribe(resp => {
      if (resp.success){
        this.class_module=resp.modulos
        this.nombre_dip=resp.nombre_dip
        let link='javajavascript:void(0)'
        if(resp.diplomado_clase!=null){link=resp.diplomado_clase}
        this.link_clase=link
        this.spinner.hide()
      }
    })
  }

  selectDiplomado(event){
    try{
      let code=event.courses_code
      this.changeDiplomado(code)
    }catch(e){
      let code=this.diplomados[0].courses_code
      this.formMatricula.controls.diplomado.setValue(code)
      this.changeDiplomado(code)
    }
  }

  selectDiplomadoClass(event){
    try{
      let code=event.courses_code
      this.classModule(code)
      this.getNotasPay(code)
    }catch(e){
      let code=this.diplomados[0].courses_code
      this.formMatricula.controls.diplomado_clase.setValue(code)
      this.classModule(code)
      this.getNotasPay(code)
    }
  }

  selectDiplomadoCrono(event){
    try{
      let code=event.courses_code
      this.getCronograma(code)
    }catch(e){
      let code=this.diplomados[0].courses_code
      this.formMatricula.controls.diplomado_crono.setValue(code)
      this.getCronograma(code)
    }
  }

  changeDiplomado(code){
    this.porcentajes.forEach(i=>{
      if(code==i.diplomado_code){
        this.detail_diplomado=i
      }
    })
  }

  abrirLink(data){}
}
