import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { PanelComponent } from './pages/panel/panel.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { FichasComponent } from './pages/registro/fichas/fichas.component';
import { MatriculasComponent } from './pages/registro/matriculas/matriculas.component';
import { LeadsComponent } from './pages/registro/leads/leads.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PanelComponent,
    RegistroComponent,
    AlumnosComponent,
    FichasComponent,
    MatriculasComponent,
    LeadsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
