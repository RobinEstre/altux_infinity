import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AcademicoService } from 'src/app/alumno/services/academico.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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

  courseCode: any;

  constructor(private service: AcademicoService, private spinner: NgxSpinnerService,private route: ActivatedRoute,private modalService: NgbModal) { 
    //const name = Calendar.name; // add this line in your constructor
    this.courseCode = this.route.snapshot.params['code'];
  }

  course:any; modulo:any; modulos:any; grabacion:any; module_id:any; materials:any; tipo_material:any; class_module:any; link_clase:any; url_doc:any

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
        let link='javajavascript:void(0)'
        if(resp.link!=null){link=resp.link}
        this.link_clase=link
      }
    })
  }

  getDetailDiplomado() {
    this.service.getDetailDiplomadoByCode(this.courseCode).subscribe(resp => {
      if (resp.success){
        let data:any=[]
        this.course=resp.data
        resp.data.modulos.forEach(i=>{
          let clase=''
          if(this.modulo.numero_modulo==i.module_number){clase='show'}
          data.push({
            "id": i.id,
            "module_name": i.module_name,
            "module_number": i.module_number,
            "module_detail": i.module_detail,
            "clase": i.clase,
            "class": clase
          })
        })
        this.modulos=data
        this.spinner.hide()
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

  clasesGrabadas(mod_id){
    this.grabacion = []
    let body = {
      "course_code": this.courseCode,
      "modulo_id": mod_id
    };
    this.service.clasesGrabadas(body).subscribe(resp => {
      if (resp['success'] === true){
        this.grabacion = resp['data'];
      }
    });
    this.module_id=mod_id;
  }

  getMaterials(num_module){
    this.materials = [];
    const body = {
      "course_code": this.courseCode,
      "num_module": num_module+1
    };
    this.service.getStudyMaterials(body).subscribe(res => {
      this.materials = res.material;
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

  abrirLink(modulo){
    this.checkAsistencia(modulo.id,modulo.link.diplomado_clase_id)
    window.open(modulo.link.url_clase,'_blank');
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

  openModal(url){
    this.url_doc=url
    this.modalRefDoc = this.modalService.open(this.modalContentDoc, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRefDoc.result.then();
  }

  closeModal(){
    this.modalRefDoc.close()
  }
}
