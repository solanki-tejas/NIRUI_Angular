import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ApplicationLog } from 'src/app/core/models/response.types';
import { ApiService } from 'src/app/core/services/api.service';
import { DataService } from 'src/app/core/services/data.service';
import { SearchApplicationLogsComponent } from 'src/app/shared/components/search-application-logs/search-application-logs.component';
import { formatTimestamp, generateQueryString } from 'src/app/shared/utils/functions';
import * as XLSX from 'xlsx';  // Import xlsx library

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, FormsModule, SearchApplicationLogsComponent],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent {
  searchResults: ApplicationLog[] = [];
  loading = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private dataService: DataService // Inject DataService
  ) { }


  ngOnInit(): void {
    // Subscribe to tableData updates from DataService
    this.dataService.getTableDataObservable("application-logs").subscribe((data) => {
      this.searchResults = data;
    });

    // Check if there's existing data in the service
    const cachedData = this.dataService.getTableData("application-logs");
    if (cachedData.length > 0) {
      this.searchResults = cachedData;
    } else {
      // Load data if not cached
      this.loadData();
    }

    // Subscribe to loading updates from DataService
    this.dataService.getLoadingStateObservable("application-logs").subscribe((data) => {
      this.loading = data;
    });
  }


  getFormatDate(data: any) {
    return formatTimestamp(data);
  }

  loadData(): void {
    this.dataService.setLoadingState("application-logs", true);
    const queryParams = generateQueryString(this.dataService.getSearchQuery("application-logs"));
    const urlToPass = 'logs/search' + queryParams;

    this.apiService.getData(urlToPass).subscribe({
      next: (data) => {
        this.searchResults = data.applicationLogList; // Assuming the response structure matches
        this.dataService.setTableData("application-logs", this.searchResults); // Store in DataService
        this.dataService.setLoadingState("application-logs", false);
        // this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.dataService.setLoadingState("application-logs", false);
        // this.loading = false;
      },
    });
  }

  onRowSelect(event: any) {
    // this.currentLog = { ...event.data }; // Populate form with selected row's data
    // this.visible = true;
  }
}
