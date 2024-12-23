import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicRoutingModule } from './academic-routing.module';
import { PanelComponent } from './pages/panel/panel.component';
import { ClasesComponent } from './pages/clases/clases.component';
import { MaterialesComponent } from './pages/materiales/materiales.component';
import { DiplomadosComponent } from './pages/diplomados/diplomados.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LeadsComponent } from './pages/leads/leads.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { ModalDetailComponent } from './pages/examenes/modal-detail/modal-detail.component';
import { ModalExamComponent } from './pages/examenes/modal-exam/modal-exam.component';
import { ModalNotasComponent } from './pages/examenes/modal-detail/modal-notas/modal-notas.component';
import { CrearExamenComponent } from './pages/crear-examen/crear-examen.component';
import { QuestionsComponent } from './pages/crear-examen/questions/questions.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AddDiplomadoComponent } from './pages/add-diplomado/add-diplomado.component';
import { PlanEstudioComponent } from './pages/add-diplomado/plan-estudio/plan-estudio.component';
import { VentasComponent } from './pages/add-diplomado/ventas/ventas.component';
import { ArchwizardModule } from 'angular-archwizard';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { FechasComponent } from './pages/fechas/fechas.component';
import { StudentsComponent } from './pages/students/students.component';
import { TableButtonsComponent } from './pages/students/table-buttons/table-buttons.component';
import { FechaPagoComponent } from './pages/fecha-pago/fecha-pago.component';
import { PrioridadComponent } from './pages/prioridad/prioridad.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    PanelComponent,
    ClasesComponent,
    MaterialesComponent,
    DiplomadosComponent,
    LeadsComponent,
    ExamenesComponent,
    ModalDetailComponent,
    ModalExamComponent,
    ModalNotasComponent,
    CrearExamenComponent,
    QuestionsComponent,
    AddDiplomadoComponent,
    PlanEstudioComponent,
    VentasComponent,
    AlumnosComponent,
    FechasComponent,
    StudentsComponent,
    TableButtonsComponent,
    FechaPagoComponent,
    PrioridadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    NgxDropzoneModule,
    ArchwizardModule,
    NgxDocViewerModule,
    ReactiveFormsModule,
    DragDropModule,
    AcademicRoutingModule
  ]
})
export class AcademicModule { }
