import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { VentasService } from '../../service/ventas.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
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
  token = localStorage.getItem('token');

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  constructor(public service: VentasService, private fb: FormBuilder, private spinner: NgxSpinnerService) { }

  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  registro: any[] = [];
  grupo: any[] = [
    {
      'id': 'matriculacuota',
      'name_doc': 'Matrícula Cuota',
    },
    {
      'id': 'matriculacontado',
      'name_doc': 'Matrícula Contado',
    },
  ];
  verGrupo: string = '';
  grupos = this.fb.group({
    grupo: ['',],
  });

  ngOnInit(): void {
    this.listOrdenes();
  }

  listOrdenes() {
    this.spinner.show();
    this.grupos.controls['grupo'].setValue('matriculacuota');
    this.dtOptions={
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      lengthMenu: [5, 10, 25],
      processing: true,
      language: AlumnosComponent.spanish_datatables
    }
    const jsonbody = {
      "type_matricula" : 'matriculacuota',
    };
    this.service.listregistro(jsonbody).subscribe(data => {
      let dip=[];
      data['data'].forEach(i=>{
        const split = i.courses_name.split(' ')
        split.splice(0, 3);
        let name=split.map(x=>x).join(" ")
        dip.push({
          'courses_name': name,
          'apellidos': i.apellidos,
          'email': i.email,
          'fecha_matricula': i.fecha_matricula,
          'is_paid': i.is_paid,
          'nombres': i.nombres,
          'phone': i.phone,
          'total_price': i.total_price,
          'vendedor_id': i.vendedor_id,
          'venta_id': i.venta_id,
          'student_id': i.student_id,
          'diplomado_code': i.diplomado_code,
        })
      })
      this.registro = dip;
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
      this.spinner.hide();
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
      this.registro=[]
      this.dtTrigger.next();
      this.spinner.hide()
    });
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
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
      this.obtenerEstudiantes()
    });
  }

  obtenerEstudiantes(){
    this.verGrupo=this.grupos.controls['grupo'].value;
    const jsonbody = {
      "type_matricula" : this.verGrupo,
    };
    this.spinner.show();
    this.service.listregistro(jsonbody).subscribe(data => {
      if (data["success"] === true) {
        this.registro = (data as any).data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
        this.spinner.hide();
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
      this.registro=[]
      this.dtTrigger.next();
      this.spinner.hide()
    });
  }

  generateCode(id, nombre){
    let name=nombre['nombres']+' '+nombre['apellidos']
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
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
        this.reenviarAcceso(id, nombre.diplomado_code)
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
}