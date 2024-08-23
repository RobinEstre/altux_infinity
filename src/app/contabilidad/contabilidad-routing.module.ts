import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PerfilSharedComponent } from '../shared/components/perfil/perfil.component';
import { ReportesComponent } from './pages/reportes/reportes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'panel',
        component: DashboardComponent
      },
      {
        path: 'reporte',
        component: ReportesComponent
      },
      {
        path: 'perfil',
        component: PerfilSharedComponent
      },
    ]
  },
];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadRoutingModule { }
