import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AcademicoService } from 'src/app/alumno/services/academico.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class DetalleComponent implements OnInit {
  @ViewChild('docs') private modalContentDoc: TemplateRef<DetalleComponent>;
  private modalRefDoc: NgbModalRef;
  @ViewChild('content') private modalContent: TemplateRef<DetalleComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('record') private modalContentClass: TemplateRef<DetalleComponent>;
  private modalRefClass: NgbModalRef;

  courseCode: any;

  constructor(private service: AcademicoService, private spinner: NgxSpinnerService,private route: ActivatedRoute,
    private modalService: NgbModal,private routes: Router, private sanitizer : DomSanitizer,) { 
    //const name = Calendar.name; // add this line in your constructor
    this.courseCode = this.route.snapshot.params['code'];
  }

  course:any; modulo:any; modulos:any; grabacion:any; module_id:any; materials:any; tipo_material:any; class_module:any; link_clase:any; 
  url_doc:any; evaluations:any; detalle_class:any; url_class:any; fecha_ahora:any=new Date(); diplomado_clase:any
  id_examen:any; exam_expired:boolean=false; exam_generated:boolean=false; exam_finalizado:boolean=false; btn_iniciar_exam:boolean=true;

  ngOnInit(): void {
    this.getModuloActual()
  }

  getModuloActual(){
    this.spinner.show()
    this.service.getModActual(this.courseCode).subscribe(resp => {
      if (resp.success){
        if (resp['modulo']) {
          this.modulo=resp.modulo
          this.getDetailDiplomado()
        }else {
          this.getDetailDiplomado()
        }
      }
    })
    this.service.getClassModule(this.courseCode).subscribe(resp => {
      if (resp.success){
        this.class_module=resp.modulos
        this.diplomado_clase=resp.diplomado_clase
        let link='javajavascript:void(0)'
        if(resp.diplomado_clase!=null){link=resp.diplomado_clase}
        this.link_clase=link
      }
    })
  }

  getDetailDiplomado() {
    this.service.getDetailDiplomadoByCode(this.courseCode).subscribe(resp => {
      if (resp.success){
        let data:any=[], num=0
        this.course=resp.data
        resp.data.modulos.forEach(i=>{
          num++
          let bg_color
          if(i.module_number%2==0){
            bg_color = ""
          }else{
            bg_color = "color-file"        
          }
          let clase='', name
          if(this.modulo){if(this.modulo.numero_modulo==i.module_number){clase='show'}}
          const split = i.module_name.split(' ')
          split.splice(0, 2);
          name=split.map(x=>x).join(" ")
          data.push({
            "id": i.id,
            "module_name": name,
            "module_number": i.module_number,
            "module_detail": i.module_detail,
            'bg_color': bg_color,
            "clase": i.clase,
            "class": clase
          })
        })
        this.getEvaluationsHans(data,num)
        this.getMaterials(data,num)
        this.clasesGrabadas(data,num)
        this.modulos=data
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

  innermenuopen() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('innermenu-close');
  }

  clasesGrabadas(data, mod_id){
    const bloques=[{bloque:1,data:null},{bloque:2,data:null},{bloque:3,data:null},{bloque:4,data:null},
    {bloque:5,data:null},{bloque:6,data:null},{bloque:7,data:null}]
    let n=0
    for(let i:any=0; i<data.length;i++){
      let body = {
        "course_code": this.courseCode,
        "modulo_id": data[i].id
      };
      this.service.clasesGrabadas(body).subscribe(resp => {
        if (resp['success'] === true){
          bloques.forEach(a=>{
            if(a.bloque==i+1){
              a.data=resp.data
            }
          })
          this.grabacion = bloques;
        }
      });
      this.module_id=mod_id;
    }
  }

  getMaterials(resp, num_module){
    const bloques=[{bloque:1,data:null},{bloque:2,data:null},{bloque:3,data:null},{bloque:4,data:null},
    {bloque:5,data:null},{bloque:6,data:null},{bloque:7,data:null}]
    let n=0
    for(let i:any=0; i<resp.length;i++){
      const body = {
        "course_code": this.courseCode,
        "num_module": i+1
      };
      this.service.getStudyMaterials(body).subscribe(res => {
        if(res.success){
          bloques.forEach(a=>{
            if(a.bloque==i+1){
              a.data=res.material
            }
          })
        }
        this.materials = bloques;
        let data:any = [];
        res.material.forEach(i => {
          if (data.length > 0){
            const found = data.find(
                (item) => item.type_material_id == i.type_material_id
            );
            if (found){
              console.log('no encontro el valor')
            }else {
              let json = {
                "type_material_id": i.type_material_id,
                "tipmat_name": i.tipmat_name,
              }
              data.push(json)
            }
          }else{
            let json = {
              "type_material_id": i.type_material_id,
              "tipmat_name": i.tipmat_name,
            }
            data.push(json)
          }
        })
        this.tipo_material = data
      })
    }
  }

  abrirLink(modulo){
    this.checkAsistencia(modulo.modulo_id, this.diplomado_clase.id)
    window.open(this.diplomado_clase.class_url,'_blank');
  }

  checkAsistencia(mod_id, id){
    let body = {
      "course_code": this.courseCode,
      "modulo_id": mod_id,
      "diplomadoclase_id": id
    };
    this.service.marcarAsistencia(body).subscribe(resp => {
      if (resp['success'] === true){
      }
    });
  }

  action_Evaluation(data, mod_id){
    this.spinner.show()
    this.id_examen=data
    this.module_id=mod_id
    const body = {
      "ficha_evaluacion_id": data.evaluation_student_id,
    };
    this.service.get_Action(body).subscribe(res => {
      if(res['success']==true){
        switch (res['accion']) {
          case 'evaluacion_finalizado':
            this.openModalInfo()
            this.exam_finalizado=true
            this.exam_generated=false
            this.exam_expired=false
            this.btn_iniciar_exam=false
            this.spinner.hide()
            break;
          case 'evaluacion_generado':
            this.openModalInfo()
            this.exam_generated=true
            this.exam_expired=false
            this.exam_finalizado=false
            this.btn_iniciar_exam=true
            this.spinner.hide()
            break;
          case 'evaluacion_expirado':
            this.openModalInfo()
            this.exam_expired=true
            this.exam_generated=false
            this.exam_finalizado=false
            this.btn_iniciar_exam=false
            this.spinner.hide()
            break;
          case 'evaluacion_reanudado':
            const url = '/alumno/examen/'+this.courseCode+'/'+mod_id+'/'+data.evaluation_student_id;
            this.spinner.hide()
            this.routes.navigate([url])
            break;
        }
      }
      else {
        switch (res['accion']) {
          case 'token_expirado':
            Swal.fire(
                'Error!',
                ''+res['message'],
                'error'
            )
            const reload = '/alumno/academico/'+this.courseCode
            this.spinner.hide()
            this.routes.navigate([reload])
            break;
          case 'no_existe_ficha_evaluacion':
            Swal.fire(
                'Error!',
                ''+res['message'],
                'error'
            )
            const url = '/alumno/academico/'+this.courseCode
            this.spinner.hide()
            this.routes.navigate([url])
            break;
        }
      }
    }, error => {
      Swal.fire(
          'Error!',
          'Error de servidor Actualizar página e intentar nuevamente',
          'error'
      )
      const reload = '/alumno/academico/'+this.courseCode
      this.spinner.hide()
      return this.routes.navigate([reload])
    });
  }

  prueba(num_module, num){
    //console.log(num)
  }

  /*LISTAR EXAMEN HANS*/
  getEvaluationsHans(data, num){
    const body=[{bloque:1,data:null, promedio:0},{bloque:2,data:null, promedio:0},{bloque:3,data:null, promedio:0},{bloque:4,data:null, promedio:0},
    {bloque:5,data:null, promedio:0},{bloque:6,data:null, promedio:0},{bloque:7,data:null, promedio:0}]
    let n=0
    for(let i:any=0; i<data.length;i++){
      this.service.getEvaluations(this.courseCode,data[i].id).subscribe(res => {
        if(res.success){
          body.forEach(a=>{
            if(a.bloque==i+1){
              a.data=res.data
              a.promedio=res.promedio
            }
          })
          n++
          if(n==data.length){
            this.evaluations = body;
            this.spinner.hide()
          }
        }
      });
    }
    // this.service.getEvaluationsHans(body).subscribe(res => {
    //   this.evaluations = res.data;
    // });
  }

  openModal(url){
    this.url_doc=url
    this.modalRefDoc = this.modalService.open(this.modalContentDoc, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRefDoc.result.then();
  }

  closeModal(){
    this.modalRefDoc.close()
  }

  openModalInfo() {
    this.modalRef = this.modalService.open(this.modalContent, { centered: true, size: 'lg' });
    this.modalRef.result.then();
  }

  closeModalInfo() {
    this.modalRef.close();
  }

  openModalClass(mod_id, data) {
    this.checkAsistencia(mod_id, data.id)
    this.detalle_class=data
    this.url_class=data.clase.data_class.url_clase_grabada
    this.sanitizer.bypassSecurityTrustResourceUrl(this.url_class);
    this.modalRefClass = this.modalService.open(this.modalContentClass, { centered: true, size: 'xl' });
    this.modalRefClass.result.then();
  }

  closeModalClass() {
    this.modalRefClass.close();
  }

  openTest(data){
    //const url = '/alumno/examen/'+this.courseCode+'/'+this.id+'/'+this.id_examen;
    this.closeModalInfo()
    const body = {
      "ficha_evaluacion_id": data.evaluation_student_id,
    };
    this.service.create_Evaluation_Estudent(body).subscribe(resp => {
      if(resp['success']==true){
        const url = '/alumno/examen/'+this.courseCode+'/'+this.module_id+'/'+data.evaluation_student_id;
        return this.routes.navigate([url])
      }
    })
  }
}
