import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  items: MenuItem[];
  searchTerm = '';

  constructor(private authService: AuthService) {
    this.items = [
      {
        label: 'Options',
        items: [
          // {
          //   label: 'Profile',
          //   icon: 'pi pi-user',
          // },
          {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];
  }

  logout(): void {
    this.authService.logout();
  }
}
