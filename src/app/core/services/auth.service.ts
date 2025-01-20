// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
// import { ApplicationLog, LogLevel, LogType } from '../models/response.types';
// import { ApiService } from './api.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

//   constructor(private router: Router, private apiService: ApiService) {
//     // Check localStorage on init
//     const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
//     this.isAuthenticatedSubject.next(isLoggedIn);
//   }

//   login(username: string, password: string): any {
//     // Simulated login - replace with actual authentication
//     if (username === 'admin' && password === 'admin') {
//       localStorage.setItem('isLoggedIn', 'true');
//       this.isAuthenticatedSubject.next(true);

//       const newLog: ApplicationLog = {
//         logType: LogType.LOGIN,
//         logLevel: LogLevel.INFO,
//         description: 'Admin is logged in',
//       };

//       const urlToPass = 'logs/insert';
//       this.apiService.postData(urlToPass, newLog).subscribe({
//         next: (response) => {
//         },
//         error: (err) => console.error('Error creating log:', err),
//       });

//       this.router.navigate(['/home']);
//     }
//   }

//   logout(): void {
//     localStorage.removeItem('isLoggedIn');
//     this.isAuthenticatedSubject.next(false);
//     this.router.navigate(['/login']);
//   }
// }

import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth0Service: Auth0Service) { }

  login(username: string, password: string): void {
    // Redirect-based login (username/password fields are not used with Auth0 SDK)
    this.auth0Service.loginWithRedirect();
  }

  logout(): void {
    this.auth0Service.logout({
      logoutParams: {
        returnTo: "http://localhost:4200/login"
      }
    });
  }
}

