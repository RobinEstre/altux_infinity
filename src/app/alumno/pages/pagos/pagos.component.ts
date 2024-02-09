import { ChangeDetectorRef, Component, Input, LOCALE_ID, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import {DataTableDirective} from "angular-datatables";
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
import { PagosService } from '../../services/pagos.service';
registerLocaleData(localeEs, 'es');
declare var $: any;

enum disabledType {
  enabled,
  disabled
}
enum checkedType {
  unchecked,
  checked
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
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
  @ViewChild('pay') private modalPayment: TemplateRef<PagosComponent>;
  private modalPay: NgbModalRef;
  @ViewChild('pago') private modalContentPago: TemplateRef<PagosComponent>;
  private modalRefPago: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private service: PagosService, private spinner: NgxSpinnerService, config: NgbModalConfig, private modalService: NgbModal, private fb: FormBuilder,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  formExcPay = this.fb.group({
    number_card: [null,],
    cvv: ['', ],
    month_expirate: [null],
    year_expirate: [null],
    ruc:[''],
    is_factura:[false],
    razon_social:['']
  });

  pagos:any=[]; data_detalle:any; courses:any; id_temporal:any=null; checkbox: any[] = []; is_pay: boolean=false; monto_final:any=0; optionCard = true; optionEfectivo = false;
  domain = 'finance';arrayMes:any=[]; fechanual:any=[]; jsonbody:any; nameruc:any; arrayCheck: any = []; id_code:any=0; _generate:any; num_ruc:any; mostrarSelect:boolean=false;

  ngOnInit(): void {
    this.getCourses()
    this.loadMonth()
    this.loadyear()
    //this.listarCarteraAlumnos();
  }
  
  loadMonth() {
    this.arrayMes.push(
        {'mes': '01'},
        {'mes': '02'},
        {'mes': '03'},
        {'mes': '04'},
        {'mes': '05'},
        {'mes': '06'},
        {'mes': '07'},
        {'mes': '08'},
        {'mes': '09'},
        {'mes': '10'},
        {'mes': '11'},
        {'mes': '12'}
    );
  }

  loadyear() {
    const d = new Date();
    const n = d.getFullYear();
    const m = d.getMonth() + 1;
    for (let i = n; i <= 2029; i++) {
      this.fechanual.push(
          {
            'year': i
          }
      );
    }
  }
  
  getCourses(){
    this.spinner.show()
    this.service.getCourses().subscribe(resp=>{
      if(resp.success){
        resp.courses.forEach(i=>{
          const split = i.course.courses_name.split(' ')
          split.pop();
          split.pop();
          split.splice(0, 3);
          let name=split.map(x=>x).join(" ")
          let modulos:any=i.course.detail.other_description.descripcion_general.num_modulos
          let porcentaje:any=(i.modulo_actual*100)/modulos
          i.porcentaje=porcentaje
          i.course.courses_name=name
        })
        this.courses=resp.courses
        this.listarPagos(resp.courses[0].course.courses_code)
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
      this.spinner.hide()
    })
  }

  listarPagos(code){
    // this.dtOptions={
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   lengthMenu: [5, 10, 25],
    //   responsive: true,
    //   processing: true,
    //   searching: false,
    //   paging: false,
    //   info: false,
    //   language: PagosComponent.spanish_datatables
    // }
    this.pagos=[]
    this.service.getPagos(code).subscribe(resp => {
      if(resp.success){
        this.pagos=resp.data;
        //this.dtTrigger.next();
        this.spinner.hide()
        this.generateCheckbox();
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
      this.pagos=[]
      this.dtTrigger.next();
      this.spinner.hide()
    });
  }

  // ngAfterViewInit() {
  // }

  // ngOnDestroy(): void {
  //   // Do not forget to unsubscribe the event
  //   this.dtTrigger.unsubscribe();
  // }

  rerender(){
    this.spinner.show()
    this.listarPagos(this.courses[this.id_code].course.courses_code)
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   // Destroy the table first
    //   dtInstance.destroy();
    //   // Call the dtTrigger to rerender again
    // });
  }

  selectDomain(domain: string) {
    this.domain = domain;
    this.optionCard = false;
    this.optionEfectivo = false;
    this.formExcPay.controls['number_card'].setValidators([]);
    this.formExcPay.controls['month_expirate'].setValidators([]);
    this.formExcPay.controls['year_expirate'].setValidators([]);
    this.formExcPay.controls['cvv'].setValidators([]);
    this.formExcPay.controls['number_card'].updateValueAndValidity();
    this.formExcPay.controls['month_expirate'].updateValueAndValidity();
    this.formExcPay.controls['year_expirate'].updateValueAndValidity();
    this.formExcPay.controls['cvv'].updateValueAndValidity();
    if(domain=='finance'){
      this.optionCard=true
      this.formExcPay.controls['number_card'].setValidators([Validators.required]);
      this.formExcPay.controls['month_expirate'].setValidators([Validators.required]);
      this.formExcPay.controls['year_expirate'].setValidators([Validators.required]);
      this.formExcPay.controls['cvv'].setValidators([Validators.required]);
      this.formExcPay.controls['number_card'].updateValueAndValidity();
      this.formExcPay.controls['month_expirate'].updateValueAndValidity();
      this.formExcPay.controls['year_expirate'].updateValueAndValidity();
      this.formExcPay.controls['cvv'].updateValueAndValidity();
    }
    else{this.optionEfectivo=true}
  }

  openModalPay() {
    //this.data_detalle=data;
    this.nameruc=null
    this.optionCard=true
    this.optionEfectivo=false
    this.arrayCheck=[]
    this.formExcPay.reset()
    this.formExcPay.controls['month_expirate'].setValue('');
    this.formExcPay.controls['year_expirate'].setValue('');

    var cantidad = this.pagos.length;
    for (let i = 0; i < cantidad; i++) {
      if(this.checkbox[i].is_checked===1){
        this.arrayCheck.push(i-1);
      }
    }
    this.generateCheckbox()

    this.modalPay = this.modalService.open(this.modalPayment, { centered: true, size: 'md' });
    this.modalPay.result.then();
  }

  closeModalPay() {
    this.modalPay.close();
  }

  openModalPago() {
    this.modalRefPago = this.modalService.open(this.modalContentPago, { centered: true, size: 'lg' });
    this.modalRefPago.result.then();
  }

  closeModalPago() {
    this.modalRefPago.close();
  }

  changeSlide(event){
    this.id_code=event[0].activeIndex
    this.spinner.show()
    this.listarPagos(this.courses[this.id_code].course.courses_code)
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   // Destroy the table first
    //   dtInstance.destroy();
    //   // Call the dtTrigger to rerender again
    // });
  }

  optionFacture(event){
    let ischecked = event.target.checked;
    this.num_ruc=ischecked;
    if (ischecked === true){
      this.mostrarSelect = true
      this.formExcPay.controls['ruc'].setValidators([Validators.required,Validators.minLength(11), Validators.maxLength(11)]);
      this.formExcPay.controls['ruc'].updateValueAndValidity();
    }else{
      this.formExcPay.controls['ruc'].setValidators([]);
      this.formExcPay.controls['ruc'].updateValueAndValidity();
      this.formExcPay.controls['ruc'].setValue('');
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
      this.formExcPay.controls['ruc'].enable();
      this.service.getInfoDNI(ruc_consulta.tipo, ruc_consulta.documento).subscribe(data => {
        if (data['success'] === false) {
          this.nameruc = null;
          this.formExcPay.controls['ruc'].setValue('');
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "¡RUC no encontrado!",
            showConfirmButton: false,
            timer: 1500
          });
        }
        else if (data['data']['estado']=='ACTIVO'){
          //this.rucexist = data;
          this.nameruc = data['data']['razonSocial'];
          console.log(this.nameruc)
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡RUC encontrado!",
            showConfirmButton: false,
            timer: 1500
          });
        }
        else if (data['data']['estado'] !='ACTIVO') {
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
        this.formExcPay.controls['ruc'].setValue('');
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

  generateCheckbox(){
    try {
      var cantidad = this.pagos.length;
      this.id_temporal = null
      for (let i = 0; i < cantidad; i++) {
        if (this.pagos[i].estado_pago == false && this.id_temporal == null) {
          this.id_temporal = i
        }
        this.checkbox.push({
          "id": i,
          "is_disabled": disabledType.disabled,
          "is_checked": checkedType.unchecked
        });
      }
      if (this.checkbox[this.id_temporal].is_disabled == disabledType.disabled) {
        this.checkbox[this.id_temporal].is_disabled = disabledType.enabled;
      }
    }
    catch (e) {
      return
    }
  }

  updateCheckbox(id, event){
   // console.log(this.id_temporal)
   console.log(event)
    var indice = id;
    if (event.target.checked == true) {
      this.is_pay=true;
      if (indice == this.pagos.length-1) {
        this.checkbox[indice].is_checked = checkedType.checked;
        this.monto_final+= +this.pagos[indice]['saldo'];
        return;
      }
      this.checkbox[indice + 1].is_disabled = disabledType.enabled;
      this.checkbox[indice].is_checked = checkedType.checked;
      this.monto_final+= +this.pagos[indice]['saldo'];
    }
    else if (event.target.checked == false){
      for (let i = id+1; i < this.pagos.length; i++) {
        if(this.checkbox[i].is_checked == true){
          this.monto_final-= +this.pagos[i]['saldo'];
        }
        this.checkbox[i].is_disabled = disabledType.disabled;
        this.checkbox[i].is_checked = checkedType.unchecked;
      }
      if(this.checkbox[id] == this.checkbox[this.id_temporal]){
        this.is_pay=false
        this.monto_final=0
        return;
      }
      if(this.checkbox[id].is_checked == true){
        this.monto_final-= +this.pagos[id]['saldo'];
      }
      this.checkbox[id].is_checked = checkedType.unchecked;
    }
  }

  exectPayment(){
    if (this.domain == 'finance') {
      this.realizarPagoCard();
    }else {
      this.realizarpagoEfectivo();
    }
  }

  realizarPagoCard(){
    this.spinner.show()
    const jsonbody = {
      "tarjeta": {
        "number_card": this.formExcPay.controls['number_card'].value,
        "card_ccv": this.formExcPay.controls['cvv'].value,
        "card_exp_month": this.formExcPay.controls['month_expirate'].value,
        "exp_year": this.formExcPay.controls['year_expirate'].value
      },
      "indice": this.arrayCheck,
      "is_facture": this.num_ruc,
      "ruc": this.formExcPay.controls['ruc'].value,
      "codigo_diplomado": this.courses[this.id_code].course.courses_code,
      "razon_social" : this.nameruc,
    };
    this.service.postPagoTarjeta(jsonbody).subscribe(data => {
      if (data['success'] === true) {
        if (data['data']['object']=='error') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data['data']['user_message'],
          })
        }
        else{
          Swal.fire({
            icon: 'success',
            title: 'Genial!',
            text: 'Pago Realizado',
          })
        }
        for (let i = 0; i < this.pagos.length; i++) {
          this.checkbox[i].is_disabled = disabledType.disabled;
          this.checkbox[i].is_checked = checkedType.unchecked;
        }
        this.monto_final=0
        this.closeModalPay()
        this.formExcPay.reset()
        this.spinner.hide();
        this.rerender()
      }
    });
  }

  realizarpagoEfectivo(){
    this.spinner.show()
    const jsonbody = {
      "indice": this.arrayCheck,
      "is_facture": this.num_ruc,
      "ruc": this.formExcPay.controls['ruc'].value,
      "razon_social" : this.nameruc,
      "codigo_diplomado" : this.courses[this.id_code].course.courses_code
    };
    this.service.postPagoEfectivo(jsonbody).subscribe(data => {
      if (data['success'] === true) {
        this._generate = data['data'];
        this.monto_final=0
        for (let i = 0; i < this.pagos.length; i++) {
          this.checkbox[i].is_disabled = disabledType.disabled;
          this.checkbox[i].is_checked = checkedType.unchecked;
        }
        this.formExcPay.reset()
        this.closeModalPay()
        this.openModalPago()
        this.spinner.hide()
        this.rerender()
      }
    });
  }
}
