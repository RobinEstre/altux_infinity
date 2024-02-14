import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms'
import { ExamenesService } from 'src/app/academic/services/examenes.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  tipo_pregunta:any[]=[
    {
      "id":0,
      "name":"Seleccion Simple"
    },/*
    {
      "id":1,
      "name":"Seleccion Multiple"
    }*/
  ]

  @Output('miEvento') miPrueba = new EventEmitter<any>()
  @Input()detalle_examen:any=false;
  @Input()maximo:any=false;
  @Input()archivo:any=[];

  empForm:FormGroup;
  tipo:boolean;
  name:any
  form:any
  id:number=0
  max_questions:number=0
  mostrar_max:boolean
  color:any=''

  constructor(private fb:FormBuilder, private Service: ExamenesService) {
    this.empForm=this.fb.group({
      pregunta: this.fb.array([]) ,
    })
  }

  ngOnInit() {
    if (this.archivo.length >= this.maximo) {
      this.mostrar_max = true
    }
    this.max_questions=this.empForm.value.pregunta.length
    if(this.archivo){
      console.log(this.archivo.length)
      this.init(this.archivo.length)
    }else{
      this.pregunta().push(this.newEmployee());
    }
  }

  init(num){
    if(num>0){
      let index=0
      this.archivo.forEach(i=>{
        this.pregunta().push(this.fb.group({
          id: [i.id],
          texto: [i.pregunta.texto, Validators.required],
          valor:[1],
          seleccion_multiple: [0],
          alternativa:this.fb.array([])
        }));
        i.alternativa.forEach(a=>{
          this.employeeSkills(index).push(this.fb.group({
            id:[a.id],
            check: [a.check],
            texto: [a.texto, Validators.required],
            valor: [a.valor]
          }));
        })
        index++
      })
    }else{
      this.pregunta().push(this.newEmployee());
    }
  }

  pregunta(): FormArray {
    return this.empForm.get("pregunta") as FormArray
  }

  employeeSkills(empIndex:number) : FormArray {
    return this.pregunta().at(empIndex).get("alternativa") as FormArray
  }

  newEmployee(): FormGroup {
    return this.fb.group({
      id: [''],
      texto: ['', Validators.required],
      valor:[1],
      seleccion_multiple: [0],
      alternativa:this.fb.array([])
    })
  }

  newSkill(): FormGroup {
    return this.fb.group({
      id:[''],
      check: [false],
      texto: ['', Validators.required],
      valor: [0]
    })
  }

  onSubmit() {
    this.form=this.empForm.value
    let resp=[]
    let id=-1
    this.form.pregunta.forEach(i=>{
      id++
      let respuestas=[]
      let seleccion
      let id_alternativa=-1
      if(i.seleccion_multiple==0){
        seleccion=false
      }
      if(i.seleccion_multiple==1){
        seleccion=true
      }
      i.alternativa.forEach(a=>{
        id_alternativa++
        let valor
        if(a.check==true){
          valor=1
        }
        if(a.check==false){
          valor=0
        }
        respuestas.push({
          'id':id_alternativa,
          'check': a.check,
          'texto': a.texto,
          'valor': valor
        })
      })
      resp.push({
        "id": id,
        "pregunta":{
          "texto":i.texto,
          "valor":i.valor,
          "seleccion_multiple":seleccion
        },
        "alternativa": respuestas
      })
    })
    this.mostrar_max=false
    let num= this.empForm.value.pregunta.length
    for(let i=0; num>i; i++){
      this.pregunta().removeAt(0);
      this.pregunta().removeAt(i);
    }
    this.miPrueba.emit(resp)
  }

  change(event,id:number,emp:number){
    this.empForm.value.pregunta[emp].alternativa.forEach(i=>{

    })
    let a = this.empForm.value.pregunta[emp].alternativa[id].check
  }

  removeEmployee(empIndex:number) {
    this.pregunta().removeAt(empIndex);
    if(this.empForm.value.pregunta.length<this.maximo){
      this.mostrar_max=false
    }
  }

  removeEmployeeSkill(empIndex:number,skillIndex:number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }

  addEmployeeSkill(empIndex:number) {
    this.employeeSkills(empIndex).push(this.newSkill());
  }

  addEmployee() {
    this.max_questions=this.empForm.value.pregunta.length
    let i= this.max_questions-1
    let alt
    let check=0
    if(this.max_questions>=1){
      alt=this.empForm.value.pregunta[i].alternativa.length
      this.empForm.value.pregunta[i].alternativa.forEach(i=>{
        if(i.check==true){
          check++
        }
      })
      if(alt==0){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error!",
          text: 'Ingrese Alternativas a la Pregunta',
          showConfirmButton: false,
          timer: 2000
        });
        return
      }
      else if(check==0){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error!",
          text: 'Marque una Respuesta a la Pregunta',
          showConfirmButton: false,
          timer: 2000
        });
        return
      }
      else if(check>1){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Error!",
          text: 'Solo Puede Marcar Una Respuesta',
          showConfirmButton: false,
          timer: 2000
        });
        return
      }
      else {
        this.pregunta().push(this.newEmployee());
        if (this.max_questions+1 >= this.maximo) {
          this.mostrar_max = true
        }
      }
    }
    else if(this.max_questions<1){
      this.pregunta().push(this.newEmployee());
      return;
    }
    /*this.empForm.value.pregunta.forEach(i=>{
      alt=i.alternativa.length
      i.alternativa.forEach(a=>{
        if(a.check==true){
          check++
        }
      })
    })*/
  }

  select_tipo(empIndex:number, event){
    try {/*
      if (event.id == 0) {
        this.id++
        this.name='radio'
        this.tipo = true
        this.employeeSkills(empIndex).push(this.newSkill());
      }*//*
      if (event.id == 1) {
        this.id=0
        this.name='checkbox'
        this.tipo = false
        this.employeeSkills(empIndex).push(this.newSkill());
      }*//*
      this.id++
      this.name='checkbox'*/
      /*this.id++
      this.employeeSkills(empIndex).push(this.newSkill());*/
    }
    catch (e) {
    }
  }
}
