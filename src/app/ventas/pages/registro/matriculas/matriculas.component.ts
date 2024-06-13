import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VentasService } from 'src/app/ventas/service/ventas.service';
import {DataTableDirective} from "angular-datatables";
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
registerLocaleData(localeEs, 'es');
//Import Culqi
import { greet } from '../../../../../assets/js/service.js';
import { config_data } from '../../../../../assets/js/config.js';
import { ejecutar } from '../../../../../assets/js/checkout.js';

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class MatriculasComponent implements OnInit {
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
  @ViewChild('date') private modalDate: TemplateRef<MatriculasComponent>;
  private modalFecha: NgbModalRef;
  @ViewChild('pay') private modalPayment: TemplateRef<MatriculasComponent>;
  private modalPay: NgbModalRef;
  @ViewChild('pago') private modalPago: TemplateRef<MatriculasComponent>;
  private modalPag: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private service: VentasService, private spinner: NgxSpinnerService, config: NgbModalConfig, private modalService: NgbModal,
    private fb: FormBuilder,private datePipe: DatePipe,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  formGenerate = this.fb.group({
    id:['',],
    tipo_matricula:[null],
    is_factura:[null],
    ruc:[''],
    fecha:[null]
  });
  formDate = this.fb.group({
    fecha:['',Validators.required],
  })

  matriculas:any; _generate:any; num_ruc:boolean=false; nameruc:any; data_detalle:any; mostrarSelect:boolean=false; nombre_razsocial:any

  ngOnInit(): void {
    this.listarCarteraAlumnos();
  }

  listarCarteraAlumnos(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      lengthChange: false,
      processing: true,
      language: MatriculasComponent.spanish_datatables
    }
    this.service.getMatriculas().subscribe(data => {
      if(data.success){
        data['data'].forEach(i=>{
          // const split = i.diplomado_name.split(' ')
          // split.splice(0, 3);
          // let name=split.map(x=>x).join(" ")
          // i.diplomado_name=name
        })
        this.matriculas= data.data;
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
      this.matriculas=[]
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

  openModalPay(data) {
    this.modalPay = this.modalService.open(this.modalPayment, { centered: true, size: 'md' });
    this.formGenerate.controls['id'].setValue(data.id);
    this.formGenerate.controls['ruc'].setValidators([]);
    this.formGenerate.controls['ruc'].updateValueAndValidity();
    this.nameruc='';
    this.data_detalle=data;
    // this.codigo = data.diplomado_code;
    // this.diference= reserva;
    // this.nombre = nombre;
    // this.name_diplomado = diplomado;
    // this.dni=dni;
    this.formGenerate.controls.is_factura.setValue(false);
    this.modalPay.result.then();
  }

  closeModalPay() {
    this.modalPay.close();
    this.mostrarSelect=false;
  }

  openModalPago() {
    this.modalPag = this.modalService.open(this.modalPago, { centered: true, size: 'lg' });
    this.modalPag.result.then();
  }

  closeModalPago() {
    this.modalPag.close();
  }

  openModalDate(data) {
    this.formDate.reset()
    this.data_detalle=data
    let fecha:any=this.datePipe.transform(data.recordatorio*1000,"yyyy-MM-dd")
    this.formDate.controls.fecha.setValue(fecha)
    //this.id_date=data.id
    this.modalFecha = this.modalService.open(this.modalDate, { centered: true, size: 'md' });
    this.modalFecha.result.then();
  }

  closeModalDate() {
    this.modalFecha.close();
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

  generatePay(){
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
        this.generarCodigoPago()
      }
      else if (result.isDismissed) {
        this.generarLinkPago()
      }
    })
  }

  generarCodigoPago(){
    let number_doc, raz_social
    if(this.num_ruc == false){
      number_doc=this.data_detalle.dni;
      raz_social=this.data_detalle.nombres+' '+this.data_detalle.apellidos;
    }
    else {
      number_doc=this.formGenerate.controls['ruc'].value;
      raz_social=this.nombre_razsocial;
    }
    this.spinner.show();
    const jsonbody = {
      "id_preventa": this.data_detalle.id_preventa,
      "is_facture": this.formGenerate.controls['is_factura'].value,
      "num_doc": number_doc,
      "razon_zocial": raz_social,
    };
    this.service.generarSegundoPago(jsonbody).subscribe(data => {
      if (data['success'] === true) {
        if(data['data']['object'] === 'error'){
          Swal.fire({
            position: "center",
            icon: "warning",
            title: '¡Error!',
            text: '¡No se pudo generar el codigo, inténtelo nuevamente!',
            showConfirmButton: false,
            timer:2000
          });
          this.mostrarSelect=false;
          this.spinner.hide();
          return
        }
        else{
          this.spinner.hide();
          this.mostrarSelect=false;
          this.closeModalPay();
          let datos={
            amount: data['data'].amount,
            currency_code: data['data'].currency_code,
            description: data['data'].description,
            order_number: data['data'].id,
            client_details: {
              first_name: this.data_detalle.nombres,
              last_name: this.data_detalle.apellidos,
              email: this.data_detalle.correo,
              phone_number: this.data_detalle.celular
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
            firstName: this.data_detalle.nombres,
            lastName: this.data_detalle.apellidos,
            address: "",
            address_c: "",
            phone: this.data_detalle.celular,
            email: this.data_detalle.correo,
          }
          config_data(datos_config);
          greet(datos)
          ejecutar(null)
          // this.closeModalPay()
          // this.openModalPago()
          // this.mostrarSelect=false;
          // this.formGenerate.reset();
          // this.spinner.hide();
          // this._generate = data['data'];
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: '¡Genial ☺!',
          //   text: '¡Se generó código de Pago!',
          //   showConfirmButton: false,
          //   timer:2000
          // });
        }
      }
    }, error => {
      if (error.status === 400) {
        Swal.fire({
          title: 'Error!',
          text: error.error['message'],
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#d37c0c',
          cancelButtonText: 'Cerrar'
        })
      }
      if (error.status === 500) {
        Swal.fire({
          title: 'Error!',
          text: 'Comuniquese con el Area de Sistemas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#d37c0c',
          cancelButtonText: 'Cerrar'
        })
      }
      this.closeModalPay()
      this.spinner.hide();
    });
  }

  generarLinkPago(){
    let number_doc, raz_social
    if(this.num_ruc == false){
      number_doc=this.data_detalle.dni;
      raz_social=this.data_detalle.nombres+' '+this.data_detalle.apellidos;
    }
    else {
      number_doc=this.formGenerate.controls['ruc'].value;
      raz_social=this.nombre_razsocial;
    }
    this.spinner.show();
    let body={
      "id_preventa": this.data_detalle.id_preventa,
      "diplomado_code": this.data_detalle.diplomado_code,
      "pais": "Perú",
      "tipoDoc": 1,
      "num_documento": this.data_detalle.dni,
      "num_documento_sunat": number_doc,
      "email": this.data_detalle.correo,
      "telefono": this.data_detalle.celular,
      "nombres": this.data_detalle.nombres,
      "apellidos": this.data_detalle.apellidos,
      "is_facture": this.formGenerate.controls['is_factura'].value,
      "rzon_social": raz_social,
      "pago_matricula": this.data_detalle.cuota_1,
      "tipo_matricula": 'pagomensualidad',
      "discount": {
        diplomado_name:this.data_detalle.diplomado_name,
        descuento:this.data_detalle.descuento
      },
      "data_cuota1": {
        "id_preventa": this.data_detalle.id_preventa,
        "is_facture": this.formGenerate.controls['is_factura'].value,
        "num_doc": number_doc,
        "razon_zocial": raz_social,
      }
    }
    this.spinner.show();
    this.service.registrarLinkMatricula(body).subscribe(data => {
      if( data['success']==true){
        let linkpago='https://app.altux.edu.pe/matricula-pago/'+data['data']
        this.copyText(linkpago)
        this.closeModalPay()
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

  actDatePago(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.rerenderDate(this.data_detalle.id_preventa)
    });
  }

  rerenderDate(id){
    this.spinner.show()
    var unixtimestamp= (new Date(this.formDate.controls['fecha'].value).getTime()+360*60000)/1000
    const jsonbody = {
      "preventa_id" : id,
      "next_payment" : unixtimestamp.toString(),
    };
    this.service.actFechaPago(jsonbody).subscribe(res => {
      if(res.success){
        this.formDate.reset()
        this.listarCarteraAlumnos()
        this.closeModalDate()
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Fecha Actualizada Correctamente!',
          showConfirmButton: false,
          timer:2000
        });
      }
    }, error => {
      if (error.status === 400) {
        Swal.fire({
          title: 'Error!',
          text: error.error['message'],
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#d37c0c',
          cancelButtonText: 'Cerrar'
        })
      }
      if (error.status === 500) {
        Swal.fire({
          title: 'Error!',
          text: 'Comuniquese con el Area de Sistemas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#d37c0c',
          cancelButtonText: 'Cerrar'
        })
      }
      this.closeModalDate()
      this.spinner.hide();
    });
  }
}
