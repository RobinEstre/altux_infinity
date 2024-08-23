import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ContabilidadService } from '../../services/contabilidad.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl  } from '@angular/platform-browser';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-boletas',
  templateUrl: './boletas.component.html',
  styleUrls: ['./boletas.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class BoletasComponent implements OnInit {
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
  @ViewChild('content') private modalContent: TemplateRef<BoletasComponent>;
  private modalRef: NgbModalRef;
  active = 1;safeUrl: SafeResourceUrl;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  @ViewChild('dtActions') dtActions!: TemplateRef<BoletasComponent>;

  constructor(private service: ContabilidadService, private spinner: NgxSpinnerService,private fb: FormBuilder,private modalService: NgbModal,
    private cd: ChangeDetectorRef,private datePipe: DatePipe,private sanitizer: DomSanitizer) {
  }

  columns: Array<any> = [];
  dtOptions: DataTables.Settings  = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataTableActions: Array<any> = [
    {
      cmd: "ver",
      label: "Ver Comprobante",
      classList: "",
      icon: 'bi bi-eye'
    },
    // {
    //   cmd: "add",
    //   label: "Matrícula | Ficha",
    //   classList: "mx-2",
    //   icon: 'bi bi-cash-stack'
    // },
  ];
  formFechas = this.fb.group({
    fecha_inicio: ['',Validators.required],
    fecha_fin: ['',Validators.required],
  });

  public paginate:any; public start_paginate:number=0; register_count:number; filter_params:any; detalle:any

  ngOnInit(): void {
    setTimeout(() => {
      this.listInit();
    })
  }

  listInit(){
    const fechaInicio = this.obtenerFechaInicioDeMes();
    const fechaFin = this.obtenerFechaFinDeMes();
    const fechaInicioFormateada = this.formatearFecha(fechaInicio);
    const fechaFinFormateada = this.formatearFecha(fechaFin);
    console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
    this.formFechas.controls.fecha_inicio.setValue(fechaInicioFormateada)
    this.formFechas.controls.fecha_fin.setValue(fechaFinFormateada)
    this.filter_params = `paginate[index]=1&paginate[row]=10&fecha_inicio=${fechaInicioFormateada}&fecha_fin=${fechaFinFormateada}`
    this.listarReporte();
  }

  listarReporte(){
    this.columns.push(
      {title: 'N°', data: 'request_body.NOM_RZN_SOC_RECP'},
      {title: 'Estudiante', data: 'request_body.NOM_RZN_SOC_RECP'},
      {title: 'N° Documento', data: 'request_body.NUM_NIF_RECP'},
      {title: 'Concepto', data: 'request_body.items[0].TXT_DESC_ITEM'},
      {title: 'SubTotal', data: 'request_body.MNT_TOT_GRAVADO'},
      {title: 'IGV', data: 'request_body.MNT_TOT_TRIB_IGV'},
      {title: 'Total', data: 'request_body.MNT_TOT'},
      {title: 'Serie', data:'bol_serie' },
      {title: 'N° Comprobante', data:'bol_correlativo' },
      {title: 'F. Emision', data: 'emision'},
      //{title: 'F. Modificación', data: 'updated_at'},
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
          this.filter_params=`paginate[index]=${this.paginate}&paginate[row]=${body_params['length']}&search=${body_params['search']['value'] || ''}&fecha_inicio=${this.formFechas.controls.fecha_inicio.value}&fecha_fin=${this.formFechas.controls.fecha_fin.value}`
        }
        this.service.getReportBoletas(this.filter_params).subscribe(resp => {
          let data=[], n=0
          if(resp.success){
            if(resp.data){
              resp['data'].forEach(i=>{
                n++
                let created_at= this.datePipe.transform(i.created_at,"dd/MM/yyyy")
                let updated_at= this.datePipe.transform(i.updated_at,"dd/MM/yyyy")

                i.created_at=created_at
                i.updated_at=updated_at
                i.data=i.bol_serie+'-'+i.bol_correlativo
              })
              this.register_count = resp['count']
            }
          }else{this.register_count = 0}
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
      language: BoletasComponent.spanish_datatables,
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
    if (event['cmd'] === 'ver'){
      this.openModal(event.data.bol_url_boleta, event.data)
      //this.openModalSeguimiento(event['data'])
    }else{
      //this.openModal(event['data'])
    }
  }

  captureEventsEmitido(event: any): void {
  }

  rerender(){
    //this.filter_params = `procedencia=${this.formFechas.controls.tipo_lista.value}&pagina=1&cantidad=10`
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next()
    });
  }  

  openModal(url, data) {
    this.detalle=data
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.modalRef = this.modalService.open(this.modalContent, { centered: true, size: 'lg'});
    this.modalRef.result.then();
  }

  closeModal() {
    this.modalRef.close();
  }

  // Formatos

  obtenerFechaInicioDeMes (){
    const fechaInicio = new Date();
    // Iniciar en este año, este mes, en el día 1
    return new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
  };

  obtenerFechaFinDeMes (){
    const fechaFin = new Date();
    // Iniciar en este año, el siguiente mes, en el día 0 (así que así nos regresamos un día)
    return new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
  };

  formatearFecha (fecha){
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    return `${fecha.getFullYear()}-${(mes < 10 ? '0' : '').concat(mes)}-${(dia < 10 ? '0' : '').concat(dia)}`;
  };
}
