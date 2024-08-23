import { Routes } from '@angular/router';


export const routeContabilidad: Routes = [
    {
        path: '',
        loadChildren: () => import('../../contabilidad/contabilidad.module').then(m => m.ContabilidadModule)
    },
];
