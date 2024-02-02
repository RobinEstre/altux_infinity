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


@NgModule({
  declarations: [
    PanelComponent,
    ClasesComponent,
    MaterialesComponent,
    DiplomadosComponent,
    LeadsComponent
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
    ReactiveFormsModule,
    AcademicRoutingModule
  ]
})
export class AcademicModule { }
