import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('ngrok-skip-browser-warning', 'teste');
  }

  // Método para buscar auditorias com filtros e paginação
  getAuditoria(filtro: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}busca-auditoria`, {
      headers: this.getHeaders(),
      params: filtro
    });
  }

  // Método para obter tabelas distintas
  getTabelas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}tabelas-distintas`, { headers: this.getHeaders() });
  }
}
