import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import {
  Version,
  VersionService,
} from 'src/app/core/services/versions.service';
import { formatDate, formatTimestamp } from 'src/app/shared/utils/functions';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-versions',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, FormsModule],
  templateUrl: './versions.component.html',
  styleUrl: './versions.component.scss',
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
export class VersionsComponent {
  versions: Version[] = [];
  loading = false;
  visible: boolean = false;
  currentVersion: Version = {
    version: '',
    info: '',
    changeDate: '',
  };

  constructor(private router: Router, private apiService: ApiService) { }

  fetchVersions() {
    this.loading = true;
    const urlToPass = 'changelog/search';

    this.apiService.getData(urlToPass).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          // Sort the data by `changeDate` in descending order
          this.versions = data.sort((a, b) => {
            const dateA = new Date(a.changeDate).getTime();
            const dateB = new Date(b.changeDate).getTime();
            return dateB - dateA; // Descending order
          });
        } else {
          this.versions = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      },
    });
  }

  ngOnInit() {
    this.fetchVersions();
  }

  getFormatDate(data: any) {
    return formatDate(data);
  }

  showDialog() {
    this.visible = true;
    this.currentVersion = {
      version: '',
      info: '',
      changeDate: '',
    }; // Reset form
  }

  onSubmit() {
    if (this.currentVersion.version) {
      // this.versionService.addVersion(this.currentVersion).subscribe(() => {
      //   this.fetchVersions();
      //   this.visible = false;
      // });
    }
  }

  onRowSelect(event: any) {
    // this.currentVersion = { ...event.data }; // Populate form with selected row's data
    // this.visible = true;
  }
}
