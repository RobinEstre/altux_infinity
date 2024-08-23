import {Component, LOCALE_ID, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import Swal from "sweetalert2";
import {DatePipe, registerLocaleData} from "@angular/common";
import localeEs from "@angular/common/locales/es";
import { CobranzaService } from '../../services/cobranza.service';
registerLocaleData(localeEs, 'es');
declare var $: any;
//Import Culqi
import { greet } from '../../../../assets/js/service.js';
import { config_data } from '../../../../assets/js/config.js';
import { ejecutar } from '../../../../assets/js/checkout.js';

enum disabledType {
  enabled,
  disabled
}
enum checkedType {
  unchecked,
  checked
}

@Component({
  selector: 'app-cobros',
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class CobrosComponent implements OnInit {
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
      sortAscending: ": Activar para ordenar la tabla en orden ascendente",
      sortDescending: ": Activar para ordenar la tabla en orden descendente"
    }
  }

  @ViewChild('edit') private modalPayment: TemplateRef<CobrosComponent>;
  private modalPay: NgbModalRef;
  @ViewChild('control') private modalControl: TemplateRef<CobrosComponent>;
  private modalCon: NgbModalRef;
  @ViewChild('vencido') private modalControlVencido: TemplateRef<CobrosComponent>;
  private modalRefVencido: NgbModalRef;
  @ViewChild('pago') private modalPago: TemplateRef<CobrosComponent>;
  private modalPag: NgbModalRef;
  @ViewChild('detail') private modalContentDetail: TemplateRef<CobrosComponent>;
  private modalRefDetail: NgbModalRef;
  @ViewChild('infostudent') private modalContentInfoStudent: TemplateRef<CobrosComponent>;
  private modalRefInfoStudent: NgbModalRef;
  @ViewChild('new') private modalNew: TemplateRef<CobrosComponent>;
  private modalContentNew: NgbModalRef;
  @ViewChild('infomigra') private modalcontentmigracion: TemplateRef<CobrosComponent>;
  private modalRefInfomigra: NgbModalRef;
  @ViewChild('com') private modalcontentDescuentos: TemplateRef<CobrosComponent>;
  private modalRefDescuentos: NgbModalRef;
  
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>(); student:any

  constructor(private fb: FormBuilder, private Service: CobranzaService, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private modalService: NgbModal) {
  }

  formCompromiso = this.fb.group({
    otro:[''],
    fecha:[null,Validators.required],
  });
  formMat = this.fb.group({
    option_select: [null],
    banco: [null, ],
    n_opreacion: [null,],
    fecha_pago: [null,],
    importe: [null, ],
    monto_correccion: [null, ],
    status_pay: [false, ],
  });
  formgrupos = this.fb.group({
    diplomado: [null],
    mensualidad_index: [null, ]
  });
  formGenerate = this.fb.group({
    descuento:[null],
    is_factura:[false],
    ruc:[''],
  });

  optionsMigration = [
    // {
    //   "id": "corregir",
    //   "value": "Corregir Registro Pago"
    // },
    {
      "id": "consultar",
      "value": "Consultar Pago"
    },
    {
      "id": "registro",
      "value": "Registrar"
    }
  ]
  bancosPagos = [
    {
      "id": "BCP",
      "value": "BCP"
    },
    {
      "id": "BBVA",
      "value": "BBVA"
    },
    {
      "id": "SCOTIABANK",
      "value": "SCOTIABANK"
    },
    {
      "id": "INTERBANK",
      "value": "INTERBANK"
    },
    {
      "id": "BANCO_DE_LA_NACION",
      "value": "BANCO DE LA NACIÓN"
    },
    {
      "id": "POS",
      "value": "POS"
    },
    {
      "id": "YAPE",
      "value": "YAPE"
    },
    {
      "id": "PLIN",
      "value": "PLIN"
    },
    {
      "id": "VISA LIMK",
      "value": "VISA LIMK"
    }
  ]

  show_registro = false; show_corregir = false; btn_show = false; sale_id = false; indice_num:any; monto_mensualidad = null; status_pay = null;
  name_mensualidad = null; name_student = null; id_studen:any; monto = null; data_info_indice  = null; state_info_consulta  = false; status_option  =  null;
  students:any[]= []; report_student:any = null; show_cbx:boolean = false; nombres_apellidos:any = null; _detail; _diplomado;

  public months = [
    {
      "name": "Mensualidad Nº2",
      "value" : "1"
    },
    {
      "name": "Mensualidad Nº3",
      "value" : "2"
    },
    {
      "name": "Mensualidad Nº4",
      "value" : "3"
    },
    {
      "name": "Mensualidad Nº5",
      "value" : "4"
    },
    {
      "name": "Mensualidad Nº6",
      "value" : "5"
    },
    {
      "name": "Mensualidad Nº7",
      "value" : "6"
    }
  ]

  num_ruc:any; detalle_fecha:any=[]; mostrarSelect: boolean = false; nameruc:any=''; nameperson:any; nombre_razsocial:any; rucexist:any[];
  have_info_profile= false; courseCode: string; verGrupo: string = ''; code:any; descuento:any; indice:any; id_sales:any; discount:boolean=false
  total_pagar:any; meses_pagar:any; porcentaje:any; total_descuento:any; fecha:any; course_code:any; detail_student:any; cuotas:any; id_student:any
  nombre:any; index:any=0; _generate:any; fecha_title:any; name_diplomado:any; detalle_cobranza:any=[]; number:any; fecha_ahora:any=new Date()
  detail:any; total:any; detalle_cuota:any; checkbox: any[] = []; is_pay:boolean = false; id_temporal:any=null; detalle:any=[]; student_compromiso:any=[]
  detalle_comisiones:any; diplomado:any;

  ngOnInit(): void {
    this.list()
    this.listDiplomado()
  }

  listDiplomado(){
    this.Service.listar_diplomados().subscribe(data => {
      data['data'].forEach(i=>{
        // const split = i.courses_name.split(' ')
        // split.splice(0, 3);
        // let name=split.map(x=>x).join(" ")
        // i.courses_name= name
      })
      this.diplomado = data['data'];
    });
  }

  list(){
    this.fecha_ahora=new Date()
    this.fecha_title= this.datePipe.transform(this.fecha_ahora,"dd-MM-yyyy")
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      lengthMenu: [5, 10, 25],
      language: CobrosComponent.spanish_datatables
    }
    this.students=[]
    this.dtTrigger.next();
  }

  listinit(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        { extend: 'copy', className: 'btn btn-primary text-white', title:'Reporte Pagos '+this.name_diplomado+' '+this.fecha_title },
        { extend: 'print', className: 'btn btn-danger text-white', title:'Reporte Pagos '+this.name_diplomado+' '+this.fecha_title },
        { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Reporte Pagos '+this.name_diplomado+' '+this.fecha_title },
        { extend: 'colvis', className: 'btn btn-warning'},
        //{ extend: 'columnsToggle', className: 'btn btn-outline-danger'}
      ],
      language: CobrosComponent.spanish_datatables
    }
    this.Service.listpagoStudent(this.course_code).subscribe(item => {
      if (item['success'] === true){
        let data=[]
        let fecha= new Date()
        item['data'].forEach(i=>{
          let mv=0
          let deuda=0
          let saldo=0
          i.detalle.cuotas.forEach(c=>{
            let fecha_pago=new Date(c.fecha_vencimiento*1000)
            if(c.is_paid==false && fecha>fecha_pago){
              deuda+= +c.monto_pagar;
              mv++
            }
            if (c.is_paid != true) {
              saldo+= +c.monto_pagar;
            }
          })
          data.push({
            'mv':mv,
            'id': i.id,
            'is_suscrib': i['is suscrib'],
            'sales_id': i.sales_id,
            'nombres': i.nombre,
            'apellidos': i.apellido,
            'celular': i.telefono,
            'dni': i.dni,
            'email': i.email,
            'deuda':deuda,
            'saldo':saldo,
            'cuotas':i.detalle.cuotas,
            'matricula': {
              "is_paid": i.detalle.cuotas[0].is_paid,
              'fecha': i.detalle.cuotas[0].fecha_vencimiento,
              'monto': 150,
            },
            'mes1': {
              "is_paid": i.detalle.cuotas[0].is_paid,
              'fecha': i.detalle.cuotas[0].fecha_vencimiento,
              'monto': 150,
            },
            'mes2': {
              "is_paid": i.detalle.cuotas[1].is_paid,
              'fecha': i.detalle.cuotas[1].fecha_vencimiento,
              'monto': +i.detalle.cuotas[1].monto_pagar,
            },
            'mes3': {
              "is_paid": i.detalle.cuotas[2].is_paid,
              'fecha': i.detalle.cuotas[2].fecha_vencimiento,
              'monto': +i.detalle.cuotas[2].monto_pagar,
            },
            'mes4': {
              "is_paid": i.detalle.cuotas[3].is_paid,
              'fecha': i.detalle.cuotas[3].fecha_vencimiento,
              'monto': +i.detalle.cuotas[3].monto_pagar,
            },
            'mes5': {
              "is_paid": i.detalle.cuotas[4].is_paid,
              'fecha': i.detalle.cuotas[4].fecha_vencimiento,
              'monto': +i.detalle.cuotas[4].monto_pagar,
            },
            'mes6': {
              "is_paid": i.detalle.cuotas[5].is_paid,
              'fecha': i.detalle.cuotas[5].fecha_vencimiento,
              'monto': +i.detalle.cuotas[5].monto_pagar,
            },
            'mes7': {
              "is_paid": i.detalle.cuotas[6].is_paid,
              'fecha': i.detalle.cuotas[6].fecha_vencimiento,
              'monto': +i.detalle.cuotas[6].monto_pagar,
            },
            'cert': {
              "is_paid": i.detalle.cuotas[7].is_paid,
              'fecha': i.detalle.cuotas[7].fecha_vencimiento,
              'monto': +i.detalle.cuotas[7].monto_pagar,
            }
          })
        })
        this.students= data
        this.detalle_fecha=item['diplomado_detalle_cuota']
        this.dtTrigger.next()
        this.spinner.hide()
      }
    }, error => {
      this.spinner.hide()
      this.list()
    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  select_diplomat(event) {
    try {
      this.name_diplomado=event.courses_name
      this.course_code = event.courses_code
      this.formgrupos.controls['diplomado'].setValue(this.course_code);
      this.show_cbx = true
      this.detalleCobranza()
      this.rerender()
    }catch (e){
      this.formgrupos.controls['diplomado'].setValue(null);
      this.show_cbx = false
      this.rerendercath()
    }
  }

  detalleCobranza(){
    this.spinner.show()
    this.detalle_cobranza=[]
    this.Service.listDetailCobranza(this.course_code).subscribe(item => {
      if (item['success'] === true){
        let monto_cobrado=0, debe=0, total=0;
        monto_cobrado=   item.detalle_montos[0].cobrado.toLocaleString('es-PE');
        debe=  item.detalle_montos[0].monto_deben.toLocaleString('es-PE');
        total=  item.detalle_montos[0].total.toLocaleString('es-PE');
        this.detalle_cobranza.push({
          'alumnos': item.detalle_alumnos[0],
          'montos':{
            "diplomado_name": item.detalle_montos[0].diplomado_name,
            "codigo_diplomado": item.detalle_montos[0].codigo_diplomado,
            "cobrado": monto_cobrado,
            "monto_deben": debe,
            "total": total,
            "mensualidad": item.detalle_montos[0].mensualidad,
            "monto_cobrado_del_acumulado": item.detalle_montos[1].monto_cobrado_del_acumulado,
            //"monto_Acumulado": item.detalle_montos[2].monto_Acumulado
          }
        })
        this.spinner.hide()
      }
      else {
        this.detalle_cobranza=[]
        this.spinner.hide()
      }
    }, error => {
      this.detalle_cobranza=[]
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "¡Ocurrio un error con el servidor, comuniquese con el area de sistemas!",
        showConfirmButton: false,
        timer: 1500
      });
      this.spinner.hide()
    })
  }

  rerendercath(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.list()
    })
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.listinit()
    })
  }

  openModalDetail(detail, id, student) {
    this.student=student
    this._detail=detail
    let diplomado
    this.diplomado.forEach(i=>{
      if(i.courses_code){
        diplomado=i.courses_name
      }
    })
    this._diplomado={
      'code_course': this.course_code,
      'diplomado_name': diplomado,
      'id': id
    }
    this.modalRefDetail = this.modalService.open(this.modalContentDetail, {backdrop : 'static', centered: true, keyboard: false,
    windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRefDetail.result.then();
  }

  reportStudent(student_id, nombres){
    this.nombres_apellidos = nombres
    let data= student_id+'/'+this.course_code
    this.spinner.show()
    this.Service.listReportStudent(data).subscribe(data => {
      if(data['success']==true){
        this.report_student=data['data']
        this.modalRefInfoStudent = this.modalService.open(this.modalContentInfoStudent, {backdrop : 'static', centered: true, keyboard: false,
        windowClass: 'animate__animated animate__backInUp', size: 'lg' });
        this.modalRefInfoStudent.result.then();
        this.spinner.hide()
      }
    }, error => {
      this.spinner.hide()
    })
  }

  closeModalDetail() {
    this.modalRefDetail.close();
  }

  closeModalInfoStudent() {
    this.modalRefInfoStudent.close();
  }

  updateEstudent(jsonbody){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    let id= jsonbody.id
    if(id==6){
      this.migrarEstudiante(jsonbody.json)
    }
    if(id==4){      
      swalWithBootstrapButtons.fire({
        title: 'Estas Seguro de Realizar el Retiro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, muy seguro!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.bajaEstudiante(jsonbody)
        } else if ( result.dismiss === Swal.DismissReason.cancel ) {
          this.closeModal()
        }
      })
    }
    if(id==1){
      this.controlStudent(jsonbody.json)
    }
    if(id==2){
      this.compromisoEstudiante(jsonbody.json)
    }
  }

  openModal(id, nombre, cuotas) {
    this.id_student=id
    this.nombre=nombre
    this.detail_student={
      'student':{
        'id': id
      }
    }
    this.modalPay = this.modalService.open(this.modalPayment, {backdrop : 'static', centered: true, keyboard: false,
    windowClass: 'animate__animated animate__backInUp', size: 'md' });
    this.modalPay.result.then();
  }

  closeModal() {
    this.modalPay.close()
  }

  migrarEstudiante(jsonbody){
    this.spinner.show();
    this.Service.migrate_Student(jsonbody).subscribe(res => {
      if (res["success"] === true) {
        this.spinner.hide();
        this.closeModal()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :D!",
          text: '¡Solicitud Enviada!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },error => {
      if(error.status===400){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error :C!",
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      }
    });
  }

  compromisoEstudiante(jsonbody){
    this.spinner.show();
    this.Service.compromiso_Student(jsonbody).subscribe(res => {
      if (res["success"] === true) {
        this.spinner.hide();
        this.closeModal()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :D!",
          text: '¡Solicitud Enviada!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },error => {
      if(error.status===400){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error :C!",
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      }
    });
  }

  controlStudent(jsonbody){
    this.spinner.show();
    this.Service.control_Student(jsonbody).subscribe(res => {
      if (res["success"] === true) {
        this.spinner.hide();
        this.closeModal()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :D!",
          text: '¡Solicitud Enviada!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },error => {
      if(error.status===400){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error :C!",
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      }
    });
  }

  validarBaja(id){
    const body={
      "desuscribir_estudiante_id": id,
      "estado": "approbed"
    }
    this.Service.aprobar_rechazar(body).subscribe(resp => {
      if (resp["success"] === true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :D!",
          text: '¡Retiro Existoso!',
          showConfirmButton: false,
          timer: 1500
        });
        this.closeModal()
      }
      this.spinner.hide()
    });
  }

  bajaEstudiante(jsonbody){
    this.spinner.show();
    this.Service.baja_Student(jsonbody.json).subscribe(res => {
      if (res["success"] === true) {
        this.subirEvidencia(jsonbody, res['data']['id'])
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :D!",
          text: '¡Solicitud Enviada!',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        this.spinner.hide();
        this.closeModal()
        Swal.fire({
          position: "center",
          icon: "warning",
          title: res['message'],
          showConfirmButton: false,
          timer: 1500
        });
      }
      if (res["success"] === true) {
        //this.toastr.success('¡Solicitud Enviada!', '¡Genial :)!'); 
      }
    },error => {
      if(error.status===400){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error :C!",
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      }
    });
  }

  subirEvidencia(data, id){
    const formData = new FormData()
    formData.append("desuscribir_estudiante_id", id);
    formData.append("observacion_tipo_id", '2');
    formData.append("descripcion", data.json.descripcion);
    for (let i = 0; i < data.files[0].length; i++) {
      formData.append('evidencia', data.files[0][i], data.files[0][i].name);
    }
    this.Service.register_Observacion(formData).subscribe(data => {
      this.validarBaja(id)
    });
  }

  openModalControl(id, nombre) {
    this.nombre=nombre
    this.detail_student={
      'student':{
        'id': id
      }
    }
    this.modalCon = this.modalService.open(this.modalControl, {backdrop : 'static', centered: true, keyboard: false,
    windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalCon.result.then();
  }

  closeModalControl() {
    this.modalCon.close()
  }

  listDescuento(id, indice){
    this.spinner.show();
    const jsonbody={
      "sale_id": id,
      "indice_mensualidad": indice
    }
    this.Service.listDiscount(jsonbody).subscribe(res => {
      if (res["success"] == true) {
        let desc=[]
        res['porcentajes'].forEach(i=>{
          desc.push({
            "id": i.id,
            "porcentaje": i.porcentaje+' %',
            'monto': i.porcentaje
          })
        })
        this.indice=indice
        this.descuento=desc
        this.total_pagar=+res['total_pagar']
        this.total_descuento=(10/100)*this.total_pagar
        this.modalRefVencido = this.modalService.open(this.modalControlVencido, {backdrop : 'static', centered: true, keyboard: false,
        windowClass: 'animate__animated animate__backInUp', size: 'md' });
        this.modalRefVencido.result.then();
        this.spinner.hide();
      }
    },error => {
      if(error.status===400){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error :C!",
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      }
    });
  }

  prontoPago(id, data) {
    this.id_sales= id
    let indice
    if(data.cuotas[1].is_paid==false){
      indice=1
      this.meses_pagar='Mensualidades 02,03,04,05,06,07'
      this.formGenerate.controls['ruc'].setValue('')
      this.formGenerate.controls['is_factura'].setValue(false)
      this.formGenerate.controls['descuento'].setValue(null)
      this.nameruc=''
      this.discount=true
      this.listDescuento(id, indice)
      return
    }
    if(data.cuotas[2].is_paid==false){
      indice=2
      this.meses_pagar='Mensualidades 03,04,05,06,07'
      this.formGenerate.controls['ruc'].setValue('')
      this.formGenerate.controls['is_factura'].setValue(false)
      this.formGenerate.controls['descuento'].setValue(null)
      this.nameruc=''
      this.discount=true
      this.listDescuento(id, indice)
      return
    }
    if(data.cuotas[3].is_paid==false){
      indice=3
      this.meses_pagar='Mensualidades 04,05,06,07'
      this.formGenerate.controls['ruc'].setValue('')
      this.formGenerate.controls['is_factura'].setValue(false)
      this.formGenerate.controls['descuento'].setValue(null)
      this.nameruc=''
      this.discount=true
      this.listDescuento(id, indice)
      return
    }
  }

  closeModalVencido() {
    this.modalRefVencido.close()
  }

  selectDesc(event){
    try {
      this.porcentaje=event.monto
      this.discount=true
      this.total_descuento=(+event.monto/100)*this.total_pagar
    }catch (e) {
      this.formGenerate.controls['descuento'].setValue(null)
      this.discount=false
    }
  }

  generateProntoPago(){
    this.spinner.show();
    const jsonbody={
      "sale_id": this.id_sales,
      "indice_mensualidad": this.indice,
      "is_facture": this.formGenerate.controls['is_factura'].value,
      "razon_social": this.nameruc,
      "ruc": this.formGenerate.controls['ruc'].value,
      "porcentaje_id": 1
    }
    this.Service.generate_prontoPago(jsonbody).subscribe(res => {
      if (res['success'] === true) {
        if(res['data']['object'] === 'error'){
          this.closeModalVencido();
          this.formGenerate.reset();
          this.spinner.hide();
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
          this._generate = res['data'];
          this.closeModalVencido();
          this.formGenerate.reset();
          Swal.fire({
            position: "center",
            icon: "success",
            title: '¡Genial ☺!',
            text: '¡Se generó código de Pago!',
            showConfirmButton: false,
            timer:2000
          });
          this.openModalPago()
          this.spinner.hide();
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
      this.spinner.show();
      let ruc_consulta = {
        "tipo": "ruc",
        "documento": event.target.value
      };
      this.formGenerate.controls['ruc'].enable();
      this.Service.getInfoDNI(ruc_consulta.tipo, ruc_consulta.documento).subscribe(data => {
        if (data['success'] === false) {
          this.nameperson = null;
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
          this.nombre_razsocial=this.nameruc;
          this.have_info_profile=true;
          this.rucexist = data;
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
        this.nameperson = null;
        this.formGenerate.controls['ruc'].setValue('');
        this.spinner.hide();
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

  openModalPago() {
    this.btn_show = false
    this.show_registro = false
    this.show_corregir = false
    this.state_info_consulta = false
    this.formMat.controls['option_select'].setValue(null);
    this.modalPag = this.modalService.open(this.modalPago, {backdrop : 'static', centered: true, keyboard: false,
    windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalPag.result.then();
  }

  closeModalPago() {
    this.modalPag.close();
  }

  closeModalMigracion() {
    this.modalRefInfomigra.close();
    this.btn_show = false
    this.show_registro = false
    this.show_corregir = false
    this.state_info_consulta = false
    this.formMat.controls['option_select'].setValue(null);
  }

  modificarPago(id, indice, nombre, estado, student_id, monto, coutas) {
    // this.sale_id = id
    // this.indice_num = indice
    // let pago_man = coutas[indice]['pago_manual']
    // if (pago_man){
    //   let monto_pag = 0.0
    //   pago_man.forEach(item => {
    //     monto_pag =  monto_pag +  parseFloat(item['importe_pago'])
    //   })
    //   if (estado){
    //     this.monto_mensualidad = 'MONTO: ' + 'S/ 0.00'
    //   }else {
    //     this.monto_mensualidad = 'SALDO: S/' + monto + '.00'
    //   }
    // } else {
    //   if (estado){
    //     this.monto_mensualidad = 'MONTO: ' + 'S/ 0.00'
    //   }else{
    //     this.monto_mensualidad = 'SALDO: S/' + monto + '.00'
    //   }

    // }

    // if (indice === 0){
    //   this.name_mensualidad = 'Matrícula'
    // }else if (indice === 7){
    //   this.name_mensualidad = 'Certificado'
    // }else {
    //   let mes =  parseInt(indice) + 1
    //   this.name_mensualidad = 'Mensualidad Nº ' + mes
    // }
    // this.name_student = nombre
    // this.id_student = student_id
    // this.status_pay = estado
    // this.formMat.controls['status_pay'].setValue(estado)
    // this.formMat.controls['monto_correccion'].setValue(monto)
    // this.modalRefInfomigra = this.modalService.open(this.modalcontentmigracion, { centered: true, size: 'md' });
    // this.modalRefInfomigra.result.then();
  }

  rerenderPago(id, indice, estado){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.pagoUpdate(id, indice, estado);
    });
  }

  pagoUpdate(id, indice, estado){
    this.spinner.show()
    const body={
      "sales_id":id,
      "indice":indice,
      "estado":estado
    }
    try {
      this.Service.updatePago(body).subscribe(data => {
        if (data['success'] == true) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Genial",
            text: 'Se Modificó el Pago Correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.listinit()
        } else {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "¡Error :C!",
            text: data.message,
            showConfirmButton: false,
            timer: 1500
          });
          this.listinit()
          this.spinner.hide()
        }
      },error => {
        if (error.status === 400  || error.status === 500 ) {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "¡Error :C!",
            text: 'No se Puede modificar el Pago ',
            showConfirmButton: false,
            timer: 1500
          });
          this.listinit()
          this.spinner.hide()
        }
      });
    }
    catch (e) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "¡Error :C!",
        text: 'No se Puede modificar el Pago ',
        showConfirmButton: false,
        timer: 1500
      });
      this.spinner.hide()
    }
  }

  regPagoManual(){
    this.spinner.show()
    let n_opera = this.formMat.controls['n_opreacion'].value
    let importe = this.formMat.controls['importe'].value
    let banco = this.formMat.controls['banco'].value
    let fecha_pago = this.formMat.controls['fecha_pago'].value
    if (importe > this.monto_mensualidad){
      this.spinner.hide()
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Registro no generado!",
        text: 'El importe ingresado no debe ser mayor que el monto a pagar',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      let body2 = {
        "sale_id": this.sale_id,
        "indice": this.indice_num,
        "num_operacion": n_opera,
        "importe": importe,
        "banco":banco,
        "fecha_pago":fecha_pago
      }
      this.Service.registrarPagoManual(body2).subscribe(item => {
        if(item['success']==true){
          this.data_info_indice = item['message']
          this.formMat.reset()
          this.closeModalMigracion()
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Genial",
            text: 'Se Generó el registro correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.listinit()
        }
        this.spinner.hide()
      }, error => {
        this.spinner.hide()
      })
    }

  }

  corregirPago(){
    this.spinner.show()
    let body = {
      "sale_id": this.sale_id,
      "indice": this.indice_num,
      "status_pay": this.formMat.controls['status_pay'].value,
      "monto_correccion": this.formMat.controls['monto_correccion'].value
    }
    this.Service.corregirPago(body).subscribe(data => {
      if(data['success']==true){
        this.data_info_indice = data['data']
        this.state_info_consulta = true
        this.formMat.reset()
        this.listinit()
        this.closeModalMigracion()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Genial",
          text: 'El pago se corrigió correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      }
      this.spinner.hide()
    }, error => {
      this.spinner.hide()
    })
  }

  migrationEdnpo(){
    if(this.status_option === 'registro'){
      this.regPagoManual()

    }else if(this.status_option === 'corregir') {
      this.corregirPago()
    }else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Oops",
        text: '¡No se ha seleccionado una opción!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  gestionMigracionPago(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.migrationEdnpo();
    });
  }

  onChangeMigracion(event){
    try{
      this.discount=false
      this.btn_show = false
      this.show_registro = false
      this.show_corregir = false
      this.state_info_consulta = false
      this.status_option = event.id
      if (this.status_option === 'registro' && !this.status_pay){
        this.show_registro = true
        this.btn_show = true
        this.formMat.controls['banco'].setValidators([Validators.required]);
        this.formMat.controls['n_opreacion'].setValidators([Validators.required]);
        this.formMat.controls['fecha_pago'].setValidators([Validators.required]);
        this.formMat.controls['importe'].setValidators([Validators.required]);

        this.formMat.controls['monto_correccion'].setValidators([]);
        this.formMat.controls['status_pay'].setValidators([]);
      }else if (this.status_option === 'corregir'){
        this.formMat.controls['banco'].setValidators([]);
        this.formMat.controls['n_opreacion'].setValidators([]);
        this.formMat.controls['fecha_pago'].setValidators([]);
        this.formMat.controls['importe'].setValidators([]);

        this.formMat.controls['banco'].setValue(null);
        this.formMat.controls['n_opreacion'].setValue(null);
        this.formMat.controls['fecha_pago'].setValue(null);
        this.formMat.controls['importe'].setValue(null);

        this.formMat.controls['monto_correccion'].setValidators([Validators.required]);
        this.formMat.controls['status_pay'].setValidators([]);
        this.btn_show = true
        this.show_corregir = true
      }else if (this.status_option === 'registro' && this.status_pay){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "No permitido!",
          text: '¡Esta mensualidad ya ha sido pagada por completo, no puede registrar pagos manuales.!',
          showConfirmButton: false,
          timer: 1500
        });
        this.formMat.controls['option_select'].setValue(null);
      }else if (this.status_option === 'pago'){
        this.prontoPago(this.sale_id, this.indice_num)
      }else {
        this.spinner.show()
        this.formMat.controls['banco'].setValue(null);
        this.formMat.controls['n_opreacion'].setValue(null);
        this.formMat.controls['fecha_pago'].setValue(null);
        this.formMat.controls['importe'].setValue(null);
        // consultar
        this.btn_show = false
        this.show_registro = false
        this.show_corregir = false
        const body={
          "estudiante_id" : this.id_student,
          "codigo_diplomado" : this.formgrupos.controls['diplomado'].value,
          "indice_cuota" : this.indice_num
        }
        //let path_url = "?sales_id=" + this.sale_id + "&indice=" + this.indice_num
        this.Service.solicitarDetallePago(body).subscribe(data => {
          if(data['data']){
            this.data_info_indice = data['data']
            this.state_info_consulta = true
          }
          else {
            this.data_info_indice= []
            this.state_info_consulta = true
          }
          this.spinner.hide()
        }, error => {
          this.spinner.hide()
        })
      }
    }catch (e) {
      this.formMat.controls['option_select'].setValue(null);
    }
    this.formMat.controls['banco'].updateValueAndValidity();
    this.formMat.controls['n_opreacion'].updateValueAndValidity();
    this.formMat.controls['fecha_pago'].updateValueAndValidity();
    this.formMat.controls['importe'].updateValueAndValidity();
    this.formMat.controls['monto_correccion'].updateValueAndValidity();
    this.formMat.controls['status_pay'].updateValueAndValidity();
  }

  OnchangeBancoMigracion(event){
    let value =  event.id
  }

  optionRealizoPago(event){
  }

  // COMPROMISO DE PAGO

  closeModalCompromiso() {
    this.modalContentNew.close()
  }

  openModalCompromiso(detalle){
    this.checkbox=[];
    this.is_pay=false
    this.detail=detalle
    this.spinner.show()
    const json={
      "codigo_diplomado" : this.course_code,
      "estudiante_id" : detalle.id
    }
    this.Service.list_compromisoPago(json).subscribe(res => {
      if (res["sucess"] === true) {
        let detalle=[]
        let index=0
        let monto=0
        let desabilitado=null
        res['data']['cuotas'].forEach(i=>{
          index++
          if(this.fecha_ahora>i.fecha_vencimiento*1000 && i.is_paid==false){
            if(i.deshabilitado){
              desabilitado=i.deshabilitado
            }
            else {desabilitado=null}
            detalle.push({
              'id': index-1,
              'fecha_vencimiento': i.fecha_vencimiento,
              'is_paid': i.is_paid,
              'monto_pagar': i.monto_pagar,
              'num_cuota': i.num_cuota,
              'deshabilitado': desabilitado
            })
          }
        })
        this.detalle_cuota=detalle
        detalle.forEach(i => {
          if (i.is_paid != true) {
            monto+= +i.monto_pagar;
          }
        })
        this.total=monto
        this.generateCheckbox()
        this.listCompromisoStudent()

        this.formCompromiso.reset()
        this.modalContentNew = this.modalService.open(this.modalNew, {backdrop : 'static', centered: true, keyboard: false,
        windowClass: 'animate__animated animate__backInUp', size: 'md' });
        this.modalContentNew.result.then();
        // Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: '¡Genial :)!',
        //   text: '¡Solicitud Enviada!',
        //   showConfirmButton: false,
        //   timer: 1500
        // });
      }
    },error => {
      if(error.status===400){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: '¡Error :C!!',
          text: error.error.message,
          showConfirmButton: false,
          timer: 2500
        });
        this.spinner.hide();
      }
    });
  }

  listCompromisoStudent(){
    this.Service.compromisoEstudiante(this.detail.id).subscribe(resp=>{
      let dip=[]
      if(resp['success']==true){
        resp['data'].forEach(i=>{
          var splitted = i.diplomado.nombre.split(" ");
          var name = i.diplomado.nombre.split(" ");
          splitted.splice(0,3);
          name.splice(0,2);
          var primero = name.toString().charAt(0)
          var cadena= splitted.toString();
          let cod = 'D'+primero+': '
          let nombre = cadena.replace(/_|#|-|@|<>|,/g, " ")
          dip.push({
            id: i.id,
            id_student: i.estudiante.id,
            nombre: i.estudiante.nombre+' '+i.estudiante.apellido,
            dni: i.estudiante.detalle.dni,
            celular: i.estudiante.detalle.telefono,
            email: i.estudiante.detalle.email,
            fecha_pago: i.fecha_pago,
            detalle_venta: i.detalle_venta,
            diplomado:{
              id: i.diplomado.id,
              code: i. diplomado.codigo,
              nombre: nombre,
              inicio: cod
            },
            estado: i.estado,
            fecha_creado: i.fecha_creado
          })
        })
        this.student_compromiso=dip
        this.spinner.hide();
      }
    })
  }

  generateCheckbox(){
    this.checkbox=[]
    try {
      var cantidad = this.detalle_cuota.length;
      this.id_temporal = null

      for (let i = 0; i < cantidad; i++) {
        if (this.detalle_cuota[i]["deshabilitado"] === null && this.id_temporal == null) {
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

  updateCheckbox(id, event, detail){
    var indice = id;
    if (event.target.checked == true) {
      this.is_pay=true;
      this.detalle.push(detail)
      if (indice == this.detalle_cuota.length-1) {
        this.checkbox[indice].is_checked = checkedType.checked;
        return;
      }
      this.checkbox[indice + 1].is_disabled = disabledType.enabled;
      this.checkbox[indice].is_checked = checkedType.checked;
    }
    else if (event.target.checked == false){
      let cant= this.detalle_cuota.length
      let indice= cant-id
      this.detalle.splice(id, indice)
      for (let i = id+1; i < this.detalle_cuota.length; i++) {
        this.checkbox[i].is_disabled = disabledType.disabled;
        this.checkbox[i].is_checked = checkedType.unchecked;
      }
      if(this.checkbox[id] == this.checkbox[this.id_temporal]){
        this.is_pay=false
        this.detalle=[]
      }
      this.checkbox[id].is_checked = checkedType.unchecked;
    }
  }
  
  generatePay(){
    this.spinner.show();
    let date= (new Date(this.formCompromiso.controls['fecha'].value).getTime())/1000
    let jsonbody = {
      "seguimiento_estudiante_tipo_id" : 2,
      "codigo_diplomado" : this.course_code,
      "descripcion" : this.formCompromiso.controls['otro'].value,
      "cuota" : this.detalle,
      "fecha_pago" : date,
      "estudiante_id" : this.detail.id
    };
    this.Service.compromiso_Student(jsonbody).subscribe(res => {
      if (res["success"] === true) {
        this.closeModalCompromiso()
        this.openModalCompromiso(this.detail)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: '¡Solicitud Enviada!',
          showConfirmButton: false,
          timer: 1500
        });
      }
      else{
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error :C!",
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      }
    },error => {
      if(error.status===400){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error :C!",
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      }
    });
  }

  //Descuentos y Comisiones

  openModalCom(detalle) {
    this.detalle_comisiones=detalle
    this.modalRefDescuentos = this.modalService.open(this.modalcontentDescuentos, { centered: true, size: 'lg' });
    this.modalRefDescuentos.result.then();
  }

  closeModalCom() {
    this.modalRefDescuentos.close()
  }

  // Deshabilitar Alumno

  deshabilitarAlumno(data){
    Swal.fire({
      title: "Segur@ de deshabilitar Estudiante?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, deshabilitar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show()
        let body={
          "state": false
        }
        this.Service.deshabilitarStudent(data.id, body).subscribe(resp=>{
          if(resp.success){
            this.spinner.hide()
            this.rerender()
            Swal.fire({
              position: "center",
              icon: "success",
              title: resp.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
        })
      }
    });
  }
}