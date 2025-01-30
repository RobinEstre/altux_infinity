import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { MarketingService } from 'src/app/marketing/services/marketing.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
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
  token = localStorage.getItem('token');

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  @Input() data: any;

  constructor(private spinner: NgxSpinnerService,private service: MarketingService) { }

  detalle:any;

  ngOnInit(): void {
    this.listDetail();
  }

  listDetail() {
    this.spinner.show();
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      buttons: [
        { extend: 'copy', className: 'btn btn-primary', title:'Detalle: '+this.data.event_name },
        { extend: 'print', className: 'btn btn-danger', title:'Detalle: '+this.data.event_name },
        { extend: 'excelHtml5', className: 'btn btn-success', title:'Detalle: '+this.data.event_name },
        { extend: 'csv', className: 'btn btn-success', title:'Detalle: '+this.data.event_name }
        //{ extend: 'columnsToggle', className: 'btn btn-outline-danger'}
      ],
      lengthMenu: [5, 10, 25],
      processing: true,
      language: DetalleComponent.spanish_datatables
    }
    this.service.listEventsDetail(this.data.id).subscribe(resp => {
      if(resp.success){
        this.detalle = resp.data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
        this.spinner.hide();
      }
    },error => {
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
      this.detalle=[]
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
