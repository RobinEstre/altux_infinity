import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    Daterangepicker
  ],
  exports: [
  ]
})
export class PagesModule { }
