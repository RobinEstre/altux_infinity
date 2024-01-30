import { Routes } from '@angular/router';


export const routeAcademico: Routes = [
    {
        path: '',
        loadChildren: () => import('../../academic/academic.module').then(m => m.AcademicModule)
    },
];
