import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { VentasService } from '../../service/ventas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  @ViewChild('modal_ficha') private modalContent: TemplateRef<RegistroComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('modal_pago') private modalContentPago: TemplateRef<RegistroComponent>;
  private modalRefPago: NgbModalRef;
  active = 1;

  constructor(private service: VentasService, private spinner: NgxSpinnerService,private modalService: NgbModal,private fb: FormBuilder,) { }

  formRegistro = this.fb.group({
    id:[null],
    is_referido: [false,],
    is_factura: [false,],
    patrocinador: ['',],
    dni: [''],
    nombres: ['',],
    apellidos: ['',] ,
    telefono: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    num_doc: ['',],
    nombrescompletos:['',],
    name1:[''],
    name2:[''],
    num_colegiatura: ['',],
    datecall: ['',],
    fecha: [''],
    otro_laboral: [null,],
    ruc: ['',],
    // SELECTS
    pais: [''],
    tipo_matricula: [''],
    diplomado: [''],
    tip_doc: [''],
    procedencia_venta:[''],
    cargo:[''],
    grado_instruccion:[''],
    centro_laboral: ['',],
    area: ['',]
  });

  new_diplomados: any[] = []; isperu = true; nameperson: any; dni_consulta:any; mostrarColegiatura: boolean = false; grado:any;
  centro: boolean = false; area: boolean = false; centro_laboral:any; otroLabor:boolean=false; area_trabajo:any; ficha: boolean = false; 
  procedencia:any; tipo_documento:any; select_diplomado:any; discount: any;mostrarDiscount:boolean = false; precio_pago:string ='';
  mostrarDate: boolean = false;nombre_descuento:any;is_facture: boolean = false;nameruc:any; _generate:any
  documento:any = [
    {
      'id': '4',
      'name_doc': 'Carnet de Extranjeria',
    },
    {
      'id': '7',
      'name_doc': 'Pasaporte',
    }
  ];
  countries:any=[
    {
      'id': '1',
      'name': 'Perú',
      'img' : 'https://s.latamairlines.com/images/flags/pe.svg'
    },
    {
      'id': '2',
      'name': 'Extranjero',
      'img': 'https://s.latamairlines.com/images/flags/ve.svg'
    },
  ];
  procedencia_venta:any=[
    {'name': 'LEADS'},
    {'name': 'POST OEA'},
    {'name': 'POST EXTERNO'},
    {'name': 'TRABAJO DE CAMPO'},
    {'name': 'BASE ANTERIOR'}
  ];
  grado_instruccion:any=[
    {'name': 'LICENCIADO'},
    {'name': 'COLEGIADO'},
    {'name': 'BACHILLER'},
    {'name': 'TÉCNICO'},
    {'name': 'ESTUDIANTE'}
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
  tipo_matricula: any[] = [
    {
      'id': 'prematricula',
      'name': 'Matrícula',
    },
    {
      'id': 'matriculacuota',
      'name': 'Matricula + 1° Mensualidad',
    },
    {
      'id': 'matriculacontado',
      'name': 'Al Contado',
    },
  ];

  ngOnInit(): void {
    this.listarTodosLosDiplomados();
  }

  listarTodosLosDiplomados(){
    this.formRegistro.controls['pais'].setValue('Perú')
    this.service.list_diplomados().subscribe(data => {
      if (data['success'] === 'true'){
        let dip:any=[];
        data['courses'].forEach(i=>{
          const split = i.diplomado_name.split(' ')
          split.splice(0, 3);
          let name=split.map(x=>x).join(" ")
          dip.push({
            'course_name': name,
            'course_code': i.diplomado_code
          })
        })
        this.new_diplomados=dip;
      }
    }, error => {
    });
    this.service.getCentroLaboral().subscribe(data => {
      if (data['success'] === true){
        this.centro_laboral = data['data'];
        this.centro_laboral.push({
          nombre: 'OTROS'
        })
      }
    });
    this.service.getArea().subscribe(data => {
      if (data['success'] === true){
        this.area_trabajo = data['data'];
      }
    });
  }

  openModal(){
    this.reset()
    this.modalRef = this.modalService.open(this.modalContent, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRef.result.then();
  }

  closeModal(){
    this.modalRef.close()
  }

  openModalInfo() {
    this.modalRefPago = this.modalService.open(this.modalContentPago, { centered: true, size: 'lg' });
    this.modalRefPago.result.then();
  }

  closeModalInfo() {
    this.modalRefPago.close();
  }

  reset(){
    this.formRegistro.reset()
    this.formRegistro.controls['pais'].setValue('Perú')
    this.formRegistro.controls['tipo_matricula'].disable()
    this.formRegistro.controls['tipo_matricula'].setValue('')
    this.formRegistro.controls['diplomado'].setValue('')
    this.formRegistro.controls['tip_doc'].setValue('')
    this.formRegistro.controls['procedencia_venta'].setValue('')
    this.formRegistro.controls['cargo'].setValue('')
    this.formRegistro.controls['grado_instruccion'].setValue('')
    this.formRegistro.controls['area'].setValue('')
    this.isperu=true
    this.mostrarColegiatura=false
    this.centro=false
    this.area=false
    this.otroLabor=false
    this.ficha=false
    this.mostrarDate=false
    this.mostrarDiscount=false
    this.is_facture=false
    this.discount=null
    this.nameperson=null
    this.nameruc=null
  }

  getInfoByDni(event){
    this.dni_consulta= event.target.value
    let dni_consulta = {
      "tipo": "dni",
      "documento": event.target.value
    };
    this.formRegistro.controls['nombrescompletos'].setValue('');
    this.nameperson = null;
    if (this.dni_consulta.length === 8) {
      this.spinner.show();
      this.formRegistro.controls['dni'].disable();
      this.service.validarDNI(this.dni_consulta).subscribe(data => {
        if (data['success'] === true){
          let dniexist = data['data'];
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Estudiante ya existe!",
            showConfirmButton: false,
            timer: 1500
          });
          this.spinner.hide();
          this.nameperson = dniexist['name'] + ' ' + dniexist['lastname'];
          this.formRegistro.controls['nombrescompletos'].setValue(this.nameperson);
          this.formRegistro.controls['name1'].setValue(dniexist['name']);
          this.formRegistro.controls['name2'].setValue(dniexist['lastname']);
          this.formRegistro.controls['telefono'].setValue(dniexist['telefono']);
          this.formRegistro.controls['email'].setValue(dniexist['email']);
          this.formRegistro.controls['telefono'].disable();
          this.formRegistro.controls['email'].disable();
          this.formRegistro.controls['dni'].enable();
        }
        else{
          this.service.getInfoDNI(dni_consulta.tipo, dni_consulta.documento).subscribe(dni_val => {
            this.spinner.hide();
            this.formRegistro.controls['dni'].enable();
            if (dni_val.data['success'] === false) {
              this.nameperson = null;
              this.formRegistro.controls['dni'].setValue('');
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "¡DNI no válido!",
                showConfirmButton: false,
                timer: 1500
              });
            }else{
              let dni = {
                "dni": dni_val.data['dni'],
                "nombres": dni_val.data['nombres'],
                "apellidoPaterno": dni_val.data['apellidoPaterno'],
                "apellidoMaterno":  dni_val.data['apellidoMaterno'],
              }
              Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Consulta exitosa!",
                showConfirmButton: false,
                timer: 1000
              });
              this.nameperson = dni['nombres'] + ' ' + dni['apellidoPaterno'] + ' ' + dni['apellidoMaterno'];
              this.formRegistro.controls['nombrescompletos'].setValue(this.nameperson);
              this.formRegistro.controls['name1'].setValue(dni['nombres']);
              this.formRegistro.controls['name2'].setValue(dni['apellidoMaterno'] + ' ' + dni['apellidoMaterno']);
              this.formRegistro.controls['telefono'].enable();
              this.formRegistro.controls['email'].enable();
              this.formRegistro.controls['telefono'].setValue('');
              this.formRegistro.controls['email'].setValue('');
            }
          }, error => {
            this.nameperson = null;
            this.formRegistro.controls['dni'].setValue('');
            this.formRegistro.controls['dni'].enable();
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
      }, error => {
      });
    }
    else{
      this.formRegistro.controls['dni'].enable();
      this.formRegistro.controls['telefono'].enable();
      this.formRegistro.controls['email'].enable();
      this.formRegistro.controls['email'].setValue('');
      this.formRegistro.controls['telefono'].setValue('');
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

  selectDiplomado(event){
    this.select_diplomado=event.target.value;
    this.formRegistro.controls['tipo_matricula'].enable()
  }

  selectOption(prefijo){
    this.formRegistro.controls['nombres'].setValue('');
    this.formRegistro.controls['apellidos'].setValue('');
    this.formRegistro.controls['tip_doc'].setValue('');
    this.formRegistro.controls['num_doc'].setValue('');
    this.formRegistro.controls['dni'].setValue('');
    this.nameperson=null
    const prefx  = prefijo.target.value;
    this.formRegistro.controls['pais'].setValue(prefx);
    if (this.formRegistro.controls['pais'].value === 'Perú') {
      this.isperu = true;
      this.formRegistro.controls['telefono'].setValidators([Validators.required, Validators.minLength(9),
        Validators.maxLength(9)]);
      this.formRegistro.controls['dni'].setValidators([ Validators.minLength(8), Validators.maxLength(8),
        Validators.required]);
      this.formRegistro.controls['nombres'].clearValidators();
      this.formRegistro.controls['apellidos'].clearValidators();
      this.formRegistro.controls['tip_doc'].clearValidators();
      this.formRegistro.controls['num_doc'].clearValidators();
    }else {
      this.isperu = false;
      this.formRegistro.controls['telefono'].setValidators([ Validators.required, Validators.minLength(9),
        Validators.maxLength(15)]);
      this.formRegistro.controls['dni'].clearValidators();
      this.formRegistro.controls['nombres'].setValidators([ Validators.required]);
      this.formRegistro.controls['apellidos'].setValidators([ Validators.required]);
      this.formRegistro.controls['num_doc'].setValidators([ Validators.required, Validators.minLength(9)]);
    }
    this.formRegistro.controls['dni'].updateValueAndValidity();
    this.formRegistro.controls['telefono'].updateValueAndValidity();
    this.formRegistro.controls['nombres'].updateValueAndValidity();
    this.formRegistro.controls['apellidos'].updateValueAndValidity();
    this.formRegistro.controls['num_doc'].updateValueAndValidity();
  }

  selectTipoDoc(event) {
    this.tipo_documento=event.target.value;
  }

  selectProcedencia(event){
    this.procedencia=event.target.value;
  }

  selectArea(event){
    let area=event.target.value;
  }

  selectGrado(event){
    try {
      this.grado = event.target.value;
      this.formRegistro.controls['num_colegiatura'].setValidators([]);
      this.formRegistro.controls['num_colegiatura'].updateValueAndValidity();
      if (this.grado == 'LICENCIADO' ) {
        this.mostrarColegiatura = true
        this.formRegistro.controls['num_colegiatura'].setValidators([]);
        this.formRegistro.controls['num_colegiatura'].updateValueAndValidity();
      }else if ( this.grado == 'COLEGIADO') {
        this.mostrarColegiatura = true
        this.formRegistro.controls['num_colegiatura'].setValidators([Validators.required]);
        this.formRegistro.controls['num_colegiatura'].updateValueAndValidity();
      }else {
        this.mostrarColegiatura = false
        this.formRegistro.controls['num_colegiatura'].setValidators([]);
        this.formRegistro.controls['num_colegiatura'].updateValueAndValidity();
      }
    }
    catch (e){
      this.mostrarColegiatura = false
      this.formRegistro.controls['num_colegiatura'].setValidators([]);
      this.formRegistro.controls['num_colegiatura'].updateValueAndValidity();
    }
  }

  selectCargo(event){
    try {
      let cargo = event.target.value;
      this.centro = true
      this.formRegistro.controls['centro_laboral'].setValue('')
      this.formRegistro.controls['area'].setValue('')
      this.formRegistro.controls['centro_laboral'].setValidators([]);
      this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
      this.formRegistro.controls['area'].setValidators([]);
      this.formRegistro.controls['area'].updateValueAndValidity();
      if (cargo == 'JEFE DE DEPARTAMENTO' ) {
        this.area = false
        // this.formRegistro.controls['centro_laboral'].setValidators([Validators.required]);
        // this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
      }else if ( cargo == 'JEFE DE SERVICIO') {
        this.area = true
        // this.formRegistro.controls['centro_laboral'].setValidators([Validators.required]);
        // this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
        this.formRegistro.controls['area'].setValidators([Validators.required]);
        this.formRegistro.controls['area'].updateValueAndValidity();
      }else if ( cargo == 'ASISTENCIAL') {
        this.area = true
        // this.formRegistro.controls['centro_laboral'].setValidators([Validators.required]);
        // this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
        this.formRegistro.controls['area'].setValidators([Validators.required]);
        this.formRegistro.controls['area'].updateValueAndValidity();
      }else {
        this.area = false
        this.centro = false
        this.formRegistro.controls['centro_laboral'].setValidators([]);
        this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
        this.formRegistro.controls['area'].setValidators([]);
        this.formRegistro.controls['area'].updateValueAndValidity();
      }
    }
    catch (e){
      this.centro = false
      this.area = false
      this.formRegistro.controls['centro_laboral'].setValue('')
      this.formRegistro.controls['area'].setValue('')
      this.formRegistro.controls['centro_laboral'].setValidators([]);
      this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
      this.formRegistro.controls['area'].setValidators([]);
      this.formRegistro.controls['area'].updateValueAndValidity();
    }
  }

  selectCentro(event){
    try {
      if(event.target.value=='OTROS'){
        this.otroLabor=true
        this.formRegistro.controls['otro_laboral'].setValidators([Validators.required]);
        this.formRegistro.controls['otro_laboral'].updateValueAndValidity();
      }else{
        this.otroLabor=false
        this.formRegistro.controls['otro_laboral'].setValidators([]);
        this.formRegistro.controls['otro_laboral'].updateValueAndValidity();
      }
    }
    catch (e){
      this.otroLabor=false
      this.formRegistro.controls['otro_laboral'].setValidators([]);
      this.formRegistro.controls['otro_laboral'].updateValueAndValidity();
    }
  }

  selectMatricula(event){
    this.spinner.show();
    try {
      this.formRegistro.controls['fecha'].setValue(null);
      var tipo_matricula = event.target.value;
      const jsonbody = {
        "diplomado_code": this.select_diplomado,
        "type_matricula": tipo_matricula
      };
      this.service.listDiscount(jsonbody).subscribe(data => {
        this.discount = data['message'];
        if (data['message']['first_payment'] === 0) {
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

  select(event){
    this.ficha=event.target.checked
    if(!this.ficha){
      this.formRegistro.controls['tipo_matricula'].setValue('')
      this.formRegistro.controls['fecha'].setValue(null)
      this.discount=null
    }
    else if(this.ficha){
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

  ejecutar(){
    if(!this.ficha){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-warning',
          cancelButton: 'btn btn-dark mx-3'
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

    let pais, centro_laboral=this.formRegistro.controls['centro_laboral'].value
    pais =  this.formRegistro.controls['pais'].value;
    this.spinner.show();
    if (pais === 'Perú'){
      var nombres = this.formRegistro.controls['name1'].value;
      var apellidos= this.formRegistro.controls['name2'].value;
      var num_doc= this.formRegistro.controls['dni'].value.trim();
      var type_doc: any= '1';
    }
    else {
      var nombres = this.formRegistro.controls['nombres'].value;
      var apellidos= this.formRegistro.controls['apellidos'].value;
      var num_doc= this.formRegistro.controls['num_doc'].value.trim();
      var type_doc: any= this.tipo_documento;
    }
    if(this.formRegistro.controls['centro_laboral'].value=='OTROS'){
      centro_laboral=this.formRegistro.controls['otro_laboral'].value
    }
    let jsonbody = {
      "is_referido": false,//this.referido,
      "dni_patrocinador":  null,//this.formRegistro.controls['patrocinador'].value,
      "name_patrocinador": null,//this.namepatrocinador,
      "name":nombres,
      "lastname":apellidos,
      "num_document":num_doc,
      "num_documento_sunat": null, //docunento para emitir
      "course_code":this.select_diplomado,
      "pais":this.formRegistro.controls['pais'].value,
      "phone":this.formRegistro.controls['telefono'].value.trim(),
      "email":this.formRegistro.controls['email'].value.trim(),
      "type_doc":type_doc,
      "procedencia_venta": this.procedencia,
      "grado_instruccion": this.grado,
      "num_colegiatura": this.formRegistro.controls['num_colegiatura'].value,
      "date_call":unixtimestamp.toString(),
      "centro_laboral":centro_laboral,
      "cargo":this.formRegistro.controls['cargo'].value,
      "area":this.formRegistro.controls['area'].value,
      "estado_civil": null,
      "fecha_nacimiento": null,
      "genero": null,
      "ubigeo": null,
      "direccion": null
    };
    this.spinner.show()
    this.service.registrarPreVenta(jsonbody).subscribe(data => {
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
    let pais, ubigeo=null, civil, nacimiento=null, genero=null, direccion=null, 
    centro_laboral=this.formRegistro.controls['centro_laboral'].value, rzon_social
    pais =  this.formRegistro.controls['pais'].value;
    if (pais === 'Perú'){
      var num_doc = this.formRegistro.controls['dni'].value;
      if(this.is_facture == false){
        rzon_social = this.formRegistro.controls['nombrescompletos'].value;
        var nombre = this.formRegistro.controls['name1'].value;
        var apellidos = this.formRegistro.controls['name2'].value;
        var num_documento_sunat = this.formRegistro.controls['dni'].value.trim();
        var tipo_doc: any = '1';
        var unixtimestamp = null;
      }
      else {
        rzon_social = this.nameruc;
        var nombre = this.formRegistro.controls['name1'].value;
        var apellidos = this.formRegistro.controls['name2'].value;
        var num_documento_sunat = this.formRegistro.controls['ruc'].value;
        var tipo_doc: any = '6';
        var unixtimestamp = null;
      }
    }
    else {
      let name: any = this.formRegistro.controls['nombres'].value+' '+this.formRegistro.controls['apellidos'].value;
      rzon_social = name;
      var nombre = this.formRegistro.controls['nombres'].value;
      var apellidos = this.formRegistro.controls['apellidos'].value;
      var num_doc = this.formRegistro.controls['num_doc'].value;
      var num_documento_sunat = this.formRegistro.controls['num_doc'].value;
      var tipo_doc: any = this.tipo_documento;
      var unixtimestamp = null;
    }
    if(this.formRegistro.controls['tipo_matricula'].value=='prematricula'){
      let js=this.formRegistro.controls['fecha'].value;
      var unixtimestamp:any= (new Date(js).getTime()+960*60000)/1000
    }
    if(this.formRegistro.controls['centro_laboral'].value=='OTROS'){
      centro_laboral=this.formRegistro.controls['otro_laboral'].value
    }
    const jsonbody = {
      "id_student": this.formRegistro.controls['id'].value,
      "diplomado_code": this.select_diplomado,
      "pais": this.formRegistro.controls['pais'].value,
      "tipoDoc": tipo_doc,
      "num_documento": num_doc, // documento de identidad
      "num_documento_sunat": num_documento_sunat,   // docunento para emitir
      "email": this.formRegistro.controls['email'].value.trim(),
      "telefono": this.formRegistro.controls['telefono'].value.trim(),
      "nombres": nombre,
      "apellidos": apellidos,
      "is_facture": this.is_facture,
      "rzon_social": rzon_social,
      "date_nex_payment": unixtimestamp,
      "type_matricula": this.formRegistro.controls['tipo_matricula'].value,
      "is_referido": false, //this.referido,
      "dni_patrocinador":  this.formRegistro.controls['patrocinador'].value,
      "procedencia_venta":  this.formRegistro.controls['procedencia_venta'].value,
      "grado_instruccion": this.formRegistro.controls['grado_instruccion'].value,
      "num_colegiatura": this.formRegistro.controls['num_colegiatura'].value,
      "name_patrocinador": null, //this.namepatrocinador,
      "centro_laboral":centro_laboral,
      "cargo":this.formRegistro.controls['cargo'].value,
      "area":this.formRegistro.controls['area'].value,
      "estado_civil": civil,
      "fecha_nacimiento": nacimiento,
      "genero": genero,
      "ubigeo": ubigeo,
      "direccion": direccion
    };
    //console.log(jsonbody)
    this.spinner.show();
    this.service.registrarMatricula(jsonbody).subscribe(data => {
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
          this._generate = data['data'];
          this.closeModal();
          this.spinner.hide();
          Swal.fire({
            position: "center",
            icon: "success",
            title: '¡Genial ☺!',
            text: '¡Se generó código de Pago!',
            showConfirmButton: false,
            timer:2000
          });
          this.openModalInfo();
        }
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
    let pais, ubigeo=null, civil, nacimiento=null, genero=null, direccion=null, 
    centro_laboral=this.formRegistro.controls['centro_laboral'].value, rzon_social
    pais =  this.formRegistro.controls['pais'].value;
    if (pais === 'Perú'){
      var num_doc = this.formRegistro.controls['dni'].value;
      if(this.is_facture == false){
        rzon_social = this.formRegistro.controls['nombrescompletos'].value;
        var nombre = this.formRegistro.controls['name1'].value;
        var apellidos = this.formRegistro.controls['name2'].value;
        var num_documento_sunat = this.formRegistro.controls['dni'].value.trim();
        var tipo_doc: any = '1';
        var unixtimestamp = null;
      }
      else {
        rzon_social = this.nameruc;
        var nombre = this.formRegistro.controls['name1'].value;
        var apellidos = this.formRegistro.controls['name2'].value;
        var num_documento_sunat = this.formRegistro.controls['ruc'].value;
        var tipo_doc: any = '6';
        var unixtimestamp = null;
      }
    }
    else {
      let name: any = this.formRegistro.controls['nombres'].value+' '+this.formRegistro.controls['apellidos'].value;
      rzon_social = name;
      var nombre = this.formRegistro.controls['nombres'].value;
      var apellidos = this.formRegistro.controls['apellidos'].value;
      var num_doc = this.formRegistro.controls['num_doc'].value;
      var num_documento_sunat = this.formRegistro.controls['num_doc'].value;
      var tipo_doc: any = this.tipo_documento;
      var unixtimestamp = null;
    }
    if(this.formRegistro.controls['tipo_matricula'].value=='prematricula'){
      let js=this.formRegistro.controls['fecha'].value;
      var unixtimestamp:any= (new Date(js).getTime()+960*60000)/1000
    }
    if(this.formRegistro.controls['centro_laboral'].value=='OTROS'){
      centro_laboral=this.formRegistro.controls['otro_laboral'].value
    }
    const jsonbody = {
      "id_student": this.formRegistro.controls['id'].value,
      "diplomado_code": this.select_diplomado,
      "pais": this.formRegistro.controls['pais'].value,
      "tipoDoc": tipo_doc,
      "num_documento": num_doc, // documento de identidad
      "num_documento_sunat": num_documento_sunat,   // docunento para emitir
      "email": this.formRegistro.controls['email'].value.trim(),
      "telefono": this.formRegistro.controls['telefono'].value.trim(),
      "nombres": nombre,
      "apellidos": apellidos,
      "is_facture": this.is_facture,
      "rzon_social": rzon_social,
      "date_nex_payment": unixtimestamp,
      "is_referido": false, //this.referido,
      "dni_patrocinador":  this.formRegistro.controls['patrocinador'].value,
      "procedencia_venta":  this.formRegistro.controls['procedencia_venta'].value,
      "grado_instruccion": this.formRegistro.controls['grado_instruccion'].value,
      "num_colegiatura": this.formRegistro.controls['num_colegiatura'].value,
      "name_patrocinador": null, //this.namepatrocinador,
      "centro_laboral":centro_laboral,
      "cargo":this.formRegistro.controls['cargo'].value,
      "area":this.formRegistro.controls['area'].value,
      "estado_civil": civil,
      "fecha_nacimiento": nacimiento,
      "genero": genero,
      "ubigeo": ubigeo,
      "direccion": direccion,
      "tipo_matricula": this.formRegistro.controls['tipo_matricula'].value,
      "discount": this.discount
    };
    console.log(jsonbody)
    this.spinner.show();
    this.service.registrarLinkMatricula(jsonbody).subscribe(data => {
      if( data['success']==true){data['data']
        let linkpago='http://localhost:4200/matricula-pago/'+data['data']
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