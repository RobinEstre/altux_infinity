import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamenesRoutingModule } from './examenes-routing.module';
import { ExamenComponent } from './pages/examen/examen.component';
import { NgWizardModule } from 'ng-wizard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BodyComponent } from './pages/body/body.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ExamenComponent,
    BodyComponent
  ],
  imports: [
    CommonModule,
    NgWizardModule,
    SharedModule,
    NgxSpinnerModule,
    ExamenesRoutingModule
  ]
})
export class ExamenesModule { }
