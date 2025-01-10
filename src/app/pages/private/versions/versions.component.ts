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

@Component({
  selector: 'app-versions',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, FormsModule],
  templateUrl: './versions.component.html',
  styleUrl: './versions.component.scss',
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
        this.versions = Array.isArray(data) ? data.reverse() : [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      },
    });
    // this.loading = true;
    // this.versionService.getVersions().subscribe((data) => {
    //   this.versions = data.reverse();
    //   this.loading = false;
    // });
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
