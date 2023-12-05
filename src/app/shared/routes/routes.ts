import { Routes } from '@angular/router';


export const content: Routes = [
  {
    path:'',
    loadChildren: () => import('../../alumno/alumno.module').then(m => m.AlumnoModule)
  },
];
