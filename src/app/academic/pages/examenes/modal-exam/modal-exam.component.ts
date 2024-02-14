import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import { ExamenesService } from 'src/app/academic/services/examenes.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-modal-exam',
  templateUrl: './modal-exam.component.html',
  styleUrls: ['./modal-exam.component.scss']
})
export class ModalExamComponent implements OnInit {
  
  constructor(private Service: ExamenesService, private spinner: NgxSpinnerService) { }

  @Input()titulo:string;
  @Input()id_examen:any;

  preguntas:any[]=[]

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    try {
      this.spinner.show()
      this.Service.mostrar_Examen(this.id_examen).subscribe(res => {
        this.preguntas = res['data']['formulario']
        this.spinner.hide()
      })
    }
    catch (e) {
    }
  }

  advertenciaCambio(id_pregunta, id_respuesta){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Esta Segur@ de Cambiar la Respuesta',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cambiar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cambiarRespuesta(id_pregunta, id_respuesta)
      }
    })
  }

  cambiarRespuesta(id_pregunta, id_respuesta){
    this.spinner.show()
    const jsonbody={
      "id_examen":this.id_examen,
      "pregunta":id_pregunta,
      "respuesta":id_respuesta
    }
    this.Service.cambiarRespuesta(jsonbody).subscribe(res => {
      if(res['success']==true){
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: "Respuesta Cambiada",
          showConfirmButton: false,
          timer: 2000
        });
        this.listInit()
      }
    })
  }
}
