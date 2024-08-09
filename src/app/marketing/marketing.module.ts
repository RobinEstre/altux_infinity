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


@NgModule({
  declarations: [
    DashboardComponent,
    TableLeadsComponent,
    ControlLeadsComponent
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
