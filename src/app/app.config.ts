import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthModule, AuthConfig } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import AuthData from '../assets/auth_config.json'

const auth0Config: AuthConfig = {
  domain: AuthData.domain,
  clientId: AuthData.clientId,  
  authorizationParams: {
    redirect_uri: "https://192.168.29.19:4200",
  },
  cacheLocation: 'localstorage', // Now correctly typed
  useRefreshTokens: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom([
      BrowserAnimationsModule,
      AuthModule.forRoot(auth0Config),
    ]),
  ],
};

// import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { provideHttpClient, withFetch } from '@angular/common/http';
// import { AuthModule } from '@auth0/auth0-angular';
// import { routes } from './app.routes';
// import { ApiService } from './core/services/api.service';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(withFetch()),
//     {
//       provide: APP_INITIALIZER,
//       useFactory: (apiService: ApiService) => {
//         return async () => {
//           const config = await apiService.getAuthConfig().toPromise();
//           localStorage.setItem('auth_domain', config.domain);
//           localStorage.setItem('auth_clientId', config.clientId);
//         };
//       },
//       deps: [ApiService],
//       multi: true
//     },
//     importProvidersFrom([
//       BrowserAnimationsModule,
//       AuthModule.forRoot({
//         domain: localStorage.getItem('auth_domain') || '',
//         clientId: localStorage.getItem('auth_clientId') || '',
//         authorizationParams: {
//           redirect_uri: window.location.origin,
//         },
//         cacheLocation: 'localstorage',
//         useRefreshTokens: true
//       })
//     ]),
//   ]
// };