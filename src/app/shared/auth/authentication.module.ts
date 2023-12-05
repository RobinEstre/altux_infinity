import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { AuthFooterComponent } from './auth-footer/auth-footer.component';
import { AuthrightComponent } from './authright/authright.component';
import { SwiperModule } from 'swiper/angular';
import { AuthRoutingModule } from 'src/app/auth/auth-routing.module';



@NgModule({
  declarations: [
    AuthHeaderComponent,
    AuthFooterComponent,
    AuthrightComponent
  ],
  imports: [
    CommonModule,
    SwiperModule,
    AuthRoutingModule
  ],
  exports: [
    AuthHeaderComponent,
    AuthFooterComponent,
    AuthrightComponent
  ]
})
export class AuthenticationModule { }
