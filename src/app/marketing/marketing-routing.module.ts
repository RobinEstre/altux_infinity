import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ControlLeadsComponent } from './pages/control-leads/control-leads.component';
import { PanelComponent } from '../ventas/pages/panel/panel.component';
import { PerfilSharedComponent } from '../shared/components/perfil/perfil.component';
import { ReciclajeComponent } from './pages/reciclaje/reciclaje.component';
import { EventsComponent } from './pages/events/events.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'panel',
        component: PanelComponent
      },
      {
        path: 'control-leads',
        component: ControlLeadsComponent
      },
      {
        path: 'reciclaje-leads',
        component: ReciclajeComponent
      },
      {
        path: 'eventos',
        component: EventsComponent
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
export class MarketingRoutingModule { }
