import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentComponent } from './layout/content/content.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { ModalFinalizadoComponent } from './components/exam/modal-finalizado/modal-finalizado.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalExpiredComponent } from './components/exam/modal-expired/modal-expired.component';
import { ModalTestComponent } from './components/exam/modal-test/modal-test.component';



@NgModule({
  declarations: [
    ContentComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ModalFinalizadoComponent,
    ModalExpiredComponent,
    ModalTestComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    ContentComponent,
    HeaderComponent,
    ModalFinalizadoComponent,
    ModalExpiredComponent,
    ModalTestComponent,
    FooterComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
