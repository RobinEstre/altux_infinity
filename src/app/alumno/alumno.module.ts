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
import { CalendarComponent } from './pages/academico/calendar/calendar.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgWizardModule } from 'ng-wizard';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SafePipe } from './safe.pipe';
import { PagosComponent } from './pages/pagos/pagos.component';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { NovedadesComponent } from './pages/novedades/novedades.component';


@NgModule({
  declarations: [
    ColumnresizerComponent,
    PerfilComponent,
    DashboardComponent,
    AcademicoComponent,
    DetalleComponent,
    SafePipe,
    CalendarComponent,
    PagosComponent,
    BibliotecaComponent,
    NovedadesComponent
  ],
  imports: [
    CommonModule,
    SwiperModule,
    ChartsModule,
    Daterangepicker,
    LightboxModule,
    NgxSpinnerModule,
    SharedModule,
    NgbModule,
    FullCalendarModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    NgWizardModule,
    NgSelectModule,
    JustLightboxModule.forRoot(),
    NgCircleProgressModule.forRoot(),
    AlumnoRoutingModule
  ]
})
export class AlumnoModule { }
