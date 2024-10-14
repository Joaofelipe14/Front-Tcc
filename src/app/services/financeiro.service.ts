import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service'; 
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FinancerioService {
  private baseUrl =  environment.apiUrl;


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

  createRegistroFinanceiro(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'financeiros', payload, { headers: this.getHeaders() });
  }

  getRelatorioFinanceiro(data: { ids: number[] }): Observable<Blob> {
    return this.http.post<Blob>(`${this.baseUrl}financeiros/relatorio`, data, {
      headers: this.getHeaders(),
      responseType: 'blob' as 'json'
    });
  }



  getRegistrosFinancerios(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}financeiros`, { headers: this.getHeaders() });
  }


}
