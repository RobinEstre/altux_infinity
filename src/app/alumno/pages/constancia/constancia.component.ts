import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AcademicoService } from '../../services/academico.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-constancia',
  templateUrl: './constancia.component.html',
  styleUrls: ['./constancia.component.scss']
})
export class ConstanciaComponent implements OnInit {
  @ViewChild('register') private modalContent: TemplateRef<ConstanciaComponent>;
  private modalRef: NgbModalRef;

  constructor(private spinner: NgxSpinnerService, private modalService: NgbModal,private fb: FormBuilder,private service: AcademicoService) { }

  formgrupos = this.fb.group({
    diplomado: [null]
  });

  diplomado: any; data_user:any; constancias:any; url_doc:any; tipo:any;

  ngOnInit(): void {
    this.listProfile()
  }

  listProfile(){
    this.spinner.show()
    this.service.getInfoUser().subscribe(resp=>{
      if(resp.success){
        this.data_user=resp.user_profile
        this.listDiplomado()
      }
    })
  }

  listDiplomado(){
    this.spinner.show()
    this.service.getCourses().subscribe(resp => {
      if(resp.success){
        let data=[]
        resp.courses.forEach(i=>{
          let name
          const split = i.course.courses_name.split(' ')
          split.splice(0, 3);
          name=split.map(x=>x).join(" ")
          data.push({
            "courses_code": i.course.courses_code,
            "courses_name": i.course.courses_name,
            "id": i.course.id
          })
        })
        this.diplomado = data;
        this.formgrupos.controls.diplomado.setValue(this.diplomado[0].courses_code)
        this.list()
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

  listStudent(event){
    try{
      this.rerender()
    }catch(e){
      this.formgrupos.controls.diplomado.setValue(this.diplomado[0].courses_code)
      this.rerender()
    }
  }

  rerender(){
    this.list()
  }

  list(){
    this.spinner.show()
    let id
    this.diplomado.forEach(i => {
      if(i.courses_code==this.formgrupos.controls.diplomado.value){
        id=i.id
      }
    });
    this.service.listConstancias(this.data_user.id, id).subscribe(resp => {
      if(resp.success){
        this.constancias=resp.data
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

  getCertificate(tipo){
    this.spinner.show()
    //matricula-estudiante-egreso
    let id
    this.diplomado.forEach(i => {
      if(i.courses_code==this.formgrupos.controls.diplomado.value){
        id=i.id
      }
    });
    let body = {
      "type_constancia": tipo,
      "user_id":this.data_user.id,
      "diplomado_id":id  //matricula-estudiante-egreso
    }
    this.service.generateConstancia(body).subscribe(resp => {
      if(resp.success){
        let nombre
        if(tipo=='matricula'){
          nombre='Constancia de Matrícula'
        }
        if(tipo=='estudiante'){
          nombre='Constancia de Estudios'
        }
        if(tipo=='egreso'){
          nombre='Constancia de Egreso'
        }
        this.url_doc=resp.data
        this.spinner.hide()
        this.openModal(nombre)
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

  descargarModal(url){
    window.open(url,'_blank');
  }

  descargar(tipo){
    this.spinner.show()
    //matricula-estudiante-egreso
    let id
    this.diplomado.forEach(i => {
      if(i.courses_code==this.formgrupos.controls.diplomado.value){
        id=i.id
      }
    });
    let body = {
      "type_constancia": tipo,
      "user_id":this.data_user.id,
      "diplomado_id":id  //matricula-estudiante-egreso
    }
    this.service.generateConstancia(body).subscribe(resp => {
      if(resp.success){
        window.open(resp.data.url,'_blank');
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

  openModal(tipo){
    this.tipo=tipo
    this.modalRef = this.modalService.open(this.modalContent, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'lg', keyboard: false });
    this.modalRef.result.then();
  }

  closeModal(){
    this.modalRef.close()
  }
}
