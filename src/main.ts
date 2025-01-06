import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Async function to load config
async function loadConfig() {
  const response = await fetch('/assets/config.json');
  return response.json();
}

(async () => {
  try {
    const config = await loadConfig();

    // Inject the loaded config as a provider
    appConfig.providers.push(
      importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
      { provide: 'APP_CONFIG', useValue: config }
    );

    await bootstrapApplication(AppComponent, appConfig);
  } catch (error) {
    console.error('Error loading config:', error);
  }
})();
