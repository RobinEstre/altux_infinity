import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AcademicoComponent } from './pages/academico/academico.component';
import { DetalleComponent } from './pages/academico/detalle/detalle.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { NovedadesComponent } from './pages/novedades/novedades.component';

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
      {
        path: 'pagos',
        component: PagosComponent
      },
      {
        path: 'biblioteca',
        component: BibliotecaComponent
      },
      {
        path: 'novedades',
        component: NovedadesComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
