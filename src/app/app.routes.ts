import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/private/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'message/:id',
        loadComponent: () =>
          import('./pages/private/detail-view/detail-view.component').then(
            (m) => m.DetailViewComponent
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import(
            './pages/private/message-screen/message-screen.component'
          ).then((m) => m.MessageScreenComponent),
      },
      {
        path: 'monitoring/change-logs',
        loadComponent: () =>
          import('./pages/private/versions/versions.component').then(
            (m) => m.VersionsComponent
          ),
      },
      {
        path: 'monitoring/application-logs',
        loadComponent: () =>
          import('./pages/private/logs/logs.component').then(
            (m) => m.LogsComponent
          ),
      },
      {
        path: 'settings/api-configuration',
        loadComponent: () =>
          import(
            './pages/private/api-configuration/api-configuration.component'
          ).then((m) => m.ApiConfigurationComponent),
      },
      {
        path: 'settings/auth-configuration',
        loadComponent: () =>
          import(
            './pages/private/auth-configuration/auth-configuration.component'
          ).then((m) => m.AuthConfigurationComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/public/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
