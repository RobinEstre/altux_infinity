import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnoRoutingModule } from './alumno-routing.module';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SwiperModule } from 'swiper/angular';
import { ChartsModule } from 'ng2-charts';
import { Daterangepicker } from 'ng2-daterangepicker';
import { LightboxModule } from 'ngx-lightbox';
import { JustLightboxModule } from 'just-lightbox';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ColumnresizerComponent } from './pages/dashboard/columnresizer/columnresizer.component';
import { AcademicoComponent } from './pages/academico/academico.component';
import { DetalleComponent } from './pages/academico/detalle/detalle.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    ColumnresizerComponent,
    PerfilComponent,
    DashboardComponent,
    AcademicoComponent,
    DetalleComponent
  ],
  imports: [
    CommonModule,
    SwiperModule,
    ChartsModule,
    Daterangepicker,
    LightboxModule,
    NgxSpinnerModule,
    NgbModule,
    FullCalendarModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    JustLightboxModule.forRoot(),
    NgCircleProgressModule.forRoot(),
    AlumnoRoutingModule
  ]
})
export class AlumnoModule { }
