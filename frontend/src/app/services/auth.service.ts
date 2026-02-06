import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserToken } from '../models';

const TOKEN_KEY = 'auth_token';

// Hardcoded demo users
const DEMO_USERS: { [key: string]: { password: string; roles: ('viewer' | 'maintainer' | 'admin')[] } } = {
  'viewer': { password: 'pass', roles: ['viewer'] },
  'maintainer': { password: 'pass', roles: ['maintainer'] },
  'admin': { password: 'pass', roles: ['admin'] }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    const user = DEMO_USERS[username];
    
    if (user && user.password === password) {
      const token: UserToken = {
        username,
        roles: user.roles,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
      };
      
      // Create a base64-encoded token (simple JWT-like format for demo)
      const tokenString = btoa(JSON.stringify(token));
      localStorage.setItem(TOKEN_KEY, tokenString);
      return true;
    }
    
    return false;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getDecodedToken(): UserToken | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    
    try {
      return JSON.parse(atob(token)) as UserToken;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getDecodedToken();
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    return token.exp > Date.now();
  }

  getRoles(): string[] {
    const token = this.getDecodedToken();
    return token?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles();
    return roles.some(role => userRoles.includes(role));
  }

  getUsername(): string | null {
    const token = this.getDecodedToken();
    return token?.username || null;
  }
}
