import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroPescaService {
  private baseUrl =  environment.apiUrl+'registros-pesca';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService 
  ) {}

  createRegistro(registro: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, registro, { headers: this.getHeaders() });
  }

  updateRegistro(id: number, registro: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, registro, { headers: this.getHeaders() });
  }

  getRegistrosByUserId(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user`, { headers: this.getHeaders() });
  }

  me(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`, { headers: this.getHeaders() });
  }

  // Método para obter headers com token de autorização
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('ngrok-skip-browser-warning', 'teste');
  }

}
