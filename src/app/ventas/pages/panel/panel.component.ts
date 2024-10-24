import { Component, ElementRef, LOCALE_ID, OnInit, Renderer2, ViewChild } from '@angular/core';
import { VentasService } from '../../service/ventas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DataTableDirective} from "angular-datatables";
import {DatePipe, registerLocaleData} from "@angular/common";
import { Subject } from 'rxjs';
declare var $: any;
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class PanelComponent implements OnInit {
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

  constructor(private service: VentasService, private spinner: NgxSpinnerService) { }
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  user= localStorage.getItem('USERNAME');

  cantidades:any; informe_diplomados:any; compromisos_leads:any; informes_leads:any; compromisos_ficha:any; informes_ficha:any;
  
  ngOnInit(): void {
    this.listInit();
  }

  ngAfterViewInit(): void {
    /* footable */
    // $('.footable').footable({
    //   "paging": {
    //     "enabled": true,
    //     "container": '#footable-pagination',
    //     "countFormat": "{CP} of {TP}",
    //     "limit": 3,
    //     "position": "right",
    //     "size": 5
    //   },
    //   "sorting": {
    //     "enabled": true
    //   },
    // }, function (ft: any) {
    //   $('#footablestot').html($('.footable-pagination-wrapper .label').html())

    //   $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
    //     setTimeout(function () {
    //       $('#footablestot').html($('.footable-pagination-wrapper .label').html());
    //     }, 200);
    //   });
    // });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  listInit(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 5,
      //lengthMenu: [5, 10, 25],
      //dom: 'Bfrtip',
      processing: true,
      lengthChange: false,
      searching: false, // Habilita la opción de búsqueda
      language: PanelComponent.spanish_datatables
    }
    this.service.getCantidadDashboard().subscribe(data => {
      if(data.success){
        this.cantidades= data.data;
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
    this.service.getInformeDiplomados().subscribe(data => {
      if(data.success){
        this.informe_diplomados= data.data;
        // setTimeout(() => {
        //   $('.footable').footable({
        //     "paging": {
        //       "enabled": true,
        //       "container": '#footable-pagination',
        //       "countFormat": "{CP} de {TP}",
        //       "limit": 3,
        //       "position": "right",
        //       "size": 5
        //     },
        //     "sorting": {  
        //       "enabled": true
        //     },
        //   }, function (ft: any) {
        //     $('#footablestot').html($('.footable-pagination-wrapper .label').html());
        //     $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
        //         setTimeout(function () {
        //             $('#footablestot').html($('.footable-pagination-wrapper .label').html());
        //         }, 200);
        //     });
        //     // Bind click event after Footable initialization
        //     // $('.footable').on('click', 'tbody tr td a', function() {
        //     //   // Your click event logic here
        //     //   console.log('Row clicked!');
        //     // });
        //   });
        // }, 10);
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
    this.service.getCompromisosMatriculaLeads().subscribe(data => {
      if(data.success){
        this.compromisos_leads= data.data;
        setTimeout(() => {
          $('.footable').footable({
            "paging": {
              "enabled": true,
              "container": '#footable-pagination',
              "countFormat": "{CP} de {TP}",
              "limit": 3,
              "position": "right",
              "size": 5
            },
            "sorting": {  
              "enabled": true
            },
          }, function (ft: any) {
            $('#footablestot').html($('.footable-pagination-wrapper .label').html());
            $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
              setTimeout(function () {
                $('#footablestot').html($('.footable-pagination-wrapper .label').html());
              }, 200);
            });
          });
        }, 10);
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
    this.service.getInformesPersonasLeads().subscribe(data => {
      if(data.success){
        this.informes_leads= data.data;
        setTimeout(() => {
          $('.footable2').footable({
            "paging": {
              "enabled": true,
              "container": '#footable-pagination2',
              "countFormat": "{CP} de {TP}",
              "limit": 3,
              "position": "right",
              "size": 5
            },
            "sorting": {  
              "enabled": true
            },
          }, function (ft: any) {
            $('#footablestot2').html($('.footable-pagination-wrapper .label').html());
            $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
              setTimeout(function () {
                $('#footablestot2').html($('.footable-pagination-wrapper .label').html());
              }, 200);
            });
          });
        }, 10);
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
    this.service.getCompromisosMatriculaFicha ().subscribe(data => {
      if(data.success){
        this.compromisos_ficha= data.data;
        setTimeout(() => {
          $('.footable3').footable({
            "paging": {
              "enabled": true,
              "container": '#footable-pagination3',
              "countFormat": "{CP} de {TP}",
              "limit": 3,
              "position": "right",
              "size": 5
            },
            "sorting": {  
              "enabled": true
            },
          }, function (ft: any) {
            $('#footablestot3').html($('.footable-pagination-wrapper .label').html());
            $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
              setTimeout(function () {
                $('#footablestot3').html($('.footable-pagination-wrapper .label').html());
              }, 200);
            });
          });
        }, 10);
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
    this.service.getInformesPersonasFicha().subscribe(data => {
      if(data.success){
        //let dato= [1,2,3,1]
        this.informes_ficha= data.data;
        setTimeout(() => {
          $('.footable4').footable({
            "paging": {
              "enabled": true,
              "container": '#footable-pagination4',
              "countFormat": "{CP} de {TP}",
              "limit": 3,
              "position": "right",
              "size": 5
            },
            "sorting": {  
              "enabled": true
            },
          }, function (ft: any) {
            $('#footablestot4').html($('.footable-pagination-wrapper .label').html());
            $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
              setTimeout(function () {
                $('#footablestot4').html($('.footable-pagination-wrapper .label').html());
              }, 200);
            });
          });
        }, 10);
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

  detalleVenta(tipo){
    localStorage.setItem('tipo_registro', tipo)
  }

  actFecha(code){
    // const { value: date } = await Swal.fire({
    //   title: "select departure date",
    //   input: "date",
    //   didOpen: () => {
    //     const today = (new Date()).toISOString();
    //     Swal.getInput().min = today.split("T")[0];
    //   }
    // });
    // if (date) {
    //   Swal.fire("Departure date", date);
    // }
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
        let fecha2= new Date(fecha)
        fecha2.setHours(23, 59, 59, 999);
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
        this.informe_diplomados=[]
        this.listTable()
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

  listTable(){
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 5,
      //lengthMenu: [5, 10, 25],
      //dom: 'Bfrtip',
      processing: true,
      lengthChange: false,
      searching: false, // Habilita la opción de búsqueda
      language: PanelComponent.spanish_datatables
    }
    this.service.getInformeDiplomados().subscribe(data => {
      if(data.success){
        this.informe_diplomados= data.data;
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
}