import {Component, Input, Output, OnInit, TemplateRef, ViewChild, LOCALE_ID} from '@angular/core';
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import Swal from "sweetalert2";
import { registerLocaleData } from '@angular/common';
import localeEs from "@angular/common/locales/es";
import { CobranzaService } from 'src/app/cobranza/services/cobranza.service';
registerLocaleData(localeEs, 'es');

enum disabledType {
  enabled,
  disabled
}
enum checkedType {
  unchecked,
  checked
}

@Component({
  selector: 'app-comisiones-descuentos',
  templateUrl: './comisiones-descuentos.component.html',
  styleUrls: ['./comisiones-descuentos.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' },{ provide: LOCALE_ID, useValue: 'es-PE' }]
})
export class ComisionesDescuentosComponent implements OnInit {
  @ViewChild('com') private modalcontentDescuentos: TemplateRef<ComisionesDescuentosComponent>;
  private modalRefDescuentos: NgbModalRef;

  constructor(private modalService: NgbModal,config: NgbModalConfig,private fb: FormBuilder, private spinner: NgxSpinnerService,
    private Service: CobranzaService,) {
  }

  @Input()detail:any; @Input()course_code:any; @Input()id_student:any;

  formCompromiso = this.fb.group({
    fecha:['',Validators.required],
    cuotas:[false],
    rango:[null,],
    ruc:[''],
    is_factura:[false],
  });
  
  total:any; checkbox: any[] = []; arrayCheck: any = []; cuotas: any = []; id_temporal:any=null; is_pay:boolean = false; monto_final:number=0
  fecha_ahora:any=new Date(); detalle:any; text:any; pago_partes:any=false; minimo:any=0; maximo:any; descuento:any=0; mostrar_cuotas:any=false
  nameruc:any=''; validar_generar:boolean=true; mostrarSelect:boolean = false; fecha_bloquear:any; _generate;

  ngOnInit(): void {
    console.log(this.detail)
    this.listinit()
  }

  listinit(){
    this.validaciones()
    let monto=0, index=0
    let cuotas=[]
    this.detail.cuotas.forEach(i => {
      if (i.is_paid != true) {
        monto+= +i.monto_pagar;
        cuotas.push({
          num: index,
          num_cuota: i.num_cuota,
          monto_pagar: i.monto_pagar
        })
      }
      index++
    })
    this.cuotas=cuotas
    console.log(this.cuotas)
    this.total=monto
    //this.generateCheckbox()
  }

  changeCheck(event){
    if(this.formCompromiso.controls['cuotas'].value==false){
      this.formCompromiso.controls['fecha'].setValue(null)
    }
    this.mostrar_cuotas=this.formCompromiso.controls['cuotas'].value
  }

  generarPago(){
    this.spinner.show()
    if(this.pago_partes==true){
      this.pagoDividido()
    }else{
      this.pagoNoCorriente()
    }
  }

  pagoDividido(){
    let fee=[], date, payment_date
    if(this.formCompromiso.controls['fecha'].value==null){
      payment_date=[
        {
            "date" : "now"
        }
      ]
    }else{
      date= this.formCompromiso.controls['fecha'].value.replace('T', ' ');
      payment_date=[
        {
            "date" : "now"
        },
        {
            "date" : date
        }
      ]
    }
    this.cuotas.forEach(i=>{
      fee.push(i.num)
    })
    let body={
      "course_code" : this.course_code,
      "student_id" : this.detail.id,
      "fee" : fee,
      "payment_date" : payment_date
    }
    this.Service.registrarPagoNoCorrienteDividido(body).subscribe(resp=>{
      if(resp.success==true){
        this._generate = resp['data'][0];
        this.openModalCom()
        this.spinner.hide()
      }
    })
  }

  pagoNoCorriente(){
    let fee=[]
    this.cuotas.forEach(i=>{
      if(this.pago_partes==true){        
        fee.push({
          "index" : i.num,
          "discount_percentage" : 0,
          "bono_percentage" : 0
        })
      }else{
        if(i.num==7){
          fee.push({
            "index" : i.num,
            "discount_percentage" : 0,
            "bono_percentage" : 0
          })
        }else{
          fee.push({
            "index" : i.num,
            "discount_percentage" : this.descuento,
            "bono_percentage" : this.maximo-this.descuento
          })
        }
      }
    })
    let body={
      "course_code" : this.course_code,
      "student_id" : this.detail.id,
      "is_facture": this.mostrarSelect,
      "ruc": this.formCompromiso.controls['ruc'].value,
      "razon_social" : this.nameruc,
      "fee" : fee
    }
    this.Service.registrarPagoNoCorriente(body).subscribe(resp=>{
      if(resp.success==true){
        this._generate = resp['data'];
        this.openModalCom()
        this.spinner.hide()
      }
    })
  }

  optionFacture(event){
    let ischecked = event.target.checked;
    if (ischecked === true){
      this.validar_generar=false
      this.mostrarSelect = true
      this.formCompromiso.controls['ruc'].setValidators([Validators.required]);
      this.formCompromiso.controls['ruc'].updateValueAndValidity();
    }else{
      this.formCompromiso.controls['ruc'].setValidators([]);
      this.formCompromiso.controls['ruc'].updateValueAndValidity();
      this.formCompromiso.controls['ruc'].setValue('');
      this.nameruc='';
      this.mostrarSelect = false
      this.validar_generar=true
    }
  }

  getInfoByRuc(event){
    const inputValue = event.target.value;
    this.nameruc = '';
    if (inputValue.length === 11) {
      let ruc_consulta = {
        "tipo": "ruc",
        "documento": event.target.value
      };
      this.spinner.show();
      this.formCompromiso.controls['ruc'].enable();
      this.Service.getInfoDNI(ruc_consulta.tipo, ruc_consulta.documento).subscribe(data => {
        if (data['success'] === false) {
          this.nameruc = null;
          this.formCompromiso.controls['ruc'].setValue('');
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
        this.formCompromiso.controls['ruc'].setValue('');
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "error",
          title: "¡Ocurrió un error, inténtelo en un momento!",
          showConfirmButton: false,
          timer: 1500
        });
      });
    }else{      
      this.validar_generar=false
    }
  }
  
  openModalCom() {
    this.modalRefDescuentos = this.modalService.open(this.modalcontentDescuentos, { centered: true, size: 'lg', keyboard: false });
    this.modalRefDescuentos.result.then();
  }

  closeModalCom() {
    this.modalRefDescuentos.close()
  }

  validaciones(){
    this.pago_partes=false
    if(this.detail.cuotas[5].is_paid==false&&this.detail.cuotas[6].is_paid==false&&this.detail.cuotas[4].is_paid==true){
      this.text='PAGAR CUOTAS EN PARTES'
      this.pago_partes=true
    }else if(this.detail.cuotas[7].is_paid==false&&this.detail.cuotas[6].is_paid==true){
      this.pago_partes=true
    }else{
      this.maximo=30
      if(this.detail.cuotas[1].is_paid==false&&this.detail.cuotas[0].is_paid==true){
        this.maximo=40
      }
    }
    let mes
    var fecha = new Date();
    var anio = fecha.getFullYear();
    var dia = fecha.getDate();
    var _mes = fecha.getMonth();//viene con valores de 0 al 11
    _mes = _mes + 1;//ahora lo tienes de 1 al 12
    dia=dia+2
    if (_mes < 10)//ahora le agregas un 0 para el formato date
    { mes = "0" + _mes;}
    else
    { mes = _mes.toString;}
    this.fecha_bloquear = anio+'-'+mes+'-'+dia+'T05:00';
  }

  change(){
    this.descuento=this.formCompromiso.controls['rango'].value
    console.log(this.formCompromiso.controls['rango'].value)
  }
}