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
import { Version, VersionService } from 'src/app/core/services/versions.service';

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
  lastVersion: Version

  constructor(private authService: AuthService, private router: Router, private versionService: VersionService) {
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
          {
            label: 'Logs',
            // icon: 'pi pi-bolt',
            route: '/logs',
            command: () => this.routeToPage('settings/logs'),
          },
        ],
      },
    ];
  }

  ngOnInit() {
    this.versionService.getLastVersion().subscribe((data) => {
      this.lastVersion = data;
    });
  }

  routeToPage(path: string) {
    this.router.navigateByUrl(path);
  }

  logout(): void {
    this.authService.logout();
  }

  navigateVersion(): void {
    this.router.navigate(['/settings/versions']);
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }
}
