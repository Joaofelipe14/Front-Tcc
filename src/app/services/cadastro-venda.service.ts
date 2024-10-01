import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroVendaService {
  private baseUrl =  environment.apiUrl+'venda';
  private vendasSubject = new BehaviorSubject<any[]>([]);
  vendas$ = this.vendasSubject.asObservable(); 

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

  createRegistro(registro: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, registro, { headers: this.getHeaders() });
  }

  updateRegistro(id: number, registro: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, registro, { headers: this.getHeaders() });
  }

  getRegistrosByUserId(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/meus`, { headers: this.getHeaders() });
  }

  getRegistrosAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, { headers: this.getHeaders() });
  }

    /*LOgica para avisar a compontente inicial que houve uma atualizacao*/
    setvendas(vendas: any[]) {
      this.vendasSubject.next(vendas); 
    }
}
