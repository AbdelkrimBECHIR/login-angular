import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, finalize } from 'rxjs';

export interface AuthResponse {
  access_token: string;  // Modifié pour correspondre à la réponse de l'API
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/auth';
  private tokenKey = 'auth_token';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialiser avec le token stocké
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (response && response.access_token) {
          this.setToken(response.access_token);
        }
      }),
      finalize(() => {
        console.log('Login request completed');
      })
    );
  }

  private setToken(token: string): void {
    console.log('Setting token:', token);
    localStorage.setItem(this.tokenKey, token);
    this.tokenSubject.next(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Checking isLoggedIn, token exists:', !!token);
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
