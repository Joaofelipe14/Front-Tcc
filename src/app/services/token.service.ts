import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenKey = 'token';

  constructor() { }

  getToken(): string | null {
    let token
    if(sessionStorage.getItem(this.tokenKey)){
        token =sessionStorage.getItem(this.tokenKey)
    }else{
      token = this.getTokenCookie()
    }
    return token;
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    this.saveTokenCookie(token)
  }

  remove(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.removeCookie()
  }

  hasTokenChanged(newToken: string): boolean {
    const currentToken = this.getToken();
    return currentToken !== newToken;
  }

  /*LOgica pro cookie*/
  saveTokenCookie(token: string, expiresInDays: number = 30): void {
    const date = new Date();
    date.setTime(date.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${this.tokenKey}=${token};${expires};path=/`;

  }

  getTokenCookie(): string | null {
    const nameEQ = `${this.tokenKey}=`;
    const cookiesArray = document.cookie.split(';');
    for (const cookie of cookiesArray) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }

    return null;
  }

  // Método para remover o token
  removeCookie(): void {
    document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
