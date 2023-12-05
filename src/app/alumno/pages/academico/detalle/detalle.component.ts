import { Component, OnInit } from '@angular/core';
import {CalendarOptions, FullCalendarComponent} from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from "@fullcalendar/core/locales/es";
import * as moment from 'moment';
import { AcademicoService } from 'src/app/alumno/services/academico.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  thisyear: any = moment().format('YYYY');
  thismonth: any = moment().format('MM');
  courseCode: any;
 
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    // customButtons: {
    //     myCustomButton: {
    //         text: 'Create Appointment',
    //         click: function () {
    //             alert('clicked the custom button!');
    //         }
    //     }
    // },
    headerToolbar: {
      // left: 'prev,next myCustomButton',
      left: 'prev,next',
      center: 'title',
      right: 'today dayGridMonth,listMonth'
    },
    locale: esLocale,
    plugins: [dayGridPlugin,listPlugin],
    events: [
      {
        title: 'All Day Event',
        className: 'regular-event',
        start: this.thisyear + '-' + this.thismonth + '-01',
      },
      {
        title: 'Long Event',
        className: 'task-event',
        start: this.thisyear + '-' + this.thismonth + '-07',
        end: this.thisyear + '-' + this.thismonth + '-10'
      },
      {
        className: 'reminder-event',
        title: 'Repeating Event',
        start: this.thisyear + '-' + this.thismonth + '-09T16:00:00'
      },
      {
        title: 'Repeating Event',
        className: 'reminder-event',
        start: this.thisyear + '-' + this.thismonth + '-16T16:00:00'
      },
      {
        title: 'Conference',
        className: 'task-event',
        start: this.thisyear + '-' + this.thismonth + '-11',
        end: this.thisyear + '-' + this.thismonth + '-13'
      },
      {
        title: 'Meeting',
        className: 'meeting-event',
        start: this.thisyear + '-' + this.thismonth + '-12T10:30:00',
        end: this.thisyear + '-' + this.thismonth + '-10T12:30:00'
      },
      {
        title: 'Happy Hour',
        className: 'freetime-event',
        start: this.thisyear + '-' + this.thismonth + '-10T17:30:00'
      },
      {
        title: 'Dinner',
        className: 'regular-event',
        start: this.thisyear + '-' + this.thismonth + '-10T20:00:00'
      },
      {
        title: "John's Birthday",
        className: 'birthday-event',
        start: this.thisyear + '-' + this.thismonth + '-13T07:00:00'
      },
      {
        title: 'Click for Google',
        className: 'external-event',
        url: 'http://google.com/',
        start: this.thisyear + '-' + this.thismonth + '-28'
      }
    ]
  };

  constructor(private service: AcademicoService, private spinner: NgxSpinnerService,private route: ActivatedRoute,) { 
    //const name = Calendar.name; // add this line in your constructor
    this.courseCode = this.route.snapshot.params['code'];
  }

  course:any; modulo:any; modulos:any

  data_prueba:any=[
    {
      id:1,
      name:"Bloque 1: Introducción a la Enfermería Estética"
    },
    {
      id:2,
      name:"Bloque 2: Estética Facial I"
    },
    {
      id:3,
      name:"Bloque 3: Estética Facial II"
    },
    {
      id:4,
      name:"Bloque 4: Estética Corporal I"
    },
    {
      id:5,
      name:"Bloque 5: Estética Corporal II"
    },
    {
      id:6,
      name:"Bloque 6: Asistencia en Procedimientos Médicos"
    },
    {
      id:7,
      name:"Bloque 7: Sustentación de Casos Clínicos"
    },
  ]

  ngOnInit(): void {
    this.getModuloActual()
  }

  getModuloActual(){
    this.spinner.show()
    this.service.getModActual(this.courseCode).subscribe(resp => {
      if (resp.success){
        if (resp['modulo']) {
          this.modulo=resp.modulo
          this.getDetailDiplomado()
        }else {
          this.getDetailDiplomado()
        }
      }
    })
  }

  getDetailDiplomado() {
    this.service.getDetailDiplomadoByCode(this.courseCode).subscribe(resp => {
      if (resp.success){
        let data:any=[]
        this.course=resp.data
        resp.data.modulos.forEach(i=>{
          let clase=''
          if(this.modulo.numero_modulo==i.module_number){clase='show'}
          data.push({
            "id": i.id,
            "module_name": i.module_name,
            "module_number": i.module_number,
            "module_detail": i.module_detail,
            "clase": i.clase,
            "class": clase
          })
        })
        this.modulos=data
        this.spinner.hide()
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

  innermenuopen() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('innermenu-close');
  }
}
