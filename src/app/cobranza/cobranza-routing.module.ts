import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './pages/panel/panel.component';
import { PerfilSharedComponent } from '../shared/components/perfil/perfil.component';
import { CobrosComponent } from './pages/cobros/cobros.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'panel',
        component: PanelComponent
      },
      {
        path: 'perfil',
        component: PerfilSharedComponent
      },
      {
        path: 'reporte-pagos',
        component: CobrosComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobranzaRoutingModule { }
