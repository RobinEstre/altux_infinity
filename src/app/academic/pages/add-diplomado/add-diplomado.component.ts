import {Component, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { DiplomadosService } from '../../services/diplomados.service';

@Component({
  selector: 'app-add-diplomado',
  templateUrl: './add-diplomado.component.html',
  styleUrls: ['./add-diplomado.component.scss']
})
export class AddDiplomadoComponent implements OnInit {
  @ViewChild('diplo') private modalControlDiplomado: TemplateRef<AddDiplomadoComponent>;
  private modalConDiplomado: NgbModalRef;
  public token = localStorage.getItem('token');

  ipt_cbx_diplomado = false;
  alldiplomados: any[] = [];
  teachers: any[] = [];
  detail_diplomado: any;

  formDiplomado: FormGroup = this.fb.group({
    type_publicacion: [null, Validators.required],
    universidades: [null, Validators.required],
    cbx_diplomado: [null],
    sat: [null, Validators.required],
    name_diplomado: ['', Validators.required],
    vacantes: ['', Validators.required],
    certificacion: ['', Validators.required],
    dirigido: ['', Validators.required],
    desc_general: ['', Validators.required]
  });

  tipo_publicacion=[
    {
      'id': 'nueva',
      'name': 'Diplomado Nuevo'
    },
    {
      'id': 'existente',
      'name': 'Diplomado Existente'
    }
  ]

  code_url:any

  data= []; sat:any=[]; universidades:any=[]; modulos:any=[]
  is_modulos:boolean=false; is_ventas:boolean=false; valid_modulos:boolean=true; new_modulos:any; valid_pagos:boolean=true; new_pagos:any;
  valid_images:boolean=false; data_ventas:any=null

  constructor(private fb: FormBuilder, public diplomadoService: DiplomadosService, private spinner: NgxSpinnerService, 
              private modalService: NgbModal, private route: ActivatedRoute, private routes: Router,) {
    this.code_url = this.route.snapshot.params['code'];
  }

  url_img_750x500: File[]=[];url_img_1200x630: File[]=[];url_img_1920x500: File[]=[];url_img_1920x700: File[]=[];url_img_brochure: File[]=[];

  ngOnInit(): void {
    this.listarTodosLosDiplomados()
    this.listInit()
  }

  listInit(){
    this.listUniversidades()
  }

  listarTodosLosDiplomados(){
    this.diplomadoService.listDiplomados().subscribe(dat => {
      let dip = [];
      if (dat['success'] === true){
        dat['data'].forEach(i => {
          var splitted = i.name.split(" ");
          var name = i.name.split(" ");
          splitted.splice(0, 3);
          name.splice(0, 2);
          var primero = name.toString().charAt(0)
          var cadena = splitted.toString();
          let nueva = 'D' + primero + ': ' + cadena.replace(/_|#|-|@|<>|,/g, " ")
          dip.push({
            'courses_name': nueva,
            'courses_code': i.id
          })
        })
        this.alldiplomados = dip;
      }
    }, error => {
    });
  }

  listUniversidades(){
    this.spinner.show()
    this.formDiplomado.disable()
    this.formDiplomado.controls['type_publicacion'].enable()
    this.diplomadoService.listUniversidades().subscribe(data =>{
      if(data['success'] === true) {
        this.universidades = data['data']
        this.listSat()
      }
    }, error => {
    });
  }

  listSat(){
    this.diplomadoService.listSat().subscribe(data =>{
      if(data['status'] === true) {
        this.sat = data['data']
        this.completeTemporal()
      }
    }, error => {
    });
  }

  completeTemporal(){
    this.diplomadoService.listDiplomadosTemporales().subscribe(resp =>{
      let data=null
      if(resp['success'] === true) {
        resp['data'].forEach(i=>{
          if(i.url_code==this.code_url){
            if(Object.keys(i.pagos).length!=0){
              this.data_ventas={
                "ventas": i.pagos,                
                "inicio": i.start_date_course,
                "fin": i.end_date_course,
              }
            }
            if(Object.keys(i.url_imagenes).length!=0){
              this.valid_images=true
            }
            data=i
            if(i.modulos.modulos){this.modulos=i.modulos.modulos}
            else{this.modulos=[]}
          }
        })
        if(data.details.diplomado_name!=null){
          let des_general = data.information['descripcion'][0];
          let dirigido = data.information['dirigido'][0];
          let certificacion = data.information['certificacion'][0];
          this.formDiplomado.controls['type_publicacion'].setValue('nueva');
          this.formDiplomado.controls['vacantes'].setValue(data.information.cantidad_vacantes);
          this.formDiplomado.controls['name_diplomado'].setValue(data.details.diplomado_name);
          this.formDiplomado.controls['universidades'].setValue(data.details.universidad_id);
          this.formDiplomado.controls['sat'].setValue(data.details.sac_id);
          this.formDiplomado.controls['desc_general'].setValue(des_general);
          this.formDiplomado.controls['dirigido'].setValue(dirigido);
          this.formDiplomado.controls['certificacion'].setValue(certificacion);
          if(data.details.diplomado_name_id!=null){
            this.ipt_cbx_diplomado = true;
            this.formDiplomado.controls['type_publicacion'].setValue('existente');
            this.formDiplomado.controls['cbx_diplomado'].setValue(data.details.diplomado_name_id);
          }
          this.formDiplomado.enable()
        }
        this.spinner.hide()
      }
    }, error => {
    });
  }

  ListarDiplomadoByCode(code): void {
    this.diplomadoService.listDiplomadoId(code, ).subscribe(resp => {
      if (resp['success'] === true){
        this.spinner.show()
        let data={
          "url_img_750x500":resp['detalle'].other_description.url_image_video,
          "url_img_1200x630":resp['detalle'].other_description.url_img_meta_tag,
          "url_img_1920x500":resp['detalle'].other_description.image_shoopingcart,
          "url_img_1920x700":resp['detalle'].other_description.url_img_banner_main,
          "url_img_brochure":resp['detalle'].other_description.url_brochure
        }
        this.guardarImagenes(data)
        this.detail_diplomado = resp['detalle']['other_description']['descripcion_general'];
        this.modulos=resp['detalle']['other_description']['plan_estudios']
        console.log(this.modulos)
        let des_general = this.detail_diplomado['curso_descripcion'][0];
        let dirigido = this.detail_diplomado['dirigido'][0];
        let certificacion = this.detail_diplomado['certificacion'][0];

        this.formDiplomado.controls['vacantes'].setValue(resp['curso']['limit_students']);
        this.formDiplomado.controls['name_diplomado'].setValue(resp['curso']['diplomado_name']['name']);
        this.formDiplomado.controls['desc_general'].setValue(des_general);
        this.formDiplomado.controls['dirigido'].setValue(dirigido);
        this.formDiplomado.controls['certificacion'].setValue(certificacion);
      }
    }, error => {
    });
  }

  diplomadoSelected(event){
    try {
      const val = event.courses_code;
      this.ListarDiplomadoByCode(val);
    }
    catch (e) {
      this.formDiplomado.controls['name_diplomado'].setValue('');
      this.formDiplomado.controls['desc_general'].setValue('');
      this.formDiplomado.controls['dirigido'].setValue('');
      this.formDiplomado.controls['certificacion'].setValue('');
      this.formDiplomado.controls['vacantes'].setValue('');
      this.formDiplomado.controls['sat'].setValue(null);
      this.formDiplomado.controls['universidades'].setValue(null);
    }
  }

  SelectTypePublication(event){
    this.is_modulos=false
    try {
      this.formDiplomado.enable()
      const val = event.id;
      if (val === "existente") {
        //this.listarTodosLosDiplomados();
        this.ipt_cbx_diplomado = true;
      } else {
        this.ipt_cbx_diplomado = false
        this.formDiplomado.controls['name_diplomado'].setValue('');
        this.formDiplomado.controls['desc_general'].setValue('');
        this.formDiplomado.controls['dirigido'].setValue('');
        this.formDiplomado.controls['certificacion'].setValue('');
        this.formDiplomado.controls['vacantes'].setValue('');
        this.formDiplomado.controls['sat'].setValue(null);
        this.formDiplomado.controls['universidades'].setValue(null);
        this.formDiplomado.controls['cbx_diplomado'].setValue(null);
      }
    }
    catch (e) {
      this.ipt_cbx_diplomado = false
      this.formDiplomado.reset()
      this.formDiplomado.disable()
      this.formDiplomado.controls['type_publicacion'].enable()
    }
  }

  openModal() {
    this.modalConDiplomado = this.modalService.open(this.modalControlDiplomado, { centered: true, size: 'md', keyboard: false });
    this.modalConDiplomado.result.then();
  }

  closeModal() {
    this.modalConDiplomado.close()
  }

  onSelect1920x500(event) {
    this.valid_images=false
    this.url_img_1920x500.push(...event.addedFiles);
    console.log(this.url_img_1920x500);
  }
  
  onRemove1920x500(event) {
    this.valid_images=false
    this.url_img_1920x500.splice(this.url_img_1920x500.indexOf(event), 1);
  }

  onSelect1920x700(event) {
    this.valid_images=false
    this.url_img_1920x700.push(...event.addedFiles);
    console.log(this.url_img_1920x700);
  }
  
  onRemove1920x700(event) {
    this.valid_images=false
    this.url_img_1920x700.splice(this.url_img_1920x700.indexOf(event), 1);
  }

  onSelect1200x630(event) {
    this.valid_images=false
    this.url_img_1200x630.push(...event.addedFiles);
    console.log(this.url_img_1200x630);
  }
  
  onRemove1200x630(event) {
    this.valid_images=false
    console.log(event);
    this.url_img_1200x630.splice(this.url_img_1200x630.indexOf(event), 1);
  }

  onSelect750x500(event) {
    this.valid_images=false
    this.url_img_750x500.push(...event.addedFiles);
    console.log(this.url_img_750x500);
  }
  
  onRemove750x500(event) {
    this.valid_images=false
    this.url_img_750x500.splice(this.url_img_750x500.indexOf(event), 1);
  }

  onSelectbrochure(event) {
    this.valid_images=false
    for (const item of event.target.files) {
      this.url_img_brochure.push(item);
    }
    console.log(this.url_img_brochure)
  }
  
  onRemovebrochure(index) {
    this.valid_images=false
    this.url_img_brochure.splice(index, 1);
  }

  ventas(){
    this.is_ventas=false
  }

  PublishDiplomado(){
    //this.is_modulos=true
    this.spinner.show()
    let id_diplo=null
    if(this.formDiplomado.controls['cbx_diplomado'].value!=null){id_diplo=this.formDiplomado.controls['cbx_diplomado'].value}
    let diplo={
      "diplomado_name_id":id_diplo,
      "diplomado_name": this.formDiplomado.controls['name_diplomado'].value,
      "sac_id": this.formDiplomado.controls['sat'].value,
      "cantidad_vacantes": this.formDiplomado.controls['vacantes'].value,
      "universidad_id": this.formDiplomado.controls['universidades'].value,
      "universidad_name":null,
      "descripcion":[
        this.formDiplomado.controls['desc_general'].value
      ],
      "certificacion":[
        this.formDiplomado.controls['certificacion'].value
      ],
      "dirigido":[
        this.formDiplomado.controls['dirigido'].value
      ]
    }
    this.diplomadoService.saveInfoTemporal(this.code_url, diplo, ).subscribe(resp=>{
      if(resp['success']==true){
        if(this.modulos.length==0){
          if(this.formDiplomado.controls['cbx_diplomado'].value!=null){
            this.diplomadoService.listDiplomadoId(this.formDiplomado.controls['cbx_diplomado'].value, ).subscribe(resp => {
              if (resp['success'] === true){
                this.modulos=resp['detalle']['other_description']['plan_estudios']
                this.is_modulos=true
                this.spinner.hide()
              }
            }, error => {
            });
          }else{
            this.is_modulos=true
            this.spinner.hide()
          }
        }else{
          this.is_modulos=true
          this.spinner.hide()
        }
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

  saveModulos(data){
    console.log(data)
    this.new_modulos=data
    let id= data.length
    if(data[id-1].status==true){this.valid_modulos=false}else{this.valid_modulos=true}
    //this.valid_modulos=false
  }
  
  guardarModulos(){
    this.spinner.show()
    let data=[], num=1
    this.new_modulos.forEach(i=>{
      let temario=[], fechas=[], num_fechas=1
      i.temario.forEach(t=>{
        temario.push(t)
      })
      i.fechas_clases.forEach(f=>{
        let date:any
        if(f.date_class){date=f.date_class}
        else{date=(new Date(f.fecha_clase).getTime())/1000}
        fechas.push({
          number_class:num_fechas,
          date_class: date
        })
        num_fechas++
      })
      let fecha_final:any= (new Date(i.fecha_final).getTime())/1000
      let fecha_susti:any= (new Date(i.fecha_susti).getTime())/1000
      data.push({
        "module_number":num,
        "docente_id":i.docente,
        "module_name":i.tema,
        "details_module":temario,
        "fechas_clases":fechas,
        "fecha_inicio_final":fecha_final,
        "fecha_inicio_sustitutorio":fecha_susti
      })
      num++
    })
    let body= {
      "data": data
    }
    this.diplomadoService.saveModulosTemporal(this.code_url, body, ).subscribe(resp=>{
      if(resp['success']==true){
        this.is_ventas=true
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

  subirImagenes(){
    this.spinner.show()
    let data={}
    let name_file=[
      {
        nombre: "url_img_750x500",
        data: this.url_img_750x500
      },
      {
        nombre: "url_img_1200x630",
        data: this.url_img_1200x630
      },
      {
        nombre: "url_img_1920x500",
        data: this.url_img_1920x500
      },
      {
        nombre: "url_img_1920x700",
        data: this.url_img_1920x700
      },
      {
        nombre: "url_img_brochure",
        data: this.url_img_brochure
      },
    ]    
    for(let a=0; a<5; a++){
      const formData = new FormData()
      formData.append("bucket", 'oea-files');
      formData.append("nombre", name_file[a].data[0].name);
      formData.append("folder", 'diplomados/');
      formData.append('files', name_file[a].data[0], name_file[a].data[0].name);
      this.diplomadoService.subirImagenes(formData, ).subscribe(resp=>{
        if(resp['success']==true){
          let url= resp['data'][0]['url']
          data[name_file[a].nombre] = url;
          if(Object.keys(data).length==5){
            this.guardarImagenes(data)
          }
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

  guardarImagenes(data_img){
    let data={
      "data_img":data_img  
    }
    this.diplomadoService.saveImagesTemporal(this.code_url, data).subscribe(resp=>{
      if(resp['success']==true){
        this.valid_images=true
        this.spinner.hide()
        this.closeModal()
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
    console.log(data)
  }

  savePagos(data){
    console.log(data)
    this.new_pagos=data
    if(this.new_pagos=='vacio'){this.valid_pagos=true}else{this.valid_pagos=false}
    //this.valid_modulos=false
  }

  guardarPagos(){Swal.fire({
    title: `Estas seguro de finalizar y crear nuevo Diplomado?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#51BB25',
    cancelButtonColor: '#F31F1F',
    confirmButtonText: 'Si, crear!',
    cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show()
        if(this.new_pagos=='lleno'){
          this.crearDiplomado()
        }else{
          this.diplomadoService.savePagosTemporal(this.code_url, this.new_pagos, ).subscribe(resp=>{
            if(resp['success']==true){
              this.crearDiplomado()
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
      }
    })
  }

  crearDiplomado(){
    this.diplomadoService.crearDiplomado(this.code_url, ).subscribe(resp=>{
      if(resp['success']==true){
        let url:any = 'academico/publicar-diplomado/'
        this.spinner.hide()
        this.routes.navigate([url])
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Nuevo Diplomado Creado',
          showConfirmButton: false,
          timer: 3000
        })
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
}
