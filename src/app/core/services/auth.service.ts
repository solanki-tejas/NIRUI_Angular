import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Check localStorage on init
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(isLoggedIn);
  }

  login(username: string, password: string): any {
    // Simulated login - replace with actual authentication
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true');
      this.isAuthenticatedSubject.next(true);
      this.router.navigate(['/home']);
    }
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
}
