import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { ExamenesService } from 'src/app/academic/services/examenes.service';

@Component({
  selector: 'app-modal-detail',
  templateUrl: './modal-detail.component.html',
  styleUrls: ['./modal-detail.component.scss']
})
export class ModalDetailComponent implements OnInit {

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
  @ViewChild('nota') private modalContentNota: TemplateRef<ModalDetailComponent>;
  private modalRefnota: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings={};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private spinner: NgxSpinnerService, private Service:ExamenesService,config: NgbModalConfig, private modalService: NgbModal,) { }

  @Input()detail:any; @Input()nombre:any

  detail_notes:any; id_examen:any; notas:any; id_student:any; student:any

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    this.id_examen=this.detail.id
    this.spinner.show()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      processing: true,
      dom: 'Bfrtip',
      language: ModalDetailComponent.spanish_datatables
    }
    this.spinner.show()
    this.Service.list_Notes(this.detail.id).subscribe(data => {
      if(data['success']==true){
        this.detail_notes=data['data']
        data['data'].forEach(i=>{
          i.detalle.forEach(a=>{
            a.fecha
          })
        })
        this.dtTrigger.next()
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: "Notas Encontradas",
          showConfirmButton: false,
          timer: 2000
        });
      }
    })
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  openModalNota() {
    this.modalRefnota = this.modalService.open(this.modalContentNota, { backdrop : 'static', centered: true, size: 'lg', keyboard: false });
    this.modalRefnota.result.then();
  }

  closeModalNota() {
    this.modalRefnota.close();
  }

  onMouseEnter(nota, detail): void {
    this.notas=+nota
    this.id_student=detail.id_estudiante
    this.student=detail.nombre+' '+detail.apellido
    this.openModalNota()
  }

  onmouseleave(event: any): void {
    this.closeModalNota()
  }

  resetExam(data){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro de Formatear el Examen?',
      text: data.nombre+' '+data.apellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Seguro',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let body={
          "student_id": data.id_estudiante,
          "sheet_id": this.id_examen
        }
        this.resetExamen(body)
      }
    })
  }

  resetExamen(body){
    this.spinner.show()
    this.Service.resetExamen(body).subscribe(resp => {
      if(resp.success){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.listInit()
        });
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: "Examen Formateado",
          showConfirmButton: false,
          timer: 2000
        });
      }
    },error => {
      if(error.status==400){
        Swal.fire({
          title: 'Advertencia!',
          text: error.error.message,
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar'
        })
      }
      if(error.status==500){
        Swal.fire({
          title: 'Advertencia!',
          text: 'Comuniquese con el Área de Sistemas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar'
        })
      }
      // this.closeModal()
      this.spinner.hide()
    })
  }
}
