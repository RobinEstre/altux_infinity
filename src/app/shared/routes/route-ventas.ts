import { Routes } from '@angular/router';


export const routeVentas: Routes = [
    {
        path: '',
        loadChildren: () => import('../../ventas/ventas.module').then(m => m.VentasModule)
    },
];
