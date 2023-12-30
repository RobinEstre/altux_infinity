import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class PerfilComponent implements OnInit {
  @ViewChild('add') private modalContentAdd: TemplateRef<PerfilComponent>;
  private modalRefAdd: NgbModalRef;
  @ViewChild('modal_img') private modalContentIMG: TemplateRef<PerfilComponent>;
  private modalRefIMG: NgbModalRef;

  user_name:any= localStorage.getItem('user');

  constructor(private service: PerfilService, private spinner: NgxSpinnerService,private modalService: NgbModal, private fb: FormBuilder,
    public authenticationService: AuthenticationService,) {
  }
  
  formPass = this.fb.group({
    old_pass: [null, Validators.required],
    new_pass: [null, Validators.required],
    confirm_pass: [null, Validators.required]
  });
  profile:any; files: File[] = []; img_perfil:any
  userName:any; userImg:any;
  showpass: boolean = false; showpass2: boolean = false; showpass3: boolean = false;

  ngOnInit(): void {
    this.listProfile()
  }

  listProfile(){
    this.spinner.show()
    this.service.getInfoUser().subscribe(resp=>{
      if(resp.success){
        setTimeout(() => {
          this.profile=resp.user_profile.detail_user
          this.userName = localStorage.getItem('USERNAME');
          this.userImg = localStorage.getItem('IMG_USER');
          this.spinner.hide()
        }, 1500);
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

  openModal(){
    this.formPass.reset()
    this.modalRefAdd = this.modalService.open(this.modalContentAdd, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'sm' });
    this.modalRefAdd.result.then();
  }

  closeModal(){
    this.modalRefAdd.close()
  }

  openModalIMG(){
    this.files=[]
    this.formPass.reset()
    this.modalRefIMG = this.modalService.open(this.modalContentIMG, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'md' });
    this.modalRefIMG.result.then();
  }

  closeModalIMG(){
    this.modalRefIMG.close()
  }

  update(){}

  updateImg(data, index){
    Swal.fire({
      title: "¿Estás seguro de actualizar tu avatar de perfil ?",
      text: "Estas seleccionando el Avatar "+(index+1),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Actualizar!",
      cancelButtonText: "No, cancelar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeModalIMG()
        this.spinner.show()
        let body={
          "id_avatar":data.id
        }
        this.service.selectImgUser(body).subscribe(data => {
          if(data['success']==true){
            this.authenticationService.miVariable$.next(true);
            Swal.fire({
              position: "center",
              icon: "success",
              title: data['message'],
              showConfirmButton: false,
              timer: 1500
            });
            this.listProfile()
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
    });
  }

  subirIMG(){
    this.closeModalIMG()
    this.spinner.show()
    for(let a=0; a<this.files.length; a++){
      const formData = new FormData()
      formData.append('img_usuario', this.files[a], this.files[a].name);
      this.service.updateImgUser(formData).subscribe(data => {
        if(data['success']==true){
          this.authenticationService.miVariable$.next(true);
          Swal.fire({
            position: "center",
            icon: "success",
            title: data['message'],
            showConfirmButton: false,
            timer: 1500
          });
          this.listProfile()
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

  viewpassword() {
    this.showpass = !this.showpass;
  }

  viewpassword2() {
    this.showpass2 = !this.showpass2;
  }

  viewpassword3() {
    this.showpass3 = !this.showpass3;
  }

  onSelect(event: { addedFiles: any; }) {
    this.files=[]
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
