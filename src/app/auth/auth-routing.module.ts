import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PasswordComponent } from './password/password.component';
import { RegistrationComponent } from './registration/registration.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [{
    path: 'login',
    component: LoginComponent
  }, {
    path: 'registration',
    component: RegistrationComponent
  }, {
    path: 'change-password',
    component: ChangePasswordComponent
  }, {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }, {
    path: 'verify',
    component: VerifyComponent
  }, {
    path: 'password/:code',
    component: PasswordComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
