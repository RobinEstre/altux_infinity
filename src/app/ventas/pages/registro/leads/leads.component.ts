import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VentasService } from 'src/app/ventas/service/ventas.service';
import {DataTableDirective} from "angular-datatables";
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class LeadsComponent implements OnInit {
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

  constructor(private service: VentasService, private spinner: NgxSpinnerService,) { }
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  leads:any

  ngOnInit(): void {
    this.listarCarteraAlumnos();
  }

  listarCarteraAlumnos(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      dom: 'Bfrtip',
      buttons: [
        { extend: 'pdfHtml5', className: 'btn btn-primary', title:'Fichas Ventas'},
        { extend: 'copy', className: 'btn btn-primary', title:'Fichas Ventas'},
        { extend: 'print', className: 'btn btn-danger', title:'Fichas Ventas'},
        { extend: 'excelHtml5', className: 'btn btn-success', title:'Fichas Ventas'}
      ],
      processing: true,
      language: LeadsComponent.spanish_datatables
    }
    this.service.getLeads().subscribe(data => {
      if(data.success){
        let dip:any=[];
        data['data'].forEach(i=>{
          const split = i.diplomado.courses_name.split(' ')
          split.splice(0, 3);
          let name=split.map(x=>x).join(" ")
          dip.push({
            "id": i.id,
            "diplomado": i.diplomado,
            'courses_name': name,
            "estado": i.estado,
            "nombres": i.nombres,
            "apellidos": i.apellidos,
            "dni": i.dni,
            "email": i.email,
            "telefono": i.telefono,
            "seguimiento": i.seguimiento,
            "numero_colegiatura": i.numero_colegiatura,
            "procedencia": i.procedencia,
            'created_at': i.created_at,
            "updated_at": i.updated_at,
            "vendedor": i.vendedor
          })
        })
        this.leads= dip;
        // Calling the DT trigger to manually render the table
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
      this.leads=[]
      this.dtTrigger.next();
      this.spinner.hide()
    });
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
