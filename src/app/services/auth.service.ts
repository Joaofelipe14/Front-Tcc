import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private urlCadastro = `${environment.apiUrl}usuario/registrar`;
  private urlLogin = `${environment.apiUrl}login`;

  constructor(private http: HttpClient) {}

  cadastrar(formData: FormData): Observable<any> {
    return this.http.post<any>(this.urlCadastro, formData);
  }

  logar(usuario: { cpf: string; senha: string }): Observable<any> {
    return this.http.post<any>(this.urlLogin, usuario);
  }
}
