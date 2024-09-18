import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MarketingService } from '../../services/marketing.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DataTableDirective} from "angular-datatables";
import {DatePipe, registerLocaleData} from "@angular/common";
import { Subject } from 'rxjs';
declare var $: any;
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-activos',
  templateUrl: './activos.component.html',
  styleUrls: ['./activos.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class ActivosComponent implements OnInit {
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
    buttons: {
      copy: "Copiar",
      colvis: "Visibilidad",
      collection: "Colección",
      colvisRestore: "Restaurar visibilidad",
      copyKeys: "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
      copySuccess: {
        1: "Copiada 1 fila al portapapeles",
        _: "Copiadas %ds fila al portapapeles"
      },
      copyTitle: "Copiar al portapapeles",
      csv: "CSV",
      excel: "Excel",
      pageLength: {
        1: "Mostrar todas las filas",
        _: "Mostrar %d filas"
      },
      pdf: "PDF",
      print: "Imprimir",
      renameState: "Cambiar nombre",
      updateState: "Actualizar",
      createState: "Crear Estado",
      removeAllStates: "Remover Estados",
      removeState: "Remover",
      savedStates: "Estados Guardados",
      stateRestore: "Estado %d"
    },
    paginate: {
      first: "Primero",
      previous: "Anterior",
      next: "Siguiente",
      last: "Último"
    },
    aria: {
      sortDescending: ": Activar para ordenar la tabla en orden descendente",
      sortAscending: ": Activar para ordenar la tabla en orden ascendente"
    }
  }
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  constructor(private service: MarketingService, private spinner: NgxSpinnerService) { }

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  diplomados:any

  ngOnInit(): void {
    this.listInit();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  listInit(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 15, 20],
      dom: 'Bfrtip',
      processing: true,
      lengthChange: true,
      searching: true, // Habilita la opción de búsqueda
      language: ActivosComponent.spanish_datatables
    }
    this.service.getInformeDiplomados().subscribe(data => {
      if(data.success){
        this.diplomados= data.data;
        this.dtTrigger.next();
        this.spinner.hide()
      }
    },error=>{
      if(error.status==400){
        Swal.fire({
          position: "center",
          icon: "error",
          title: 'Advertencia!',
          text: error.error.message,
          showConfirmButton: false,
          timer:2000
        });
      }
      if(error.status==500){
        Swal.fire({
          position: "center",
          icon: "error",
          title: 'Advertencia!',
          text: 'Comuniquese con el Área de Sistemas',
          showConfirmButton: false,
          timer:2000
        });
      }
      this.spinner.hide()
    });
  }

  actFecha(code){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'mx-2 btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estas Segur@ de Cambiar la fecha de venta?',
      icon: 'question',
      html:'<input id="datepicker" type="datetime-local" class="form-control text-dark" autofocus>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cambiar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let dat= $('#datepicker').val().toString()
        let fecha= new Date(dat)
        //let fecha= new Date(dat).getTime()+86400000
        // let fecha2= new Date(fecha)
        // fecha2.setHours(23, 59, 59, 999);
        let fecha_inicio= fecha.getTime()/1000
        this.rerenderFecha(code, fecha_inicio)
      }
    })
  }

  rerenderFecha(code, fecha){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.updateFecha(code, fecha)
    });
  }

  updateFecha(code,fecha){
    this.spinner.show()
    const jsonbody={
      "diplomado_code":code,
      "nueva_fecha":fecha
    }
    this.service.actFechalimite(jsonbody).subscribe(res => {
      if(res['success']==true){
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Genial!',
          text: 'Fecha Modificada',
          showConfirmButton: false,
          timer:2000
        });
        this.diplomados=[]
        this.listInit()
      }
    },error=>{
      if(error.status==400){
        Swal.fire({
          position: "center",
          icon: "error",
          title: 'Advertencia!',
          text: error.error.message,
          showConfirmButton: false,
          timer:2000
        });
      }
      if(error.status==500){
        Swal.fire({
          position: "center",
          icon: "error",
          title: 'Advertencia!',
          text: 'Comuniquese con el Área de Sistemas',
          showConfirmButton: false,
          timer:2000
        });
      }
      this.spinner.hide()
    });
  }
}
