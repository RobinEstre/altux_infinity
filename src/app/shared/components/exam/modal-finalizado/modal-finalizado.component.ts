import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import { ExamenService } from 'src/app/examenes/service/examen.service';

@Component({
  selector: 'app-modal-finalizado',
  templateUrl: './modal-finalizado.component.html',
  styleUrls: ['./modal-finalizado.component.scss']
})
export class ModalFinalizadoComponent implements OnInit {
  public token = localStorage.getItem('token');

  constructor(private spinner: NgxSpinnerService,private route: ActivatedRoute,private service: ExamenService,
              private routes: Router,) { }

  ngOnInit(): void {
    this.list()
  }

  @Input()id_examen:any;
  @Input()titulo:string;
  @Input()motrar_nota:boolean;
  nota_evaluacion:any;
  examen:any
  preguntas:any[]=[]

  list() {
    this.spinner.show()
    const body = {
      "ficha_evaluacion_id": this.id_examen,
    };
    if(this.motrar_nota==true){
      this.service.getDetailExamenResp(body).subscribe(resp => {
        if (resp['success'] == true) {
          this.examen = resp['data']
          let preguntas:any = []
          this.examen.formulario.forEach(a => {
            let texto = null
            let result = null
            a.alternativa.forEach(r => {
              texto = r.texto
              result = r.resultado
            })
            preguntas.push({
              'id': a.id,
              'preguntas': a.pregunta,
              'respuesta': texto,
              'resultado': result
            })
          })
          this.preguntas = preguntas
          this.service.get_Nota(this.examen.evaluacion_id).subscribe(data => {
            if (data['success'] == true) {
              this.nota_evaluacion = this.zfill(data['data']['notes_evaluation'], 2)
            }
          })
          this.spinner.hide()
        }
      })
    }
    if(this.motrar_nota==false){
      this.service.getDetailExamen(body).subscribe(resp => {
        if (resp['success'] == true) {
          this.examen = resp['data']
          let preguntas:any = []
          this.examen.formulario.forEach(a => {
            let texto = null
            let result = null
            a.alternativa.forEach(r => {
              if(r.seleccionado){
                texto= r.texto
              }
            })
            preguntas.push({
              'id': a.id,
              'preguntas': a.pregunta,
              'respuesta': texto
            })
          })
          this.preguntas = preguntas
          this.spinner.hide()
        }
      })
    }
  }

  zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
  }
}
