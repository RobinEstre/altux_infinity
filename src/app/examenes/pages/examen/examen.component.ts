import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExamenService } from '../../service/examen.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss']
})
export class ExamenComponent implements OnInit {
  @ViewChild('content') private modalContent: TemplateRef<ExamenComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('terminate') private modalContentTerminate: TemplateRef<ExamenComponent>;
  private modalRefTerminate: NgbModalRef;

  constructor(private route: ActivatedRoute,private spinner: NgxSpinnerService,private modalService: NgbModal,
    private service: ExamenService,private routes: Router,) { 
    this.id_examen = this.route.snapshot.params['id_examen'];
    this.courseCode = this.route.snapshot.params['code'];
  }

  public _examen:any;

  id_examen:any; nota:boolean; enviar:boolean=true; courseCode: any; exam_finalizado:boolean=true; finalizar:boolean=true; salir:boolean=false
  expirado:boolean = true; examen:any; preguntas:any=[]; respuestas:any=[]

  ngOnInit(): void {
    this.list()
  }

  list(){
    const body = {
      "ficha_evaluacion_id": this.id_examen,
    };
    this.service.getDetailExamen(body).subscribe(resp => {
      if(resp['success']==true) {
        this.examen = resp['data']
        this._examen = this.examen
        this.initQuestions()
      }
      else if(resp['success']==false){
        this.expirado=false
        this.spinner.show('exist');
        setTimeout(() => {
          this.spinner.hide('exist');
          const url = '/alumno/academico/'+this.courseCode
          return this.routes.navigate([url])
        }, 2000)
      }
      else if(resp['data']['activo']==false){
        this.expirado=false
        this.spinner.show('expired');
        setTimeout(() => {
          this.spinner.hide('expired');
          const url = '/alumno/academico/'+this.courseCode
          return this.routes.navigate([url])
        }, 5000)
      }
      else if(resp['data']['is_finished']==true){
        this.expirado=false
        this.spinner.show('expired');
        setTimeout(() => {
          this.spinner.hide('expired');
          const url = '/alumno/academico/'+this.courseCode
          return this.routes.navigate([url])
        }, 5000)
      }
    },error => {
      if (error.status === 401) {
        this.expirado=false
        this.spinner.show('exist');
        setTimeout(() => {
          this.spinner.hide('exist');
          localStorage.removeItem('token');
          //this.toastr.error('Sesion Exiparada, Inicie Sesion Nuevamente', 'Error !!')
          const url = '/'
          return this.routes.navigate([url])
        }, 2000)
      }
      else {
        this.expirado=false
        this.spinner.show('exist');
        setTimeout(() => {
          this.spinner.hide('exist');
          localStorage.removeItem('token');
          //this.toastr.error('Sesion Exiparada, Inicie Sesion Nuevamente', 'Error !!')
          const url = '/'
          return this.routes.navigate([url])
        }, 2000)
      }
    })
  }

  initQuestions(){
    this.preguntas=[]
    this.respuestas=[]
    let preguntas:any=[], number:any=0, respuestas:any=[], id=false
    this.examen.formulario.forEach(a => {
      let clas:any='', color:any='rgb(227 58 89 / 43%)', validate:any=0
      number++
      if(!id){
        a.alternativa.forEach(i=>{
          if(i.seleccionado){color='rgb(33 208 126 / 30%)', validate++}
        })
        if(validate==0){id=true, clas='active'}
      }
      preguntas.push({
        'class': clas,
        'color': color,
        'number': number,
        'id': a.id,
        'preguntas': a.pregunta,
        'respuesta': a.alternativa
      })
      if(clas=='active'){
        respuestas.push({
          'id': a.id,
          'preguntas': a.pregunta,
          'respuesta': a.alternativa
        })
      }
    })
    this.preguntas=preguntas
    this.respuestas=respuestas
  }

  changeQuestion(data){
    this.respuestas=[]
    let respuestas:any=[]
    this.examen.formulario.forEach(a => {
      if(a.id==data.id){
        respuestas.push({
          'id': a.id,
          'preguntas': a.pregunta,
          'respuesta': a.alternativa
        })
      }
    })
    this.respuestas=respuestas
  }

  changeAlternativas(id, id_pregunta){
    this.spinner.show()
    this.preguntas=[]
    this.respuestas=[]
    const body = {
      "ficha_evaluacion" : this.examen.ficha_evaluacion,
      "evaluacion_id" : this.examen.evaluacion_id,
      "id_pregunta" : id_pregunta,
      "id_respuesta" : id
    };
    this.service.sendRespuestas(body).subscribe(data => {
      console.log(data)
      if(data['success']==true){
        const bod = {
          "ficha_evaluacion_id" : this.examen.ficha_evaluacion.toString(),
        };
        this.service.getDetailExamen(bod).subscribe(resp => {
          if (resp['success'] == true) {
            this.spinner.hide()
            this.examen = resp['data']
            this.initQuestions()
          }
        })
      }
    })
  }

  finalizar_Examen(id){
    this.spinner.show('end')
    const body = {
      "evaluacion_id" : id,
      "estado" : true
    };
    this.service.end_Examen(body).subscribe(resp => {
      if(resp['success']==true){
        this.nota=true
        setTimeout(() => {
          this.nota=true
          this.enviar=false
          this.expirado=false
          this.salir=true
          this.closeModalTerminate()
          this.openModalInfo(true)
          this.spinner.hide('end');
        }, 2000)
      }
    })
  }

  salir_Examen(){
    this.spinner.show('end')
    setTimeout(() => {
      this.closeModal()
      this.spinner.hide('end')
      const url = '/alumno/academico/'+this.courseCode
      return this.routes.navigate([url])
    }, 2000)
  }

  openModalInfo(estado) {
    this.nota=estado
    this.modalRef = this.modalService.open(this.modalContent, { centered: true, size: 'lg' });
    this.modalRef.result.then();
  }

  closeModal() {
    this.modalRef.close();
  }

  openModalTerminate() {
    this.closeModal()
    this.modalRefTerminate = this.modalService.open(this.modalContentTerminate, { centered: true, size: 'lg' });
    this.modalRefTerminate.result.then();
  }

  closeModalTerminate() {
    this.modalRefTerminate.close();
  }
}
