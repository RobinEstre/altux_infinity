import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CobranzaRoutingModule } from './cobranza-routing.module';
import { PanelComponent } from './pages/panel/panel.component';
import { CobrosComponent } from './pages/cobros/cobros.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ArchwizardModule } from 'angular-archwizard';
import { ComisionesDescuentosComponent } from './pages/cobros/comisiones-descuentos/comisiones-descuentos.component';
import { CuotasComponent } from './pages/cobros/cuotas/cuotas.component';
import { EstudianteComponent } from './pages/cobros/estudiante/estudiante.component';


@NgModule({
  declarations: [
    PanelComponent,
    CobrosComponent,
    ComisionesDescuentosComponent,
    CuotasComponent,
    EstudianteComponent
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
    CobranzaRoutingModule
  ]
})
export class CobranzaModule { }
