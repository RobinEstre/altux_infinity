import {Component, Input, Output, EventEmitter, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DiplomadosService } from 'src/app/academic/services/diplomados.service';

@Component({
  selector: 'app-plan-estudio',
  templateUrl: './plan-estudio.component.html',
  styleUrls: ['./plan-estudio.component.scss'],
  providers: [DatePipe]
})
export class PlanEstudioComponent implements OnInit {
  @ViewChild('diplo') private modalControlDiplomado: TemplateRef<PlanEstudioComponent>;
  private modalConDiplomado: NgbModalRef;

  @Output('miEvento') miPrueba = new EventEmitter<any>()

  @Input() data_modulos:any
  code_url:any

  constructor(private fb: FormBuilder, public diplomadoService: DiplomadosService, private spinner: NgxSpinnerService, 
    private modalService: NgbModal, private route: ActivatedRoute,private datePipe: DatePipe,) {
    this.code_url = this.route.snapshot.params['code'];
    this.formFechas=this.fb.group({
      data: this.fb.array([]) ,
    })
  }

  formFechas: FormGroup;
  formModule = this.fb.group({
    temario: [''],
    tema: ['', Validators.required],
    fecha_final: ['', Validators.required],
    fecha_sust: ['', Validators.required],
    docente: [null, Validators.required],
  });

  modulos:any=[]; detalle:any; temarios:any=[]; docente:any=[]; disable_button:boolean=false

  ngOnInit(): void {
    this.listAllTeacher()
  }

  listinit(){
    if(this.data_modulos[0].name_modulo){
      for(let i=0; i<this.data_modulos.length; i++){
        this.modulos.push({
          id:i,
          nombre:this.data_modulos[i].name_modulo,
          data:this.data_modulos[i].detalle_module,
          status:false,
          fechas_clases:null,
          fecha_final:null,
          fecha_susti:null,
          docente:null,
          tema:null,
          temario:null
        })
      }
    }else if(this.data_modulos[0].module_name){
      for(let i=0; i<this.data_modulos.length; i++){
        let date_final= (new Date(this.data_modulos[i].fecha_inicio_final*1000).getTime())
        let final= this.datePipe.transform(date_final,"yyyy-MM-dd")
        let date_sust= (new Date(this.data_modulos[i].fecha_inicio_sustitutorio*1000).getTime())
        let susti= this.datePipe.transform(date_sust,"yyyy-MM-dd")
        let temario=[]
        this.data_modulos[i].details_module.forEach(a=>{
          temario.push(a)
        })
        this.modulos.push({
          id:i,
          nombre:this.data_modulos[i].module_name,
          data:this.data_modulos[i].details_module,
          status:true,
          fechas_clases:this.data_modulos[i].fechas_clases,
          fecha_final:final,
          fecha_susti:susti,
          docente:this.data_modulos[i].docente_id,
          tema:this.data_modulos[i].module_name,
          temario: temario
        })
      }
    }else{
      for(let i=0; i<1; i++){
        this.modulos.push({
          id:i,
          nombre:'Módulo '+(i+1),
          status:false,
          fechas_clases:null,
          fecha_final:null,
          fecha_susti:null,
          docente:null,
          tema:null,
          temario:null
        })
      }
    }
    // console.log(this.data_modulos)
    // console.log(this.modulos)
    this.miPrueba.emit(this.modulos)
  }

  listAllTeacher(){
    this.diplomadoService.getInfoTeacher().subscribe(data =>{
      if(data['success'] === true) {
        this.docente = data['data']
        this.listinit()
      }
    }, error => {});
  }

  data(): FormArray {
    return this.formFechas.get("data") as FormArray
  }

  addFecha() {
    let fec=this.formFechas.controls['data'].value
    console.log(fec.length)
    if(fec.length==2){
      this.data().push(this.newFecha());
    }else{
      console.log('no se puede más')
    }
  }

  newFecha(): FormGroup {
    return this.fb.group({
      fecha_clase: ['']
    })
  }

  newModulo(){
    let i= this.modulos.length
    this.modulos.push({
      id:i,
      nombre:'Módulo '+(i+1),
      status:false,
      fechas_clases:null,
      fecha_final:null,
      fecha_susti:null,
      docente:null,
      tema:null,
      temario:null
    })
    this.miPrueba.emit(this.modulos)
  }

  deleteModule(index) {
    this.modulos.splice(index, 1);
    this.miPrueba.emit(this.modulos)
  }

  removeData(empIndex:number) {
    console.log(empIndex)
    this.data().removeAt(empIndex);
  }

  openModal(detalle) {
    this.formModule.reset()
    this.temarios=[]
    this.detalle=detalle
    this.completarData(detalle)
    this.modalConDiplomado = this.modalService.open(this.modalControlDiplomado, { centered: true, size: 'xl', keyboard:false });
    this.modalConDiplomado.result.then();
  }

  closeModal(){
    this.modalConDiplomado.close()
    this.formFechas.value.data.length
    this.data().removeAt(0);
    this.data().removeAt(1);
    this.data().removeAt(2);
    for(let i:number=0; i<this.formFechas.value.data.length; i++){
      this.data().removeAt(i);
    }
  }

  completarData(detalle){
    if(detalle.status==false){
      this.formModule.controls['tema'].setValue(detalle.nombre)
      console.log('false')
      if(detalle.data){
        detalle.data.forEach(i=>{
          this.temarios.push(i.nombre_temario)
        })
      }
      for(let i=0; i<2; i++){
        this.data().push(this.fb.group({
          fecha_clase: ['', Validators.required]
        }));
      }
    }else{
      console.log('true')
      this.formModule.controls['tema'].setValue(detalle.nombre)
      this.formModule.controls['docente'].setValue(detalle.docente)
      this.formModule.controls['fecha_final'].setValue(detalle.fecha_final)
      this.formModule.controls['fecha_sust'].setValue(detalle.fecha_susti)
      if(detalle.temario.length>0){
        detalle.temario.forEach(i=>{
          this.temarios.push(i)
        })
      }else{
        detalle.data.forEach(i=>{
          this.temarios.push({
            name: i
          })
        })
      }
      detalle.fechas_clases.forEach(i=>{
        if(i.date_class){
          let date= (new Date(i.date_class*1000).getTime())
          let unix= this.datePipe.transform(date,"yyyy-MM-dd hh:mm")
          this.data().push(this.fb.group({
            fecha_clase: [unix, Validators.required]
          }));
        }else{
          let unix= this.datePipe.transform(i.fecha_clase,"yyyy-MM-dd hh:mm")
          this.data().push(this.fb.group({
            fecha_clase: [unix, Validators.required]
          }));
        }
      })
    }
  }

  addTemario(){
    if(this.formModule.controls['temario'].value!=''){
      this.temarios.push(this.formModule.controls['temario'].value)
      this.formModule.controls['temario'].setValue('')
    }
  }

  deleteTemario(index){
    this.temarios.splice(index, 1);
  }

  finish(){
    console.log(this.formFechas.value.data)
    var elementoAEditar = this.modulos.find(elemento => elemento.id === this.detalle.id);
    if (elementoAEditar) {
      elementoAEditar.nombre= this.formModule.controls['tema'].value
      elementoAEditar.fechas_clases= this.formFechas.value.data
      elementoAEditar.fecha_final= this.formModule.controls['fecha_final'].value
      elementoAEditar.fecha_susti= this.formModule.controls['fecha_sust'].value
      elementoAEditar.docente= this.formModule.controls['docente'].value
      elementoAEditar.tema= this.formModule.controls['tema'].value
      elementoAEditar.temario= this.temarios
      elementoAEditar.status= true
    }
    this.miPrueba.emit(this.modulos)
    this.closeModal()
  }
}
