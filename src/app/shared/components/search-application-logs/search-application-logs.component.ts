import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ApiService } from 'src/app/core/services/api.service';
import { DataService } from 'src/app/core/services/data.service';
import {
  formatDateToISO,
  formatTimestamp,
  generateQueryString,
} from '../../utils/functions';
import * as XLSX from 'xlsx'; // Import xlsx library
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-application-logs',
  standalone: true,
  imports: [
    TabViewModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './search-application-logs.component.html',
  styleUrl: './search-application-logs.component.scss',
})
export class SearchApplicationLogsComponent implements OnInit {
  formGroup: FormGroup;
  logLevelOptions = [
    { label: 'TRACE', value: 'TRACE' },
    { label: 'DEBUG', value: 'DEBUG' },
    { label: 'INFO', value: 'INFO' },
    { label: 'WARN', value: 'WARN' },
    { label: 'ERROR', value: 'ERROR' },
    { label: 'FATAL', value: 'FATAL' },
  ];
  logTypeOptions = [
    { label: 'LOGIN', value: 'LOGIN' },
    { label: 'MESSAGE SEARCH', value: 'MESSAGE SEARCH' },
    { label: 'SYSTEM', value: 'SYSTEM' },
    { label: 'APPLICATION', value: 'APPLICATION' },
    { label: 'OTHER', value: 'OTHER' },
  ];

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Initialize the form group with existing search query or default values
    const existingSearchQuery =
      this.dataService.getSearchQuery('application-logs');

    this.formGroup = new FormGroup({
      logLevel: new FormControl(existingSearchQuery.logLevel),
      logType: new FormControl(existingSearchQuery.logType),
      description: new FormControl(existingSearchQuery.description),
      logDateFrom: new FormControl(
        existingSearchQuery.logDateFrom
          ? new Date(existingSearchQuery.logDateFrom)
          : null
      ),
      logDateTo: new FormControl(
        existingSearchQuery.logDateTo
          ? new Date(existingSearchQuery.logDateTo)
          : null
      ),
    });

    // Sync form changes with the DataService
    this.formGroup.valueChanges.subscribe((formValue) => {
      this.dataService.updateSearchQuery('application-logs', {
        ...formValue,
        logDateFrom: formatDateToISO(formValue.logDateFrom),
        logDateTo: formatDateToISO(formValue.logDateTo),
      });
    });
  }

  search(): void {
    this.dataService.setLoadingState('application-logs', true);

    const searchQuery = this.dataService.getSearchQuery('application-logs');
    const queryParams = generateQueryString(searchQuery);
    const urlToPass = 'logs/search' + queryParams;

    this.apiService.getData(urlToPass).subscribe({
      next: (data) => {
        this.dataService.setTableData(
          'application-logs',
          data.applicationLogList
        ); // Store in DataService
        this.dataService.setLoadingState('application-logs', false);

        // Constructing a detailed log message
        // const constraints = [];

        // if (searchQuery.logLevel) {
        //   constraints.push(`Log Level: ${searchQuery.logLevel}`);
        // }

        // if (searchQuery.logType) {
        //   constraints.push(
        //     `Log Type: ${searchQuery.logType}`
        //   );
        // }

        // if (searchQuery.description) {
        //   constraints.push(
        //     `Description: ${searchQuery.description}`
        //   );
        // }

        // if (searchQuery.logDateFrom) {
        //   constraints.push(
        //     `Log Date From: ${new Date(
        //       searchQuery.logDateFrom
        //     ).toLocaleString()}`
        //   );
        // }

        // if (searchQuery.logDateTo) {
        //   constraints.push(
        //     `Log Date To: ${new Date(
        //       searchQuery.logDateTo
        //     ).toLocaleString()}`
        //   );
        // }

        // const logMessage =
        //   constraints.length > 0
        //     ? `Message searched with constraints: ${constraints.join(', ')}`
        //     : 'Message searched with no constraints';

        // const newLog: Log = {
        //   datetime: new Date().toISOString(),
        //   logType: 'Message Search',
        //   log: logMessage,
        // };

        // this.logsService.addLog(newLog);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        // this.dataService.setLoadingState("application-logs", false);
        // const errorLogMessage = `API Error occurred while searching application logs. Error Details: ${error.message || 'Unknown Error'
        //   }`;

        // const errorLog: Log = {
        //   datetime: new Date().toISOString(),
        //   logtype: 'Error',
        //   log: errorLogMessage,
        // };

        // this.logsService.addLog(errorLog);
      },
    });
  }

  exportToExcel() {
    const cachedData = this.dataService.getTableData('application-logs');
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      cachedData.map((log) => ({
        Type: log.logType,
        Level: log.logLevel,
        Description: log.description,
        Date: log.logDate ? formatTimestamp(log.logDate) : '-',
      }))
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Application-logs');

    // Export the file
    XLSX.writeFile(wb, 'Application-logs.xlsx');
  }
}
