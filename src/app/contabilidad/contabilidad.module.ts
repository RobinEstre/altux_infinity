import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContabilidadRoutingModule } from './contabilidad-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BoletasComponent } from './pages/boletas/boletas.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { SharedModule } from '../shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonsBoletaComponent } from './pages/boletas/buttons-boleta/buttons-boleta.component';
import { ButtonsFacturaComponent } from './pages/facturas/buttons-factura/buttons-factura.component';
import { ReportesComponent } from './pages/reportes/reportes.component';


@NgModule({
  declarations: [
    DashboardComponent,
    BoletasComponent,
    FacturasComponent,
    ButtonsBoletaComponent,
    ButtonsFacturaComponent,
    ReportesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDropzoneModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    ContabilidadRoutingModule
  ]
})
export class ContabilidadModule { }
