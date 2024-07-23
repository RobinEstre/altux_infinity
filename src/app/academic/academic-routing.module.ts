import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilSharedComponent } from '../shared/components/perfil/perfil.component';
import { PanelComponent } from './pages/panel/panel.component';
import { ClasesComponent } from './pages/clases/clases.component';
import { MaterialesComponent } from './pages/materiales/materiales.component';
import { DiplomadosComponent } from './pages/diplomados/diplomados.component';
import { LeadsComponent } from './pages/leads/leads.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { CrearExamenComponent } from './pages/crear-examen/crear-examen.component';
import { AddDiplomadoComponent } from './pages/add-diplomado/add-diplomado.component';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { RegistroComponent } from '../ventas/pages/registro/registro.component';
import { CobrosComponent } from '../cobranza/pages/cobros/cobros.component';
import { FechasComponent } from './pages/fechas/fechas.component';
import { StudentsComponent } from './pages/students/students.component';
import { FechaPagoComponent } from './pages/fecha-pago/fecha-pago.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'panel',
        component: PanelComponent
      },
      {
        path: 'clases',
        component: ClasesComponent
      },
      {
        path: 'materiales',
        component: MaterialesComponent
      },
      {
        path: 'diplomados',
        component: DiplomadosComponent
      },
      {
        path: 'publicar-diplomado/:code',
        component: AddDiplomadoComponent
      },
      {
        path: 'leads',
        component: LeadsComponent
      },
      {
        path: 'perfil',
        component: PerfilSharedComponent
      },
      {
        path: 'examenes',
        component: ExamenesComponent
      },
      {
        path: 'crear-examenes',
        component: CrearExamenComponent
      },
      {
        path: 'alumnos',
        component: AlumnosComponent
      },
      {
        path: 'ventas',
        component: RegistroComponent
      },
      {
        path: 'reporte-pagos',
        component: CobrosComponent
      },
      {
        path: 'fechas',
        component: FechasComponent
      },
      {
        path: 'estudiantes',
        component: StudentsComponent
      },
      {
        path: 'fecha-pago',
        component: FechaPagoComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicRoutingModule { }
