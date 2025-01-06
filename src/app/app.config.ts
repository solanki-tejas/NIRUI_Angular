import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCPmA8o-LN1yTFZlFjbxEAkbIBZq_wE3Mk',
  authDomain: 'netlink-labs.firebaseapp.com',
  projectId: 'netlink-labs',
  storageBucket: 'netlink-labs.firebasestorage.app',
  messagingSenderId: '752864786931',
  appId: '1:752864786931:web:9f2e206d25f1c6bf733a86',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    // Add Firebase providers
    importProvidersFrom([

      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
    ]),
  ],
};
