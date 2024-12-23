import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import { AcademicService } from '../../services/academic.service';
declare var $: any;

@Component({
  selector: 'app-prioridad',
  templateUrl: './prioridad.component.html',
  styleUrls: ['./prioridad.component.scss']
})
export class PrioridadComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private service: AcademicService) { }

  leads:any

  ngOnInit(): void {
  }

  listInit(){
    this.service.listPrioridadLeads().subscribe(resp => {
      if(resp.data){
        this.leads = resp.data
      }
    })
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.leads, event.previousIndex, event.currentIndex);
  // }
}
