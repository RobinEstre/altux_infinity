import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef, LOCALE_ID} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import Swal from "sweetalert2";
import { AcademicService } from '../../services/academic.service';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }]
})
export class ClasesComponent implements OnInit {
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
  @ViewChild('new') private modalContent: TemplateRef<ClasesComponent>;
  private modalRef: NgbModalRef;
  @ViewChild('recording') private modalContentRecording: TemplateRef<ClasesComponent>;
  private modalRefRecording: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings={};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder, private Service: AcademicService, private route: ActivatedRoute, private spinner: NgxSpinnerService,
  private modalService: NgbModal){
    this.courseCode = this.route.snapshot.params['code']
  }

  formNewClass = this.fb.group({
    fecha:['', Validators.required],
    activate:[false],
    link:['', Validators.required],
    nombre:['', Validators.required]
  })

  formRecording = this.fb.group({
    link:['',Validators.required],
  })

  formgrupos = this.fb.group({
    grupo: [null],
    diplomado: [null],
    modulo: [null]
  });

  clases: any; group: any[] = []; diplomado: any[] = []; module: any[] = []; detail: any[] = [];

  courseCode: string; verGrupo: string = ''; code:any; fecha:any; nombre:any; code_dip:any; id_group:any; id_modulo:any; mostrar:boolean=false
  id:any; is_public:boolean=false;

  ngOnInit(): void {
    this.list();
    this.listDiplomado();
  }

  listDiplomado() {
    this.Service.list_diplomados().subscribe(data => {
      if (data['success'] === 'true'){
        let dip:any=[];
        data['courses'].forEach(i=>{
          const split = i.course.courses_name.split(' ')
          split.splice(0, 3);
          let name=split.map(x=>x).join(" ")
          dip.push({
            'course_name': name,
            'course_code': i.course.courses_code
          })
        })
        this.diplomado=dip;
      }
    }, error => {
    });
    // this.Service.listar_diplomado().subscribe(data => {
    //   let dip=[];
    //   data['data'].forEach(i=>{
    //     var splitted = i.course.courses_name.split(" ");
    //     var name = i.course.courses_name.split(" ");
    //     splitted.splice(0,3);
    //     name.splice(0,2);
    //     var primero = name.toString().charAt(0)
    //     var cadena= splitted.toString();
    //     let nueva = 'D'+primero+': '+cadena.replace(/_|#|-|@|<>|,/g, " ")
    //     dip.push({
    //       'courses_name': nueva,
    //       'courses_code': i.course.courses_code
    //     })
    //   })
    //   this.diplomado = dip;
    // });
    this.formgrupos.controls['grupo'].disable();
    this.formgrupos.controls['modulo'].disable();
  }

  list(){
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      dom: 'Bfrtip',
      processing: true,
      language: ClasesComponent.spanish_datatables
    }
    this.clases =[]
    this.dtTrigger.next()
  }

  listGroup(event) {
    try {
      this.code = event.courses_code
      this.mostrar=false
      this.Service.list_group(this.code).subscribe(data => {
        this.group = data['data'];
        this.formgrupos.controls['grupo'].setValue(null);
        this.formgrupos.controls['modulo'].setValue(null);
        this.formgrupos.controls['grupo'].enable();
      });
    }
    catch (e) {
      this.formgrupos.controls['grupo'].setValue(null);
      this.formgrupos.controls['modulo'].setValue(null);
      this.formgrupos.controls['grupo'].disable();
      this.formgrupos.controls['modulo'].disable();
    }
  }

  listModule(event) {
    try {
      this.code = event.courses_code
      this.mostrar=false
      this.Service.list_module2(this.code).subscribe(data => {
        this.module = data['data'];
        this.formgrupos.controls['modulo'].setValue(null);
        this.formgrupos.controls['modulo'].enable();
      });
    }
    catch (e) {
      this.formgrupos.controls['modulo'].setValue(null);
      this.formgrupos.controls['modulo'].disable();
    }
  }

  selectModule(event){
    try{
      this.mostrar=true
      this.rerender()
    } catch (e) {
      console.log(e)
      this.mostrar=false
      this.formgrupos.controls['modulo'].setValue(null);
    }
  }

  rerenderClass(code, id_modulo){
    this.spinner.show()
    if(this.is_public==true){
      var activate= true
    }else {var activate=false}
    var unixtimestamp= (new Date(this.formNewClass.controls['fecha'].value,).getTime()+360*60000)/1000
    const jsonbody = {
      "diplomado_code" : code,
      "module_id" : id_modulo,
      "link_url": this.formNewClass.controls['link'].value,
      "name_class" : this.formNewClass.controls['nombre'].value,
      "date_class": unixtimestamp,
      "is_public": activate
    };
    this.Service.createClass(jsonbody).subscribe(res => {
      if(res['success'] === true){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial!",
          text: '¡Clase Creada Correctamente!',
          showConfirmButton: false,
          timer: 1500
        });
        this.formNewClass.reset()
        this.listInit()
        this.spinner.hide()
        this.closeModal()
      }
    });
  }

  rerenderRecording(){
    this.spinner.show()
    const jsonbody = {
      "clase_grabada_id" : this.id,
      "url_clase_grabada" : this.formRecording.controls['link'].value,
    };
    this.Service.addRecording(jsonbody,).subscribe(res => {
      if(res['success'] === true){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial!",
          text: '¡🎥 Clase Guardada Correctamente!',
          showConfirmButton: false,
          timer: 1500
        });
        this.formRecording.reset()
        this.listInit()
        this.spinner.hide()
        this.closeModalRecording()
      }
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.listInit()
    });
  }

  createClass(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.rerenderClass(this.code, this.id_modulo)
    });
  }

  addRecording(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.rerenderRecording()
    });
  }

  listInit(){
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25],
      dom: 'Bfrtip',
      processing: true,
      language: ClasesComponent.spanish_datatables
    }
    const jsonbody = {
      "diplomado_code" : this.formgrupos.controls['diplomado'].value,
      "module_id" : this.formgrupos.controls['modulo'].value
    };
    this.Service.listClass(jsonbody,).subscribe(res => {
      if (res["success"]==true) {
        this.clases = (res as any).data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
        this.spinner.hide();
      }
    },error => {
      if(error.status===400){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "¡Error!",
          text: '¡Data no Encontrada!',
          showConfirmButton: false,
          timer: 1500
        });
        this.dtTrigger.next();
        this.spinner.hide();
      }
    });
  }

  openModalInfo() {
    this.formNewClass.reset();
    this.modalRef = this.modalService.open(this.modalContent, { centered: true, size: 'md'});
    this.modalRef.result.then();
    this.code_dip= this.formgrupos.controls['diplomado'].value
    this.id_modulo= this.formgrupos.controls['modulo'].value
  }

  closeModal() {
    try {
      this.modalRef.close();
    }
    catch (e) {
      this.modalRef.close();
    }
  }

  openModalRecording(clase_url,id,name) {
    this.formRecording.reset();
    this.id=id
    this.nombre=name
    this.formRecording.controls['link'].setValue(clase_url);
    this.modalRefRecording = this.modalService.open(this.modalContentRecording, { centered: true, size: 'md'});
    this.modalRefRecording.result.then();
  }

  closeModalRecording() {
    try {
      this.modalRefRecording.close();
    }
    catch (e) {
      this.modalRefRecording.close();
    }
  }

  activateClass(event, id): void {
    var estado= event.target.checked
    var id = id
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.addEstadoPublic(estado,id)
    });
  }

  deleteClass(id){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Esta Segur@ de Eliminar la Clase??',
      icon: 'question',
      text:'Al Eliminar La Clase Será de Forma Permanente',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rerenderdeleteClass(id)
      }
    })
  }

  rerenderdeleteClass(id): void {
    var id = id
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.trashClass(id)
    });
  }

  trashClass(id){
    this.spinner.show()
    this.Service.delEstadeClass(id,).subscribe(res => {
      if(res['success'] === true){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Genial!",
          text: '¡Clase Eliminada!',
          showConfirmButton: false,
          timer: 1500
        });
        this.listInit()
        this.spinner.hide()
      }
    });
  }

  addEstadoPublic(estado, id){
    this.spinner.show()
    const jsonbody = {
      "diplomado_clase_id" : id,
      "is_public" : estado
    };
    this.Service.actEstadeClass(jsonbody,).subscribe(res => {
      if(res['success'] === true){
        this.listInit()
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Genial!",
          text: '¡Clase Habilitada!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
}
