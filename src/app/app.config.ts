import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';
// import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';

// Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyCPmA8o-LN1yTFZlFjbxEAkbIBZq_wE3Mk',
//   authDomain: 'netlink-labs.firebaseapp.com',
//   projectId: 'netlink-labs',
//   storageBucket: 'netlink-labs.firebasestorage.app',
//   messagingSenderId: '752864786931',
//   appId: '1:752864786931:web:9f2e206d25f1c6bf733a86',
// };

// Auth0 configuration
const auth0Config = {
  domain: 'dev-dlvuaq1t6es7rgio.us.auth0.com',
  clientId: '98n2E76Vg6t4pj9DenxSFKgWwAP86jBV',
  authorizationParams: {
    redirect_uri: "http://localhost:4200",
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom([
      BrowserAnimationsModule,
      // provideFirebaseApp(() => initializeApp(firebaseConfig)),
      // provideFirestore(() => getFirestore()),
      // provideAuth(() => getAuth()),
      AuthModule.forRoot(auth0Config),
    ]),
  ],
};