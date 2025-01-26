import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Async function to load API config
async function loadAPIConfig() {
  const response = await fetch('/assets/config.json');
  return response.json();
}

// Async function to load API config
// async function loadAuthConfig() {
//   const response = await fetch('/assets/auth_config.json');
//   return response.json();
// }


(async () => {
  try {
    const apiConfig = await loadAPIConfig();
    // const authConfig = await loadAuthConfig();

    // Inject the loaded config as a provider
    appConfig.providers.push(
      importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
      { provide: 'API_CONFIG', useValue: apiConfig },
      // { provide: 'AUTH_CONFIG', useValue: authConfig },
    );

    await bootstrapApplication(AppComponent, appConfig);
  } catch (error) {
    console.error('Error loading config:', error);
  }
})();
