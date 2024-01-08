import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './shared/layout/content/content.component';
import { content } from './shared/routes/routes';
import { AuthGuard } from './shared/guard/auth.guard';
import { routeExam } from './shared/routes/route-exam';
import { routeVentas } from './shared/routes/route-ventas';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'alumno',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: content
    //dentro de content se declaran los modulos
  },
  {
    path: 'alumno',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: routeExam
  },
  {
    path: 'ventas',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: routeVentas
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
