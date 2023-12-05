import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AcademicoComponent } from './pages/academico/academico.component';
import { DetalleComponent } from './pages/academico/detalle/detalle.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'panel',
        component: DashboardComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent
      },
      {
        path: 'academico',
        component: AcademicoComponent
      },
      {
        path: 'academico/:code',
        component: DetalleComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
