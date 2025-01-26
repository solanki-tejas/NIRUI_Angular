import { Component, OnInit } from '@angular/core';
import authData from '../../../../assets/auth_config.json'
import { ApiService } from 'src/app/core/services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-auth-configuration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-configuration.component.html',
  styleUrl: './auth-configuration.component.scss',
  animations: [
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '1s 0.2s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class AuthConfigurationComponent implements OnInit {
  loading: boolean = false;
  authConfigData = {};

  constructor(private apiService: ApiService, private router: Router) { }

  fetchAPIConfigData() {
    this.loading = true;
    this.apiService.getAuthConfig().subscribe((data) => {
      this.authConfigData = data;
      this.loading = false;
    });
  }

  ngOnInit() {
    this.fetchAPIConfigData();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
