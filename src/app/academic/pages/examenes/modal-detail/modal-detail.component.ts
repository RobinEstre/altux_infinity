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
}
