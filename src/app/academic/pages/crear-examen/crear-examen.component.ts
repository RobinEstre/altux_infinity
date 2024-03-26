import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import Swal from "sweetalert2";
import { NgxSpinnerService } from 'ngx-spinner';
import { ExamenesService } from '../../services/examenes.service';

@Component({
  selector: 'app-crear-examen',
  templateUrl: './crear-examen.component.html',
  styleUrls: ['./crear-examen.component.scss'],
  providers: [DatePipe]
})
export class CrearExamenComponent implements OnInit {

  constructor(private fb: FormBuilder, private Service: ExamenesService, private spinner: NgxSpinnerService,private datePipe: DatePipe,) { 
  }

  formgrupos = this.fb.group({
    diplomado: [null, Validators.required],
    modulo: [null, Validators.required],
    tipo_examen: [null, Validators.required]
  });

  formdetail = this.fb.group({
    maximo_preguntas: [null],
    maximo_nota: [null, Validators.required],
    minimo_nota: [null, Validators.required],
    fecha_inicio: [null, Validators.required],
    fecha_fin: [null, Validators.required],
    nombre_examen: [null, Validators.required],
    descripcion: [null, ],
  });

  group: any[] = []; diplomado: any[] = []; modulo: any[] = []; _generate: any; data:any
  code:any; tipo_examen:any; max_quiz:any; dates:any; diplomado_name:any=''; modulo_name:any=''; examen_name:any='';

  ngOnInit(): void {
    this.listDiplomado()
  }

  listDiplomado() {
    this.formdetail.controls['maximo_nota'].disable()
    this.formdetail.controls['minimo_nota'].disable()
    this.formdetail.controls['fecha_inicio'].disable()
    this.formdetail.controls['fecha_fin'].disable()
    this.formdetail.controls['nombre_examen'].disable()
    this.Service.listar_tipoExamen().subscribe(data => {
      this.tipo_examen=data['data']
    })
    this.Service.listar_diplomados().subscribe(data => {
      data['data'].forEach(i=>{
        // const split = i.courses_name.split(' ')
        // split.splice(0, 3);
        // let name=split.map(x=>x).join(" ")
        // i.courses_name= name
      })
      this.diplomado = data['data'];
    });
    this.formgrupos.controls['modulo'].disable();
  }

  listModule(event) {
    this.data=[]
    this._generate=false
    try {
      this.diplomado_name=event.courses_name
      let code = event.courses_code
      this.formgrupos.controls['modulo'].setValue(null);
      this.Service.list_module(code, ).subscribe(data => {
        this.modulo = data['data'];
        this.formgrupos.controls['modulo'].enable();
      });
    }
    catch (e) {
      this.diplomado_name=''
      this.modulo_name=''
      this.examen_name=''
      this.formgrupos.controls['modulo'].setValue(null);
      this.formgrupos.controls['modulo'].disable();
      this.formgrupos.controls['tipo_examen'].setValue(null);
      this.formdetail.controls['fecha_inicio'].setValue(null);
      this.formdetail.controls['fecha_fin'].setValue(null);
      this.formdetail.controls['maximo_nota'].setValue(null)
      this.formdetail.controls['minimo_nota'].setValue(null)
      this.formdetail.controls['maximo_preguntas'].setValue('')
    }
  }

  selectModule(event){
    this.data=[]
    this._generate=false
    try{
      this.formgrupos.controls['tipo_examen'].setValue(null);
      this.formdetail.controls['fecha_inicio'].setValue(null);
      this.formdetail.controls['fecha_fin'].setValue(null);
      var splitted = event.module_name.split(' ');
      splitted.splice(2,8);
      var cadena= splitted.toString();
      this.modulo_name=cadena.replace(/_|#|-|@|<>|:|,/g, " ")
      let date
      this.modulo.forEach(i=>{
        if(event.id==i.id){
          date={
            'modulo': i.module_detail.evaluaciones
          }
          this.dates=date
        }
      })
    } catch (e) {
      this.modulo_name=''
      this.examen_name=''
      this.formgrupos.controls['modulo'].setValue(null);
      this.formgrupos.controls['tipo_examen'].setValue(null);
      this.formdetail.controls['fecha_inicio'].setValue(null);
      this.formdetail.controls['fecha_fin'].setValue(null);
      this.formdetail.controls['maximo_nota'].setValue(null)
      this.formdetail.controls['minimo_nota'].setValue(null)
      this.formdetail.controls['maximo_preguntas'].setValue('')
    }
  }

  selectTypeExamen(event){
    this.data=[]
    this._generate=false
    try{
      this.examen_name=event.type_name
      for(let i=0; this.tipo_examen.length>i;i++) {
        if (event.id == this.tipo_examen[i].id) {
          this.formdetail.controls['maximo_nota'].setValue(this.tipo_examen[i].detail.maximo_nota)
          this.formdetail.controls['maximo_preguntas'].setValue(this.tipo_examen[i].detail.maximo_pregunta)
          this.formdetail.controls['minimo_nota'].setValue(this.tipo_examen[i].detail.minimo_nota)
          this.max_quiz=this.formdetail.controls['maximo_preguntas'].value
        }
      }
      this.dates.modulo.forEach(i=>{
        if(i.name_evaluacion==event.type_name){
          if(i.fecha_inicio && i.fecha_fin){
            let date_inicio= (new Date(i.fecha_inicio*1000).getTime())
            let fecha_inicio:any= this.datePipe.transform(date_inicio,"yyyy-MM-dd HH:mm")
            this.formdetail.controls['fecha_inicio'].setValue(fecha_inicio);
            let date_fin= (new Date(i.fecha_fin*1000).getTime())
            let fecha_fin:any= this.datePipe.transform(date_fin,"yyyy-MM-dd HH:mm")
            this.formdetail.controls['fecha_fin'].setValue(fecha_fin);
          }
          else {
            this.formdetail.controls['fecha_inicio'].setValue(null);
            this.formdetail.controls['fecha_fin'].setValue(null);
          }
        }
      })
    }
    catch (e) {
      this.examen_name=''
      this.formgrupos.controls['tipo_examen'].setValue(null);
      this.formdetail.controls['fecha_inicio'].setValue(null);
      this.formdetail.controls['fecha_fin'].setValue(null);
      this.formdetail.controls['maximo_nota'].setValue(null)
      this.formdetail.controls['minimo_nota'].setValue(null)
      this.formdetail.controls['maximo_preguntas'].setValue('')
    }
  }

  async openFile(){
    this.data=[]
    this._generate=false
    const { value: file } = await Swal.fire({
      title: 'Subir Archivo De Examen',
      input: 'file',
      inputAttributes: {
        'accept': 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'aria-label': 'Subir Archivo Excel'
      },
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText:'Cerrar',
      confirmButtonText: 'Subir Archivo'
    })
    if (file) {
      console.log(file)
      this.subirExcel(file)      
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Archivo no seleccionado',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  subirExcel(files){
    this.spinner.show()
    const formData = new FormData()
    formData.append('files', files, files.name);
    this.Service.addExcelExamen(formData).subscribe(data => {
      if(data['success']==true){
        this.data=data.data
        this._generate=true
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: "Examen Generado",
          showConfirmButton: false,
          timer: 2000
        });
      }else{
        Swal.fire({
          position: "center",
          icon: "warning",
          title: data['message'],
          showConfirmButton: false,
          timer: 2000
        });
      }
      this.spinner.hide()
    }, error => {
      if(error.status==400){
        Swal.fire({
          title: 'Advertencia!',
          text: error.error['message'],
          icon: 'warning',
          showCancelButton: true,
          showConfirmButton:false,
          cancelButtonColor: '#d37c0c',
          cancelButtonText: 'Cerrar'
        })
      }
      if(error.status==500){
        Swal.fire({
          title: 'Advertencia!',
          text: 'Comuniquese con el Area de Sistemas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton:false,
          cancelButtonColor: '#d37c0c',
          cancelButtonText: 'Cerrar'
        })
      }
      this.spinner.hide()
    })
  }

  detail_Exam(){
    this.data=[]
    this._generate=true
    this.max_quiz=this.formdetail.controls['maximo_preguntas'].value
  }

  registrar(jsonbody){
    let fec_1=this.formdetail.controls['fecha_inicio'].value;
    var fecha_inicio= (new Date(fec_1).getTime())/1000

    let fec_2=this.formdetail.controls['fecha_fin'].value;
    var fecha_fin= (new Date(fec_2).getTime())/1000

    let nombre = this.diplomado_name+' - '+this.modulo_name+'- '+this.examen_name

    const body= {
      "nombre": nombre,
      "descripcion": this.formdetail.controls['descripcion'].value,
      "tipo_evaluacion": this.formgrupos.controls['tipo_examen'].value,
      "course_code": this.formgrupos.controls['diplomado'].value,
      "modulo_id": this.formgrupos.controls['modulo'].value,
      "detalle": {
        "maximo_pregunta": this.formdetail.controls['maximo_preguntas'].value,
        "maximo_nota": this.formdetail.controls['maximo_nota'].value,
        "minimo_nota": this.formdetail.controls['minimo_nota'].value,
        "fecha_inicio": fecha_inicio,
        "fecha_fin": fecha_fin,
        "tiempo_inicio": null,
        "tiempo_fin": null,
        "temporizador": 3600
      },
      "formulario": jsonbody
    }
    this.Service.registrarExamen(body, ).subscribe(data => {
      if(data.success==true){
        this._generate=false
        this.formgrupos.reset()
        this.formdetail.reset()
        Swal.fire({
          position: "center",
          icon: "warning",
          title: '¡Genial!',
          text: 'Registrado Correcto',
          showConfirmButton: false,
          timer: 2000
        });
      }
      else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: '¡Error!',
          text: 'Intentelo nuevamente',
          showConfirmButton: false,
          timer: 2000
        });
        return
      }
    })
  }
}

