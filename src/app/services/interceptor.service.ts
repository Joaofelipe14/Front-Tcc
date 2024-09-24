import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private token: TokenService) { }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.router.navigate(['/login']);
                    this.token.remove()
                    alert('Sessão expirada, por favor faça login novamente.');

                }
                return throwError(error);
            })
        );
    }
}
