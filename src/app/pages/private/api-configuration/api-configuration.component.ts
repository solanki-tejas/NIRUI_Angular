import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-api-configuration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-configuration.component.html',
  styleUrl: './api-configuration.component.scss',
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
export class ApiConfigurationComponent {
  loading: boolean = false;
  configData = {};

  constructor(private apiService: ApiService, private router: Router) { }

  fetchVersions() {
    this.loading = true;
    this.apiService.getAPIConfig().subscribe((data) => {
      this.configData = data;
      this.loading = false;
    });
  }

  ngOnInit() {
    this.fetchVersions();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
