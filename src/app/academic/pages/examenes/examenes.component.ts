import {Component, LOCALE_ID, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import localeEs from '@angular/common/locales/es';
import { ExamenesService } from '../../services/examenes.service';
import Swal from "sweetalert2";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' } ,DatePipe]
})
export class ExamenesComponent implements OnInit  {
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
  @ViewChild('new') private modalContent: TemplateRef<ExamenesComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('detail') private modalContentDetail: TemplateRef<ExamenesComponent>;
  private modalRefDetail: NgbModalRef;
  @ViewChild('exam') private modalContentExam: TemplateRef<ExamenesComponent>;
  private modalRefExam: NgbModalRef;

  constructor(private fb: FormBuilder, private service: ExamenesService, private datePipe: DatePipe, private modalService: NgbModal, 
    private spinner: NgxSpinnerService){
  }

  @Input() examen: any;
  @Input() dif: any;
  nombre:any
  id_ficha:any
  detail_examen:any
  id_examen:any

  formExamen = this.fb.group({
    fecha_inicio:['',Validators.required],
    fecha_fin:['',Validators.required],
  })

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings={};
  dtTrigger: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.listExam()
  }

  listExam() {
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      //dom: 'Bfrtip',
      processing: true,
      language: ExamenesComponent.spanish_datatables
    }
    this.service.listar_ExamenAcademic().subscribe(data => {
      if(data['success']==true){
        data['data'].forEach(i=>{
          const split = i.evaluation_form.name.split(' ')
          split.splice(0, 3);
          let name=split.map(x=>x).join(" ")
          i.evaluation_form.name=name
        })
        this.examen=data['data']
        this.dtTrigger.next();
        this.spinner.hide()
      }
    })
    // try {
    //   if(this.dif=='admin'){
    //     this.service.listar_ExamenAcademic().subscribe(data => {
    //       if(data['success']==true){
    //         this.examen=data['data']
    //         this.dtTrigger.next();
    //       }
    //     })
    //   }
    //   else if(this.dif=='academic'){
    //     this.service.listar_Examen().subscribe(data => {
    //       if(data['success']==true){
    //         this.examen=data['data']
    //         this.dtTrigger.next();
    //       }
    //     })
    //   }
    // }
    // catch (e) {
    //   this.dtTrigger.next();
    // }
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  updateFecha(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.rerenderFecha()
    });
  }

  rerenderFecha() {
    this.spinner.show()
    let fec_1=this.formExamen.controls['fecha_inicio'].value;
    var fecha_inicio= (new Date(fec_1).getTime())/1000

    let fec_2=this.formExamen.controls['fecha_fin'].value;
    var fecha_fin= (new Date(fec_2).getTime())/1000
    const body={
      "ficha_evaluacion_id" : this.id_ficha,
      "fecha_inicio" : fecha_inicio,
      "fecha_fin" : fecha_fin
    }
    this.service.update_fechaExamen(body,).subscribe(data => {
      if(data['success']==true){
        this.listExam()
        this.closeModal()
        this.formExamen.reset()
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: "Fecha Actualizada",
          showConfirmButton: false,
          timer: 2000
        });
      }
    })
  }

  openModalInfo(exam) {
    this.id_ficha=exam.id
    this.nombre=exam.evaluation_form.name
    let fec_ini= (new Date(exam.detail.fecha_inicio*1000).getTime())
    let fecha_inicio= this.datePipe.transform(fec_ini,"yyyy-MM-dd HH:mm")
    let fec_fin= (new Date(exam.detail.fecha_fin*1000).getTime())
    let fecha_fin= this.datePipe.transform(fec_fin,"yyyy-MM-dd HH:mm")
    this.formExamen.controls['fecha_inicio'].setValue(fecha_inicio)
    this.formExamen.controls['fecha_fin'].setValue(fecha_fin)
    this.modalRef = this.modalService.open(this.modalContent, { backdrop : 'static', centered: true, size: 'md', keyboard: false });
    this.modalRef.result.then();
  }

  closeModal() {
    this.modalRef.close();
  }

  openModalDetail(exam) {
    this.detail_examen=exam
    this.nombre=exam.evaluation_form.name
    this.modalRefDetail = this.modalService.open(this.modalContentDetail, { backdrop : 'static', centered: true, size: 'lg', keyboard: false });
    this.modalRefDetail.result.then();
  }

  closeModalDetail() {
    this.modalRefDetail.close();
  }

  openModalExam(exam) {
    this.id_examen=exam.id
    this.nombre=exam.evaluation_form.name
    this.modalRefExam = this.modalService.open(this.modalContentExam, { backdrop : 'static', centered: true, size: 'lg', keyboard: false });
    this.modalRefExam.result.then();
  }

  closeModalExam() {
    this.modalRefExam.close();
  }
}