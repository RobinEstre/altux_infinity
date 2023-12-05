import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';
import { AuthServiceService } from 'src/app/auth/services/auth-service.service';


@Injectable()
export class TokenInterceptorLOGIN implements HttpInterceptor {
    constructor(private loginService: AuthServiceService, private routes: Router) {}
    
    intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).do((event: HttpEvent<any>) => {
        }, (err: any) => {
            if (err.status === 401) {
                // redirect to the login route
                // or show a modal
                this.loginService.isLogoutUnathorizated();

                return this.routes.navigate(['/']);
            }
            if (err.status === 403) {
                // redirect to the login route
                // or show a modal
                this.loginService.isLogoutUnathorizated();
                return this.routes.navigate(['/']);
            }
        });
    }
}
