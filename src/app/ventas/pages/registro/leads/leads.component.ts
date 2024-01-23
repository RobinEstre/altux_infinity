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

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  constructor(private service: VentasService, private spinner: NgxSpinnerService,private fb: FormBuilder,private modalService: NgbModal) { }
  formSeguimiento = this.fb.group({
    estado:['',],
    reason: ['',Validators.required],
  });
  formRegistro = this.fb.group({
    tipo_matricula:['',],
    fecha: [null],
    is_factura: [false,],
    ruc: ['',],
    grado_instruccion:[''],
    cargo:[''],
    area:[''],
  });
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
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  leads:any; estado:any; ficha:boolean=false; discount:any; data_detail:any; is_facture:boolean=false; nameruc:any; mostrarDiscount:boolean=false
  mostrarDate:boolean=false; nombre_descuento:any; area_trabajo:any; area:boolean=false

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
      language: LeadsComponent.spanish_datatables
    }
    this.service.getLeads().subscribe(data => {
      if(data.success){
        let dip:any=[];
        data['data'].forEach(i=>{
          const split = i.diplomado.courses_name.split(' ')
          split.splice(0, 3);
          let name=split.map(x=>x).join(" ")
          dip.push({
            "id": i.id,
            "diplomado": i.diplomado,
            'courses_name': name,
            "estado": i.estado,
            "nombres": i.nombres,
            "apellidos": i.apellidos,
            "dni": i.dni,
            "email": i.email,
            "telefono": i.telefono,
            "seguimiento": i.seguimiento,
            "numero_colegiatura": i.numero_colegiatura,
            "procedencia": i.procedencia,
            'created_at': i.created_at,
            "updated_at": i.updated_at,
            "vendedor": i.vendedor
          })
        })
        this.leads= dip;
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
      this.leads=[]
      this.dtTrigger.next();
      this.spinner.hide()
    });
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
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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

  openModalSeguimiento(data) {
    this.formSeguimiento.controls.estado.setValue('')
    this.modalRefSeguimiento = this.modalService.open(this.modalSeguimiento,{centered: true, size: 'sm', keyboard: false, backdrop : 'static'});
    this.modalRefSeguimiento.result.then();
  }

  closeModalSeguimiento() {
    this.modalRefSeguimiento.close();
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

  selectSeguimiento(event){}

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

  saveSeguimiento(){}

  saveRegister(){
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
      "num_documento_sunat": this.data_detail.dni,
      "email": this.data_detail.email,
      "telefono": this.data_detail.telefono,
      "nombres": this.data_detail.nombres,
      "apellidos": this.data_detail.apellidos,
      "is_facture": this.is_facture,
      "rzon_social": rzon_social,
      "date_nex_payment": unixtimestamp,
      "type_matricula": this.formRegistro.controls['tipo_matricula'].value,
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
      "direccion": null
    }
  }
}
