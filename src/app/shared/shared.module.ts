import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentComponent } from './layout/content/content.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { ModalFinalizadoComponent } from './components/exam/modal-finalizado/modal-finalizado.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalExpiredComponent } from './components/exam/modal-expired/modal-expired.component';
import { ModalTestComponent } from './components/exam/modal-test/modal-test.component';
import { PerfilSharedComponent } from './components/perfil/perfil.component';
import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [
    ContentComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ModalFinalizadoComponent,
    ModalExpiredComponent,
    ModalTestComponent,
    PerfilSharedComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgxDropzoneModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ContentComponent,
    HeaderComponent,
    PerfilSharedComponent,
    ModalFinalizadoComponent,
    ModalExpiredComponent,
    ModalTestComponent,
    FooterComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
