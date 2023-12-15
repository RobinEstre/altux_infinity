import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  id_examen:any;
  courseCode: any;

  constructor(private spinner: NgxSpinnerService,private routes: Router,private route: ActivatedRoute,) {
    this.id_examen = this.route.snapshot.params['id_examen'];
    this.courseCode = this.route.snapshot.params['code'];
  }

  @Input()examen:any;

  _second = 1000; _minute = this._second * 60; _hour = this._minute * 60; _day = this._hour * 24;
  end: any; now: any; day: any; hours: any; minutes: any; seconds: any; distance:any; source=timer(0,1000);

  ngOnInit(): void {
    setTimeout(() => {
      this.now = new Date()
      this.end = new Date(this.examen.tiempo_fin * 1000);
      //let distance = this.end - this.now;
      //console.log(distance)var day1 = new Date('08/25/2020');
      // var fecha1 = moment(this.now, "YYYY-MM-DD HH:mm:ss");
      // var fecha2 = moment(this.end, "YYYY-MM-DD HH:mm:ss");
      
      // var diff = fecha2.diff(fecha1, 'h'); // Diff in days
      // console.log(diff);
      
      // var diff = fecha2.diff(fecha1, 'm'); // Diff in hours
      // console.log(diff);

      this.source.subscribe(t => {
        let resta = (this.now)/1000+(t)
        let fecha = new Date(resta*1000)
        this.showDate(fecha);
      });
    }, 1000);
  }

  showDate(fecha){
    //console.log(this.distance)
    if(this.distance<0){
      this.terminate()
      return
    }
    this.distance = this.end - fecha;
    this.day = Math.floor(this.distance / this._day);
    this.hours = Math.floor((this.distance % this._day) / this._hour);
    this.minutes = Math.floor((this.distance % this._hour) / this._minute);
    this.seconds = Math.floor((this.distance % this._minute) / this._second);
  }

  terminate(){
    this.spinner.show('terminado')
    setTimeout(() => {
      // spinner ends after 5 seconds
      this.spinner.hide('terminado');
      const url = '/alumno/academico/'+this.courseCode
      return this.routes.navigate([url])
    }, 5000);
  }
}
