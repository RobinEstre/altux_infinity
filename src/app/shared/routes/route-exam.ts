import { Routes } from '@angular/router';


export const routeExam: Routes = [
    {
        path: '',
        loadChildren: () => import('../../examenes/examenes.module').then(m => m.ExamenesModule)
    },
];
