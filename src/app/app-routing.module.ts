import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './shared/layout/content/content.component';
import { content } from './shared/routes/routes';
import { AuthGuard } from './shared/guard/auth.guard';
import { routeExam } from './shared/routes/route-exam';
import { routeVentas } from './shared/routes/route-ventas';
import { routeAcademico } from './shared/routes/route-academico';
import { FormPayMatriculaComponent } from './auth/form-pay-matricula/form-pay-matricula.component';
import { routeCobranza } from './shared/routes/route-cobranza';

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
  {
    path:'matricula-pago/:code',
    component: FormPayMatriculaComponent
  },
  {
    path: 'academico',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: routeAcademico
  },
  {
    path: 'cobranza',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: routeCobranza
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
