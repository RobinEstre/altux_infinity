import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilSharedComponent } from '../shared/components/perfil/perfil.component';
import { PanelComponent } from './pages/panel/panel.component';
import { ClasesComponent } from './pages/clases/clases.component';
import { MaterialesComponent } from './pages/materiales/materiales.component';
import { DiplomadosComponent } from './pages/diplomados/diplomados.component';
import { LeadsComponent } from './pages/leads/leads.component';

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
        path: 'leads',
        component: LeadsComponent
      },
      {
        path: 'perfil',
        component: PerfilSharedComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicRoutingModule { }
