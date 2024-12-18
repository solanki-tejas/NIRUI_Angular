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
    name: '',
    plainDescription: '',
    description: '',
    date: '',
  };

  constructor(private versionService: VersionService, private router: Router) {}

  fetchVersions() {
    this.loading = true;
    this.versionService.getVersions().subscribe((data) => {
      this.versions = data.reverse();
      this.loading = false;
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
      name: '',
      plainDescription: '',
      description: '',
      date: '',
    }; // Reset form
  }

  onSubmit() {
    if (this.currentVersion.name) {
      this.versionService.addVersion(this.currentVersion).subscribe(() => {
        this.fetchVersions();
        this.visible = false;
      });
    }
  }

  onRowSelect(event: any) {
    // this.currentVersion = { ...event.data }; // Populate form with selected row's data
    // this.visible = true;
  }
}
