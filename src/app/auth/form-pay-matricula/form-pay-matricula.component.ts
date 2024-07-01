import {Component, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {MatriculaService} from "../services/matricula.service";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');
//Import Culqi
import { greet } from '../../../assets/js/service.js';
import { config_data } from '../../../assets/js/config.js';
import { ejecutar } from '../../../assets/js/checkout.js';

// import Swiper core and required modules
import SwiperCore, { Swiper, Autoplay, Pagination, Navigation } from "swiper";
import { LocalhostKeys } from 'src/app/shared/enum/localhost-keys';
import { SwiperComponent } from 'swiper/angular';
// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-form-pay-matricula',
  templateUrl: './form-pay-matricula.component.html',
  styleUrls: ['./form-pay-matricula.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class FormPayMatriculaComponent implements OnInit {
  @ViewChild('content') private modalContent: TemplateRef<FormPayMatriculaComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('pago') private modalContentPago: TemplateRef<FormPayMatriculaComponent>;
  private modalRefPago: NgbModalRef;
  @ViewChild(SwiperComponent) swiper: SwiperComponent;
  code:any
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private routes: Router, config: NgbModalConfig, private modalService: NgbModal,
    public service: MatriculaService, private spinner: NgxSpinnerService,) {
    this.code = this.route.snapshot.params['code']
    this.themeColor = localStorage.getItem(LocalhostKeys.THEME_COLOR) ?? 'theme-blue';
  }

  formMatricula = this.fb.group({
    telefono: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    dni: [''],
    pais: [''],
  });
  formExcPay = this.fb.group({
    number_card: ['',],
    cvv: ['', ],
    month_expirate: [null],
    year_expirate: [null],
  });

  vendedor:any; mostrarDiscount:boolean = false; mostrar_efectivo: boolean = false; optionCard = true; optionEfectivo = false; precio_pago:any; discount:any; data:any;
  tipo_pago:any; btnPay:any; arrayMes:any=[]; fechanual:any=[]; methodPay = 'card'; mostrar_pago: boolean = false; jsonbody:any; _generate:any; isFullScreen: boolean = false;

  pagination = {
    el: '.pagination-wrap',
    clickable: true,
    bulletClass: "swiper-pagination-bullet mx-1 ",
  };
  navigation = {
    nextEl: '.btn-next',
    prevEl: '.btn-prev',
  }
  themeColor = 'theme-blue';
  userName = '';
  domain = 'finance'; validar_expirado:boolean=false; imagen_vendedor:any

  ngOnInit(): void {
    //window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    this.listInit()
    this.loadMonth()
    this.loadyear()
  }
  
  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  handleBeforeUnload(event: BeforeUnloadEvent) {
    console.log(this.validar_expirado)
    if (this.validar_expirado) {
      console.log("La página está a punto de cerrarse o recargarse.");
      return Swal.fire("La página está a punto de cerrarse o recargarse.");
    }else{
      //return Swal.fire('Aqui no pasa nada')
    }
  }

  slideChange(event) {
    if(event[0].activeIndex==1){
      //console.log('data 1')
      var x = document.getElementsByClassName("btn-next");
      for (let i = 0; i < x.length; i++) {
        (<HTMLElement>x[i]).setAttribute("disabled", "disabled");
      }
    }
    if(event[0].activeIndex==2){
      var x = document.getElementsByClassName("btn-prev");
      for (let i = 0; i < x.length; i++) {
        (<HTMLElement>x[i]).setAttribute("disabled", "disabled");
      }
      return
    }    
    // document.getElementsByClassName('btn-next')[0].classList.remove('d-none');
    // document.getElementsByClassName('btn-summary')[0].classList.add('d-none')
  }

  reachEnd() {
    // setTimeout(() => {
    //   document.getElementsByClassName('btn-next')[0].classList.add('d-none');
    //   document.getElementsByClassName('btn-summary')[0].classList.remove('d-none')
    // }, 50);
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

  listInit(){
    this.spinner.show();
    this.service.listFomularioLink(this.code).subscribe(data => {
      if(data["success"]==true){
        this.data=data['data']['data_matricula']
        //console.log(this.data)
        let img_perfil
        data['data'].user.detail_user.img_perfil.forEach(i=>{
          if(i.is_active){img_perfil=i.url}
        })
        this.imagen_vendedor=img_perfil
        //const split = this.data.discount.diplomado_name.split(' ')
        // split.splice(0, 3);
        // let name=split.map(x=>x).join(" ")
        // this.data.discount.diplomado_name=name
        this.vendedor=data['data']['user']
        this.discount=data['data']['data_matricula']['discount']
        if (this.discount['first_payment'] === 0) {
          this.mostrarDiscount = false;
          this.precio_pago = 'S/' + this.discount['total_payment'] + '.00';
        }
        else {
          this.mostrarDiscount = true;
          this.precio_pago = 'S/' + this.discount['first_payment'] + '.00';
        }
        this.formMatricula.controls['dni'].setValue(data['data']['data_matricula']['num_documento'])
        this.formMatricula.controls['telefono'].setValue(data['data']['data_matricula']['telefono'])
        this.formMatricula.controls['email'].setValue(data['data']['data_matricula']['email'])
        this.formMatricula.controls['pais'].setValue('Perú')
        this.formExcPay.controls['month_expirate'].setValue('');
        this.formExcPay.controls['year_expirate'].setValue('');
        if(data['data']['data_matricula']['pais']){
          this.formMatricula.controls['pais'].setValue(data['data']['data_matricula']['pais'])
        }
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡URL Válida!',
          showConfirmButton: false,
          timer:1500
        });
        this.spinner.hide();
      }
      else{
        Swal.fire({
          position: "center",
          icon: "warning",
          title: '¡La URL no existe!',
          showConfirmButton: false,
          timer:1500
        });
        return this.routes.navigate(['/']);
      }
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
        if (error.error['message']) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: '¡Oops!',
            text: error.error['message'],
            showConfirmButton: false,
            timer:1500
          });
        }
      }
    });
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

  modalPago(){
    this.openModalInfo()
    this.formExcPay.reset();
  }

  openModalInfo() {
    this.modalRef = this.modalService.open(this.modalContent, { centered: true, size: 'md' });
    this.modalRef.result.then();
    this.card();
  }

  card(){
    this.tipo_pago='card';
    this.optionCard = true;
    this.optionEfectivo = false;
    this.btnPay = 'Pagar';
    this.formExcPay.controls['number_card'].setValidators([Validators.required]);
    this.formExcPay.controls['month_expirate'].setValidators([Validators.required]);
    this.formExcPay.controls['year_expirate'].setValidators([Validators.required]);
    this.formExcPay.controls['cvv'].setValidators([Validators.required]);
    this.formExcPay.controls['number_card'].updateValueAndValidity();
    this.formExcPay.controls['month_expirate'].updateValueAndValidity();
    this.formExcPay.controls['year_expirate'].updateValueAndValidity();
    this.formExcPay.controls['cvv'].updateValueAndValidity();
  }

  // CULQI NUEVO

  exectPayment(){
    if(this.data.data_cuota1){this.payWithCuota();}else{this.payWithVentas();}
    // if (this.domain == 'finance') {
    //   this.payWithCard();
    // }else {
    //   this.payWithEfective();
    // }
  }

  payWithVentas(){
    this.body();
    this.generateCheckout(this.jsonbody);
  }

  payWithCuota(){
    this.body();
    this.generateCheckoutCuota(this.jsonbody);
  }

  payWithCard() {
    this.body();
    this.realizarMatricula(this.jsonbody);
  }

  body(){
    let num_documento_sunat, razon, tipo_pago, tipo_matricula, date, procedencia='FICHA'
    if(this.data.procedencia_venta!=''){procedencia=this.data.procedencia_venta}
    if(this.data.is_facture==true){
      num_documento_sunat = this.data.num_documento_sunat
    }else {
      num_documento_sunat = null
    }
    if( this.data.rzon_social){
      razon= this.data.rzon_social
    }else {razon=''}
    if (this.domain == 'finance') {tipo_pago='card'}else {tipo_pago='efective'}
    if( this.data.type_matricula){tipo_matricula= this.data.type_matricula}else{tipo_matricula= this.data.tipo_matricula}
    if( this.data.date_nex_payment){date= this.data.date_nex_payment}else{date= null}    
    this.jsonbody = {
      "diplomado_code": this.data.diplomado_code,
      "type_pay": 'efective',
      "pais": this.data.pais,
      "tipoDoc": this.data.tipoDoc,
      "num_documento": this.data.num_documento,
      "num_documento_sunat": this.data.num_documento_sunat,
      "email": this.formMatricula.controls['email'].value,
      "telefono": this.formMatricula.controls['telefono'].value,
      "nombres": this.data.nombres,
      "apellidos": this.data.apellidos,
      "is_facture": this.data.is_facture,
      "num_ruc": num_documento_sunat,
      "rzon_social": razon,
      "date_nex_payment": date,
      "type_matricula": tipo_matricula,
      "id_student": this.data.id_student,
      "is_referido": this.data.is_referido,
      "dni_patrocinador": this.data.dni_patrocinador,
      "name_patrocinador": this.data.name_patrocinador,
      "procedencia_venta": procedencia,
      "grado_instruccion": this.data.grado_instruccion,
      "num_colegiatura": this.data.num_colegiatura,
      "id_vendedor": this.vendedor.id,
      "tarjeta": {
        "number_card": this.formExcPay.controls['number_card'].value,
        "card_ccv": this.formExcPay.controls['cvv'].value,
        "card_exp_month": this.formExcPay.controls['month_expirate'].value,
        "email": this.formMatricula.controls['email'].value,
        "exp_year": this.formExcPay.controls['year_expirate'].value,
      }
    };
  }

  generateCheckout (jsonbody){
    this.spinner.show();
    this.service.registrarMatricula(jsonbody).subscribe(async data => {
      if(data['data']['object']=='error'){
        this.formExcPay.controls['month_expirate'].setValue('');
        this.formExcPay.controls['year_expirate'].setValue('');
        this.formExcPay.reset();
        Swal.fire({
          position: "center",
          icon: "warning",
          title: '¡Error!',
          text: '¡No se pudo generar el checkout, inténtelo nuevamente!',
          showConfirmButton: false,
          timer:2000
        });
        this.spinner.hide();
        return
      }
      else if (data['success']==true){
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
            tarjeta: true,
            yape: true,
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
        ejecutar(this.code)
        //this.swiper.swiperRef.slideNext();
        //let event=[{activeIndex: 2}]
        //this.slideChange(event) 
        //this.formExcPay.reset();
        //this.codigoExpirado()
        //console.log(greet(data['data']));
        //this._generate = data['data'];
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
        if (error.error['message']) {
          if (error.error['message']) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: '¡Oops!',
              text: error.error['message'],
              showConfirmButton: false,
              timer:1500
            });
          }
        }
      }
    });
  }

  generateCheckoutCuota (jsonbody){
    const body = {
      "id_preventa": this.data.data_cuota1.id_preventa,
      "is_facture": this.data.data_cuota1.is_facture,
      "num_doc": this.data.data_cuota1.num_doc,
      "razon_zocial": this.data.data_cuota1.razon_zocial,
      "vendedor_id": this.vendedor.id,
    };
    this.service.generarSegundoPago(body).subscribe(data => {
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
          this.spinner.hide();
          return
        }
        else{
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
              tarjeta: true,
              yape: true,
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
          ejecutar(this.code)
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
      this.spinner.hide();
    });
  }

  realizarMatricula(jsonbody){
    this.spinner.show();
    this.service.registrarMatricula(jsonbody).subscribe(data => {
      if(this.jsonbody.type_pay == 'efective'){
        if(data['data']['object']=='error') {
          this.formExcPay.controls['month_expirate'].setValue('');
          this.formExcPay.controls['year_expirate'].setValue('');
          this.formExcPay.reset();
          Swal.fire({
            position: "center",
            icon: "warning",
            title: '¡Error!',
            text: '¡No se pudo generar el codigo, inténtelo nuevamente!',
            showConfirmButton: false,
            timer:2000
          });
          return
        }
        else if (data['success']==true){
          this.swiper.swiperRef.slideNext();
          let event=[{activeIndex: 2}]
          this.slideChange(event) 
          this.formExcPay.reset();
          this.codigoExpirado()
          Swal.fire({
            position: "center",
            icon: "success",
            title: '¡Genial ☺!',
            text: '¡Se Generó Código de Pago!',
            showConfirmButton: false,
            timer:2000
          });
          this._generate = data['data'];
        }
      }
      else{
        if (data['data']['object']=='error') {
          this.formExcPay.controls['month_expirate'].setValue('');
          this.formExcPay.controls['year_expirate'].setValue('');
          this.spinner.hide();
          this.formExcPay.reset();
          Swal.fire({
            position: "center",
            icon: "warning",
            title: '¡Error!',
            text: data['data']['user_message'],
            showConfirmButton: false,
            timer:2000
          });
        }
        else{
          this.formExcPay.reset();
          this.swiper.swiperRef.slideNext();
          let event=[{activeIndex: 2}]
          this.slideChange(event) 
          this.codigoExpirado()
          Swal.fire({
            position: "center",
            icon: "success",
            title: '¡Genial ☺!',
            text: '¡Pago Realizado!',
            showConfirmButton: false,
            timer:2000
          });
        }
      }
      this.formExcPay.controls['month_expirate'].setValue('');
      this.formExcPay.controls['year_expirate'].setValue('');
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      if (error.status === 400) {
        if (error.error['message']) {
          if (error.error['message']) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: '¡Oops!',
              text: error.error['message'],
              showConfirmButton: false,
              timer:1500
            });
          }
        }
      }
    });
  }

  codigoExpirado(){
    const jsonbody={
      "url_matricula" : this.code,
      "estado" : "consumed"
    }
    this.service.expirarCodigo(jsonbody).subscribe(data => {
      if(data['success']==true){
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Realizado!',
          showConfirmButton: false,
          timer:2000
        });
        //return this.routes.navigate(['/']);
      }
      else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: '¡Error!',
          text: data['message'],
          showConfirmButton: false,
          timer:2000
        });
      }
    })
  }

  openModalPago() {
    this.modalRefPago = this.modalService.open(this.modalContentPago, { centered: true, size: 'lg' });
    this.modalRefPago.result.then();
  }

  closeModal() {
    this.formExcPay.reset();
    this.modalRef.close();
    this.mostrar_pago=false;
    this.mostrar_efectivo=false;
  }

  closeModalPago() {
    this.modalRefPago.close();
  }

  copyToClipboard() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this._generate['payment_code'];
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    Swal.fire({
      position: "center",
      icon: "success",
      title: '¡Código Copiado!',
      showConfirmButton: false,
      timer:2000
    });
  }
}
