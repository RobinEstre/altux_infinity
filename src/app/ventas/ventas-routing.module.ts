import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './pages/panel/panel.component';
import { PerfilSharedComponent } from '../shared/components/perfil/perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { CheckoutPruebaComponent } from './pages/checkout-prueba/checkout-prueba.component';

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
      {
        path: 'checkout',
        component: CheckoutPruebaComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
