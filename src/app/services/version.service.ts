import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VersaoService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders()
    }

    // Método para buscar a versão da aplicação
    getVersao(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}version`, { headers: this.getHeaders() });
    }

    
}
