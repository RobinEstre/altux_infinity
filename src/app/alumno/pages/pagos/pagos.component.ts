import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import {DataTableDirective} from "angular-datatables";
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
import { PagosService } from '../../services/pagos.service';
registerLocaleData(localeEs, 'es');
declare var $: any;

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
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
  @ViewChild('pay') private modalPayment: TemplateRef<PagosComponent>;
  private modalPay: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private service: PagosService, private spinner: NgxSpinnerService, config: NgbModalConfig, private modalService: NgbModal,private fb: FormBuilder,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  pagos:any; data_detalle:any; courses:any;

  ngOnInit(): void {
    this.getCourses()
    //this.listarCarteraAlumnos();
  }
  
  getCourses(){
    this.service.getCourses().subscribe(resp=>{
      if(resp.success){
        resp.courses.forEach(i=>{
          const split = i.course.courses_name.split(' ')
          split.pop();
          split.pop();
          split.splice(0, 3);
          let name=split.map(x=>x).join(" ")
          let modulos:any=i.course.detail.other_description.descripcion_general.num_modulos
          let porcentaje:any=(i.modulo_actual*100)/modulos
          i.porcentaje=porcentaje
          i.course.courses_name=name
        })
        this.courses=resp.courses
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
      this.spinner.hide()
    })
  }

  listarCarteraAlumnos(){
    this.spinner.show()
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      processing: true,
      language: PagosComponent.spanish_datatables
    }
    this.service.getPagos().subscribe(data => {
      if(data.success){
        data['data'].forEach(i=>{
          const split = i.diplomado_name.split(' ')
          split.splice(0, 3);
          let name=split.map(x=>x).join(" ")
          i.diplomado_name=name
        })
        this.pagos= data.data;
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
      this.pagos=[]
      this.dtTrigger.next();
      this.spinner.hide()
    });
  }

  ngAfterViewInit() {
    /* footable */
    $('.footable').footable({
      "paging": {
        "enabled": true,
        "container": '#footable-pagination',
        "countFormat": "{CP} de {TP}",
        "limit": 3,
        "position": "right",
        "size": 5
      },
      "sorting": {
        "enabled": true
      },
    }, function (ft: any) {
      $('#footablestot').html($('.footable-pagination-wrapper .label').html())

      $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
        setTimeout(function () {
          $('#footablestot').html($('.footable-pagination-wrapper .label').html());
        }, 200);
      });
    });

    var chosensimple: any = $('.chosenoptgroup')
    chosensimple.chosen().on('change', function (event: any, el: any) {
      var textdisplay_element = $(".chosenoptgroup + .chosen-container .chosen-single > span");
      var selected_element = $(".chosenoptgroup option:selected");
      var selected_value = selected_element.val();
      if (selected_element.closest('optgroup').length > 0) {
        var parent_optgroup = selected_element.closest('optgroup').attr('label');
        textdisplay_element.text(parent_optgroup + ' ' + selected_value).trigger("chosen:updated");
      }
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  openModalPay(data) {
    this.data_detalle=data;
    this.modalPay = this.modalService.open(this.modalPayment, { centered: true, size: 'md' });
    this.modalPay.result.then();
  }

  closeModalPay() {
    this.modalPay.close();
  }

  changeSlide(event){
    console.log(event[0])
  }
}
