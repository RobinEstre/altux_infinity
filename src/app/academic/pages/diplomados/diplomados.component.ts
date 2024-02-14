import { Component, OnInit, LOCALE_ID, ViewChild } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import {Subject} from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DatePipe, registerLocaleData} from "@angular/common";
import localeEs from '@angular/common/locales/es';
import {DataTableDirective} from "angular-datatables";
import { Router } from '@angular/router';
import { DiplomadosService } from '../../services/diplomados.service';
registerLocaleData(localeEs, 'es');


@Component({
  selector: 'app-diplomados',
  templateUrl: './diplomados.component.html',
  styleUrls: ['./diplomados.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' } ,DatePipe]
})
export class DiplomadosComponent implements OnInit {
  public static spanish_datatables = {
    processing: "Procesando...",
    search: "Buscar:",
    lengthMenu: "Mostrar _MENU_ elementos",
    info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
    infoEmpty: "Mostrando ningún elemento.",
    infoFiltered: "(filtrado _MAX_ elementos total)",
    infoPostFix: "",
    loadingRecords: "Cargando registros...",
    zeroRecords: "No se encontraron registros",
    emptyTable: "No hay datos disponibles en la tabla",
    paginate: {
      first: "Primero",
      previous: "Anterior",
      next: "Siguiente",
      last: "Último"
    },
    aria: {
      sortAscending: ": Activar para ordenar la tabla en orden ascendente",
      sortDescending: ": Activar para ordenar la tabla en orden descendente"
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder, public diplomadoService: DiplomadosService, private routes: Router,
    private spinner: NgxSpinnerService, private modalService: NgbModal) {
  }

  tipos:any; temporales:any

  ngOnInit(): void {
    this.list()
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.list()
    });
  }

  list(){
    this.spinner.show()
    this.diplomadoService.listTipos().subscribe(resp=>{
     if(resp['success']==true){
      this.tipos=resp['data']
      this.listTemporales()
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

  listTemporales(){
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      dom: 'Bfrtip',
      processing: true,
      language: DiplomadosComponent.spanish_datatables
    }
    this.diplomadoService.listDiplomadosTemporales().subscribe(resp=>{
     if(resp['success']==true){
      this.temporales=resp['data']
      this.dtTrigger.next();
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

  delete(detalle){
    Swal.fire({
      title: `Estas seguro de eliminar?`,
      text: "Al eliminar no podrás revirtir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51BB25',
      cancelButtonColor: '#F31F1F',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTemporal(detalle.url_code)
      }
    }) 
  }

  deleteTemporal(code){
    this.spinner.show()
    this.diplomadoService.deleteTemporal(code, ).subscribe(resp=>{
      if(resp['success']==true){
        this.rerender()
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

  crearTemporal(tipo){
    Swal.fire({
      title: `Estas seguro de crear nuevo?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51BB25',
      cancelButtonColor: '#F31F1F',
      confirmButtonText: 'Si, crear!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show()
        let body={
          "tipo_curso": tipo
        }
        ///academico/publicar-diplomado/:code
        this.diplomadoService.crearDiplomadoTemporal(body, ).subscribe(resp=>{
          if(resp['success']==true){
            let url:any = 'academico/publicar-diplomado/'+resp['code_url']
            this.spinner.hide()
            this.routes.navigate([url])
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
    })
  }
}
