import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyComponent } from './verify/verify.component';
import { PasswordComponent } from './password/password.component';
import { AuthenticationModule } from '../shared/auth/authentication.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormPayMatriculaComponent } from './form-pay-matricula/form-pay-matricula.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegistrationComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    VerifyComponent,
    PasswordComponent,
    FormPayMatriculaComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    AuthenticationModule
  ]
})
export class AuthModule { }
