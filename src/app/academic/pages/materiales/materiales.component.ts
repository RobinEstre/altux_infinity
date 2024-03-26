import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, Validators} from "@angular/forms";
import {NgbModal, NgbModalConfig, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { MaterialesService } from '../../services/materiales.service';
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {
  @ViewChild('docs') private modalContentDoc: TemplateRef<MaterialesComponent>;
  private modalRefDoc: NgbModalRef;
  @ViewChild('terminate') private modalContentTerminate: TemplateRef<MaterialesComponent>;
  private modalRefTerminate: NgbModalRef;

  constructor(private fb: FormBuilder,private service: MaterialesService,private spinner: NgxSpinnerService, private modalService: NgbModal) { }

  formgrupos = this.fb.group({
    grupo: [null],
    diplomado: [null],
    modulo: [null]
  });

  diplomado: any; modulo:any; code:any; mostrar:boolean; nombre:any; files:any; materials:any; tipo_material:any; tipos:any; nombre_tipo:any;
  id_module:any; id_tipo:any; num_module:any; url_doc:any;

  ngOnInit(): void {
    this.listDiplomado()
  }

  listDiplomado() {
    this.service.listar_diplomados().subscribe(data => {
      data['data'].forEach(i=>{
        // const split = i.courses_name.split(' ')
        // split.splice(0, 3);
        // let name=split.map(x=>x).join(" ")
        // i.courses_name= name
      })
      this.diplomado = data['data'];
    });
  }

  listGroup(event) {
    try {
      this.nombre = event.courses_name
      this.code = event.courses_code
      this.mostrar = false
      this.modulo=null
      this.materials=null
      this.tipo_material=null
      if(event!=null){
        this.spinner.show()
        this.service.list_module(this.code).subscribe(resp => {
          if (resp['success'] === true){
            let data:any=[], num=0
            resp.data.forEach(i=>{
              num++
              let bg_color
              if(i.module_number%2==0){
                bg_color = ""
              }else{
                bg_color = "color-file"        
              }
              let clase='', name
              if(this.modulo){if(this.modulo.numero_modulo==i.module_number){clase='show'}}
              const split = i.module_name.split(' ')
              split.splice(0, 2);
              name=split.map(x=>x).join(" ")
              data.push({
                "id": i.id,
                "module_name": name,
                "module_number": i.module_number,
                "module_detail": i.module_detail,
                'bg_color': bg_color,
                "clase": i.clase,
                "class": clase
              })
            })
            this.modulo=data
            this.spinner.hide()
            this.getMaterials(data)
          }
        })
      }else{
      }
    }catch (e) {
      this.mostrar = false
      this.modulo=null
      this.materials=null
      this.tipo_material=null
    }
  }

  getMaterials(resp){
    const bloques=[{bloque:1,data:null},{bloque:2,data:null},{bloque:3,data:null},{bloque:4,data:null},
    {bloque:5,data:null},{bloque:6,data:null},{bloque:7,data:null}]
    let n=0
    for(let i:any=0; i<resp.length;i++){
      const body = {
        "course_code": this.code,
        "num_module": i+1
      };
      this.service.getStudyMaterials(body).subscribe(res => {
        if(res.success){
          bloques.forEach(a=>{
            if(a.bloque==i+1){
              a.data=res.material
            }
          })
        }
        this.materials = bloques;
        let data:any = [];
        res.material.forEach(i => {
          if (data.length > 0){
            const found = data.find(
                (item) => item.type_material_id == i.type_material_id
            );
            if (found){
              console.log('no encontro el valor')
            }else {
              let json = {
                "type_material_id": i.type_material_id,
                "tipmat_name": i.tipmat_name,
              }
              data.push(json)
            }
          }else{
            let json = {
              "type_material_id": i.type_material_id,
              "tipmat_name": i.tipmat_name,
            }
            data.push(json)
          }
        })
        this.tipo_material = data
      })
    }
  }

  // getMaterials(num_module) {
  //   this.num_module=num_module
  //   const body = {
  //     "course_code": this.code,
  //     "num_module": num_module + 1
  //   };
  //   this.service.getStudyMaterials(body).subscribe(res => {
  //     this.materials = res.material;
  //     this.tipoMaterial()
  //   })
  // }

  tipoMaterial(){
    this.service.listTipoMaterial().subscribe(res => {
      this.tipo_material = res['data'];
    })
  }

  openModal(id_tipo, id_modulo, name){
    this.nombre_tipo='Tipo Material: '+name
    this.id_module=id_modulo
    this.id_tipo= id_tipo
    this.modalRefTerminate = this.modalService.open(this.modalContentTerminate, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'md' });
    this.modalRefTerminate.result.then();
  }

  closeModalTerminate() {
    this.modalRefTerminate.close();
  }

  openModalDoc(url){
    this.url_doc=url
    this.modalRefDoc = this.modalService.open(this.modalContentDoc, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRefDoc.result.then();
  }

  closeModal(){
    this.modalRefDoc.close()
  }

  onSelect(event: { addedFiles: any; }) {
    this.files=[]
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  addMaterial(){
    this.spinner.show()
    const formData = new FormData()
    formData.append("codigo_diplomado", this.code);
    formData.append("modulo_id", this.id_module);
    formData.append("tipo_material_id", this.id_tipo);
    for (let i = 0; i < this.files.length; i++) {
      formData.append('material', this.files[i], this.files[i].name);
    }
    this.service.addMaterial(formData).subscribe(data => {
      if(data['success']==true){
        this.files=[]
        this.spinner.hide()
        this.materials=null
        this.tipo_material=null
        this.getMaterials(this.modulo)
        this.closeModalTerminate()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: "Registro Exitoso",
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  deleteObservation(id){
    this.spinner.show()
    this.service.deleteMaterial(id).subscribe(res => {
      if(res['success']==true){
        this.spinner.hide()
        this.materials=null
        this.tipo_material=null
        this.getMaterials(this.modulo)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Genial :)!",
          text: "Material Eliminado",
          showConfirmButton: false,
          timer: 2000
        });
      }
      else{
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error!",
          text: "No se Pudo Eliminar el Material",
          showConfirmButton: false,
          timer: 2000
        });
      }
    })
  }

  withConfirmation(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro de Eliminar el Material?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Seguro',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteObservation(id)
      }
    })
  }
}
