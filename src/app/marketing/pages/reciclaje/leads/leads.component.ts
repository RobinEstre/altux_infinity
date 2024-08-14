import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import {DataTableDirective} from "angular-datatables";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');
import Swal from "sweetalert2";
import { MarketingService } from 'src/app/marketing/services/marketing.service';

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

  @ViewChild('dtActions') dtActions!: TemplateRef<LeadsComponent>;
  @ViewChild('is_celular') is_celular!: TemplateRef<LeadsComponent>;
  @ViewChild('idTpl', {static: true}) idTpl: TemplateRef<LeadsComponent>;
  @ViewChild('is_tipo') is_tipo!: TemplateRef<LeadsComponent>;
  @ViewChild('is_alumno') is_alumno!: TemplateRef<LeadsComponent>;
  @ViewChild('is_vendedor') is_vendedor!: TemplateRef<LeadsComponent>;
  @ViewChild('is_categoria') is_categoria!: TemplateRef<LeadsComponent>;

  constructor(private spinner: NgxSpinnerService, private cd: ChangeDetectorRef,private datePipe: DatePipe, private service: MarketingService){ 
  }

  columns: Array<any> = [];
  dtOptions: DataTables.Settings  = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataTableActions: Array<any> = [
    // {
    //   cmd: "seguimiento",
    //   label: "Seguimiento",
    //   classList: "",
    //   icon: 'bi bi-binoculars'
    // },
    {
      cmd: "add",
      label: "Asignar Nuevo Vendedor",
      classList: "mx-2",
      icon: 'bi bi-send'
    },
  ];
  public paginate:any; public start_paginate:number=0; register_count:number; filter_params:any; detalle:any

  ngOnInit(): void {
    setTimeout(() => {
      this.listInit();
    })
  }

  listInit(){
    this.columns.push(
      {title: 'N°', data:'dni' },
      {title: 'Nombres y Apellidos', data: 'nombres', orderable: false, searchable: false, defaultContent: '',
        ngTemplateRef: {
          ref: this.is_alumno,
          context: {
            captureEvents: this.captureEventsEmitido.bind(self)
          }
        }
      },
      {title: 'DNI', data: 'dni'},
      {title: 'Celular', data: 'telefono', orderable: false, searchable: false, defaultContent: '',
        ngTemplateRef: {
          ref: this.is_celular,
          context: {
            captureEvents: this.captureEventsEmitido.bind(self)
          }
        }
      },
      {title: 'Correo', data: 'email'},
      {title: 'Diplomado', data: 'diplomado.courses_name'},
      {title: 'Vendedor', data: 'vendedor', orderable: false, searchable: false, defaultContent: '',
        ngTemplateRef: {
          ref: this.is_vendedor,
          context: {
            captureEvents: this.captureEventsEmitido.bind(self)
          }
        }
      },
      // {title: 'Procedencia', data: 'procedencia'},
      {title: 'Categoria', data: 'seguimiento', orderable: false, searchable: false, defaultContent: '',
        ngTemplateRef: {
          ref: this.is_categoria,
          context: {
            captureEvents: this.captureEventsEmitido.bind(self)
          }
        }
      },
      // {title: 'Estado', data: 'estado', orderable: false, searchable: false, defaultContent: '',
      //   ngTemplateRef: {
      //     ref: this.is_tipo,
      //     context: {
      //       captureEvents: this.captureEventsEmitido.bind(self)
      //     }
      //   }
      // },
      {title: 'F. Registro', data: 'updated_at'},
    );
    if (this.dataTableActions.length > 0) {
      this.columns.push({
        title: "Acciones",
        data: null,
        orderable: false,
        searchable: false,
        defaultContent: "",
        ngTemplateRef: {
          ref: this.dtActions,
          context: {
            captureEvents: this.onCaptureEvent.bind(this)
          }
        }
      });
    }
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        // validar si existe variables en el objeto
        // console.log(dataTablesParameters)
        let result = Object.entries(dataTablesParameters).length;
        if (result > 0){
          // si hay registros, configurar los nuevos parametros de busqueda
          let body_params = dataTablesParameters

          this.start_paginate = body_params['start']

          if (this.register_count){
            if(body_params['length'] > this.register_count){
              this.paginate = 1
            }else{
              let n_paginated = (this.register_count  / body_params['length'])
              n_paginated = Math.ceil(n_paginated)
              let list_indices = [];
              for (let i = 0; i < n_paginated; i++) {
                let i_custom = i+1
                let value = i * body_params['length'];
                list_indices.push({
                  id: i_custom,
                  value: value,
                });
              }
              list_indices.forEach((item) => {
                if (item.value === body_params['start']) {
                  this.paginate = item.id;
                }
              });
            }
          }else{
            this.paginate = 1
          }
          this.filter_params = `paginate[row]=${body_params['length']}&paginate[index]=${this.paginate}&search=${body_params['search']['value'] || ''}`
          //this.filter_params=`pagina=${this.paginate}&cantidad=${body_params['length']}`
        }
        this.service.listLeads(this.filter_params).subscribe(resp => {
          // console.log(this.filter_params)
          if(resp['data']){
            resp['data'].forEach(i=>{
              i.created_at= this.datePipe.transform(i.created_at,"dd/MM/yyyy HH:mm"),
              i.updated_at= this.datePipe.transform(i.updated_at,"dd/MM/yyyy HH:mm")
            })
            this.register_count = resp['count']
          }
          callback({
            recordsTotal: resp['count'],
            recordsFiltered: resp['count'],
            data: resp['data']
          });
        })
      },
      rowCallback: (row: Node, data: any[] | object, dataIndex: number) => {
        row.childNodes[0].textContent = String((dataIndex + this.start_paginate) + 1);
      },
      //dom: '<l>Bfrtip',
      columnDefs: [
        {
          targets: "_all",
          className: "valign-middle",
        },
        {
          targets: [0],
          className: "text-right noVis",
        },
      ],
      stateSave: true,
      serverSide: true,
      processing: true,
      searchDelay: 600,
      language: LeadsComponent.spanish_datatables,
      columns: this.columns
    };
    this.cd.detectChanges();
    this.dtTrigger.next();
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next()
    });
  }

  onCaptureEvent(event: any): void {
    if (event['cmd'] === 'add'){
      this.spinner.show()
      this.detalle=event.data
      let data:any=[]
      this.service.listVendedores(event.data.vendedor.id).subscribe(resp=>{
        if(resp.success){
          resp.data.forEach(i=>{
            data.push({
              id: i.vendedor_id,
              name: i.nombres
            })
          })
          this.spinner.hide()
          this.chargeVendedores(data, event.data)
        }
      })
    }else{
    }
  }

  captureEventsEmitido(event: any): void {
  }
  
  chargeVendedores(data, info) {
    var options = {};
    $.map(data,
    function(o) {
      options[o.id] = o.name;
    });

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success text-bold',
        cancelButton: 'btn btn-danger mx-2 text-light text-bold'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Asignar Leads',
      text: info.nombres+' '+info.apellidos,
      input: 'select',
      inputOptions: options,
      showCancelButton: true,
      //animation: 'slide-from-top',
      inputPlaceholder: 'Por favor seleccione un vendedor',
      confirmButtonText: 'Si, Seguro',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.asignarSeller(+result.value, data)
        //console.log(result);
      }
    })
  }

  asignarSeller(id, data){
    let name
    data.forEach(i=>{
      if(i.id == id){name=i.name}
    })
    Swal.fire({
      title: "Estás segura de asignar al vendedor: "+name,
      text: "No podrás revertir los cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Asignar!",
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show()
        let body={
          "seller_id" : id
        }
        this.service.asignarVendedores(this.detalle.id, body).subscribe(resp=>{
          if(resp.success){
            this.spinner.hide()
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Leads fue asignado correctamente",
              showConfirmButton: false,
              timer: 2500
            });
            this.rerender()
          }
        })
      }
    });
  }
}
