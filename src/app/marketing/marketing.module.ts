import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketingRoutingModule } from './marketing-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ControlLeadsComponent } from './pages/control-leads/control-leads.component';
import { TableLeadsComponent } from './pages/control-leads/table-leads/table-leads.component';
import { ReciclajeComponent } from './pages/reciclaje/reciclaje.component';
import { BaseExtraComponent } from './pages/reciclaje/base-extra/base-extra.component';
import { LeadsComponent } from './pages/reciclaje/leads/leads.component';
import { ButtonsLeadsComponent } from './pages/reciclaje/leads/buttons-leads/buttons-leads.component';
import { ButtonsBaseComponent } from './pages/reciclaje/base-extra/buttons-base/buttons-base.component';
import { EventsComponent } from './pages/events/events.component';
import { ButtonsEventsComponent } from './pages/events/buttons-events/buttons-events.component';
import { ActivosComponent } from './pages/activos/activos.component';
import { DetalleComponent } from './pages/events/detalle/detalle.component';


@NgModule({
  declarations: [
    DashboardComponent,
    TableLeadsComponent,
    ControlLeadsComponent,
    ReciclajeComponent,
    BaseExtraComponent,
    LeadsComponent,
    ButtonsLeadsComponent,
    ButtonsBaseComponent,
    EventsComponent,
    ButtonsEventsComponent,
    ActivosComponent,
    DetalleComponent
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
    MarketingRoutingModule
  ]
})
export class MarketingModule { }
