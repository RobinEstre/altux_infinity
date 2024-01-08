import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { VentasService } from '../../service/ventas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  @ViewChild('modal_ficha') private modalContent: TemplateRef<RegistroComponent>;
  private modalRef: NgbModalRef;

  constructor(private service: VentasService, private spinner: NgxSpinnerService,private modalService: NgbModal,) { }

  ngOnInit(): void {
  }

  openModal(){
    this.modalRef = this.modalService.open(this.modalContent, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRef.result.then();
  }

  closeModal(){
    this.modalRef.close()
  }
}
