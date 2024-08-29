import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
 
  updateToken(token: any) {
    sessionStorage.setItem(this.tokenKey, token);
  }

  private tokenKey = 'token'; 

  constructor() { }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  hasTokenChanged(newToken: string): boolean {
    const currentToken = this.getToken();
    return currentToken !== newToken;
  }
}
