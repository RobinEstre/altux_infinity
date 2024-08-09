import { Routes } from '@angular/router';


export const routeMarketing: Routes = [
    {
        path: '',
        loadChildren: () => import('../../marketing/marketing.module').then(m => m.MarketingModule)
    },
];
