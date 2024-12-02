import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ApiService } from 'src/app/core/services/api.service';
import { generateQueryString } from '../../utils/functions';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [
    TabViewModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-section.component.html',
  styleUrl: './search-section.component.scss',
})
export class SearchSectionComponent implements OnInit {
  formGroup: FormGroup;

  flowTypeOptions = [
    { label: 'OUTBOUND', value: 'OUTBOUND' },
    { label: 'INBOUND', value: 'INBOUND' },
  ];

  translationDirectionOptions = [
    { label: 'MTtoMX', value: 'MTtoMX' },
    { label: 'MXtoMT', value: 'MXtoMT' },
  ];

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // Initialize the form group with existing search query or default values
    const existingSearchQuery = this.dataService.getSearchQuery();

    this.formGroup = new FormGroup({
      flowType: new FormControl(existingSearchQuery.flowType),
      translationDirection: new FormControl(existingSearchQuery.translationDirection),
      creationTimestampFrom: new FormControl(
        existingSearchQuery.creationTimestampFrom
          ? new Date(existingSearchQuery.creationTimestampFrom)
          : null
      ),
      creationTimestampTo: new FormControl(
        existingSearchQuery.creationTimestampTo
          ? new Date(existingSearchQuery.creationTimestampTo)
          : null
      ),
    });

    // Sync form changes with the DataService
    this.formGroup.valueChanges.subscribe((formValue) => {
      this.dataService.updateSearchQuery(formValue);
    });
  }

  search(): void {
    this.dataService.setLoadingState(true)

    const queryParams = generateQueryString(this.dataService.getSearchQuery());
    const urlToPass = 'messages/search' + queryParams;

    this.apiService.getData(urlToPass).subscribe({
      next: (data) => {
        this.dataService.setTableData(data.nipMessageList); // Store in DataService
        this.dataService.setLoadingState(false)

      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.dataService.setLoadingState(false)

      },
    });
  }
}
