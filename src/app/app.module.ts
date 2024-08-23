import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SwiperModule } from 'swiper/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { JustLightboxModule } from 'just-lightbox';
import { LightboxModule } from 'ngx-lightbox';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TagifyModule } from 'ngx-tagify';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { PersonalizationService } from './shared/services/personalization.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { TokenInterceptor } from './shared/interceptor/token.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TokenInterceptorLOGIN } from './shared/interceptor/token_login.interceptor';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    Daterangepicker,
    BrowserAnimationsModule,
    NgSelectModule,
    NgxSpinnerModule,
    RouterModule,
    NgCircleProgressModule.forRoot(),
    JustLightboxModule.forRoot(),
    LightboxModule,
    FullCalendarModule,
    NgbModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    CKEditorModule,
    NgxDocViewerModule,
    TagifyModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig),
  ],
  providers: [PersonalizationService, AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass:TokenInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass:TokenInterceptorLOGIN, multi:true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
