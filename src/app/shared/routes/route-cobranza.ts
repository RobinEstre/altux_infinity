import { Routes } from '@angular/router';


export const routeCobranza: Routes = [
    {
        path: '',
        loadChildren: () => import('../../cobranza/cobranza.module').then(m => m.CobranzaModule)
    },
];
