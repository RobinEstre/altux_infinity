import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import { AcademicService } from '../../services/academic.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
declare var $: any;

@Component({
  selector: 'app-prioridad',
  templateUrl: './prioridad.component.html',
  styleUrls: ['./prioridad.component.scss']
})
export class PrioridadComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private service: AcademicService) { }

  leads:any=[]

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    this.spinner.show();
    this.service.listPrioridadLeads().subscribe(resp => {
      if(resp.data){
        this.leads = resp.data
        this.spinner.hide();
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.leads, event.previousIndex, event.currentIndex);
    this.updatePriority(event.previousIndex, event.currentIndex)
  }

  updatePriority(index, currentIndex){
    this.spinner.show();
    let id=this.leads[index].id
    let body={
      "priority": currentIndex,
      "user": this.leads[index].user,
      "is_turn": true,
    }
    this.service.updatePriority(id, body).subscribe(resp => {
      if(resp.success){
        this.leads=[]
        this.listInit()
      }
    })
  }

  openNew(){
    this.spinner.show();
    let data:any=[], num=0;
    let params: string = "";
    this.leads.forEach(i=>{
      if(num==0){params+="exclude[sellers]="+i.user}else{params+="&&exclude[sellers]="+i.user}
      num++
    })
    this.service.listVendedores(params).subscribe(resp=>{
      if(resp.success){
        resp.data.forEach(i=>{
          data.push({
            id: i.vendedor_id,
            name: i.nombres
          })
        })
        this.spinner.hide();
        this.newPriority(data)
      }
    })
  }

  newPriority(data){
    var options = {};
    $.map(data,
    function(o) {
      options[o.id] = o.name;
    });

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success text-bold',
        cancelButton: 'btn btn-danger mx-2 text-bold'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Crear Nueva Prioridad',
      text: 'Seleccionar Vendedor',
      input: 'select',
      inputOptions: options,
      showCancelButton: true,
      //animation: 'slide-from-top',
      inputPlaceholder: 'Por favor seleccione un vendedor',
      confirmButtonText: 'Si, Seguro',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.createPriority(+result.value)
        //console.log(result);
      }
    })
  }

  createPriority(id){
    this.spinner.show();
    let body={
      "user": id
    }
    this.service.createPriority(body).subscribe(resp => {
      if(resp.success){
        this.leads=[]
        this.listInit()
      }
    })
  }
}
