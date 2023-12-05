import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './shared/layout/content/content.component';
import { content } from './shared/routes/routes';
import { AuthGuard } from './shared/guard/auth.guard';

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
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
