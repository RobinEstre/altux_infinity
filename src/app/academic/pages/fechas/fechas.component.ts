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
  selector: 'app-fechas',
  templateUrl: './fechas.component.html',
  styleUrls: ['./fechas.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class FechasComponent implements OnInit {

  constructor(private fb: FormBuilder,private service: FechasService,private spinner: NgxSpinnerService, private modalService: NgbModal,
    private datePipe: DatePipe,) { 
  }

  formgrupos = this.fb.group({
    grupo: [null],
    diplomado: [null],
    modulo: [null]
  });

  diplomado: any; modulo:any; code:any; mostrar:boolean; nombre:any;

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
      this.mostrar = false
      this.modulo=null
      if(event!=null){
        this.spinner.show()
        this.service.listModulos(this.code).subscribe(resp => {
          if (resp['success'] === true){
            let data:any=[]
            resp['data'].forEach(i=>{
              const split = i.module_name.split(' ')
              split.splice(0, 2);
              let name=split.map(x=>x).join(" ")
              const name_title = i.module_name.split(' ')
              var title=name_title[0]+' '+name_title[1];
              data.push({
                "modulo_id": i.modulo_id,
                "module_title": title,
                "module_name": name,
                "clases": i.clases,
                "evaluaciones": i.evaluaciones
              })
            })
            this.modulo=data
            this.spinner.hide()
          }
        })
      }else{
      }
    }catch (e) {
      this.mostrar = false
      this.modulo=null
    }
  }

  changeClase(data, estado, index){
    if(estado=='fecha'){
      this.cambiarFecha(data, index)
    }else{
      this.cambiarEstado(data, estado, index)
    }
  }

  cambiarFecha(data, index){
    let fecha:any=this.datePipe.transform(data.clases[index].fecha_clase*1000,"dd-MM-yyyy | h:mm a")
    if(!data.clases[index].fecha_clase){fecha='Sin fecha'}
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro de Cambiar la fecha de la Clase '+data.clases[index].clase+'?\n'+fecha,
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
        //fecha.setDate(fecha.getDate() + 1);
        data.clases[index].fecha_clase=fecha.getTime()/1000
        let body={
          "fecha_clase1":data.clases[0].fecha_clase,
          "estado_clase1":data.clases[0].estado,
          "fecha_clase2":data.clases[1].fecha_clase,
          "estado_clase2":data.clases[1].estado,
          "fecha_clase_taller":data.clases[2].fecha_clase,
          "estado_taller":data.clases[2].estado,
      
          "inicio_evaluacion_lectura1":data.evaluaciones[0].fecha_inicio,
          "fin_evaluacion_lectura1":data.evaluaciones[0].fecha_fin,
          "estado_evaluacion_lectura1":data.evaluaciones[0].estado,
      
          "inicio_evaluacion_lectura2":data.evaluaciones[1].fecha_inicio,
          "fin_evaluacion_lectura2":data.evaluaciones[1].fecha_fin,
          "estado_evaluacion_lectura2":data.evaluaciones[1].estado,
      
          "inicio_evaluacion_final":data.evaluaciones[2].fecha_inicio,
          "fin_evaluacion_final":data.evaluaciones[2].fecha_fin,
          "estado_evaluacion_final":data.evaluaciones[2].estado,
      
          "inicio_evaluacion_taller":data.evaluaciones[3].fecha_inicio,
          "fin_evaluacion_taller":data.evaluaciones[3].fecha_fin,
          "estado_evaluacion_taller":data.evaluaciones[3].estado,
      
          "inicio_evaluacion_sustitutorio":data.evaluaciones[4].fecha_inicio,
          "fin_evaluacion_sustitutorio":data.evaluaciones[4].fecha_fin,
          "estado_evaluacion_sustitutorio":data.evaluaciones[4].estado
        }
        this.actEstado(data.modulo_id,body,'fecha')
      }
    })
  }

  cambiarEstado(data, estado, index){
    let texto='¿Está Seguro de Cambiar a Inactivo?', icon='error'
    if(estado){
      texto='¿Está Seguro de Cambiar a Activo?'
      icon='success'
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: texto+' Clase '+data.clases[index].clase,
      //text: 'Clase '+data.clases[index].clase,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Seguro',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        data.clases[index].estado=estado
        let body={
          "fecha_clase1":data.clases[0].fecha_clase,
          "estado_clase1":data.clases[0].estado,
          "fecha_clase2":data.clases[1].fecha_clase,
          "estado_clase2":data.clases[1].estado,
          "fecha_clase_taller":data.clases[2].fecha_clase,
          "estado_taller":data.clases[2].estado,
      
          "inicio_evaluacion_lectura1":data.evaluaciones[0].fecha_inicio,
          "fin_evaluacion_lectura1":data.evaluaciones[0].fecha_fin,
          "estado_evaluacion_lectura1":data.evaluaciones[0].estado,
      
          "inicio_evaluacion_lectura2":data.evaluaciones[1].fecha_inicio,
          "fin_evaluacion_lectura2":data.evaluaciones[1].fecha_fin,
          "estado_evaluacion_lectura2":data.evaluaciones[1].estado,
      
          "inicio_evaluacion_final":data.evaluaciones[2].fecha_inicio,
          "fin_evaluacion_final":data.evaluaciones[2].fecha_fin,
          "estado_evaluacion_final":data.evaluaciones[2].estado,
      
          "inicio_evaluacion_taller":data.evaluaciones[3].fecha_inicio,
          "fin_evaluacion_taller":data.evaluaciones[3].fecha_fin,
          "estado_evaluacion_taller":data.evaluaciones[3].estado,
      
          "inicio_evaluacion_sustitutorio":data.evaluaciones[4].fecha_inicio,
          "fin_evaluacion_sustitutorio":data.evaluaciones[4].fecha_fin,
          "estado_evaluacion_sustitutorio":data.evaluaciones[4].estado
        }
        this.actEstado(data.modulo_id,body,'estado')
      }
    })
  }

  changeEval(data, estado, index){
    if(estado=='fecha_inicio'){
      this.cambiarFechaEval(data, index, 'inicio')
    }else if(estado=='fecha_fin'){
      this.cambiarFechaEval(data, index, 'fin')
    }else{
      this.cambiarEstadoEval(data, estado, index)
    }
  }

  cambiarEstadoEval(data, estado, index){
    let texto='¿Está Seguro de Cambiar a Inactivo?', icon='error'
    if(estado){
      texto='¿Está Seguro de Cambiar a Activo?'
      icon='success'
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: texto,
      text: data.evaluaciones[index].name_evaluacion,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Seguro',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        data.evaluaciones[index].estado=estado
        let body={
          "fecha_clase1":data.clases[0].fecha_clase,
          "estado_clase1":data.clases[0].estado,
          "fecha_clase2":data.clases[1].fecha_clase,
          "estado_clase2":data.clases[1].estado,
          "fecha_clase_taller":data.clases[2].fecha_clase,
          "estado_taller":data.clases[2].estado,
      
          "inicio_evaluacion_lectura1":data.evaluaciones[0].fecha_inicio,
          "fin_evaluacion_lectura1":data.evaluaciones[0].fecha_fin,
          "estado_evaluacion_lectura1":data.evaluaciones[0].estado,
      
          "inicio_evaluacion_lectura2":data.evaluaciones[1].fecha_inicio,
          "fin_evaluacion_lectura2":data.evaluaciones[1].fecha_fin,
          "estado_evaluacion_lectura2":data.evaluaciones[1].estado,
      
          "inicio_evaluacion_final":data.evaluaciones[2].fecha_inicio,
          "fin_evaluacion_final":data.evaluaciones[2].fecha_fin,
          "estado_evaluacion_final":data.evaluaciones[2].estado,
      
          "inicio_evaluacion_taller":data.evaluaciones[3].fecha_inicio,
          "fin_evaluacion_taller":data.evaluaciones[3].fecha_fin,
          "estado_evaluacion_taller":data.evaluaciones[3].estado,
      
          "inicio_evaluacion_sustitutorio":data.evaluaciones[4].fecha_inicio,
          "fin_evaluacion_sustitutorio":data.evaluaciones[4].fecha_fin,
          "estado_evaluacion_sustitutorio":data.evaluaciones[4].estado
        }
        this.actEstado(data.modulo_id,body,'estado')
      }
    })
  }

  cambiarFechaEval(data, index, tipo){
    let fecha:any
    if(tipo=='inicio'){
      fecha=this.datePipe.transform(data.evaluaciones[index].fecha_inicio*1000,"dd-MM-yyyy")
      if(!data.evaluaciones[index].fecha_inicio){fecha='Sin fecha'}
    }
    if(tipo=='fin'){
      fecha=this.datePipe.transform(data.evaluaciones[index].fecha_fin*1000,"dd-MM-yyyy | h:mm a")
      if(!data.evaluaciones[index].fecha_fin){fecha='Sin fecha'}
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro de Cambiar la fecha '+tipo+' de '+data.evaluaciones[index].name_evaluacion+'?\n'+fecha,
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
        //fecha.setDate(fecha.getDate() + 1);
        if(tipo=='inicio'){
          data.evaluaciones[index].fecha_inicio=fecha.getTime()/1000
        }
        if(tipo=='fin'){
          data.evaluaciones[index].fecha_fin=fecha.getTime()/1000
        }
        let body={
          "fecha_clase1":data.clases[0].fecha_clase,
          "estado_clase1":data.clases[0].estado,
          "fecha_clase2":data.clases[1].fecha_clase,
          "estado_clase2":data.clases[1].estado,
          "fecha_clase_taller":data.clases[2].fecha_clase,
          "estado_taller":data.clases[2].estado,
      
          "inicio_evaluacion_lectura1":data.evaluaciones[0].fecha_inicio,
          "fin_evaluacion_lectura1":data.evaluaciones[0].fecha_fin,
          "estado_evaluacion_lectura1":data.evaluaciones[0].estado,
      
          "inicio_evaluacion_lectura2":data.evaluaciones[1].fecha_inicio,
          "fin_evaluacion_lectura2":data.evaluaciones[1].fecha_fin,
          "estado_evaluacion_lectura2":data.evaluaciones[1].estado,
      
          "inicio_evaluacion_final":data.evaluaciones[2].fecha_inicio,
          "fin_evaluacion_final":data.evaluaciones[2].fecha_fin,
          "estado_evaluacion_final":data.evaluaciones[2].estado,
      
          "inicio_evaluacion_taller":data.evaluaciones[3].fecha_inicio,
          "fin_evaluacion_taller":data.evaluaciones[3].fecha_fin,
          "estado_evaluacion_taller":data.evaluaciones[3].estado,
      
          "inicio_evaluacion_sustitutorio":data.evaluaciones[4].fecha_inicio,
          "fin_evaluacion_sustitutorio":data.evaluaciones[4].fecha_fin,
          "estado_evaluacion_sustitutorio":data.evaluaciones[4].estado
        }
        this.actEstado(data.modulo_id,body,'fecha')
      }
    })
  }

  actEstado(id, body, tipo){
    this.spinner.show()
    this.service.actFechas(id, body).subscribe(res => {
      if(res['success']==true){
        this.spinner.hide()
        this.reset()
        if(tipo=='estado'){
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Genial :)!",
            text: "Estado Actualizado",
            showConfirmButton: false,
            timer: 2000
          });
        }else{
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Genial :)!",
            text: "Fecha Actualizada",
            showConfirmButton: false,
            timer: 2000
          });
        }
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
    this.service.listModulos(this.code).subscribe(resp => {
      if (resp['success'] === true){
        let data:any=[]
        resp['data'].forEach(i=>{
          const split = i.module_name.split(' ')
          split.splice(0, 2);
          let name=split.map(x=>x).join(" ")
          const name_title = i.module_name.split(' ')
          var title=name_title[0]+' '+name_title[1];
          data.push({
            "modulo_id": i.modulo_id,
            "module_title": title,
            "module_name": name,
            "clases": i.clases,
            "evaluaciones": i.evaluaciones
          })
        })
        this.modulo=data
        this.spinner.hide()
      }
    })
  }
}
