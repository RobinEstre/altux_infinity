import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AcademicoService } from '../../services/academico.service';

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

  diplomado: any;

  ngOnInit(): void {
    this.listDiplomado()
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
            "courses_name": i.course.courses_name
          })
        })
        this.diplomado = data;
        this.formgrupos.controls.diplomado.setValue(this.diplomado[0].courses_code)
        // this.list()
        this.spinner.hide()
      }
    });
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
  }

  getCertificate(){
    this.spinner.show()
    let body = {
      "type_constancia":"matricula",
      "user_id":13,
      "diplomado_id":44  //matricula-estudiante-egreso
    }
    this.service.getCourses().subscribe(data => {
      this.diplomado = data['data'];
      this.formgrupos.controls.diplomado.setValue(this.diplomado[0].courses_code)
      this.spinner.hide()
    });}

  openModal(){
    this.modalRef = this.modalService.open(this.modalContent, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'lg', keyboard: false });
    this.modalRef.result.then();
  }

  closeModal(){
    this.modalRef.close()
  }
}
