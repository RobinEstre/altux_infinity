import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import Swal from "sweetalert2";
declare var $: any;
import { CobranzaService } from 'src/app/cobranza/services/cobranza.service';

enum disabledType {
  enabled,
  disabled
}
enum checkedType {
  unchecked,
  checked
}

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.scss']
})
export class CuotasComponent implements OnInit {

  @ViewChild('content') private modalContent: TemplateRef<CuotasComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('pago') private modalPago: TemplateRef<CuotasComponent>;
  private modalPag: NgbModalRef;

  constructor(private modalService: NgbModal,config: NgbModalConfig,private fb: FormBuilder, private spinner: NgxSpinnerService,
    private Service: CobranzaService,) { 
  }

  @Input()detail:any; @Input()diplomado:any;

  formExcPay = this.fb.group({
    number_card: ['',],
    cvv: ['', ],
    month_expirate: [null],
    year_expirate: [null],
    ruc:[''],
    is_factura:[false],
    razon_social:['']
  });

  _generate; total:any; checkbox: any[] = [];  arrayCheck: any = []; is_pay:boolean = false; id_temporal:any=null; monto_final:number=0;
  code_diplo:any; optionCard = true; fecha_ahora:any; ocultar: boolean = true; mostrar_pago:boolean = false; mostrar_efectivo:boolean = false
  mostrarSelect:boolean = false; have_info_profile = false; monto:number=0; nameruc:any=null; validar_generar:boolean=true; 
  btnPay: any = 'Generar Pago'; linkpago:any;

  ngOnInit(): void {
    this.listinit()
  }

  ngAfterViewInit() {
    /* footable */
    /* table data master */
    $('.footable').footable({
      "paging": {
        "enabled": true,
        "container": '#footable-pagination',
        "countFormat": "{CP} of {TP}",
        "limit": 3,
        "position": "right",
        "size": 5
      },
      "sorting": {
        "enabled": true
      },
    }, function (ft: any) {
      $('#footablestot').html($('.footable-pagination-wrapper .label').html())

      $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
        setTimeout(function () {
          $('#footablestot').html($('.footable-pagination-wrapper .label').html());
        }, 200);
      });

    });

    var chosensimple: any = $('.chosenoptgroup')
    chosensimple.chosen().on('load change', function (event: any, el: any) {
      var textdisplay_element = $(".chosenoptgroup + .chosen-container .chosen-single > span");
      var selected_element = $(".chosenoptgroup option:selected");
      var selected_value = selected_element.val();
      if (selected_element.closest('optgroup').length > 0) {
        var parent_optgroup = selected_element.closest('optgroup').attr('label');
        textdisplay_element.text(parent_optgroup + ' ' + selected_value).trigger("chosen:updated");
      }
    });
  }

  listinit(){
    this.is_pay=false
    this.fecha_ahora=new Date()
    this.detail.forEach(i => {
      if (i.is_paid != true) {
        this.monto+= +i.monto_pagar;
      }
    })
    this.total=this.monto+'.00'
    this.generateCheckbox()
  }

  generateCheckbox(){
    try {
      var cantidad = this.detail.length;
      this.id_temporal = null

      for (let i = 0; i < cantidad; i++) {
        if (this.detail[i]["is_paid"] == false && this.id_temporal == null) {
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
    }
  }

  updateCheckbox(id, event){
    var indice = id;
    if (event.target.checked == true) {
      this.is_pay=true;
      if (indice == this.detail.length-1) {
        this.checkbox[indice].is_checked = checkedType.checked;
        this.monto_final+= +this.detail[indice]['monto_pagar'];
        return;
      }
      this.checkbox[indice + 1].is_disabled = disabledType.enabled;
      this.checkbox[indice].is_checked = checkedType.checked;
      this.monto_final+= +this.detail[indice]['monto_pagar'];
    }
    else if (event.target.checked == false){
      for (let i = id+1; i < this.detail.length; i++) {
        if(this.checkbox[i].is_checked == true){
          this.monto_final-= +this.detail[i]['monto_pagar'];
        }
        this.checkbox[i].is_disabled = disabledType.disabled;
        this.checkbox[i].is_checked = checkedType.unchecked;
      }
      if(this.checkbox[id] == this.checkbox[this.id_temporal]){
        this.is_pay=false
      }
      if(this.checkbox[id].is_checked == true){
        this.monto_final-= +this.detail[id]['monto_pagar'];
      }
      this.checkbox[id].is_checked = checkedType.unchecked;
    }
  }

  openModalInfo(code) {
    this.modalRef = this.modalService.open(this.modalContent, {centered: true, size: 'md'});
    this.modalRef.result.then();
    this.code_diplo=code

    var cantidad = this.detail.length;
    for (let i = 0; i < cantidad; i++) {
      if(this.checkbox[i].is_checked===1){
        this.arrayCheck.push(i);
      }
    }
  }

  closeModal() {
    this.mostrar_pago=false;
    this.mostrar_efectivo=false;
    this.arrayCheck=[];
    this.mostrarSelect=false;
    this.modalRef.close();
  }

  openModalPago() {
    this.modalPag = this.modalService.open(this.modalPago, {backdrop : 'static', centered: true, keyboard: false,
    windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalPag.result.then();
  }

  closeModalPago() {
    this.modalPag.close();
  }

  exectPayment(){
    /*if (this.methodPay === 'card') {
      this.payWithCard();
    }else {*/
    this.payWithEfective();
    //}
  }

  payWithEfective(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-warning'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Elegir El Método De Pago',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '💰 PagoEfectivo',
      cancelButtonText: '💳 Tarjetas'
    }).then((result) => {
      if (result.isConfirmed) {
        this.realizarpagoEfectivo()
      }
      else if ( result.isDismissed) {
        this.generarLinkPago()
      }
    })
  }

  generarLinkPago(){
    this.spinner.show()
    const jsonbody = {
      "student_id": this.diplomado.id,
      "indice": this.arrayCheck,
      "codigo_diplomado": this.diplomado.code_course
    };
    this.Service.linkPago(jsonbody).subscribe(data => {
      if( data['success']==true){data['data']
        this.linkpago='https://app.altux.edu.pe/matricula-pago/'+data['url_generado']
        this.copyText(this.linkpago)
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Link Copiado!',
          showConfirmButton: false,
          timer:2000
        });
        this.closeModal();
        for (let i = 0; i < this.detail.length; i++) {
          this.checkbox[i].is_disabled = disabledType.disabled;
          this.checkbox[i].is_checked = checkedType.unchecked;
        }
        this.generateCheckbox()
        this.spinner.hide()
      }
      else {
        Swal.fire(
            'Error!',
            ''+data['message'],
            'error'
        )
        this.closeModal();
        for (let i = 0; i < this.detail.length; i++) {
          this.checkbox[i].is_disabled = disabledType.disabled;
          this.checkbox[i].is_checked = checkedType.unchecked;
        }
        this.generateCheckbox()
        this.spinner.hide()
      }
    })
  }

  realizarpagoEfectivo(){
    this.spinner.show()
    let ruc = this.formExcPay.controls['ruc'].value
    if (this.formExcPay.controls['is_factura'].value && ruc.length != 11) {
      Swal.fire(
          'No se puede generar el código de pago!',
          '¡El RUC debe contener 11 caracteres!',
          'error'
      )
    }
    const jsonbody = {
      "indice": this.arrayCheck,
      "is_facture": this.formExcPay.controls['is_factura'].value,
      "ruc": this.formExcPay.controls['ruc'].value,
      "razon_social" : this.nameruc,
      "codigo_diplomado" : this.diplomado.code_course,
      "estudiante_id": this.diplomado.id
    };
    this.Service.postPagoEfectivo(jsonbody).subscribe(data => {
      this.closeModal()
      if (data['success'] === true) {
        this.is_pay=false
        this._generate = data['data'];
        for (let i = 0; i < this.detail.length; i++) {
          this.checkbox[i].is_disabled = disabledType.disabled;
          this.checkbox[i].is_checked = checkedType.unchecked;
        }
        this.generateCheckbox()
        this.openModalPago()
        this.spinner.hide()
      }
    });
  }

  optionFacture(event){
    let ischecked = event.target.checked;
    if (ischecked === true){
      this.validar_generar=false
      this.mostrarSelect = true
      this.formExcPay.controls['ruc'].setValidators([Validators.required]);
      this.formExcPay.controls['ruc'].updateValueAndValidity();
    }else{
      this.formExcPay.controls['ruc'].setValidators([]);
      this.formExcPay.controls['ruc'].updateValueAndValidity();
      this.formExcPay.controls['ruc'].setValue('');
      this.nameruc='';
      this.mostrarSelect = false
      this.validar_generar=true
    }
  }

  getInfoByRuc(event){
    const inputValue = event.target.value;
    this.nameruc = '';
    if (inputValue.length === 11) {
      this.spinner.show();
      let ruc_consulta = {
        "tipo": "ruc",
        "documento": event.target.value
      };
      this.formExcPay.controls['ruc'].enable();
      this.Service.getInfoDNI(ruc_consulta.tipo, ruc_consulta.documento).subscribe(data => {
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
        else if (data['data'].resultado['estado']=='ACTIVO'){
          this.nameruc = data['data'].resultado['razon_social'];
          this.validar_generar=true
          this.have_info_profile=true;
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
        this.formExcPay.controls['ruc'].setValue('');
        Swal.fire({
          position: "center",
          icon: "error",
          title: "¡Ocurrió un error, inténtelo en un momento!",
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      });
    }else{      
      this.validar_generar=false
    }
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
