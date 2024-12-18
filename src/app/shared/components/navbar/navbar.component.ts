import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    AvatarModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    MenuModule,
    MenubarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  items: MenuItem[];
  searchTerm = '';

  constructor(private authService: AuthService, private router: Router) {
    this.items = [
      {
        label: 'Message Screen',
        command: () => this.routeToPage('messages'),
        // icon: 'pi pi-envelope',
      },

      {
        label: 'Settings',
        // icon: 'pi pi-gear',
        items: [
          {
            label: 'Change Log',
            // icon: 'pi pi-bolt',
            route: '/versions',
            command: () => this.routeToPage('settings/versions'),
          },
          {
            label: 'API Configuration',
            route: '/api-configuration',
            command: () => this.routeToPage('settings/api-configuration'),
            // icon: 'pi pi-server',
          },
        ],
      },
    ];
  }

  routeToPage(path: string) {
    this.router.navigateByUrl(path);
  }

  logout(): void {
    this.authService.logout();
  }

  navigateVersion(): void {
    this.router.navigate(['/versions']);
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }
}
