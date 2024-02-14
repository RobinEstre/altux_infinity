import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import { ExamenesService } from 'src/app/academic/services/examenes.service';

@Component({
  selector: 'app-modal-notas',
  templateUrl: './modal-notas.component.html',
  styleUrls: ['./modal-notas.component.scss']
})
export class ModalNotasComponent implements OnInit {

  constructor(private Service: ExamenesService, private spinner: NgxSpinnerService,) { }

  @Input()titulo:string;
  @Input()student:string;
  @Input()id_examen:any;
  @Input()id_student:any;
  @Input()nota:number;

  examen:any
  preguntas:any[]=[]

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    try {
      this.spinner.show()
      const body = {
        "ficha_evaluacion_id": this.id_examen,
        "estudiante_id" : this.id_student
      };
      this.Service.mostrar_NotaExamen(body).subscribe(resp => {
        if (resp['success'] == true) {
          this.examen = resp['data']
          let preguntas = []
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
          this.spinner.hide()
        }
      })
    }
    catch (e) {
    }
  }
}