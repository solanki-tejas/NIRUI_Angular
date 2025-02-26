import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { Root } from 'src/app/core/models/response.types';
import { SearchSectionComponent } from 'src/app/shared/components/search-section/search-section.component';
import { ApiService } from 'src/app/core/services/api.service';
import { DataService } from 'src/app/core/services/data.service';
import {
  formatTimestamp,
  generateQueryString,
} from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    TagModule,
    FormsModule,
    SearchSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  searchResults: Root[] = [];
  loading = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private dataService: DataService // Inject DataService
  ) {}

  ngOnInit(): void {
    // Subscribe to tableData updates from DataService
    this.dataService.getTableDataObservable().subscribe((data) => {
      this.searchResults = data;
    });

    // Check if there's existing data in the service
    const cachedData = this.dataService.getTableData();
    if (cachedData.length > 0) {
      this.searchResults = cachedData;
    } else {
      // Load data if not cached
      this.loadData();
    }

    // Subscribe to loading updates from DataService
    this.dataService.getLoadingStateObservable().subscribe((data) => {
      this.loading = data;
    });
  }

  loadData(): void {
    this.dataService.setLoadingState(true);
    const queryParams = generateQueryString(this.dataService.getSearchQuery());
    const urlToPass = 'messages/search' + queryParams;

    this.apiService.getData(urlToPass).subscribe({
      next: (data) => {
        this.searchResults = data.nipMessageList; // Assuming the response structure matches
        this.dataService.setTableData(this.searchResults); // Store in DataService
        this.dataService.setLoadingState(false);
        // this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.dataService.setLoadingState(false);
        // this.loading = false;
      },
    });
  }

  // onRowSelect(event: any): void {
  //   this.router.navigate(['/detail', event.data.requestId]);
  // }

  onRowSelect(event: any): void {
    // Find the selected record using the requestId
    const selectedRecord = this.searchResults.find(
      (item) => item.requestId === event.data.requestId
    );

    if (selectedRecord) {
      // Store the selected record in localStorage
      localStorage.setItem('selectedRecord', JSON.stringify(selectedRecord));
    }

    // Navigate to the detail page
    this.router.navigate(['/detail', event.data.requestId]);
  }

  getFormatDate(data: any) {
    return formatTimestamp(data);
  }
}
