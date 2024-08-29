import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private urlCadastro = `${environment.apiUrl}usuario/registrar`;
  private urlLogin = `${environment.apiUrl}usuario/login`;
  private urlAtualizar = `${environment.apiUrl}usuario/editar/`;


  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // {headers: getHeaders}
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  cadastrar(formData: FormData): Observable<any> {
    return this.http.post<any>(this.urlCadastro, formData);
  }

  logar(payload: any): Observable<any> {
    return this.http.post<any>(this.urlLogin, payload);
  }

  atualizar(payload: FormData, user_id: number): Observable<any> {
    return this.http.post<any>(this.urlAtualizar+user_id, payload);
  }
}