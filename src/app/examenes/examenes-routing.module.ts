import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamenComponent } from './pages/examen/examen.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'examen/:code/:id_modulo/:id_examen',
        component: ExamenComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamenesRoutingModule { }
