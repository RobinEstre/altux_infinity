import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  selector: 'app-fichas',
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class FichasComponent implements OnInit {
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
  @ViewChild('seguimiento') private modalSeguimiento: TemplateRef<FichasComponent>;
  private modalRefSeguimiento: NgbModalRef;

  @ViewChild('delete') private modalDelete: TemplateRef<FichasComponent>;
  private modalDel: NgbModalRef;

  @ViewChild('editar') private modalEditar: TemplateRef<FichasComponent>;
  private modalEdit: NgbModalRef;

  @ViewChild('pay') private modalPayment: TemplateRef<FichasComponent>;
  private modalPay: NgbModalRef;

  @ViewChild('pago') private modalPago: TemplateRef<FichasComponent>;
  private modalPag: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  constructor(private service: VentasService, private spinner: NgxSpinnerService,private fb: FormBuilder, private modalService: NgbModal) { }
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  formReserva = this.fb.group({
    pais: ['Perú'],
    is_referido: ['',],
    patrocinador: ['',],
    diplomado: ['', Validators.required],
    dni: [''],
    nombres: ['',],
    apellidos: ['',] ,
    telefono: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    num_doc: ['',],
    tip_doc: [],
    nombrescompletos:['',],
    name1:[''],
    name2:[''],
    procedencia_venta:['', Validators.required],
    grado_instruccion:['', Validators.required],
    num_colegiatura: ['',],
    datecall: ['', Validators.required],
  });
  formDelete = this.fb.group({
    id:['',],
    reason: ['',Validators.required],
  });
  formGenerate = this.fb.group({
    id:['',],
    tipo_matricula:['',Validators.required],
    is_factura:[],
    ruc:[''],
    fecha:[null]
  });
  formSeguimiento = this.fb.group({
    estado:['',],
    reason: ['',Validators.required],
    fecha: [''],
  });
  formEditar = this.fb.group({
    telefono: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
  });

  fichas:any;isperu = true; mostrarColegiatura: boolean = false; referido:boolean=false; mostrar_patrocinador: boolean = false; nameperson:any
  namepatrocinador:any; detalle:any; nameruc:any; discount:any; mostrarDate: boolean = false; mostrarSelect: boolean = false; _generate:any
  nombre_descuento:any; precio_pago:any; mostrarDiscount:boolean=false; linkpago:any; num_ruc:boolean=false; data_detail:any;date_seguimiento:boolean=false
  
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
  estado_seg:any=[
    {id: 'informacion', name: 'Interesado'},
    {id: 'no_contesta', name: 'No Contesta'},
    {id: 'no_interesado', name: 'No Interesado'},
    {id: 'compromiso_pago', name: 'Compromiso Matrícula'},
    {id: 'proximo_grupo', name: 'Lead No Califica'}
  ];

  ngOnInit(): void {
    this.listarCarteraAlumnos();
  }

  listarCarteraAlumnos(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      //dom: 'Bfrtip',
      processing: true,
      language: FichasComponent.spanish_datatables
    }
    this.service.getFichas().subscribe(data => {
      if(data.success){
        let dip:any=[];
        data['data'].forEach(i=>{
          // const split = i.diplomado.courses_name.split(' ')
          // split.splice(0, 3);
          // let name=split.map(x=>x).join(" ")
          dip.push({
            'created_at':i.created_at,
            'is_referido': i.is_referido,
            'dni_patrocinador': i.dni_patrocinador,
            'name_patrocinador': i.name_patrocinador,
            'num_colegiatura': i.num_colegiatura,
            'type_doc': i.type_doc,
            'name': i.name,
            'lastname': i.latname,
            'names':i.name+' '+i.latname,
            'phone': i.phone,
            'mail': i.email,
            'courses_name': i.diplomado.courses_name,
            'date_call': i.date_call,
            'num_doc': i.num_doc,
            'courses_code': i.diplomado.courses_code,
            'id': i.id,
            'pais': i.pais,
            'grado_instruccion': i.grado_instruccion,
            'details': i.details,
            'procedencia_venta': i.procedencia_venta,
            'historial_seguimiento': i.historial_seguimiento,
            'seguimiento': i.seguimiento
          })
        })
        this.fichas= dip;
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
      this.fichas=[]
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

  selectSeguimiento(event){
    this.formSeguimiento.controls.fecha.setValue(null)
    this.date_seguimiento=false
    if(event.target.value=='compromiso_pago'){this.date_seguimiento=true}
    if(event.target.value=='informacion'){this.date_seguimiento=true}
  }

  selectMatricula(event){
    this.spinner.show();
    this.discount=null;
    try {
      this.formGenerate.controls['fecha'].setValue(null);
      var tipo_matricula = event.target.value;
      const jsonbody = {
        "diplomado_code": this.detalle.courses_code,
        "type_matricula": tipo_matricula
      };
      this.service.listDiscount(jsonbody).subscribe(data => {
        this.discount = data['message'];
        if (+data['message']['total_payment'] > 200) {
          this.mostrarDiscount = false;
          this.precio_pago = 'S/' + data['message']['total_payment'] + '.00';
        } else {
          this.mostrarDiscount = true;
          this.precio_pago = 'S/' + data['message']['first_payment'] + '.00';
        }
        this.spinner.hide();
      });
    }
    catch (e){
      this.spinner.hide();
      this.discount=null;
      this.precio_pago='';
      this.formGenerate.controls['tipo_matricula'].setValue(null);
    }
    if(tipo_matricula === 'prematricula'){
      this.mostrarDate=true;
      this.nombre_descuento='Matrícula';
      this.formGenerate.controls['fecha'].setValidators([Validators.required]);
      this.formGenerate.controls['fecha'].updateValueAndValidity();
    }
    else if(tipo_matricula === 'matriculacontado'){
      this.mostrarDate=false;
      this.nombre_descuento='Diplomado Contado';
      this.formGenerate.controls['fecha'].setValidators([]);
      this.formGenerate.controls['fecha'].updateValueAndValidity();
    }
    else {
      this.mostrarDate=false;
      this.nombre_descuento='Matrícula + 1ra Cuota';
      this.formGenerate.controls['fecha'].setValidators([]);
      this.formGenerate.controls['fecha'].updateValueAndValidity();
    }
  }

  optionFacture(event){
    let ischecked = event.target.checked;
    this.num_ruc=ischecked;
    if (ischecked === true){
      this.mostrarSelect = true
      this.formGenerate.controls['ruc'].setValidators([Validators.required,Validators.minLength(11), Validators.maxLength(11)]);
      this.formGenerate.controls['ruc'].updateValueAndValidity();
    }else{
      this.formGenerate.controls['ruc'].setValidators([]);
      this.formGenerate.controls['ruc'].updateValueAndValidity();
      this.formGenerate.controls['ruc'].setValue('');
      this.nameruc='';
      this.mostrarSelect = false
    }
  }

  openModalEdit(alumnos) {
    this.detalle=alumnos
    this.formEditar.reset()
    this.formEditar.controls.email.setValue(alumnos.mail)
    this.formEditar.controls.telefono.setValue(alumnos.phone)
    // this.mostrar_patrocinador=false;
    // this.formReserva.reset();
    // this.nameperson=null;
    // this.isperu = true;
    // this.formReserva.controls['pais'].setValue('Perú');
    // this.formReserva.controls['datecall'].setValue(null);
    this.modalEdit = this.modalService.open(this.modalEditar, { centered: true, size: 'md', keyboard: false, backdrop : 'static' });
    this.modalEdit.result.then();
  }

  closeModalEdit() {
    this.modalEdit.close();
    // this.mostrarColegiatura=false;
    // this.namepatrocinador=null
  }

  openModalDel(id) {
    this.formDelete.controls['id'].setValue(id)
    this.modalDel = this.modalService.open(this.modalDelete, { centered: true, size: 'sm', keyboard: false, backdrop : 'static' });
    this.modalDel.result.then();
  }

  closeModalDel() {
    this.modalDel.close();
  }
  
  openModalPay(alumno) {
    this.detalle=alumno
    this.modalPay = this.modalService.open(this.modalPayment, { centered: true, size: 'md', keyboard: false, backdrop : 'static' });
    this.formGenerate.controls['id'].setValue(alumno.id);
    this.formGenerate.controls.tipo_matricula.setValue('');
    this.formReserva.reset()
    this.mostrarSelect=false;
    this.formGenerate.controls['ruc'].setValidators([]);
    this.formGenerate.controls['ruc'].updateValueAndValidity();
    this.nameruc=null;
    this.discount=null;
    this.mostrarDate=false;
    //this.codigo = code;
    //this.dni=dni;
    this.formGenerate.controls['is_factura'].setValue(false);
    this.modalPay.result.then();
  }

  closeModalPay() {
    this.modalPay.close()
  }

  openModalPago() {
    this.modalPag = this.modalService.open(this.modalPago, { centered: true, size: 'lg', keyboard: false, backdrop : 'static' });
    this.modalPag.result.then();
  }

  closeModalPago() {
    this.modalPag.close();
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

  rerender(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.listarCarteraAlumnos()
    });
  }

  deleteClient(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.rerenderdeleteClient()
    });
  }

  rerenderdeleteClient(){
    this.spinner.show();
    const jsonbody = {
      "id_preventa":this.formDelete.controls['id'].value,
      "reason":this.formDelete.controls['reason'].value,
    };
    this.service.deleteClient(jsonbody).subscribe(data => {
      if (data['success'] === true) {
        this.formDelete.reset();
        this.listarCarteraAlumnos();
        this.closeModalDel();
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Se Eliminó Cliente de la Cartera!',
          showConfirmButton: false,
          timer:2000
        });
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
      this.spinner.hide()
    });
  }

  generateModal(){
    var unixtimestamp= ((new Date(this.formGenerate.controls['fecha'].value)).getTime())/1000
    let num_documento_sunat
    if(this.num_ruc == false){
      var number_doc=this.detalle.num_doc;
      num_documento_sunat = null;
      var raz_social=this.detalle.names;
      var tipo_doc= '1'; //valor DNI para emitir factura a la sunat
    }
    else {
      var number_doc = this.detalle.num_doc;
      num_documento_sunat = this.formGenerate.controls['ruc'].value.trim();
      var raz_social=this.nameruc;
      var tipo_doc= '6'; //Valor 6 hace referencia a ruc para emitir factura a la sunat
    }
    const jsonbody = {
      "id_preventa": this.formGenerate.controls['id'].value,
      "type": this.formGenerate.controls['tipo_matricula'].value,
      "date_nex_payment": unixtimestamp,
      "descuento":  0,
      "type_doc": tipo_doc,
      "is_facture": this.num_ruc,
      "num_documento": number_doc, // documento de identidad
      "num_documento_sunat": num_documento_sunat,   // docunento para emitir
      "rzn_social": raz_social,
      "procedencia_venta": "FICHA",
      "discount": this.discount
    };

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
      confirmButtonText: '💰 PagoEfectivo',
      cancelButtonText: '💳 Tarjetas'
    }).then((result) => {
      if (result.isConfirmed) {
        this.generatePay(jsonbody)
      }
      else if ( result.isDismissed) {
        this.generarLinkPago()
      }
    })
  }

  generatePay(jsonbody){
    this.spinner.show();
    this.service.generarPagoPreventa(jsonbody).subscribe(data => {
      if (data['success'] === true) {
        if(data['data']['object'] === 'error'){
          this.formGenerate.reset();
          this.closeModalPay();
          this.spinner.hide();
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "¡No se pudo generar el codigo, inténtelo nuevamente!",
            showConfirmButton: false,
            timer: 1500
          });
        }
        else{
          this.closeModalPay();
          let datos={
            amount: data['data'].amount,
            currency_code: data['data'].currency_code,
            description: data['data'].description,
            order_number: data['data'].id,
            client_details: {
              first_name: jsonbody.nombres,
              last_name: jsonbody.apellidos,
              email: jsonbody.email,
              phone_number: jsonbody.telefono
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
            firstName: jsonbody.nombres,
            lastName: jsonbody.apellidos,
            address: "",
            address_c: "",
            phone: jsonbody.telefono,
            email: jsonbody.email,
          }
          config_data(datos_config);
          greet(datos)
          ejecutar(null)
          // this._generate = data['data'];
          // this.closeModalPay();
          // this.formGenerate.reset();
          // this.spinner.hide();
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: "¡Genial ☺!",
          //   text: "¡Se generó código de Pago!",
          //   showConfirmButton: false,
          //   timer: 1500
          // });
          // this.rerender()
          // this.openModalPago()
        }
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
        if (error.error.message['non_field_errors']) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Error!",
            text: error.error.message['non_field_errors'][0],
            showConfirmButton: false,
            timer: 1500
          });
        }
        if (error.error['message']) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Error!",
            text: error.error.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    });
  }

  generarLinkPago(){
    this.spinner.show()
    let tipo_name
    this.tipo_matricula.forEach(i=>{
      if(this.formGenerate.controls['tipo_matricula'].value==i.id){
        tipo_name=i.name
      }
    })
    const jsonbody = {
      "id_preventa": this.formGenerate.controls['id'].value,
      "type_matricula": this.formGenerate.controls['tipo_matricula'].value,
      "tipo_matricula": tipo_name,
      "procedencia_venta": 'FICHA',
      "discount": this.discount
    };
    this.service.registrarLinkPreMatricula(jsonbody).subscribe(data => {
      if( data['success']==true){
        this.linkpago='https://app.altux.edu.pe/matricula-pago/'+data['data']
        this.copyText(this.linkpago)
        this.formGenerate.reset();
        this.discount=null;
        this.closeModalPay();
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial ☺!",
          text: "¡Link Copiado!",
          showConfirmButton: false,
          timer: 1500
        });
        this.rerender()
      }
      else {
        this.closeModalPay();
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error!",
          text: data['message'],
          showConfirmButton: false,
          timer: 1500
        });
      }
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
        if (error.error.message['non_field_errors']) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Error!",
            text: error.error.message['non_field_errors'][0],
            showConfirmButton: false,
            timer: 1500
          });
        }
        if (error.error['message']) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Error!",
            text: error.error.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
      if (error.status === 500) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "¡Error!",
          text: "Error de servidor",
          showConfirmButton: false,
          timer: 1500
        });
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

  getInfoByRuc(event){
    const inputValue = event.target.value;
    this.nameruc = null;
    if (inputValue.length === 11) {
      let ruc_consulta = {
        "tipo": "ruc",
        "documento": event.target.value
      };
      this.spinner.show();
      this.formGenerate.controls['ruc'].enable();
      this.service.getInfoDNI(ruc_consulta.tipo, ruc_consulta.documento).subscribe(data => {
        if (data['success'] === false) {
          this.nameruc = null;
          this.formGenerate.controls['ruc'].setValue('');
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
        this.formGenerate.controls['ruc'].setValue('');
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
    this.service.registrarSeguimientoFicha(this.data_detail.id, body).subscribe(data => {
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

  editCliente(){
    this.spinner.show()
    let jsonbody = {
      "is_referido": this.detalle.is_referido,
      "dni_patrocinador":  null,
      "name_patrocinador": null,
      "id_preventa": this.detalle.id,
      "name":this.detalle.name,
      "lastname":this.detalle.lastname,
      "num_document":this.detalle.num_doc,
      "num_documento_sunat": null, //docunento para emitir
      "course_code":this.detalle.courses_code,
      "pais":this.detalle.pais,
      "phone":this.formEditar.controls.telefono.value,
      "email":this.formEditar.controls.email.value,
      "type_doc":this.detalle.type_doc,
      "procedencia_venta": "FICHA",
      "grado_instruccion": this.detalle.grado_instruccion,
      "num_colegiatura": this.detalle.num_colegiatura,
      "date_call": this.detalle.date_call,
      "centro_laboral": null,
      "cargo": null,
      "area": null,
      "estado_civil": null,
      "fecha_nacimiento": null,
      "genero": null,
      "ubigeo": null,
      "direccion": null
    };
    this.service.actualizarPreVenta(jsonbody).subscribe(data => {
      if (data['success'] === true) {
        this.closeModalEdit();
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Se Actualizó los datos!',
          showConfirmButton: false,
          timer:2000
        });
        this.spinner.hide();
        this.rerender();
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
}
