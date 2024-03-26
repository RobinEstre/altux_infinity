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
    // SELECTS
    pais: [''],
    diplomado: [''],
    tip_doc: [''],
    procedencia_venta:[''],
    vendedor:[''],
    grado_instruccion:['']
  });

  diplomado: any; estudiantes:any; isperu = true; nameperson: any; dni_consulta:any; mostrarColegiatura: boolean = false; grado:any; vendedores:any
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
      this.service.listar_estudiantes(this.diplomado[0].courses_code).subscribe(data => {
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
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.spinner.show()
        this.dtOptions={
          pagingType: 'full_numbers',
          pageLength: 10,
          lengthMenu: [5, 10, 25],
          //dom: 'Bfrtip',
          processing: true,
          language: AlumnosComponent.spanish_datatables
        }
        this.service.listar_estudiantes(event.courses_code).subscribe(data => {
          if(data['success']==true){
            this.estudiantes=data['data']
            this.dtTrigger.next();
            this.spinner.hide()
          }
        })
      });
    }catch(e){
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
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
    this.isperu=true
    this.mostrarColegiatura=false
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
              this.formRegistro.controls['apellidos'].setValue(dni['apellidoMaterno'] + ' ' + dni['apellidoMaterno']);
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

  addStudent(){
    let pais =  this.formRegistro.controls['pais'].value;
    this.spinner.show();
    if (pais === 'Perú'){
      var nombres = this.formRegistro.controls['nombres'].value;
      var apellidos= this.formRegistro.controls['apellidos'].value;
      var num_doc= this.formRegistro.controls['dni'].value.trim();
      var type_doc: any= '1';
    }
    else {
      var nombres = this.formRegistro.controls['nombres'].value;
      var apellidos= this.formRegistro.controls['apellidos'].value;
      var num_doc= this.formRegistro.controls['num_doc'].value.trim();
      var type_doc: any= this.formRegistro.controls.tip_doc.value;
    }
    let body={
      "diplomado_code": this.formRegistro.controls.diplomado.value,
      "pais": pais,
      "tipoDoc": type_doc,
      "num_documento": num_doc,
      "num_documento_sunat": num_doc,
      "email": this.formRegistro.controls.email.value,
      "telefono": this.formRegistro.controls.telefono.value,
      "nombres": nombres,
      "apellidos": apellidos,
      "is_facture": false,
      "solicita_comprobante": false,
      "rzon_social": nombres+' '+apellidos,
      "type_matricula": "matriculacuota",
      "procedencia_venta": this.formRegistro.controls.procedencia_venta.value,
      "grado_instruccion": this.formRegistro.controls.grado_instruccion.value,
      "num_colegiatura": this.formRegistro.controls.num_colegiatura.value,
      "vendedor_id": +this.formRegistro.controls.vendedor.value
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
}
