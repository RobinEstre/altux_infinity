import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './pages/panel/panel.component';
import { PerfilSharedComponent } from '../shared/components/perfil/perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'panel',
        component: PanelComponent
      },
      {
        path: 'registro',
        component: RegistroComponent
      },
      {
        path: 'alumnos',
        component: AlumnosComponent
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
export class VentasRoutingModule { }
