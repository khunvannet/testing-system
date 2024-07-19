import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}
  setSession(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSession(key: string): any {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  clearSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearAllSessions(): void {
    sessionStorage.clear();
  }
}
