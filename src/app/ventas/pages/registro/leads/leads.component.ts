import { ChangeDetectorRef, Component, Input, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VentasService } from 'src/app/ventas/service/ventas.service';
import {DataTableDirective} from "angular-datatables";
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
registerLocaleData(localeEs, 'es');
//Import Culqi
import { greet } from '../../../../../assets/js/service.js';
import { config_data } from '../../../../../assets/js/config.js';
import { ejecutar } from '../../../../../assets/js/checkout.js';

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
  @ViewChild('seguimiento') private modalSeguimiento: TemplateRef<LeadsComponent>;
  private modalRefSeguimiento: NgbModalRef;
  @ViewChild('register') private modal: TemplateRef<LeadsComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('modal_pago') private modalContentPago: TemplateRef<LeadsComponent>;
  private modalRefPago: NgbModalRef;
  @ViewChild('modal_editar') private modalEditar: TemplateRef<LeadsComponent>;
  private modalEdit: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  @ViewChild('dtActions') dtActions!: TemplateRef<LeadsComponent>;
  @ViewChild('is_tipo') is_tipo!: TemplateRef<LeadsComponent>;
  @ViewChild('is_fechaModificacion') is_fechaModificacion!: TemplateRef<LeadsComponent>;
  @ViewChild('is_celular') is_celular!: TemplateRef<LeadsComponent>;
  @ViewChild('idTpl', {static: true}) idTpl: TemplateRef<LeadsComponent>;

  constructor(private service: VentasService, private spinner: NgxSpinnerService,private fb: FormBuilder,private modalService: NgbModal,
    private cd: ChangeDetectorRef,private datePipe: DatePipe,
  ) {}

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
    {
      cmd: "edit",
      label: "Editar",
      classList: "",
      icon: 'bi bi-pencil-square'
    },
  ];
  formSeguimiento = this.fb.group({
    estado:['',],
    reason: ['',Validators.required],
    fecha: [''],
  });
  formRegistro = this.fb.group({
    tipo_matricula:['',],
    fecha: [null],
    is_factura: [false,],
    ruc: ['',],
    grado_instruccion:[''],
    cargo:[''],
    area:[''],
    datecall:['']
  });
  formSearch = this.fb.group({
    tipo_lista:['',]
  });
  formEditar = this.fb.group({
    tipo_doc: ['', Validators.required],
    num_doc: ['', Validators.required],
    nombres: ['', Validators.required],
    apellido_p: ['', Validators.required],
    apellido_m: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
  });
  tipo_doc: any[] = [
    {
      'id': 'dni',
      'name': 'DNI',
    },
    {
      'id': 'cee',
      'name': 'Carnet Extranjeria',
    },
    {
      'id': 'pass',
      'name': 'Pasaporte',
    },
  ];
  tipo_matricula: any[] = [
    {
      'id': 'prematricula',
      'name': 'Matrícula',
    },
    {
      'id': 'matriculacuota',
      'name': 'Matricula + 1° Cuota',
    },
    {
      'id': 'matriculacontado',
      'name': 'Al Contado',
    },
  ];
  cargo:any=[
    {
      name:'JEFE DE DEPARTAMENTO'
    },
    {
      name:'JEFE DE SERVICIO'
    },
    {
      name:'ASISTENCIAL'
    },
    {
      name:'NO LABORAL'
    }
  ];
  grado_instruccion:any=[
    {'name': 'LICENCIADO'},
    {'name': 'COLEGIADO'},
    {'name': 'BACHILLER'},
    {'name': 'TÉCNICO'},
    {'name': 'ESTUDIANTE'}
  ];
  estado_seg:any=[
    {id: 'informacion', name: 'Información Enviada'},
    {id: 'no_contesta', name: 'No Contesta'},
    {id: 'no_interesado', name: 'No Interesado'},
    {id: 'compromiso_pago', name: 'Compromiso Matrícula'},
    {id: 'proximo_grupo', name: 'Próximo Grupo'}
  ];
  tipo_lista:any=[
    {name: 'LEADS'},
    {name: 'BASE EXTRA'}
  ];
  @Input()estado_leads:any;
  detalle_edit:any
  leads:any; estado:any; ficha:boolean=false; discount:any; data_detail:any; is_facture:boolean=false; nameruc:any; mostrarDiscount:boolean=false
  mostrarDate:boolean=false; nombre_descuento:any; area_trabajo:any; area:boolean=false; _generate:any;filter_params:any; date_seguimiento:boolean=false

  public paginate:any; public start_paginate:number=0; register_count:number;

  ngOnInit(): void {
    //this.formSearch.controls.tipo_lista.setValue('BASE EXTRA')
    setTimeout(() => {
      this.listInit();
    })
  }

  listInit(){
    this.service.getEstado().subscribe(resp => {
      if(resp.success){
        this.estado=resp.data
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
    this.service.getArea().subscribe(data => {
      if (data['success'] === true){
        this.area_trabajo = data['data'];
      }
    });
    this.formSearch.controls.tipo_lista.setValue('LEADS')
    this.filter_params = `procedencia=${this.formSearch.controls.tipo_lista.value}&pagina=1&cantidad=10`
    this.listarLeads();
  }

  listarLeads(){
    this.columns.push(
      {title: 'N°', data:'n' },
      {title: 'Nombres y Apellidos', data: 'seguimiento', orderable: false, searchable: false, defaultContent: '',
        ngTemplateRef: {
          ref: this.is_tipo,
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
      {title: 'Diplomado', data: 'courses_name'},
      {title: 'Procedencia', data: 'procedencia'},
      {title: 'F. Registro', data: 'created_at'},
      {title: 'F. Modificación', data: 'updated_at', orderable: false, searchable: false, defaultContent: '',
        ngTemplateRef: {
          ref: this.is_fechaModificacion,
          context: {
            captureEvents: this.captureEventsEmitido.bind(self)
          }
        }
      },
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
          this.filter_params=`procedencia=${this.formSearch.controls.tipo_lista.value}&procedencia=LEADS-A&pagina=${this.paginate}&cantidad=${body_params['length']}&search=${body_params['search']['value'] || ''}`
        }
        this.service.getLeads(this.filter_params).subscribe(resp => {
          let data=[], n=0, cantidad=0
          if(resp){
            if(resp.data){
              resp['data'].forEach(i=>{
                n++
                let created_at= this.datePipe.transform(i.created_at,"dd/MM/yyyy")
                let updated_at= this.datePipe.transform(i.updated_at,"dd/MM/yyyy")
                data.push({
                  "n":n,
                  "id": i.id,
                  "diplomado": i.diplomado,
                  'courses_name': i.diplomado.courses_name,
                  "estado": i.estado,
                  "alumno": i.nombres+" "+i.apellidos,
                  "nombres": i.nombres,
                  "apellidos": i.apellidos,
                  "dni": i.dni,
                  "email": i.email,
                  "telefono": i.telefono,
                  "seguimiento": i.seguimiento,
                  "numero_colegiatura": i.numero_colegiatura,
                  "procedencia": i.procedencia,
                  "historial_seguimiento": i.historial_seguimiento,
                  'created_at': created_at,
                  "updated_at": updated_at,
                  "vendedor": i.vendedor
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

  onCaptureEvent(event: any): void {
    if (event['cmd'] === 'seguimiento'){
      this.openModalSeguimiento(event['data'])
    }else if (event['cmd'] === 'edit'){
      this.openModalEdit(event['data'])
    }else if(event.cmd === 'add'){
      this.openModal(event['data'])
    }
  }

  captureEventsEmitido(event: any): void {
  }

  rerender(){
    this.filter_params = `procedencia=${this.formSearch.controls.tipo_lista.value}&pagina=1&cantidad=10`
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next()
    });
  }

  openModal(data) {
    this.reset()
    this.data_detail=data
    this.modalRef = this.modalService.open(this.modal,{centered: true, size: 'md', keyboard: false, backdrop : 'static'});
    this.modalRef.result.then();
  }

  closeModal() {
    this.modalRef.close();
  }

  reset(){
    this.formRegistro.reset()
    this.formRegistro.controls['tipo_matricula'].setValue('')
    this.formRegistro.controls['cargo'].setValue('')
    this.formRegistro.controls['grado_instruccion'].setValue('')
    this.formRegistro.controls['area'].setValue('')
    this.area=false
    this.ficha=false
    this.mostrarDate=false
    this.mostrarDiscount=false
    this.is_facture=false
    this.discount=null
    this.nameruc=null
  }

  openModalEdit(alumnos) {
    // console.log(alumnos)
    this.detalle_edit=alumnos
    this.formEditar.reset()
    
    let tipo='dni'
    if(alumnos.dni.length!=8){tipo=''}
    // Asigna los valores a los controles del formulario
    this.formEditar.controls['tipo_doc'].setValue(tipo); // Si tienes el tipo de documento
    this.formEditar.controls['num_doc'].setValue(alumnos.dni);       // DNI del alumno
    this.formEditar.controls['nombres'].setValue(alumnos.nombres);   // Nombres del alumno
    this.formEditar.controls['apellido_p'].setValue(alumnos.apellidos.split(' ')[0]); // Primer apellido
    this.formEditar.controls['apellido_m'].setValue(alumnos.apellidos.split(' ')[1]); // Segundo apellido
    this.formEditar.controls['email'].setValue(alumnos.email);     

    this.modalEdit = this.modalService.open(this.modalEditar, { centered: true, size: 'md', keyboard: false, backdrop : 'static' });
    this.modalEdit.result.then();
  }

  closeModalEdit() {
    this.modalEdit.close();
    // this.mostrarColegiatura=false;
    // this.namepatrocinador=null
  }

  openModalSeguimiento(data){
    this.date_seguimiento=false
    this.formSeguimiento.reset()
    this.data_detail=data
    this.formSeguimiento.controls.estado.setValue('')
    this.modalRefSeguimiento = this.modalService.open(this.modalSeguimiento,{centered: true, size: 'md', keyboard: false, backdrop : 'static'});
    this.modalRefSeguimiento.result.then();
  }

  closeModalSeguimiento() {
    this.modalRefSeguimiento.close();
  }

  openModalInfo() {
    this.modalRefPago = this.modalService.open(this.modalContentPago, { centered: true, size: 'lg' });
    this.modalRefPago.result.then();
  }

  closeModalInfo() {
    this.modalRefPago.close();
  }

  getInfoByRuc(event){
    const inputValue = event.target.value;
    this.nameruc = null;
    if (inputValue.length === 11) {
      let ruc_consulta = {
        "tipo": "ruc",
        "documento": event.target.value
      };
      this.spinner.show();
      this.formRegistro.controls['ruc'].enable();
      this.service.getInfoDNI(ruc_consulta.tipo, ruc_consulta.documento).subscribe(data => {
        if (data['success'] === false) {
          this.nameruc = null;
          this.formRegistro.controls['ruc'].setValue('');
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "¡RUC no encontrado!",
            showConfirmButton: false,
            timer: 1500
          });
        }
        else if (data['data'].resultado['estado']=='ACTIVO'){
          this.nameruc = data['data'].resultado['razon_social'];
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡RUC encontrado!",
            showConfirmButton: false,
            timer: 1500
          });
        }
        else if (data['data'].resultado['estado'] !='ACTIVO') {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "¡RUC Inactivo. Favor de Ingresar un RUC Activo!",
            showConfirmButton: false,
            timer: 1500
          });
        }
        this.spinner.hide();
      }, error => {
        this.nameruc = null;
        this.formRegistro.controls['ruc'].setValue('');
        //this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "error",
          title: "¡Ocurrió un error, inténtelo en un momento!",
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  }

  select(event){
    this.ficha=event.target.checked
    this.formRegistro.controls['datecall'].setValidators([]);
    this.formRegistro.controls['datecall'].updateValueAndValidity();
    this.formRegistro.controls['tipo_matricula'].setValidators([]);
    this.formRegistro.controls['tipo_matricula'].updateValueAndValidity();
    this.formRegistro.controls['fecha'].setValidators([]);
    this.formRegistro.controls['fecha'].updateValueAndValidity();
    if(!this.ficha){
      this.formRegistro.controls['tipo_matricula'].setValidators([Validators.required]);
      this.formRegistro.controls['tipo_matricula'].updateValueAndValidity();
      this.formRegistro.controls['fecha'].setValidators([Validators.required]);
      this.formRegistro.controls['fecha'].updateValueAndValidity();
      this.formRegistro.controls['tipo_matricula'].setValue('')
      this.formRegistro.controls['fecha'].setValue(null)
      this.discount=null
    }
    else if(this.ficha){
      this.formRegistro.controls['datecall'].setValidators([Validators.required]);
      this.formRegistro.controls['datecall'].updateValueAndValidity();
      this.formRegistro.controls['datecall'].setValue(null)
    }
  }

  optionFacture(event){
    let ischecked = event.target.checked;
    if (ischecked === true){
      this.is_facture = true
      this.formRegistro.controls['ruc'].setValidators([Validators.required,Validators.minLength(11), Validators.maxLength(11)]);
      this.formRegistro.controls['ruc'].updateValueAndValidity();
    }else{
      this.formRegistro.controls['ruc'].setValidators([]);
      this.formRegistro.controls['ruc'].updateValueAndValidity();
      this.formRegistro.controls['ruc'].setValue('');
      this.nameruc=null;
      this.is_facture = false
    }
  }
  
  selectListar(event){}

  selectSeguimiento(event){
    this.formSeguimiento.controls.fecha.setValue(null)
    this.date_seguimiento=false
    if(event.target.value=='compromiso_pago'){this.date_seguimiento=true}
    if(event.target.value=='informacion'){this.date_seguimiento=true}
  }

  selectMatricula(event){
    this.spinner.show();
    try {
      this.formRegistro.controls['fecha'].setValue(null);
      var tipo_matricula = event.target.value;
      const jsonbody = {
        "diplomado_code": this.data_detail.diplomado.courses_code,
        "type_matricula": tipo_matricula
      };
      this.service.listDiscount(jsonbody).subscribe(data => {
        this.discount = data['message'];
        if (data['message']['first_payment'] === 0) {
          this.mostrarDiscount = false;          
        } else {
          this.mostrarDiscount = true;
        }
        this.spinner.hide();
      });
    }
    catch (e){
      this.spinner.hide();
      this.discount=null;
      this.formRegistro.controls['tipo_matricula'].setValue(null);
    }
    if(tipo_matricula === 'prematricula'){
      this.mostrarDate=true;
      this.nombre_descuento='Matrícula';
      this.formRegistro.controls['fecha'].setValidators([Validators.required]);
      this.formRegistro.controls['fecha'].updateValueAndValidity();
    }
    else if(tipo_matricula === 'matriculacontado'){
      this.mostrarDate=false;
      this.nombre_descuento='Diplomado Contado';
      this.formRegistro.controls['fecha'].setValidators([]);
      this.formRegistro.controls['fecha'].updateValueAndValidity();
    }
    else {
      this.mostrarDate=false;
      this.nombre_descuento='Matrícula + 1ra Mensualidad';
      this.formRegistro.controls['fecha'].setValidators([]);
      this.formRegistro.controls['fecha'].updateValueAndValidity();
    }
  }

  selectCargo(event){
    let cargo = event.target.value;
    this.formRegistro.controls['area'].setValue('')
    this.formRegistro.controls['area'].setValidators([]);
    this.formRegistro.controls['area'].updateValueAndValidity();
    if (cargo == 'JEFE DE DEPARTAMENTO' ) {
      this.area = false
    }else if ( cargo == 'JEFE DE SERVICIO') {
      this.area = true
      this.formRegistro.controls['area'].setValidators([Validators.required]);
      this.formRegistro.controls['area'].updateValueAndValidity();
    }else if ( cargo == 'ASISTENCIAL') {
      this.area = true
      this.formRegistro.controls['area'].setValidators([Validators.required]);
      this.formRegistro.controls['area'].updateValueAndValidity();
    }else {
      this.area = false
      this.formRegistro.controls['area'].setValidators([]);
      this.formRegistro.controls['area'].updateValueAndValidity();
    }
  }
  
  selectTipoDoc(event){
    this.formEditar.controls.num_doc.setValue('')
    this.formEditar.controls.nombres.setValue('')
    this.formEditar.controls.apellido_p.setValue('')
    this.formEditar.controls.apellido_m.setValue('')
    this.formEditar.controls.nombres.enable();
    this.formEditar.controls.apellido_p.enable();
    this.formEditar.controls.apellido_m.enable();
  }

  editCliente(){
    this.spinner.show()
    let jsonbody = {
      "new_dni": this.formEditar.controls.num_doc.value,
      "new_nombres": this.formEditar.controls.nombres.value,
      "new_apellidos": this.formEditar.controls.apellido_p.value+' '+this.formEditar.controls.apellido_m.value,
      "new_email": this.formEditar.controls.email.value
    }
    this.service.actualizarLeads(this.detalle_edit.id, jsonbody).subscribe(data => {
      if (data['success'] === true) {
        this.closeModalEdit();
        this.spinner.hide();
        this.rerender();
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Se Actualizó los datos!',
          showConfirmButton: false,
          timer:2000
        });
      }
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
       if (error.error['message']) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: error.error['message'],
            showConfirmButton: false,
            timer: 3500
          })
          //this.toastr.error(error.error['message'], '¡Error!');
        }else if (error.error.errors['non_field_errors']) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: error.error.errors['non_field_errors'][0],
            showConfirmButton: false,
            timer: 3500
          })
          //this.toastr.error(error.error.errors['non_field_errors'][0], '¡Error!');
        }
      }
    });
  }

  getInfoByDni(event){
    let dni_consulta = {
      "tipo": "dni",
      "documento": event.target.value
    };
    if (event.target.value.length === 8) {
      this.spinner.show();
      this.formEditar.controls.num_doc.disable();
      
      this.service.getInfoDNI(dni_consulta.tipo, dni_consulta.documento).subscribe(dni_val => {
        this.spinner.hide();
        this.formEditar.controls.num_doc.enable();
        if (dni_val.data.estado === false) {
          this.formEditar.controls.num_doc.setValue('');
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "¡DNI no válido!",
            showConfirmButton: false,
            timer: 1500
          });
        }else{
          let dni = {
            "nombres": dni_val.data.resultado['nombres'],
            "apellidoPaterno": dni_val.data.resultado['apellido_paterno'],
            "apellidoMaterno":  dni_val.data.resultado['apellido_materno'],
          }
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Consulta exitosa!",
            showConfirmButton: false,
            timer: 1000
          });
          this.formEditar.controls.nombres.setValue(dni['nombres']);
          this.formEditar.controls.apellido_p.setValue(dni['apellidoPaterno']);
          this.formEditar.controls.apellido_m.setValue(dni['apellidoMaterno']);
          this.formEditar.controls.nombres.disable();
          this.formEditar.controls.apellido_p.disable();
          this.formEditar.controls.apellido_m.disable();
        }
      }, error => {
        this.formEditar.controls.num_doc.setValue('');
        this.formEditar.controls.num_doc.enable();
        this.formEditar.controls.nombres.enable();
        this.formEditar.controls.apellido_p.enable();
        this.formEditar.controls.apellido_m.enable();
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "error",
          title: "¡Inténtelo en un momento!",
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
    else{
      this.formEditar.controls.num_doc.enable();
      this.formEditar.controls.nombres.setValue('');
      this.formEditar.controls.apellido_p.setValue('');
      this.formEditar.controls.apellido_m.setValue('');
      this.formEditar.controls.nombres.enable();
      this.formEditar.controls.apellido_p.enable();
      this.formEditar.controls.apellido_m.enable();
    }
  }

  saveSeguimiento(){
    this.spinner.show()
    let fecha_pago=null; let fecha_contactar=null
    if(this.formSeguimiento.controls.estado.value=='compromiso_pago'){
      fecha_pago= ((new Date(this.formSeguimiento.controls.fecha.value)).getTime())/1000      
    }
    if(this.formSeguimiento.controls.estado.value=='informacion'){
      fecha_contactar= ((new Date(this.formSeguimiento.controls.fecha.value)).getTime())/1000      
    }
    let body={
      "fecha_pago": fecha_pago,
      "fecha_contactar": fecha_contactar,
      "tipo_seguimiento": this.formSeguimiento.controls.estado.value,
      "detalle": this.formSeguimiento.controls.reason.value
    }
    this.service.registrarSeguimiento(this.data_detail.id, body).subscribe(data => {
      if (data['success'] === true) {
        this.closeModalSeguimiento();
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Se Registró el Seguimiento!',
          showConfirmButton: false,
          timer:2000
        });
        this.rerender()
      }
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
       if (error.error['message']) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: error.error['message'],
            showConfirmButton: false,
            timer: 3500
          })
          //this.toastr.error(error.error['message'], '¡Error!');
        }else if (error.error.errors['non_field_errors']) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: error.error.errors['non_field_errors'][0],
            showConfirmButton: false,
            timer: 3500
          })
          //this.toastr.error(error.error.errors['non_field_errors'][0], '¡Error!');
        }
      }
    });
  }

  saveRegister(){
    if(!this.ficha){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-warning',
          cancelButton: 'btn btn-dark mx-3'
        },
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: 'MÉTODO DE PAGO',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '💰 PagoEfectivo',
        cancelButtonText: '💳 Tarjetas'
      }).then((result) => {
        if (result.isConfirmed) {
          this.registerMatricula()
        }
        else if (result.isDismissed) {
          this.generarLinkPago()
        }
      })
    }
    else if(this.ficha){
      this.registerFicha()
    }
  }
  
  registerFicha(){
    let js=this.formRegistro.controls['datecall'].value;
    var unixtimestamp= (new Date(js).getTime())/1000
    let body= {
      "pais": "Perú",
      "type_doc": 1,
      "name": this.data_detail.nombres,
      "lastname": this.data_detail.apellidos,
      "num_document": this.data_detail.dni,
      "num_documento_sunat": null,
      "course_code": this.data_detail.diplomado.courses_code,
      "phone": this.data_detail.telefono,
      "email": this.data_detail.email,
      "procedencia_venta": this.data_detail.procedencia,
      "grado_instruccion": this.formRegistro.controls['grado_instruccion'].value,
      "num_colegiatura": this.data_detail.numero_colegiatura,
      "date_call":unixtimestamp.toString(),
      "cargo":this.formRegistro.controls['cargo'].value,
      "area":this.formRegistro.controls['area'].value,
      "is_referido": false,
      "dni_patrocinador": null,
      "name_patrocinador": null,
      "centro_laboral": null,
      "estado_civil": null,
      "fecha_nacimiento": null,
      "genero": null,
      "ubigeo": null,
      "direccion": null
    };
    this.spinner.show()
    this.service.registrarPreVenta(body).subscribe(data => {
      if (data['success'] === true) {
        this.closeModal();
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Se Agregó Cliente!',
          showConfirmButton: false,
          timer:2000
        });
        this.rerender()
      }
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
       if (error.error['message']) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: error.error['message'],
            showConfirmButton: false,
            timer: 3500
          })
          //this.toastr.error(error.error['message'], '¡Error!');
        }else if (error.error.errors['non_field_errors']) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: error.error.errors['non_field_errors'][0],
            showConfirmButton: false,
            timer: 3500
          })
          //this.toastr.error(error.error.errors['non_field_errors'][0], '¡Error!');
        }
      }
    });
  }

  registerMatricula(){
    let rzon_social, num_documento_sunat
    if(this.is_facture == false){
      rzon_social = this.data_detail.nombres + ' ' + this.data_detail.apellidos;
      num_documento_sunat = this.data_detail.dni;
    }
    else {
      rzon_social = this.nameruc;
      num_documento_sunat = this.formRegistro.controls['ruc'].value;
    }
    if(this.formRegistro.controls['tipo_matricula'].value=='prematricula'){
      let js=this.formRegistro.controls['fecha'].value;
      var unixtimestamp:any= (new Date(js).getTime()+960*60000)/1000
    }
    let body={
      "diplomado_code": this.data_detail.diplomado.courses_code,
      "pais": "Perú",
      "tipoDoc": 1,
      "num_documento": this.data_detail.dni,
      "num_documento_sunat": num_documento_sunat,
      "email": this.data_detail.email,
      "telefono": this.data_detail.telefono,
      "nombres": this.data_detail.nombres,
      "apellidos": this.data_detail.apellidos,
      "is_facture": this.is_facture,
      "rzon_social": rzon_social,
      "date_nex_payment": unixtimestamp,
      "type_matricula": this.formRegistro.controls['tipo_matricula'].value,
      "procedencia_venta": this.data_detail.procedencia,
      //"grado_instruccion": this.formRegistro.controls['grado_instruccion'].value,
      "grado_instruccion": 'ninguno',
      "num_colegiatura": this.data_detail.numero_colegiatura,
      "cargo": this.formRegistro.controls['cargo'].value,
      "area": this.formRegistro.controls['area'].value,
      "is_referido": false,
      "id_student": null,
      "dni_patrocinador": null,
      "name_patrocinador": null,
      "centro_laboral": null,
      "estado_civil": null,
      "fecha_nacimiento": null,
      "genero": null,
      "ubigeo": null,
      "direccion": null
    }
    this.spinner.show();
    this.service.registrarMatricula(body).subscribe(data => {
      if (data['success'] === true){
        if(data['data']['object']=='error'){
          this.spinner.hide();
          this.closeModal();
          Swal.fire({
            position: "center",
            icon: "warning",
            title: '¡Error!',
            text: '¡No se pudo generar el codigo, inténtelo nuevamente!',
            showConfirmButton: false,
            timer:2000
          });
        }
        else{
          this.closeModal();
          this.spinner.hide();
          let datos={
            amount: data['data'].amount,
            currency_code: data['data'].currency_code,
            description: data['data'].description,
            order_number: data['data'].id,
            client_details: {
              first_name: body.nombres,
              last_name: body.apellidos,
              email: body.email,
              phone_number: body.telefono
            },
            expiration_date: data['data'].expiration_date,
            confirm: false,
            paymentMethods: {
              tarjeta: false,
              yape: false,
              billetera: true,
              bancaMovil: true,
              agente: true,
              cuotealo: false,
            }
          };
          let datos_config={
            TOTAL_AMOUNT: data['data'].amount,
            ORDER_NUMBER: data['data'].id,
            firstName: body.nombres,
            lastName: body.apellidos,
            address: "",
            address_c: "",
            phone: body.telefono,
            email: body.email,
          }
          config_data(datos_config);
          greet(datos)
          ejecutar(null)
          // this._generate = data['data'];
          // this.closeModal();
          // this.spinner.hide();
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: '¡Genial ☺!',
          //   text: '¡Se generó código de Pago!',
          //   showConfirmButton: false,
          //   timer:2000
          // });
          // this.openModalInfo();
        }
        this.rerender()
      }
    },error => {
      this.spinner.hide();
      if (error.status === 400) {
        if (error.error.message['non_field_errors']) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: '¡Error!',
            text: error.error.message['non_field_errors'][0],
            showConfirmButton: false,
            timer:2000
          });
        }else if (error.error['message']) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: '¡Error!',
            text: error.error['message'],
            showConfirmButton: false,
            timer:2000
          });
        }
      }
    });
  }

  generarLinkPago(){
    let rzon_social, num_documento_sunat
    if(this.is_facture == false){
      rzon_social = this.data_detail.nombres + ' ' + this.data_detail.apellidos;
      num_documento_sunat = this.data_detail.dni;
    }
    else {
      rzon_social = this.nameruc;
      num_documento_sunat = this.formRegistro.controls['ruc'].value;
    }
    if(this.formRegistro.controls['tipo_matricula'].value=='prematricula'){
      let js=this.formRegistro.controls['fecha'].value;
      var unixtimestamp:any= (new Date(js).getTime()+960*60000)/1000
    }
    let body={
      "diplomado_code": this.data_detail.diplomado.courses_code,
      "pais": "Perú",
      "tipoDoc": 1,
      "num_documento": this.data_detail.dni,
      "num_documento_sunat": num_documento_sunat,
      "email": this.data_detail.email,
      "telefono": this.data_detail.telefono,
      "nombres": this.data_detail.nombres,
      "apellidos": this.data_detail.apellidos,
      "is_facture": this.is_facture,
      "rzon_social": rzon_social,
      "date_nex_payment": unixtimestamp,
      "procedencia_venta": this.data_detail.procedencia,
      "grado_instruccion": this.formRegistro.controls['grado_instruccion'].value,
      "num_colegiatura": this.data_detail.numero_colegiatura,
      "cargo": this.formRegistro.controls['cargo'].value,
      "area": this.formRegistro.controls['area'].value,
      "is_referido": false,
      "id_student": null,
      "dni_patrocinador": null,
      "name_patrocinador": null,
      "centro_laboral": null,
      "estado_civil": null,
      "fecha_nacimiento": null,
      "genero": null,
      "ubigeo": null,
      "direccion": null,
      "tipo_matricula": this.formRegistro.controls['tipo_matricula'].value,
      "discount": this.discount
    }
    this.spinner.show();
    this.service.registrarLinkMatricula(body).subscribe(data => {
      if( data['success']==true){
        let linkpago='https://app.altux.edu.pe/matricula-pago/'+data['data']
        this.copyText(linkpago)
        this.closeModal()
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Link Copiado!',
          showConfirmButton: false,
          timer:2000
        });
      }
      else {
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "warning",
          title: '¡Error!',
          text: data['message'],
          showConfirmButton: false,
          timer:2000
        });
      }
      this.rerender()
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
       if (error.error['message']) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: error.error['message'],
            showConfirmButton: false,
            timer: 3500
          })
        }else if (error.error.errors['non_field_errors']) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: error.error.errors['non_field_errors'][0],
            showConfirmButton: false,
            timer: 3500
          })
        }
      }
    });
  }
  
  copyText(name){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = name;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}