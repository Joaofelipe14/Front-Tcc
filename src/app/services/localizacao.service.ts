import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService 
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('ngrok-skip-browser-warning', 'teste');
  }

  createLocalizacao(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}localizacoes`, payload, { headers: this.getHeaders() });
  }

  getLocalizacoes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}localizacoes`, { headers: this.getHeaders() });
  }

  getLocalizacaoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}localizacoes/${id}`, { headers: this.getHeaders() });
  }

  updateLocalizacao(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}localizacoes/${id}`, payload, { headers: this.getHeaders() });
  }

  deleteLocalizacao(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}localizacoes/${id}`, { headers: this.getHeaders() });
  }
}
