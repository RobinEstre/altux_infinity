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

  constructor(private service: VentasService, private spinner: NgxSpinnerService,private modalService: NgbModal,private fb: FormBuilder,) { }

  formRegistro = this.fb.group({
    is_referido: ['',],
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
    datecall: ['', Validators.required],
    otro_laboral: [null,],
    // SELECTS
    pais: [''],
    diplomado: ['', Validators.required],
    tip_doc: [''],
    procedencia_venta:['', Validators.required],
    cargo:['', Validators.required],
    grado_instruccion:['', Validators.required],
    centro_laboral: ['',],
    area: ['',]
  });

  new_diplomados: any[] = []; isperu = true; nameperson: any; dni_consulta:any; mostrarColegiatura: boolean = false; grado:any;
  centro: boolean = false; area: boolean = false; centro_laboral:any; otroLabor:boolean=false; area_trabajo:any
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

  ngOnInit(): void {
    this.listarTodosLosDiplomados();
  }

  listarTodosLosDiplomados(){
    this.formRegistro.controls['pais'].setValue('Perú')
    this.service.list_diplomados().subscribe(data => {
      if (data['success'] === 'true'){
        let dip:any=[];
        data['courses'].forEach(i=>{
          var splitted = i.diplomado_name.split(" ");
          var cadena= splitted.toString();
          let nueva = 'DE: '+cadena.replace(/_|#|-|@|<>|,/g, " ")
          dip.push({
            'course_name': nueva,
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
    this.formRegistro.reset()
    this.formRegistro.controls['pais'].setValue('Perú')
    this.formRegistro.controls['diplomado'].setValue('')
    this.formRegistro.controls['tip_doc'].setValue('')
    this.formRegistro.controls['procedencia_venta'].setValue('')
    this.formRegistro.controls['cargo'].setValue('')
    this.formRegistro.controls['grado_instruccion'].setValue('')
    this.formRegistro.controls['centro_laboral'].setValue('')
    this.formRegistro.controls['area'].setValue('')
    this.modalRef = this.modalService.open(this.modalContent, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRef.result.then();
  }

  closeModal(){
    this.modalRef.close()
  }

  reset(){
    this.formRegistro.controls['nombres'].setValue('');
    this.formRegistro.controls['apellidos'].setValue('');
    this.formRegistro.controls['tip_doc'].setValue('');
    this.formRegistro.controls['num_doc'].setValue('');
    this.formRegistro.controls['dni'].setValue('');
    this.nameperson=null
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
              this.formRegistro.controls['name2'].setValue(dni['apellido_paterno'] + ' ' + dni['apellido_materno']);
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

  selectDiplomado(event){
    let select_diplomado=event.target.value;
  }

  selectOption(prefijo){
    this.reset()
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
    let tipo_documento=event.target.value;
  }

  selectProcedencia(event){
    let procedencia=event.target.value;
  }

  selectArea(event){
    let area=event.target.value;
  }

  selectGrado(event){
    try {
      this.grado = event.target.value;
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
      this.formRegistro.controls['centro_laboral'].setValue(null)
      this.formRegistro.controls['area'].setValue(null)
      this.formRegistro.controls['centro_laboral'].setValidators([]);
      this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
      this.formRegistro.controls['area'].setValidators([]);
      this.formRegistro.controls['area'].updateValueAndValidity();
      if (cargo == 'JEFE DE DEPARTAMENTO' ) {
        this.area = false
        this.formRegistro.controls['centro_laboral'].setValidators([Validators.required]);
        this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
      }else if ( cargo == 'JEFE DE SERVICIO') {
        this.area = true
        this.formRegistro.controls['centro_laboral'].setValidators([Validators.required]);
        this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
        this.formRegistro.controls['area'].setValidators([Validators.required]);
        this.formRegistro.controls['area'].updateValueAndValidity();
      }else if ( cargo == 'ASISTENCIAL') {
        this.area = true
        this.formRegistro.controls['centro_laboral'].setValidators([Validators.required]);
        this.formRegistro.controls['centro_laboral'].updateValueAndValidity();
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
      this.formRegistro.controls['centro_laboral'].setValue(null)
      this.formRegistro.controls['area'].setValue(null)
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
}
