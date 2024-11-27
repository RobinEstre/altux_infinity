import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { AlumnosService } from '../../services/alumnos.service';
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, Validators} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { Subject } from 'rxjs';
import Swal from "sweetalert2";

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss']
})
export class AlumnosComponent implements OnInit {
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
      sortAscending: ": Activar para ordenar la tabla en orden ascendente",
      sortDescending: ": Activar para ordenar la tabla en orden descendente"
    }
  }
  @ViewChild('register') private modalContent: TemplateRef<AlumnosComponent>;
  private modalRef: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings={};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder,private service: AlumnosService,private spinner: NgxSpinnerService, private modalService: NgbModal) { }

  formgrupos = this.fb.group({
    diplomado: [null]
  });
  formRegistro = this.fb.group({
    dni: [''],
    nombres: ['',],
    apellidos: ['',] ,
    telefono: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    num_doc: ['',],
    num_colegiatura: ['',],
    ruc: ['',],
    // SELECTS
    pais: [''],
    diplomado: [''],
    tip_doc: [''],
    procedencia_venta:[''],
    is_factura: [false,],
    is_comprobante: [false,],
    vendedor:[''],
    grado_instruccion:[''],
    //REGISTRO SIN COMPROBANTE
    fecha_pago:[''],
    medio_pago:[''],
    voucher:[''],
  });

  diplomado: any; estudiantes:any; isperu = true; nameperson: any; dni_consulta:any; mostrarColegiatura: boolean = false; grado:any; 
  vendedores:any; nameruc:any;is_facture: boolean = false; is_comprobante: boolean = false
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
    {'name': 'POST ALTUX'},
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
  
  ngOnInit(): void {
    this.listDiplomado()
  }

  listDiplomado(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      //dom: 'Bfrtip',
      processing: true,
      language: AlumnosComponent.spanish_datatables
    }
    this.service.listar_diplomados().subscribe(data => {
      data['data'].forEach(i=>{
        // const split = i.courses_name.split(' ')
        // split.splice(0, 3);
        // let name=split.map(x=>x).join(" ")
        // i.courses_name= name
      })
      this.diplomado = data['data'];
      this.formgrupos.controls.diplomado.setValue(this.diplomado[0].courses_code)
      this.service.listar_estudiantes(this.formgrupos.controls.diplomado.value).subscribe(data => {
        if(data['success']==true){
          this.estudiantes=data['data']
          this.dtTrigger.next();
          this.spinner.hide()
        }
      })
    });
    this.service.listar_vendedores().subscribe(data => {
      if(data['success']==true){
        this.vendedores=data['data']
      }
    })
  }

  listStudent(event){
    try{
      this.rerender()
    }catch(e){
      this.formgrupos.controls.diplomado.setValue(this.diplomado[0].courses_code)
      this.rerender()
    }
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.list()
    });
  }

  list(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      //dom: 'Bfrtip',
      processing: true,
      language: AlumnosComponent.spanish_datatables
    }
    this.service.listar_estudiantes(this.formgrupos.controls.diplomado.value).subscribe(data => {
      if(data['success']==true){
        this.estudiantes=data['data']
        this.dtTrigger.next();
        this.spinner.hide()
      }
    })
  }

  openModal(){
    this.reset()
    this.modalRef = this.modalService.open(this.modalContent, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'lg', keyboard: false });
    this.modalRef.result.then();
  }

  closeModal(){
    this.modalRef.close()
  }

  reset(){
    this.formRegistro.reset()
    this.formRegistro.controls['pais'].setValue('Perú')
    this.formRegistro.controls['diplomado'].setValue('')
    this.formRegistro.controls['tip_doc'].setValue('')
    this.formRegistro.controls['procedencia_venta'].setValue('')
    this.formRegistro.controls['grado_instruccion'].setValue('')
    this.formRegistro.controls['vendedor'].setValue('')
    this.formRegistro.controls.is_comprobante.setValue(false)
    this.formRegistro.controls.voucher.setValidators([Validators.required]);
    this.formRegistro.controls.voucher.updateValueAndValidity();
    this.formRegistro.controls.voucher.setValue('');
    this.formRegistro.controls.fecha_pago.setValidators([Validators.required]);
    this.formRegistro.controls.fecha_pago.updateValueAndValidity();
    this.formRegistro.controls.fecha_pago.setValue('');
    this.formRegistro.controls.medio_pago.setValidators([Validators.required]);
    this.formRegistro.controls.medio_pago.updateValueAndValidity();
    this.formRegistro.controls.medio_pago.setValue('');
    this.isperu=true
    this.mostrarColegiatura=false
    this.is_comprobante=false
    this.is_facture=false
    this.nameperson=null
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

  getInfoByDni(event){
    this.dni_consulta= event.target.value
    let dni_consulta = {
      "tipo": "dni",
      "documento": event.target.value
    };
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
          this.formRegistro.controls['nombres'].setValue(dniexist['name']);
          this.formRegistro.controls['apellidos'].setValue(dniexist['lastname']);
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
              this.nameperson = dni_val.data.resultado.nombre_completo;
              this.formRegistro.controls['nombres'].setValue(dni['nombres']);
              this.formRegistro.controls['apellidos'].setValue(dni['apellidoPaterno'] + ' ' + dni['apellidoMaterno']);
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
        else if (data['data'].resultado['estado']=='ACTIVO'){
          //this.rucexist = data;
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

  optionComprobante(event){
    let ischecked = event.target.checked;
    if (ischecked === true){
      this.is_comprobante = true
      this.formRegistro.controls.voucher.setValidators([]);
      this.formRegistro.controls.voucher.updateValueAndValidity();
      this.formRegistro.controls.voucher.setValue('');
      this.formRegistro.controls.fecha_pago.setValidators([]);
      this.formRegistro.controls.fecha_pago.updateValueAndValidity();
      this.formRegistro.controls.fecha_pago.setValue('');
      this.formRegistro.controls.medio_pago.setValidators([]);
      this.formRegistro.controls.medio_pago.updateValueAndValidity();
      this.formRegistro.controls.medio_pago.setValue('');
    }else{
      this.formRegistro.controls.voucher.setValidators([Validators.required]);
      this.formRegistro.controls.voucher.updateValueAndValidity();
      this.formRegistro.controls.voucher.setValue('');
      this.formRegistro.controls.fecha_pago.setValidators([Validators.required]);
      this.formRegistro.controls.fecha_pago.updateValueAndValidity();
      this.formRegistro.controls.fecha_pago.setValue('');
      this.formRegistro.controls.medio_pago.setValidators([Validators.required]);
      this.formRegistro.controls.medio_pago.updateValueAndValidity();
      this.formRegistro.controls.medio_pago.setValue('');
      this.is_comprobante = false
    }
  }

  addStudent(){
    let pais =  this.formRegistro.controls['pais'].value, rzon_social
    this.spinner.show();
    if (pais === 'Perú'){
      var nombres = this.formRegistro.controls['nombres'].value;
      var apellidos = this.formRegistro.controls['apellidos'].value;
      var num_doc= this.formRegistro.controls['dni'].value.trim();
      if(this.is_facture == false){
        rzon_social = this.formRegistro.controls['nombres'].value+' '+this.formRegistro.controls['apellidos'].value;
        var num_documento_sunat = this.formRegistro.controls['dni'].value.trim();
        var type_doc: any = '1';
      }
      else {
        rzon_social = this.nameruc;
        var num_documento_sunat = this.formRegistro.controls['ruc'].value;
        var type_doc: any = '6';
      }
    }
    else {
      rzon_social = this.formRegistro.controls['nombres'].value+' '+this.formRegistro.controls['apellidos'].value;
      var nombres = this.formRegistro.controls['nombres'].value;
      var apellidos= this.formRegistro.controls['apellidos'].value;
      var num_doc= this.formRegistro.controls['num_doc'].value.trim();
      var num_documento_sunat = this.formRegistro.controls['num_doc'].value;
      var type_doc: any= this.formRegistro.controls.tip_doc.value;
    }
    let body={
      "diplomado_code": this.formRegistro.controls.diplomado.value,
      "pais": pais,
      "tipoDoc": type_doc,
      "num_documento": num_doc,
      "num_documento_sunat": num_documento_sunat,
      "email": this.formRegistro.controls.email.value,
      "telefono": this.formRegistro.controls.telefono.value,
      "nombres": nombres,
      "apellidos": apellidos,
      "is_facture": this.is_facture,
      "solicita_comprobante": this.is_comprobante,
      //"solicita_comprobante": true,
      "rzon_social": nombres+' '+apellidos,
      "type_matricula": "matriculacuota",
      "procedencia_venta": this.formRegistro.controls.procedencia_venta.value,
      "grado_instruccion": this.formRegistro.controls.grado_instruccion.value,
      "num_colegiatura": this.formRegistro.controls.num_colegiatura.value,
      "vendedor_id": +this.formRegistro.controls.vendedor.value,
      "fecha_pago": this.formRegistro.controls.fecha_pago.value,
      "medio_pago": this.formRegistro.controls.medio_pago.value,
      "voucher": this.formRegistro.controls.voucher.value
    }
    //console.log(body)
    this.service.addEstudiante(body).subscribe(data => {
      if (data['success'] === true){
        this.closeModal();
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial ☺!',
          text: '¡Se creó nuevo estudiante!',
          showConfirmButton: false,
          timer:2000
        });
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtOptions={
            pagingType: 'full_numbers',
            pageLength: 10,
            lengthMenu: [5, 10, 25],
            //dom: 'Bfrtip',
            processing: true,
            language: AlumnosComponent.spanish_datatables
          }
          this.formgrupos.controls.diplomado.setValue(this.diplomado[0].courses_code)
          this.service.listar_estudiantes(this.diplomado[0].courses_code).subscribe(data => {
            if(data['success']==true){
              this.estudiantes=data['data']
              this.dtTrigger.next();
              this.spinner.hide()
            }
          })
        });
      }
    },error => {
      this.spinner.hide();
      if (error.status === 400) {
        if (error.error.errors) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: '¡Error!',
            text: error.error.errors,
            showConfirmButton: false,
            timer:2000
          });
        }
        //else if (error.error['message']) {
        //   Swal.fire({
        //     position: "center",
        //     icon: "error",
        //     title: '¡Error!',
        //     text: error.error['message'],
        //     showConfirmButton: false,
        //     timer:2000
        //   });
        // }else{
        //   Swal.fire({
        //     position: "center",
        //     icon: "error",
        //     title: '¡Error!',
        //     text: error.error.errors,
        //     showConfirmButton: false,
        //     timer:2000
        //   });
        // }
      }
      if (error.status === 500) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: '¡Error!',
          text: "Error de servidor comunicarse con sistemas",
          showConfirmButton: false,
          timer:2000
        });
      }
    });
  }

  generateCode(id, nombre){
    let name=nombre.student.detail_user.nombres+' '+nombre.student.detail_user.apellidos
    //console.log(this.formgrupos.controls.diplomado.value)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Reenviar Acceso',
      text: "Está Seguro de Reenviar Los Acccesos de: \n" + name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Reenviar!',
      cancelButtonText: 'No, Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reenviarAcceso(id, this.formgrupos.controls.diplomado.value)
      }
    })
  }

  reenviarAcceso(id, code){
    this.spinner.show();
    const  jsonbody={
      "codigo_diplomado" : code,
      "estudiante_id" : id
    }
    this.service.reenviarAcceso(jsonbody).subscribe(res => {
      if (res["success"] === true) {
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial!',
          text: '¡Acceso Reenviado!',
          showConfirmButton: false,
          timer:2000
        });
      }
      else {
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "warning",
          title: 'Ooops!',
          text: res['message'],
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

  async actEmail(data){
    let name=data.student.detail_user.nombres+' '+data.student.detail_user.apellidos

    const { value: email } = await Swal.fire({
      title: "Modificar Email Estudiante: "+name,
      text: 'Email actual: '+data.student.detail_user.email,
      input: "email",
      inputLabel: "Nuevo Correo Electrónico",
      inputPlaceholder: "Escribe nuevo correo electrónico",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Modificar',
      cancelButtonText: 'Cancelar',
    });
    if (email) {
      this.updateEmail(data.student.id, email)
    }
  }

  updateEmail(id, email){
    this.spinner.show();
    const  jsonbody={
      "student_id" : id,
      "new_email" : email
    }
    this.service.updateEmail(jsonbody).subscribe(res => {
      if (res.succes) {
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "success",
          title: '¡Genial!',
          text: '¡Email Modificado Correctamente!',
          showConfirmButton: false,
          timer:2000
        });
        this.rerender()
      }
      else {
        this.spinner.hide();
        Swal.fire({
          position: "center",
          icon: "warning",
          title: 'Ooops!',
          text: res['message'],
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
}
