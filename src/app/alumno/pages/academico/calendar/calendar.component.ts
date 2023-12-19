import { Component, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import {CalendarOptions, EventInput, FullCalendarComponent} from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from "@fullcalendar/core/locales/es";
import localeEs from '@angular/common/locales/es';
import * as moment from 'moment';
import { AcademicoService } from 'src/app/alumno/services/academico.service';
import {registerLocaleData, DatePipe} from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [ DatePipe,{ provide: LOCALE_ID, useValue: 'es' }]
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions
  @ViewChild(FullCalendarComponent) ucCalendar: CalendarComponent;

  thisyear: any = moment().format('YYYY');
  thismonth: any = moment().format('MM');
  // calendarOptions: CalendarOptions = {
  //   initialView: 'dayGridMonth',
  //   // customButtons: {
  //   //     myCustomButton: {
  //   //         text: 'Create Appointment',
  //   //         click: function () {
  //   //             alert('clicked the custom button!');
  //   //         }
  //   //     }
  //   // },
  //   headerToolbar: {
  //     // left: 'prev,next myCustomButton',
  //     left: 'prev,next',
  //     center: 'title',
  //     right: 'today dayGridMonth,listMonth'
  //   },
  //   locale: esLocale,
  //   plugins: [dayGridPlugin,listPlugin],
  //   events: [
  //     {
  //       title: 'All Day Event',
  //       className: 'regular-event',
  //       start: this.thisyear + '-' + this.thismonth + '-01',
  //     },
  //     {
  //       title: 'Long Event',
  //       className: 'task-event',
  //       start: this.thisyear + '-' + this.thismonth + '-07',
  //       end: this.thisyear + '-' + this.thismonth + '-10'
  //     },
  //     {
  //       className: 'reminder-event',
  //       title: 'Repeating Event',
  //       start: this.thisyear + '-' + this.thismonth + '-09T16:00:00'
  //     },
  //     {
  //       title: 'Repeating Event',
  //       className: 'reminder-event',
  //       start: this.thisyear + '-' + this.thismonth + '-16T16:00:00'
  //     },
  //     {
  //       title: 'Conference',
  //       className: 'task-event',
  //       start: this.thisyear + '-' + this.thismonth + '-11',
  //       end: this.thisyear + '-' + this.thismonth + '-13'
  //     },
  //     {
  //       title: 'Meeting',
  //       className: 'meeting-event',
  //       start: this.thisyear + '-' + this.thismonth + '-12T10:30:00',
  //       end: this.thisyear + '-' + this.thismonth + '-10T12:30:00'
  //     },
  //     {
  //       title: 'Happy Hour',
  //       className: 'freetime-event',
  //       start: this.thisyear + '-' + this.thismonth + '-10T17:30:00'
  //     },
  //     {
  //       title: 'Dinner',
  //       className: 'regular-event',
  //       start: this.thisyear + '-' + this.thismonth + '-10T20:00:00'
  //     },
  //     {
  //       title: "John's Birthday",
  //       className: 'birthday-event',
  //       start: this.thisyear + '-' + this.thismonth + '-13T07:00:00'
  //     },
  //     {
  //       title: 'Click for Google',
  //       className: 'external-event',
  //       url: 'http://google.com/',
  //       start: this.thisyear + '-' + this.thismonth + '-28'
  //     }
  //   ]
  // };

  constructor(private service: AcademicoService, private spinner: NgxSpinnerService, private datePipe: DatePipe,) { }
  @Input()course:any;
  public date: { year: number, month: number };
  public model: NgbDateStruct;
  calendarEvents: EventInput[]=[]

  events:any
  data:any
  show_event:boolean;
  evento:any;

  ngOnInit(): void {
    this.serviceCalendar()
    //this.init('')
  }

  init(calendar){
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      titleFormat: { year: 'numeric', month: 'short' },
      locale: esLocale,
      headerToolbar:{
        right: 'prev,next',
        center: 'title',
        left: 'today dayGridMonth,listMonth'
      },
      height: 700,
      plugins: [dayGridPlugin,listPlugin],
      //dateClick: this.clickDay.bind(this), // bind is important!
      eventClick: this.handleDateClick.bind(this),
      events: calendar,
      //editable: true,
    };
    this.events = calendar.map((event) => {
      var nombrecortado = event.title.split(" ");
      var primernombre = nombrecortado[0];
      if(primernombre=='Pago'){
        event['backgroundColor']='#F93D3D'
      }
      if(primernombre=='Clase'){
        event['backgroundColor']='#F93D3D'
        event['borderColor']='#F93D3D'
        event['textColor']='black'
      }
      return event;
    })
  }

  serviceCalendar(){
    const now = new Date();
    let fecha_inicio = new Date(now.getFullYear(),0, 1).getTime()/1000;
    let fecha_end = new Date(now.getFullYear(), 12 , 0);
    fecha_end.setHours(23, 59, 59, 999);
    let fecha_fin = fecha_end.getTime()/1000
    this.spinner.show()
    const jsonbody = {
      "fecha_inicio" : fecha_inicio,
      "fecha_fin" : fecha_fin,
      "codigo_diplomado" : this.course
    };
    this.service.list_Calendar(jsonbody).subscribe(res => {
      if (res["success"] == true) {
        this.data = res['data'];
        this.calendarEvents=[]
        res['data'].forEach(i=>{
          let fecha, new_date, day, month, year, end_date,name, horas, minutos
          fecha=new Date(i.id*1000)
          day = fecha.getUTCDate()
          month= fecha.getUTCMonth()
          year= fecha.getUTCFullYear()
          horas=fecha.getUTCHours()-5
          minutos=fecha.getUTCMinutes()
          if(i.evento.pago){
            i.evento.pago.forEach(a=>{
              name=a.num_cuota
              new_date=this.datePipe.transform(new Date(year, month, day, horas, minutos, 0, 0), "yyyy-MM-dd HH:mm:ss")
            })
          }
          if(i.evento.clase){
            i.evento.clase.forEach(a=>{
              name='Clase '+a.clase+' Bloque '+a.modulo
              new_date=this.datePipe.transform(new Date(year, month, day, horas, minutos, 0, 0), "yyyy-MM-dd HH:mm:ss")
            })
          }
          if(i.evento.evaluacion){
            i.evento.evaluacion.forEach(a=>{
              fecha=new Date(a.fecha_inicio*1000)
              day = fecha.getUTCDate()
              month= fecha.getUTCMonth()
              year= fecha.getUTCFullYear()
              horas=fecha.getUTCHours()-5
              minutos=fecha.getUTCMinutes()

              let fecha_fin, day_fin, month_fin, year_fin, hora_fin, minuto_fin
              fecha_fin=new Date(a.fecha_fin*1000)
              day_fin = fecha_fin.getUTCDate()
              month_fin= fecha_fin.getUTCMonth()
              year_fin= fecha_fin.getUTCFullYear()
              hora_fin=fecha_fin.getUTCHours()-5
              minuto_fin=fecha_fin.getUTCHours()

              new_date=this.datePipe.transform(new Date(year, month, day, horas, minutos, 0, 0), "yyyy-MM-dd HH:mm:ss")
              name=a.name_evaluacion+' --> Bloque '+a.modulo
              end_date= this.datePipe.transform(new Date(year_fin, month_fin, day_fin, hora_fin, minuto_fin, 0, 0), "yyyy-MM-dd HH:mm:ss")
            })
          }
          let className='regular-event'
          if(i.evento.evaluacion){
            className='task-event'
            this.calendarEvents = this.calendarEvents.concat({
              title: name,
              className: className,
              start: new_date,
              end: end_date
            })
          }else{
            this.calendarEvents = this.calendarEvents.concat({
              title: name,
              className: className,
              start: new_date
            })
          }
        })
        this.init(this.calendarEvents)
      }
    }, error => {
      if (error.status === 400) {
        this.spinner.hide();
      }
      else{
        //this.toastr.error('¡No existe fecha de registro en el Modulo!', '¡Sin Datos :(!')
        this.spinner.hide();
      }
    });
  }

  handleDateClick(arg) {
    this.evento={
      'id': arg.event.id,
      'name': arg.event.title,
      'start': arg.event.start,
      'end': arg.event.end
    }
    this.show_event=true
  }

  clickDay(arg) {
    this.show_event=false
  }
}
