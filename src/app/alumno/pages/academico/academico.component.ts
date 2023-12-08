import { Component, OnInit } from '@angular/core';
import { AcademicoService } from '../../services/academico.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";

@Component({
  selector: 'app-academico',
  templateUrl: './academico.component.html',
  styleUrls: ['./academico.component.scss']
})
export class AcademicoComponent implements OnInit {

  constructor(private service: AcademicoService, private spinner: NgxSpinnerService,) { }

  academico:any;

  ngOnInit(): void {
    this.listCourses()
  }

  listCourses(){
    this.spinner.show()
    this.service.getCourses().subscribe(resp=>{
      if(resp.success){
        this.academico=resp.courses
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
}
