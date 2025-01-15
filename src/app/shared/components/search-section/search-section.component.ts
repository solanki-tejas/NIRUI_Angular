import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ApiService } from 'src/app/core/services/api.service';
import { formatDateToISO, generateQueryString } from '../../utils/functions';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import {
  ApplicationLog,
  LogLevel,
  LogType,
} from 'src/app/core/models/response.types';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [
    TabViewModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    InputTextModule,
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
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    // Initialize the form group with existing search query or default values
    const existingSearchQuery = this.dataService.getSearchQuery('messages');

    this.formGroup = new FormGroup({
      flowType: new FormControl(existingSearchQuery.flowType),
      translationDirection: new FormControl(
        existingSearchQuery.translationDirection
      ),
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
      this.dataService.updateSearchQuery('messages', {
        ...formValue,
        creationTimestampFrom: formatDateToISO(formValue.creationTimestampFrom),
        creationTimestampTo: formatDateToISO(formValue.creationTimestampTo),
      });
    });
  }

  search(): void {
    this.dataService.setLoadingState('messages', true);

    const searchQuery = this.dataService.getSearchQuery('messages');
    const queryParams = generateQueryString(searchQuery);
    const urlToPass = 'messages/search' + queryParams;

    this.apiService.getData(urlToPass).subscribe({
      next: (data) => {
        this.dataService.setTableData('messages', data.nipMessageList); // Store in DataService
        this.dataService.setLoadingState('messages', false);

        // Constructing a detailed log message
        const constraints = [];

        if (searchQuery.flowType) {
          constraints.push(`Flow Type: ${searchQuery.flowType}`);
        }

        if (searchQuery.translationDirection) {
          constraints.push(
            `Translation Direction: ${searchQuery.translationDirection}`
          );
        }

        if (searchQuery.creationTimestampFrom) {
          constraints.push(
            `Creation From: ${new Date(
              searchQuery.creationTimestampFrom
            ).toLocaleString()}`
          );
        }

        if (searchQuery.creationTimestampTo) {
          constraints.push(
            `Creation To: ${new Date(
              searchQuery.creationTimestampTo
            ).toLocaleString()}`
          );
        }

        const logMessage =
          constraints.length > 0
            ? `Message searched with constraints: ${constraints.join(', ')}`
            : 'Message searched with no constraints';

        const newLog: ApplicationLog = {
          logType: LogType.MESSAGE_SEARCH,
          logLevel: LogLevel.INFO,
          description: logMessage,
        };

        const urlToPass = 'logs/insert';
        this.apiService.postData(urlToPass, newLog).subscribe({
          next: (response) => {},
          error: (err) => console.error('Error creating user:', err),
        });
      },
      error: (error) => {
        console.error('Error fetching data:', error);

        this.dataService.setLoadingState('messages', false);

        const errorLogMessage = `API Error occurred while searching messages. Error Details: ${
          error.message || 'Unknown Error'
        }`;

        const newLog: ApplicationLog = {
          logType: LogType.MESSAGE_SEARCH,
          logLevel: LogLevel.ERROR,
          description: errorLogMessage,
        };

        const urlToPass = 'logs/insert';
        this.apiService.postData(urlToPass, newLog).subscribe({
          next: (response) => {},
          error: (err) => console.error('Error creating user:', err),
        });
      },
    });
  }
}
