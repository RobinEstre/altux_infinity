import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import {DataTableDirective} from "angular-datatables";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');
import Swal from "sweetalert2";
import { AlumnosService } from '../../services/alumnos.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class StudentsComponent implements OnInit {
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

  @ViewChild('dtActions') dtActions!: TemplateRef<StudentsComponent>;
  @ViewChild('is_celular') is_celular!: TemplateRef<StudentsComponent>;
  @ViewChild('idTpl', {static: true}) idTpl: TemplateRef<StudentsComponent>;

  constructor(private service: AlumnosService, private spinner: NgxSpinnerService, private cd: ChangeDetectorRef,private datePipe: DatePipe,) { 
  }

  columns: Array<any> = [];
  dtOptions: DataTables.Settings  = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataTableActions: Array<any> = [
    {
      cmd: "seguimiento",
      label: "Seguimiento",
      classList: "",
      icon: 'bi bi-binoculars'
    },
    {
      cmd: "add",
      label: "Matrícula | Ficha",
      classList: "mx-2",
      icon: 'bi bi-cash-stack'
    },
  ];
  public paginate:any; public start_paginate:number=0; register_count:number; filter_params:any

  ngOnInit(): void {
    setTimeout(() => {
      this.listInit();
    })
  }

  listInit(){
    this.columns.push(
      {title: 'N°', data:'n' },
      {title: 'Nombres y Apellidos', data: 'alumno'},
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
      {title: 'Diplomado', data: 'diplomado'},
      {title: 'Vendedor', data: 'vendedorName'},
      {title: 'Procedencia', data: 'procedencia'},
      {title: 'Metodo Pago', data: 'payment_method'},
      {title: 'F. Registro', data: 'created_at'},
    );
    // if (this.dataTableActions.length > 0) {
    //   this.columns.push({
    //     title: "Acciones",
    //     data: null,
    //     orderable: false,
    //     searchable: false,
    //     defaultContent: "",
    //     ngTemplateRef: {
    //       ref: this.dtActions,
    //       context: {
    //         captureEvents: this.onCaptureEvent.bind(this)
    //       }
    //     }
    //   });
    // }
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        // validar si existe variables en el objeto
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
                let i_custom = i + 1
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
          //this.filter_params = `$cantidad=${body_params['length']}&pagina=${this.paginate}&searchs=${body_params['search']['value'] || ''}`
          this.filter_params=`pagina=${this.paginate}&cantidad=${body_params['length']}`
        }
        this.service.listStudents(this.filter_params).subscribe(resp => {
          let data=[], n=0, cantidad=0
          if(resp){
            if(resp.data){
              resp['data'].forEach(i=>{
                n++
                let created_at= this.datePipe.transform(i.created_at,"dd/MM/yyyy HH:mm"), procedencia='Sin Registro'
                if(i.venta.student.detail_user.user_config.procedencia_venta){procedencia=i.venta.student.detail_user.user_config.procedencia_venta}
                data.push({
                  "n":n,
                  "id": i.id,
                  "venta": i.venta,
                  "vendedor": i.vendedor,
                  'created_at': created_at,
                  'payment_method': i.payment_method,
                  "alumno": i.venta.student.detail_user.nombres+" "+i.venta.student.detail_user.apellidos,
                  "vendedorName": i.vendedor.detail_user.nombres+" "+i.vendedor.detail_user.apellidos,
                  "procedencia": procedencia,
                  "dni": i.venta.student.detail_user.dni,
                  "telefono": i.venta.student.detail_user.telefono,
                  "email": i.venta.student.detail_user.email,
                  "diplomado": i.venta.course.courses_name
                })
              })
              this.register_count = resp['cantidad']
            }
          }else{this.register_count = cantidad}
          callback({
            recordsTotal: resp['cantidad'],
            recordsFiltered: resp['cantidad'],
            data: data
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
      language: StudentsComponent.spanish_datatables,
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

  onCaptureEvent(event: any): void {
    if (event['cmd'] === 'seguimiento'){
    }else{
    }
  }

  captureEventsEmitido(event: any): void {
  }
}
