import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import { AcademicService } from '../../services/academic.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private service: AcademicService) { }

  files: File[] = [];

  ngOnInit(): void {
  }

  onSelect(event: { addedFiles: any; }) {
    this.files=[]
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  uploadLeads(){
    this.spinner.show()
    let i=0
    for(let a=0; a<this.files.length; a++){
      const formData = new FormData()
      formData.append('excel_file', this.files[a], this.files[a].name);
      this.service.registerLeads(formData).subscribe(data => {
        if(data.success){
          i++
          if(i==this.files.length){
            Swal.fire({
              position: "center",
              icon: "success",
              title: "¡Genial :)!",
              text: "Leads Subido Correctamente",
              showConfirmButton: false,
              timer: 2000
            });
            this.files=[]
            this.spinner.hide()
          }
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
        // this.closeModal()
        this.spinner.hide()
      })
    }
  }
}
