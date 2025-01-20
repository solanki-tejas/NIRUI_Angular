// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { map } from 'rxjs';

// export const authGuard = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   return authService.isAuthenticated$.pipe(
//     map((isAuthenticated) => {
//       if (!isAuthenticated) {
//         router.navigate(['/login']);
//         return false;
//       }
//       return true;
//     })
//   );
// };

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.auth.loginWithRedirect(); // Redirect to login if not authenticated
        }
      }),
      map((isAuthenticated) => isAuthenticated)
    );
  }
}
