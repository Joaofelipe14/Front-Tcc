import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CadastroPescaService {
  private baseUrl = environment.apiUrl + 'pesca';
  private pescasSubject = new BehaviorSubject<any[]>([]);
  pescas$ = this.pescasSubject.asObservable();


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

  createRegistro(registro: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, registro, { headers: this.getHeaders() });
  }

  updateRegistro(id: number, registro: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, registro, { headers: this.getHeaders() });
  }

  getRegistrosByUserId(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/meus`, { headers: this.getHeaders() });
  }

  getRegistrosAll(params: any): Observable<any> {
    const url = `${this.baseUrl}`;
    const options = {
      headers: this.getHeaders(),
       params: params
  };
    return this.http.get<any>(url, options );
  }



/*LOgica para avisar a compontente inicial que houve uma atualizacao*/
setPescas(pescas: any[]) {
  this.pescasSubject.next(pescas);
}
}
