import {Component, LOCALE_ID, Input, OnInit, TemplateRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import Swal from "sweetalert2";
import {DatePipe, registerLocaleData} from "@angular/common";
import localeEs from "@angular/common/locales/es";
import { MarketingService } from '../../services/marketing.service';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class EventsComponent implements OnInit {
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
      sortAscending: ": Activar para ordenar la tabla en orden ascendente",
      sortDescending: ": Activar para ordenar la tabla en orden descendente"
    }
  }
  @ViewChild('modal_create') private modalContent: TemplateRef<EventsComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('modal_edit') private modalContentEdit: TemplateRef<EventsComponent>;
  private modalRefEdit: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  @ViewChild('dtActions') dtActions!: TemplateRef<EventsComponent>;
  @ViewChild('idTpl', {static: true}) idTpl: TemplateRef<EventsComponent>;
  @ViewChild('is_tipo') is_tipo!: TemplateRef<EventsComponent>;
  @ViewChild('is_estado') is_estado!: TemplateRef<EventsComponent>;

  constructor(private fb: FormBuilder, private service: MarketingService, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private modalService: NgbModal, private cd: ChangeDetectorRef) {
  }

  formEvent = this.fb.group({
    name_event:['',Validators.required],
    ponente:['',Validators.required],
    profesion:['',Validators.required],
    dowload_key:['',Validators.required],
    is_gestion:[true,Validators.required],
    is_asistencial:[true,Validators.required],
    fecha_evento:[null,Validators.required],
  });
  formEdit = this.fb.group({
    name_event:['',Validators.required],
    ponente:['',Validators.required],
    profesion:['',Validators.required],
    dowload_key:['',Validators.required],
    is_gestion:[true,Validators.required],
    is_asistencial:[true,Validators.required],
    fecha_evento:[null,Validators.required],
  });

  columns: Array<any> = [];
  dtOptions: DataTables.Settings  = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataTableActions: Array<any> = [
    {
      cmd: "update",
      label: "Editar Evento",
      classList: "mx-2",
      icon: 'bi bi-pencil-square'
    },
    {
      cmd: "eliminar",
      label: "Eliminar Evento",
      classList: "text-danger",
      icon: 'bi bi-trash'
    },
  ];

  public paginate:any; public start_paginate:number=0; register_count:number; filter_params:any; detalle:any;
  url_img_750x500: File[]=[];url_img_1920x500: File[]=[];url_img_constancia: File[]=[];url_img_material: File[]=[];

  ngOnInit(): void {
    setTimeout(() => {
      this.listInit();
    })
  }

  listInit(){
    this.columns.push(
      {title: 'N°', data:'event_code' },
      {title: 'Código', data: 'event_code'},
      {title: 'Evento', data: 'event_name'},
      {title: 'Contraseña', data: 'dowload_key'},
      {title: 'Tipo', data: 'tipo', orderable: false, searchable: false, defaultContent: '',
        ngTemplateRef: {
          ref: this.is_tipo,
          context: {
            captureEvents: this.captureEventsEmitido.bind(self)
          }
        }
      },
      {title: 'Estado', data: 'event_description', orderable: false, searchable: false, defaultContent: '',
        ngTemplateRef: {
          ref: this.is_estado,
          context: {
            captureEvents: this.captureEventsEmitido.bind(self)
          }
        }
      },
      {title: 'F. Evento', data: 'fecha_evento'},
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
          //this.filter_params = `cantidad=${body_params['length']}&pagina${this.paginate}&search=${body_params['search']['value'] || ''}`
          this.filter_params=`pagina=${this.paginate}&cantidad=${body_params['length']}`
        }
        this.service.listEvents(this.filter_params).subscribe(resp => {
          // console.log(this.filter_params)
          if(resp['data']){
            resp['data'].forEach(i=>{
              let tipo={
                is_gestion: i.is_gestion,
                is_asistencial: i.is_asistencial
              }
              //i.created_at= this.datePipe.transform(i.created_at,"dd/MM/yyyy HH:mm"),
              i.tipo= tipo
              i.updated_at= this.datePipe.transform(i.updated_at,"dd/MM/yyyy HH:mm")
              i.fecha_evento= this.datePipe.transform(i.event_start_date*1000,"dd/MM/yyyy HH:mm")
            })
            //console.log(resp.data)
            this.register_count = resp['cantidad']
          }
          callback({
            recordsTotal: resp['cantidad'],
            recordsFiltered: resp['cantidad'],
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
      language: EventsComponent.spanish_datatables,
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
    if (event.cmd === 'update'){
      this.detalle=event.data;
      //console.log(this.detalle)
      this.openModalEdit(this.detalle)
    }else{
      this.deleteEvent(event.data)
    }
  }

  captureEventsEmitido(event: any): void {
  }

  openModal(){
    this.formEvent.reset()
    this.formEvent.controls.is_gestion.setValue(true)
    this.formEvent.controls.is_asistencial.setValue(false)
    this.url_img_1920x500=[]
    this.url_img_750x500=[]
    this.url_img_constancia=[]
    this.url_img_material=[]
    this.modalRef = this.modalService.open(this.modalContent, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRef.result.then();
  }

  closeModal(){
    this.modalRef.close()
  }

  openModalEdit(data){
    // let fecha:any=this.datePipe.transform(data.recordatorio*1000,"yyyy-MM-dd")
    // this.formDate.controls.fecha.setValue(fecha,"yyyy-MM-dd HH:mm")
    let fecha_evento:any= this.datePipe.transform((+data.event_start_date)*1000, "yyyy-MM-dd HH:mm")
    this.formEdit.controls.name_event.setValue(data.event_name)
    this.formEdit.controls.ponente.setValue(data.event_data.ponente)
    this.formEdit.controls.profesion.setValue(data.event_data.profesion)
    this.formEdit.controls.dowload_key.setValue(data.dowload_key)
    this.formEdit.controls.is_gestion.setValue(data.is_gestion)
    this.formEdit.controls.is_asistencial.setValue(data.is_asistencial)
    this.formEdit.controls.fecha_evento.setValue(fecha_evento)
    this.modalRefEdit = this.modalService.open(this.modalContentEdit, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRefEdit.result.then();
  }

  closeModalEdit(){
    this.modalRefEdit.close()
  }

  changeGestion(event){
    this.formEvent.controls.is_asistencial.setValue(false)
  }

  changeAsistencial(event){
    this.formEvent.controls.is_gestion.setValue(false)
  }
  
  subirArchivoWeb(){
    this.spinner.show()
    let data={}
    let name_file=[
      {
        nombre: "url_img_1920x500",
        data: this.url_img_1920x500
      },
      {
        nombre: "url_img_750x500",
        data: this.url_img_750x500
      },
      {
        nombre: "url_img_constancia",
        data: this.url_img_constancia
      },
      {
        nombre: "url_img_material",
        data: this.url_img_material
      },
    ]
    //console.log(name_file)
    let folder= 'Eventos/'+this.formEvent.controls.name_event.value+'/'
    for(let a=0; a<4; a++){
      const formData = new FormData()
      formData.append("bucket", 'web-altux-files');
      formData.append("nombre", name_file[a].data[0].name);
      formData.append("folder", folder);
      formData.append('files', name_file[a].data[0], name_file[a].data[0].name);
      this.service.subirFileS3(formData).subscribe(resp=>{
        if(resp.success==true){
          let url= resp.data[0].url
          data[name_file[a].nombre] = url;
          if(Object.keys(data).length==4){
            this.saveEvent(data)
            //console.log(data)
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

  saveEvent(img){
    var fecha_evento= ((new Date(this.formEvent.controls.fecha_evento.value)).getTime())/1000
    let body={
      "name_event": this.formEvent.controls.name_event.value,
      "ponente": this.formEvent.controls.ponente.value,
      "profesion": this.formEvent.controls.profesion.value,
      "dowload_key": this.formEvent.controls.dowload_key.value,
      "url_material": img.url_img_material,
      "url_constancia": img.url_img_constancia,
      "url_img_principal": img.url_img_1920x500,
      "url_correo_cabecera": img.url_img_1920x500,
      "url_img_web": img.url_img_750x500,
      "fecha_evento": fecha_evento,
      "is_gestion": this.formEvent.controls.is_gestion.value,
      "is_asistencial": this.formEvent.controls.is_asistencial.value
    }
    this.service.createEvent(body).subscribe(resp=>{
      if(resp.success==true){
        this.closeModal()
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Genial Evento Creado",
          showConfirmButton: false,
          timer: 2500
        });
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
      // this.closeModal()
      this.spinner.hide()
    })
  }

  async updateState(valEvents){
    const { value: url } = await Swal.fire({
      input: "url",
      inputLabel: "URL FACEBOOK",
      inputPlaceholder: "Ingrese la URL del vídeo grabado"
    });
    if (url) {
      this.spinner.show()
      //Swal.fire(`Entered URL: ${url}`);
      let body ={
        "url_video": url,
        "event_description": "culminado"
      }
      this.service.updateEvent(valEvents.id, body).subscribe(resp=>{
        if(resp.success==true){
          this.spinner.hide()
          Swal.fire({
            position: "center",
            icon: "success",
            title: "URL Evento Asignado",
            showConfirmButton: false,
            timer: 2500
          });
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
        // this.closeModal()
        this.spinner.hide()
      })
    }
    console.log(valEvents)
  }

  deleteEvent(detalle){
    Swal.fire({
      title: "Seguro de eliminar evento?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#95c50a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show()
        this.service.deleteEvent(detalle.id).subscribe(resp=>{
          if(resp.success){
            this.spinner.hide()
            Swal.fire({
              position: "center",
              icon: "success",
              title: resp.message,
              showConfirmButton: false,
              timer: 2500
            });
            this.rerender()
          }
        })
      }
    });
  }

  updateEvent(){
    this.spinner.show()
    var fecha_evento= ((new Date(this.formEdit.controls.fecha_evento.value)).getTime())/1000
    let body={
      "name_event": this.formEdit.controls.name_event.value,
      "ponente": this.formEdit.controls.ponente.value,
      "profesion": this.formEdit.controls.profesion.value,
      "dowload_key": this.formEdit.controls.dowload_key.value,
      "fecha_evento": fecha_evento,
      "is_gestion": this.formEdit.controls.is_gestion.value,
      "is_asistencial": this.formEdit.controls.is_asistencial.value
    }
    this.service.updateEvent(this.detalle.id, body).subscribe(resp=>{
      if(resp.success==true){
        this.closeModalEdit()
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Genial Evento Actualizado",
          showConfirmButton: false,
          timer: 2500
        });
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
      // this.closeModal()
      this.spinner.hide()
    })
  }

  //FILES

  onSelect1920x500(event) {
    this.url_img_1920x500.push(...event.addedFiles);
  }
  
  onRemove1920x500(event) {
    this.url_img_1920x500.splice(this.url_img_1920x500.indexOf(event), 1);
  }

  onSelectconstancia(event) {
    this.url_img_constancia.push(...event.addedFiles);
  }
  
  onRemoveconstancia(event) {
    this.url_img_constancia.splice(this.url_img_constancia.indexOf(event), 1);
  }

  onSelect750x500(event) {
    this.url_img_750x500.push(...event.addedFiles);
  }
  
  onRemove750x500(event) {
    this.url_img_750x500.splice(this.url_img_750x500.indexOf(event), 1);
  }

  onSelectmaterial(event) {
    for (const item of event.target.files) {
      this.url_img_material.push(item);
    }
  }
  
  onRemovematerial(index) {
    this.url_img_material.splice(index, 1);
  }
}
